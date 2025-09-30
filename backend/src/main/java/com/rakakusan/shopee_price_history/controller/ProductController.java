package com.rakakusan.shopee_price_history.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rakakusan.shopee_price_history.dto.response.PriceHistoryResponse;
import com.rakakusan.shopee_price_history.dto.response.ProductDetailResponse;
import com.rakakusan.shopee_price_history.dto.response.ProductItemResponse;
import com.rakakusan.shopee_price_history.entity.Product;
import com.rakakusan.shopee_price_history.service.ProductImportService;
import com.rakakusan.shopee_price_history.service.ProductService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/products")
@AllArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductImportService productImportService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/deals")
    public List<ProductItemResponse> getDeals(@RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int limit) {
        return productService.getDeals(page, limit);
    }

    @GetMapping("/{id}")
    public ProductDetailResponse getProductById(
            @PathVariable String id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return productService.getProductById(id, startDate, endDate);
    }

    @GetMapping("/{id}/prices")
    public List<PriceHistoryResponse> getPriceHistory(@PathVariable Long id) {
        return productService.getPriceHistory(id);
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product, @RequestParam int price) {
        return productService.saveProduct(product, price);
    }

    @PostMapping("/{date}")
    public void createProductWithDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date)
            throws Exception {
        productImportService.importFromS3(date);
    }
}