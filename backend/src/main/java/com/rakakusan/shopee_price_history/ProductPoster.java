package com.rakakusan.shopee_price_history;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class ProductPoster {

    public static void main(String[] args) throws Exception {
        LocalDate start = LocalDate.parse("2025-09-26");
        LocalDate end = LocalDate.parse("2025-09-26");
        DateTimeFormatter fmt = DateTimeFormatter.ISO_DATE;

        HttpClient client = HttpClient.newHttpClient();

        for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {
            String dateStr = d.format(fmt);
            String url = "http://localhost:8080/api/products/" + dateStr;

            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .POST(HttpRequest.BodyPublishers.noBody())
                    .header("Accept", "text/plain")
                    .build();

            try {
                HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());
                System.out.printf("%s -> %d %s%n", dateStr, resp.statusCode(),
                        resp.body() == null || resp.body().isBlank() ? "" : resp.body());
            } catch (Exception e) {
                System.err.printf("%s -> failed: %s%n", dateStr, e.getMessage());
            }

            // optional: small pause to avoid hammering local server
            Thread.sleep(100);
        }
    }
}