package com.rakakusan.shopee_price_history.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.rakakusan.shopee_price_history.entity.Product;

import jakarta.transaction.Transactional;

public interface ProductRepository extends JpaRepository<Product, Long> {
        Optional<Product> findById(long id);

        Page<Product> findByTagIsNotNull(Pageable pageable);

        @Modifying
        @Transactional
        @Query(value = """
                        UPDATE products p
                        SET tag = CASE
                                        -- discount가 0이면 무조건 NULL
                                        WHEN st.discount = 0 THEN NULL

                                        -- 1단계: best 검증 (역대 최저 effective_price)
                                        WHEN st.effective_price <= hist.all_time_min THEN 'best'

                                        -- 2단계: good 검증 (최저가 ±5% 이내)
                                        WHEN st.effective_price BETWEEN (hist.all_time_min * 0.95) AND (hist.all_time_min * 1.05) THEN 'good'

                                        -- 3단계: 나머지는 null
                                        ELSE NULL
                        END
                        FROM (
                                -- daily_import의 effective_price 계산 + discount 포함
                                SELECT sku, discount, (price * (100 - discount) / 100.0) AS effective_price
                                FROM daily_import
                        ) st
                        LEFT JOIN LATERAL (
                                -- 해당 상품의 역대 최저 effective_price 조회
                                SELECT MIN(ph.price * (100 - ph.discount) / 100.0) AS all_time_min
                                FROM price_history ph
                                JOIN products p2 ON ph.product_id = p2.id
                                WHERE p2.sku = st.sku
                        ) hist ON true
                        WHERE p.sku = st.sku
                        """, nativeQuery = true)
        int updateTagsFromDailyImport();

        @Modifying
        @Transactional
        @Query(value = """
                        UPDATE products p
                        SET tag = NULL
                        WHERE NOT EXISTS (
                          SELECT 1 FROM daily_import di WHERE di.sku = p.sku
                        )
                        """, nativeQuery = true)
        int clearTagsNotInDailyImport();

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

        @Query(value = """
                        SELECT * FROM products
                        WHERE name ILIKE CONCAT('%', :keyword, '%')
                           OR name % :keyword
                        ORDER BY similarity(name, :keyword) DESC
                        LIMIT 10
                        """, nativeQuery = true)
        List<Product> searchSuggestions(@Param("keyword") String keyword);
}
