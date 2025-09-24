package com.rakakusan.shopee_price_history.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProviderChain;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.auth.credentials.EnvironmentVariableCredentialsProvider;
import software.amazon.awssdk.auth.credentials.InstanceProfileCredentialsProvider;
import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3Config {

  @Value("${aws.region:ap-southeast-1}")
  private String awsRegion;

  @Bean
  S3Client s3Client() {

    AwsCredentialsProvider providerChain = AwsCredentialsProviderChain.of(
        InstanceProfileCredentialsProvider.create(),
        EnvironmentVariableCredentialsProvider.create(),
        ProfileCredentialsProvider.create(),
        DefaultCredentialsProvider.builder().build()
    );

    return S3Client.builder()
        .region(Region.of(awsRegion))
        .credentialsProvider(providerChain)
        .build();
  }
}