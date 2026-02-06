package com.claim.demo.config;

import com.claim.demo.dto.NotificationDTO;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;

import java.util.HashMap;
import java.util.Map;

@Configuration
@org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "true", matchIfMissing = true)
public class KafkaConsumerConfig {

        @Bean
        public ConcurrentKafkaListenerContainerFactory<String, NotificationDTO> kafkaListenerContainerFactory() {

                Map<String, Object> props = new HashMap<>();
                props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
                props.put(ConsumerConfig.GROUP_ID_CONFIG, "claim-group");
                props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
                props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
                                org.springframework.kafka.support.serializer.JsonDeserializer.class);
                props.put("spring.json.trusted.packages", "*");

                ConcurrentKafkaListenerContainerFactory<String, NotificationDTO> factory = new ConcurrentKafkaListenerContainerFactory<>();

                factory.setConsumerFactory(
                                new DefaultKafkaConsumerFactory<>(props));

                return factory;
        }
}
