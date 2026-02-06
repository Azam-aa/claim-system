package com.claim.demo.service;

import com.claim.demo.dto.NotificationDTO;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final String TOPIC = "claim-events";

    private final KafkaTemplate<String, NotificationDTO> kafkaTemplate;

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    public NotificationService(KafkaTemplate<String, NotificationDTO> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishEvent(NotificationDTO event) {
        if (kafkaTemplate != null) {
            kafkaTemplate.send(TOPIC, event);
        } else {
            System.out.println("Kafka disabled, event skipped: " + event.getStatus());
        }
    }

    @KafkaListener(topics = "claim-events", groupId = "claim-group")
    public void consume(NotificationDTO event) {
        System.out.println(
                "Kafka Event Received -> "
                        + event.getEventType()
                        + " | ClaimId: " + event.getClaimId()
                        + " | Status: " + event.getStatus());
    }
}
