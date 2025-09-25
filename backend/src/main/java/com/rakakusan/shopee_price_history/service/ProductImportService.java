package com.rakakusan.shopee_price_history.service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import com.google.common.collect.Lists;
import com.rakakusan.shopee_price_history.entity.PriceHistory;
import com.rakakusan.shopee_price_history.entity.Product;
import com.rakakusan.shopee_price_history.repository.PriceHistoryRepository;
import com.rakakusan.shopee_price_history.repository.ProductRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

@Service
@RequiredArgsConstructor
public class ProductImportService {

  private static final int BATCH_SIZE = 1000;
  private static final String BUCKET_NAME = "shinmebaby.shopee.price.history";

  private final ProductRepository productRepository;
  private final PriceHistoryRepository priceHistoryRepository;
  private final S3Client s3Client;

  private final HttpClient httpClient = HttpClient.newBuilder()
      .connectTimeout(Duration.ofSeconds(30))
      .build();

  public void importFromUrl(String sourceUrl) throws Exception {
    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(sourceUrl))
        .GET()
        .build();

    HttpResponse<InputStream> response = httpClient.send(request, HttpResponse.BodyHandlers.ofInputStream());
    int status = response.statusCode();
    if (status != 200) {
      throw new IllegalStateException("CSV download failed. HTTP status: " + status);
    }

    try (InputStream is = response.body()) {
      List<Pair<Product, PriceHistory>> batch = parseCsvToPairs(is);
      for (List<Pair<Product, PriceHistory>> chunk : Lists.partition(batch, BATCH_SIZE)) {
        processChunk(chunk);
      }
    }
  }

  public void importFromS3(LocalDate date) throws Exception {
    String key = date.toString() + ".csv";
    GetObjectRequest req = GetObjectRequest.builder().bucket(BUCKET_NAME).key(key).build();
    try (ResponseInputStream<GetObjectResponse> s3is = s3Client.getObject(req)) {
      List<Pair<Product, PriceHistory>> batch = parseCsvToPairs(s3is);
      for (List<Pair<Product, PriceHistory>> chunk : Lists.partition(batch, BATCH_SIZE)) {
        processChunk(chunk);
      }
    }
  }

  @Transactional
  protected void processChunk(List<Pair<Product, PriceHistory>> chunk) {
    for (Pair<Product, PriceHistory> pair : chunk) {
      Product p = pair.getFirst();
      PriceHistory ph = pair.getSecond();

      productRepository.insertIfNotExists(p.getSku(), p.getName(), p.getUrl(), p.getImage(), p.getDescription(),
          p.getCategory());
      priceHistoryRepository.insertIfPriceChanged(p.getSku(), ph.getPrice(), ph.getDiscount(), ph.getRecordDate());
    }
  }

  // 공통 CSV 파싱 로직: InputStream -> List<Pair<Product,PriceHistory>>
  private List<Pair<Product, PriceHistory>> parseCsvToPairs(InputStream input) throws Exception {
    try (Reader rdr = new BufferedReader(new InputStreamReader(input, StandardCharsets.UTF_8))) {
      CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
          .setHeader()
          .setSkipHeaderRecord(true)
          .setIgnoreHeaderCase(true)
          .setTrim(true)
          .get();

      try (CSVParser parser = CSVParser.parse(rdr, csvFormat)) {
        List<Pair<Product, PriceHistory>> list = new LinkedList<>();
        for (CSVRecord record : parser) {
          try {
            list.add(toProduct(record));
          } catch (Exception recEx) {
            // 레코드 단위 에러는 로깅 후 계속
            System.err.println("CSV record parse error: " + recEx.getMessage());
          }
        }
        return list;
      }
    }
  }

  private Pair<Product, PriceHistory> toProduct(CSVRecord record) {
    String sku = record.isMapped("sku") ? record.get("sku") : record.get(0);
    String name = record.isMapped("name") ? record.get("name") : record.get(1);
    String url = record.isMapped("url") ? record.get("url") : record.get(2);
    String priceStr = record.isMapped("price") ? record.get("price") : record.get(3);
    String discountStr = record.isMapped("discount") ? record.get("discount") : record.get(4);
    String image = record.isMapped("image") ? record.get("image") : record.get(5);
    String desc = record.isMapped("desc") ? record.get("desc") : record.get(6);
    String category = record.isMapped("category") ? record.get("category") : record.get(7);

    int price = 0;
    try {
      price = Integer.parseInt(priceStr);
    } catch (NumberFormatException ignore) {
    }

    int discount = 0;
    try {
      discount = Integer.parseInt(discountStr);
    } catch (NumberFormatException ignore) {
    }

    Product product = new Product();
    product.setSku(sku);
    product.setName(name);
    product.setUrl(url);
    product.setImage(image);
    product.setDescription(desc);
    product.setCategory(category);

    PriceHistory priceHistory = new PriceHistory();
    priceHistory.setPrice(price);
    priceHistory.setDiscount(discount);
    priceHistory.setRecordDate(LocalDate.now());

    return Pair.of(product, priceHistory);
  }
}