package com.rakakusan.shopee_price_history.dto.response;

import java.util.List;

import lombok.Data;

@Data
public class ProductDetailResponse {
  private Long id;
  private String name;
  private String imageUrl;
  private String description;
  private String category;
  private List<PriceHistoryResponse> priceHistories;
}
