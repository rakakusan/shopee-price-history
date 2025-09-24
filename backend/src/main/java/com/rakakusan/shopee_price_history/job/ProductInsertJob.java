package com.rakakusan.shopee_price_history.job;

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
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Component;

import com.rakakusan.shopee_price_history.service.ProductImportService;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class ProductInsertJob implements Job {

  private static final String PRODUCT_FEED_URL = "http://datafeed.accesstrade.me/shopee.vn.csv";
  private ProductImportService productImportService;

  @Override
  public void execute(JobExecutionContext context) {
    try {
      productImportService.importFromUrl(PRODUCT_FEED_URL);
    } catch (InterruptedException ie) {
      Thread.currentThread().interrupt();
      System.err.println("Job interrupted: " + ie.getMessage());
    } catch (Exception e) {
      System.err.println("Job failed: " + e.getMessage());
      e.printStackTrace();
    }
  }
}
