package com.rakakusan.shopee_price_history.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.rakakusan.shopee_price_history.entity.Product;

import jakarta.transaction.Transactional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);

    @Modifying
    @Transactional
    @Query(value = """
            INSERT INTO products (sku, name, url, image, description, category)
            SELECT :sku, :name, :url, :image, :description, :category
             WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.sku = :sku)
            """, nativeQuery = true)
    int insertIfNotExists(
            @Param("sku") String sku,
            @Param("name") String name,
            @Param("url") String url,
            @Param("image") String image,
            @Param("description") String description,
            @Param("category") String category);
}
