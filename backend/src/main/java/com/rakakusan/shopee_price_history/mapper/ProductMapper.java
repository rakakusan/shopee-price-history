package com.rakakusan.shopee_price_history.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.rakakusan.shopee_price_history.dto.response.PriceHistoryResponse;
import com.rakakusan.shopee_price_history.dto.response.ProductDetailResponse;
import com.rakakusan.shopee_price_history.dto.response.ProductItemResponse;
import com.rakakusan.shopee_price_history.entity.PriceHistory;
import com.rakakusan.shopee_price_history.entity.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {

  @Mapping(source = "image", target = "imageUrl")
  @Mapping(target = "priceHistories", ignore = true)
  ProductDetailResponse toProductDetailResponse(Product product);
  @Mapping(source = "image", target = "imageUrl")
  ProductItemResponse toProductItemResponse(Product product);
  PriceHistoryResponse toPriceHistoryResponse(PriceHistory priceHistory);
}
