package com.rakakusan.shopee_price_history.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rakakusan.shopee_price_history.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
  Optional<Product> findBySku(String sku);
}
