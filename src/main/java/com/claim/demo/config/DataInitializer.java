package com.claim.demo.config;

import com.claim.demo.entity.User;
import com.claim.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User user = new User();
            user.setUsername("admin");
            user.setEmail("admin@example.com");
            user.setPassword(passwordEncoder.encode("password123"));
            user.setRole("ADMIN");
            user.setVerified(true);
            userRepository.save(user);
            System.out.println("Default user created: admin / password123");
        }

        if (userRepository.findByUsername("agent1").isEmpty()) {
            User user = new User();
            user.setUsername("agent1");
            user.setEmail("agent1@example.com");
            user.setPassword(passwordEncoder.encode("password123"));
            user.setRole("USER"); // or AGENT
            user.setVerified(true);
            userRepository.save(user);
            System.out.println("Default user created: agent1 / password123");
        }
    }
}
