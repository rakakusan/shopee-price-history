package com.rakakusan.shopee_price_history.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rakakusan.shopee_price_history.dto.response.PriceHistoryResponse;
import com.rakakusan.shopee_price_history.dto.response.ProductDetailResponse;
import com.rakakusan.shopee_price_history.entity.PriceHistory;
import com.rakakusan.shopee_price_history.entity.Product;
import com.rakakusan.shopee_price_history.mapper.ProductMapper;
import com.rakakusan.shopee_price_history.repository.PriceHistoryRepository;
import com.rakakusan.shopee_price_history.repository.ProductRepository;

import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final PriceHistoryRepository priceHistoryRepository;
    private final ProductMapper productMapper;

    public Product saveProduct(Product product, int price) {
        Product savedProduct = productRepository.save(product);

        PriceHistory ph = new PriceHistory();
        ph.setPrice(price);
        ph.setRecordDate(LocalDate.now());

        priceHistoryRepository.save(ph);
        return savedProduct;
    }

    public List<PriceHistoryResponse> getPriceHistory(Long productId) {
        List<PriceHistory> histories = priceHistoryRepository.findByProductIdOrderByRecordDateDesc(productId);
        return histories.stream()
                .map(productMapper::toPriceHistoryResponse)
                .toList();
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Transactional(readOnly = true)
    public ProductDetailResponse getProductBySku(String sku, LocalDate startDate, LocalDate endDate) {
        return productRepository.findBySku(sku)
                .map(product -> {
                    System.out.println(product.getUrl());
                    ProductDetailResponse response = productMapper.toProductDetailResponse(product);
                    System.out.println(response.getUrl());
                    List<PriceHistory> histories = new LinkedList<>();

                    if (startDate != null && endDate != null) {
                        histories = priceHistoryRepository.findByProductIdAndRecordDateBetweenOrderByRecordDateDesc(
                                product.getId(), startDate, endDate);
                    } else if (startDate != null) {
                        histories = priceHistoryRepository
                                .findByProductIdAndRecordDateGreaterThanEqualOrderByRecordDateDesc(product.getId(),
                                        startDate);
                    } else if (endDate != null) {
                        histories = priceHistoryRepository
                                .findByProductIdAndRecordDateLessThanEqualOrderByRecordDateDesc(product.getId(),
                                        endDate);
                    } else {
                        histories = priceHistoryRepository.findByProductIdOrderByRecordDateDesc(product.getId());
                    }

                    if (histories.isEmpty()) {
                        Optional<PriceHistory> prev = priceHistoryRepository
                                .findTopByProductIdOrderByRecordDateDesc(product.getId());
                        if (prev.isPresent()) {
                            histories.add(prev.get());
                        }
                    }

                    List<PriceHistoryResponse> historyResponses = histories.stream()
                            .map(productMapper::toPriceHistoryResponse)
                            .toList();
                    response.setPriceHistories(historyResponses);
                    System.out.println(response);
                    return response;
                })
                .orElseThrow(() -> new RuntimeException("Product not found with SKU: " + sku));
    }
}