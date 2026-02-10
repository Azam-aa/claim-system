package com.claim.demo.service;

import com.claim.demo.dto.ClaimRequest;
import com.claim.demo.dto.ClaimResponse;
import com.claim.demo.entity.Claim;
import com.claim.demo.entity.User;
import com.claim.demo.exception.ClaimNotFoundException;
import com.claim.demo.repository.ClaimRepository;
import com.claim.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@org.springframework.transaction.annotation.Transactional(readOnly = true)
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final UserRepository userRepository;

    public ClaimService(ClaimRepository claimRepository,
            UserRepository userRepository) {
        this.claimRepository = claimRepository;
        this.userRepository = userRepository;
    }

    @org.springframework.transaction.annotation.Transactional
    public ClaimResponse createClaim(ClaimRequest request, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Claim claim = new Claim();
        claim.setClaimNumber(request.getClaimNumber());
        claim.setDescription(request.getDescription());
        claim.setAmount(request.getAmount());
        claim.setStatus("SUBMITTED");
        claim.setCreatedAt(LocalDateTime.now());
        claim.setUser(user);

        return mapToResponse(claimRepository.save(claim));
    }

    public ClaimResponse getClaim(Long id) {
        return mapToResponse(
                claimRepository.findById(id)
                        .orElseThrow(() -> new ClaimNotFoundException("Claim not found")));
    }

    @org.springframework.transaction.annotation.Transactional
    public ClaimResponse updateStatus(Long id, String status) {

        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ClaimNotFoundException("Claim not found"));

        claim.setStatus(status);
        return mapToResponse(claimRepository.save(claim));
    }

    public List<ClaimResponse> getMyClaims(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getClaims().stream()
                .filter(c -> !c.isDeleted())
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    public List<ClaimResponse> getAllClaims() {
        return claimRepository.findAll().stream()
                .filter(c -> !c.isDeleted())
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    @org.springframework.transaction.annotation.Transactional
    public ClaimResponse approveClaim(Long id, String adminUsername) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ClaimNotFoundException("Claim not found"));

        claim.setStatus("APPROVED");
        claim.setApprovedBy(adminUsername);
        claim.setActionDate(LocalDateTime.now());

        claim.setRejectionReason(null);
        claim.setRejectedBy(null);

        Claim saved = claimRepository.save(claim);

        return mapToResponse(saved);
    }

    @org.springframework.transaction.annotation.Transactional
    public ClaimResponse rejectClaim(Long id, String reason, String adminUsername) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ClaimNotFoundException("Claim not found"));

        claim.setStatus("REJECTED");
        claim.setRejectionReason(reason);
        claim.setRejectedBy(adminUsername);
        claim.setActionDate(LocalDateTime.now());

        claim.setApprovedBy(null);

        Claim saved = claimRepository.save(claim);

        return mapToResponse(saved);
    }

    @org.springframework.transaction.annotation.Transactional
    public void softDeleteClaim(Long id) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ClaimNotFoundException("Claim not found"));
        claim.setDeleted(true);
        claimRepository.save(claim);
    }

    private ClaimResponse mapToResponse(Claim claim) {
        ClaimResponse response = new ClaimResponse();
        response.setId(claim.getId());
        response.setClaimNumber(claim.getClaimNumber());
        response.setDescription(claim.getDescription());
        response.setAmount(claim.getAmount());
        response.setStatus(claim.getStatus());
        response.setCreatedAt(claim.getCreatedAt());

        response.setRejectionReason(claim.getRejectionReason());
        response.setApprovedBy(claim.getApprovedBy());
        response.setRejectedBy(claim.getRejectedBy());
        response.setActionDate(claim.getActionDate());

        return response;
    }
}
