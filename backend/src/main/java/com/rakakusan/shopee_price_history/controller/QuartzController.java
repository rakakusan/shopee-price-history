package com.rakakusan.shopee_price_history.controller;

import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cron")
@RequiredArgsConstructor
public class QuartzController {

    private final Scheduler scheduler;

    @PostMapping("/trigger-product-insert")
    public ResponseEntity<String> triggerProductInsert() throws SchedulerException {
        JobKey key = JobKey.jobKey("productInsertJobDetail");
        if (!scheduler.checkExists(key)) {
            return ResponseEntity.badRequest().body("Job not registered: " + key);
        }
        scheduler.triggerJob(key);
        return ResponseEntity.ok("Triggered " + key);
    }
}