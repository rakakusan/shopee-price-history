package com.rakakusan.shopee_price_history.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rakakusan.shopee_price_history.entity.PriceHistory;

public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {
  List<PriceHistory> findByProductIdOrderByRecordDateDesc(Long productId);
  List<PriceHistory> findByProductIdAndRecordDateBetweenOrderByRecordDateDesc(Long productId, LocalDate start, LocalDate end);
  List<PriceHistory> findByProductIdAndRecordDateGreaterThanEqualOrderByRecordDateDesc(Long productId, LocalDate start);
  List<PriceHistory> findByProductIdAndRecordDateLessThanEqualOrderByRecordDateDesc(Long productId, LocalDate end);
  Optional<PriceHistory> findTopByProductIdOrderByRecordDateDesc(Long productId);
}
