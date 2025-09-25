package com.rakakusan.shopee_price_history.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.rakakusan.shopee_price_history.entity.PriceHistory;

import jakarta.transaction.Transactional;

public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {
  List<PriceHistory> findByProductIdOrderByRecordDateDesc(Long productId);

  List<PriceHistory> findByProductIdAndRecordDateBetweenOrderByRecordDateDesc(Long productId, LocalDate start,
      LocalDate end);

  List<PriceHistory> findByProductIdAndRecordDateGreaterThanEqualOrderByRecordDateDesc(Long productId, LocalDate start);

  List<PriceHistory> findByProductIdAndRecordDateLessThanEqualOrderByRecordDateDesc(Long productId, LocalDate end);

  Optional<PriceHistory> findTopByProductIdOrderByRecordDateDesc(Long productId);

  @Modifying
  @Transactional
  @Query(value = """
      INSERT INTO price_history(product_id, price, discount, record_date)
      SELECT p.id, :price, :discount, :recordDate
      FROM products p
      WHERE p.sku = :sku
        AND NOT EXISTS (
          SELECT 1 FROM price_history ph
          WHERE ph.product_id = p.id
            AND ph.record_date = (
              SELECT MAX(ph2.record_date) FROM price_history ph2 WHERE ph2.product_id = p.id
            )
            AND ph.price = :price
        )
        """, nativeQuery = true)
  int insertIfPriceChanged(String sku, int price, int discount, LocalDate recordDate);
}
