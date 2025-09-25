package com.rakakusan.shopee_price_history.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.zaxxer.hikari.HikariDataSource;

import jakarta.annotation.PreDestroy;

import org.testcontainers.containers.PostgreSQLContainer;

@Configuration
@Profile("dev")
public class PostgresContainerConfig {

    private PostgreSQLContainer<?> postgres;

    @Bean
    PostgreSQLContainer<?> postgresContainer() {
        postgres = new PostgreSQLContainer<>("postgres:17.6-alpine3.22")
                .withExposedPorts(5432)
                .withDatabaseName("testdb")
                .withUsername("test")
                .withPassword("test");
        postgres.start();
        return postgres;
    }

    @Bean
    HikariDataSource dataSource(PostgreSQLContainer<?> postgresContainer) {
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl(postgresContainer.getJdbcUrl());
        ds.setUsername(postgresContainer.getUsername());
        ds.setPassword(postgresContainer.getPassword());

        System.out.println("Postgres JDBC URL: " + postgresContainer.getJdbcUrl());
        System.out.println("Postgres Username: " + postgresContainer.getUsername());
        System.out.println("Postgres Password: " + postgresContainer.getPassword());
        return ds;
    }

    @PreDestroy
    public void stopContainer() {
        if (postgres != null && postgres.isRunning()) {
            postgres.stop();
        }
    }
}