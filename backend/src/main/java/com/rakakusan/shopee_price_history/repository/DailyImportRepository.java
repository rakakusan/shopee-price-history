package com.rakakusan.shopee_price_history.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class DailyImportRepository {

    public static record StagingRow(String sku, String name, String url, String image, String description, int price, BigDecimal discount, String category, LocalDate recordDate) {}

    private final JdbcTemplate jdbc;

    public DailyImportRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void ensureTable() {
        jdbc.execute("""
          CREATE TABLE IF NOT EXISTS daily_import (
            sku VARCHAR(128),
            name TEXT,
            url TEXT,
            image TEXT,
            description TEXT,
            price INT,
            discount DECIMAL,
            category TEXT,
            record_date DATE
          )
          """);
    }

    public void truncate() {
        jdbc.execute("TRUNCATE TABLE daily_import");
    }

    public void batchInsert(List<StagingRow> rows) {
        if (rows == null || rows.isEmpty()) return;
        final String sql = "INSERT INTO daily_import (sku, name, url, image, description, price, discount, category, record_date) VALUES (?,?,?,?,?,?,?,?,?)";
        jdbc.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(java.sql.PreparedStatement ps, int i) throws java.sql.SQLException {
                StagingRow r = rows.get(i);
                ps.setString(1, r.sku());
                ps.setString(2, r.name());
                ps.setString(3, r.url());
                ps.setString(4, r.image());
                ps.setString(5, r.description());
                ps.setInt(6, r.price());
                ps.setBigDecimal(7, r.discount());
                ps.setString(8, r.category());
                // LocalDate를 안전하게 java.sql.Date로 변환
                LocalDate recordDate = r.recordDate();
                if (recordDate != null) {
                    ps.setDate(9, java.sql.Date.valueOf(recordDate));
                } else {
                    ps.setDate(9, java.sql.Date.valueOf(LocalDate.now()));
                }
            }

            @Override
            public int getBatchSize() {
                return rows.size();
            }
        });
    }

    public int count() {
        Integer c = jdbc.queryForObject("SELECT COUNT(*) FROM daily_import", Integer.class);
        return c == null ? 0 : c;
    }

    public List<StagingRow> fetchPage(int offset, int limit) {
        return jdbc.query(
            "SELECT sku, name, url, image, description, price, discount, category, record_date FROM daily_import ORDER BY sku LIMIT ? OFFSET ?",
            (rs, rowNum) -> new StagingRow(
                rs.getString("sku"),
                rs.getString("name"),
                rs.getString("url"),
                rs.getString("image"),
                rs.getString("description"),
                rs.getInt("price"),
                rs.getBigDecimal("discount"),
                rs.getString("category"),
                rs.getDate("record_date").toLocalDate()
            ),
            limit, offset
        );
    }

    public int insertProductsFromStaging() {
        String sql = """
            INSERT INTO products (sku, name, url, image, description, category)
            SELECT sku, name, url, image, description, category
            FROM daily_import di
            WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.sku = di.sku)
            """;
        return jdbc.update(sql);
    }

    public int insertPriceHistoryFromStaging() {
        String sql = """
            INSERT INTO price_history (product_id, price, discount, record_date)
            SELECT p.id, di.price, di.discount, di.record_date
            FROM daily_import di
            JOIN products p ON p.sku = di.sku
            LEFT JOIN LATERAL (
                SELECT ph.price, ph.discount
                FROM price_history ph
                WHERE ph.product_id = p.id
                ORDER BY ph.record_date DESC
                LIMIT 1
            ) last_record ON true
            WHERE (
                last_record.price IS NULL
                OR last_record.price != di.price
                OR last_record.discount != di.discount
            )
            """;
        return jdbc.update(sql);
    }
}
