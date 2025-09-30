package com.rakakusan.shopee_price_history.service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import com.rakakusan.shopee_price_history.repository.DailyImportRepository;
import com.rakakusan.shopee_price_history.repository.DailyImportRepository.StagingRow;
import com.rakakusan.shopee_price_history.repository.ProductRepository;

import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

@Service
public class ProductImportService {

    private static final int BATCH_SIZE = 5000;
    private static final String BUCKET_NAME = "shinmebaby.shopee.price.history";

    private final ProductRepository productRepository;
    private final S3Client s3Client;
    private final DailyImportRepository dailyImportRepository;

    private final HttpClient httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(30)).build();

    public ProductImportService(ProductRepository productRepository,
            S3Client s3Client,
            DailyImportRepository dailyImportRepository) {
        this.productRepository = productRepository;
        this.s3Client = s3Client;
        this.dailyImportRepository = dailyImportRepository;
    }

    public void importFromUrl(String sourceUrl) throws Exception {
        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(sourceUrl)).GET().build();
        HttpResponse<InputStream> response = httpClient.send(request, HttpResponse.BodyHandlers.ofInputStream());
        int status = response.statusCode();
        if (status != 200)
            throw new IllegalStateException("CSV download failed. HTTP status: " + status);

        try (InputStream is = response.body()) {
            dailyImportRepository.ensureTable();
            dailyImportRepository.truncate();
            streamParseAndInsertToStaging(is, null);
            processStagingAndFinalize();
        }
    }

    public void importFromS3(LocalDate date) throws Exception {
        String key = date.toString() + ".csv";
        GetObjectRequest req = GetObjectRequest.builder().bucket(BUCKET_NAME).key(key).build();
        try (ResponseInputStream<GetObjectResponse> s3is = s3Client.getObject(req)) {
            dailyImportRepository.ensureTable();
            dailyImportRepository.truncate();
            streamParseAndInsertToStaging(s3is, date);
            processStagingAndFinalize();
        }
    }

    // stream-parse CSV and call dailyImportRepository.batchInsert in BATCH_SIZE chunks
    private void streamParseAndInsertToStaging(InputStream in, LocalDate date) throws Exception {
        try (Reader rdr = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8))) {
            CSVFormat csvFormat = CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true)
                    .setIgnoreHeaderCase(true).setTrim(true).get();
            try (CSVParser parser = CSVParser.parse(rdr, csvFormat)) {
                List<StagingRow> batch = new ArrayList<>();
                for (CSVRecord record : parser) {
                    try {
                        String sku = record.isMapped("sku") ? record.get("sku") : record.get(0);
                        String name = record.isMapped("name") ? record.get("name")
                                : (record.size() > 1 ? record.get(1) : "");
                        String url = record.isMapped("url") ? record.get("url")
                                : (record.size() > 2 ? record.get(2) : "");
                        String priceStr = record.isMapped("price") ? record.get("price")
                                : (record.size() > 3 ? record.get(3) : "0");
                        String discountStr = record.isMapped("discount") ? record.get("discount")
                                : (record.size() > 4 ? record.get(4) : "0");
                        String image = record.isMapped("image") ? record.get("image")
                                : (record.size() > 5 ? record.get(5) : "");
                        String description = record.isMapped("desc") ? record.get("desc")
                                : (record.size() > 6 ? record.get(6) : "");
                        String category = record.isMapped("category") ? record.get("category")
                                : (record.size() > 7 ? record.get(7) : "");

                        Integer price = 0;
                        try {
                            price = Integer.parseInt(priceStr.trim());
                        } catch (Exception ignore) {
                        }
                        BigDecimal discount = BigDecimal.ZERO;
                        try {
                            discount = new BigDecimal(discountStr.trim());
                        } catch (Exception ignore) {
                        }

                        batch.add(new StagingRow(sku, name, url, image, description, price, discount, category, date));
                        if (batch.size() >= BATCH_SIZE) {
                            dailyImportRepository.batchInsert(batch);
                            batch.clear();
                        }
                    } catch (Exception recEx) {
                        recEx.printStackTrace();
                        System.err.println("CSV record parse error: " + recEx.getMessage());
                    }
                }
                if (!batch.isEmpty())
                    dailyImportRepository.batchInsert(batch);
            }
        }
    }

    private void processStagingAndFinalize() {
        // SQL로 직접 products 테이블에 삽입 (중복 제외)
        int insertedProducts = dailyImportRepository.insertProductsFromStaging();
        System.out.println("Inserted products: " + insertedProducts);

        // SQL로 직접 price_history 테이블에 삽입 (중복/동일가격 제외)
        int insertedPriceHistory = dailyImportRepository.insertPriceHistoryFromStaging();
        System.out.println("Inserted price history records: " + insertedPriceHistory);

        // 태그 업데이트 (역대 최저가 기준)
        productRepository.clearTagsNotInDailyImport();
        int updatedTags = productRepository.updateTagsFromDailyImport();
        System.out.println("Updated product tags: " + updatedTags);
    }
}
