package com.rakakusan.shopee_price_history.job;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
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
      // JobDataMap data = context.getMergedJobDataMap();
      // String date = data.containsKey("date") ? data.getString("date") : LocalDate.now().toString();
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
