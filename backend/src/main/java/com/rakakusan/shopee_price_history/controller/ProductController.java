package com.rakakusan.shopee_price_history.controller;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import com.rakakusan.shopee_price_history.dto.response.PriceHistoryResponse;
import com.rakakusan.shopee_price_history.dto.response.ProductDetailResponse;
import com.rakakusan.shopee_price_history.entity.PriceHistory;
import com.rakakusan.shopee_price_history.entity.Product;
import com.rakakusan.shopee_price_history.service.ProductService;

import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/api/products")
@AllArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{sku}")
    public ProductDetailResponse getProductBySku(
        @PathVariable String sku,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
      return productService.getProductBySku(sku, startDate, endDate);
    }

    @GetMapping("/{id}/prices")
    public List<PriceHistoryResponse> getPriceHistory(@PathVariable Long id) {
        return productService.getPriceHistory(id);
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product, @RequestParam int price) {
        return productService.saveProduct(product, price);
    }
}