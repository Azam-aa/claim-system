package com.claim.demo.service;

import com.claim.demo.entity.Claim;
import com.claim.demo.entity.User;
import com.claim.demo.exception.UserNotFoundException;
import com.claim.demo.repository.UserRepository;
import com.claim.demo.dto.UserProfileRequest;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getLoggedInUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
    }

    public List<Claim> getLoggedInUserClaims(String username) {
        User user = getLoggedInUser(username);
        return user.getClaims();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public void blockUser(Long id, String reason) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setBlocked(true);
        user.setBlockReason(reason);
        userRepository.save(user);
    }

    public void unblockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setBlocked(false);
        user.setBlockReason(null);
        userRepository.save(user);
    }

    public User updateProfile(String username, UserProfileRequest request) {
        User user = getLoggedInUser(username);
        if (request.getPhoneNumber() != null)
            user.setPhoneNumber(request.getPhoneNumber());
        if (request.getAddress() != null)
            user.setAddress(request.getAddress());
        if (request.getAvatarUrl() != null)
            user.setAvatarUrl(request.getAvatarUrl());
        return userRepository.save(user);
    }
}
