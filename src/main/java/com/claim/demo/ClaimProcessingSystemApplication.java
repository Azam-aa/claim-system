package com.claim.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.cache.annotation.EnableCaching
public class ClaimProcessingSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClaimProcessingSystemApplication.class, args);
	}

}
