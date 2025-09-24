package com.rakakusan.shopee_price_history.dto.response;

import java.time.LocalDate;

import lombok.Data;

@Data
public class PriceHistoryResponse {
    private Long id;
    private Integer price;
    private Integer discount;
    private LocalDate recordDate;
}