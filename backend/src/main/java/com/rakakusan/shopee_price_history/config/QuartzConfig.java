package com.rakakusan.shopee_price_history.config;

import org.quartz.CronScheduleBuilder;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import com.rakakusan.shopee_price_history.job.ProductInsertJob;

@Component
public class QuartzConfig {

  @Bean
  JobDetail productInsertJobDetail() {
    return JobBuilder.newJob(ProductInsertJob.class)
        .withIdentity("productInsertJobDetail")
        .storeDurably()
        .build();
  }

  @Bean
  Trigger productInsertJobTrigger(JobDetail jobDetail) {
    return TriggerBuilder.newTrigger()
        .forJob(jobDetail)
        .withIdentity("productInsertJobTrigger")
        .withSchedule(CronScheduleBuilder.cronSchedule("0 56 20 * * ?")
                        .withMisfireHandlingInstructionFireAndProceed())
        .build();
  }
}
