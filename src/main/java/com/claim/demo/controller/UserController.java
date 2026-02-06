package com.claim.demo.controller;

import com.claim.demo.entity.Claim;
import com.claim.demo.entity.User;
import com.claim.demo.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public com.claim.demo.dto.UserResponse getMyProfile(Authentication authentication) {
        User user = userService.getLoggedInUser(authentication.getName());
        return new com.claim.demo.dto.UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole(),
                user.getPhoneNumber(), user.getAddress(), user.getAvatarUrl(), user.isBlocked());
    }

    @PutMapping("/profile")
    public com.claim.demo.dto.UserResponse updateProfile(Authentication authentication,
            @RequestBody com.claim.demo.dto.UserProfileRequest request) {
        User user = userService.updateProfile(authentication.getName(), request);
        return new com.claim.demo.dto.UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole(),
                user.getPhoneNumber(), user.getAddress(), user.getAvatarUrl(), user.isBlocked());
    }

    @GetMapping
    public List<com.claim.demo.dto.UserResponse> getAllUsers() {
        return userService.getAllUsers().stream()
                .map(user -> new com.claim.demo.dto.UserResponse(user.getId(), user.getUsername(), user.getEmail(),
                        user.getRole(), user.getPhoneNumber(), user.getAddress(), user.getAvatarUrl(),
                        user.isBlocked()))
                .collect(java.util.stream.Collectors.toList());
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @PutMapping("/{id}/block")
    public void blockUser(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        userService.blockUser(id, payload.get("reason"));
    }

    @PutMapping("/{id}/unblock")
    public void unblockUser(@PathVariable Long id) {
        userService.unblockUser(id);
    }

    @GetMapping("/claims/my")
    public List<Claim> getMyClaims(Authentication authentication) {
        return userService.getLoggedInUserClaims(authentication.getName());
    }
}
