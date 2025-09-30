package com.rakakusan.shopee_price_history.dto.response;

import lombok.Data;

@Data
public class ProductItemResponse {
  private Long id;
  private String name;
  private String url;
  private String imageUrl;
  private String description;
  private String category;
  private String tag;
  private PriceHistoryResponse latestPriceHistory;
}
