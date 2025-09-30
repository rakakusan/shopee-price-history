package com.rakakusan.shopee_price_history.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

@Data
public class PriceHistoryResponse {
    private Long id;
    private Integer price;
    private BigDecimal discount;
    private LocalDate recordDate;
}