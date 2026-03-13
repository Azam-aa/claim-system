package com.claim.demo.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    @KafkaListener(topics = "claim-updates", groupId = "claim-group")
    public void listen(String message) {
        System.out.println("Received Message in group 'claim-group': " + message);
    }
}
