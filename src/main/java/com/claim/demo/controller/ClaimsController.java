package com.claim.demo.controller;

import com.claim.demo.service.ClaimService;
import com.claim.demo.dto.ClaimResponse;
import com.claim.demo.dto.ClaimRequest;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.security.Principal;

@RestController
@RequestMapping("/api/v1/claims")
public class ClaimsController {

    private final ClaimService claimService;

    public ClaimsController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping
    public ClaimResponse createClaim(@RequestBody ClaimRequest request,
            Authentication authentication) {
        return claimService.createClaim(request, authentication.getName());
    }

    @GetMapping("/my")
    public List<ClaimResponse> getMyClaims(Authentication authentication) {
        return claimService.getMyClaims(authentication.getName());
    }

    @GetMapping
    public List<ClaimResponse> getAllClaims() {
        return claimService.getAllClaims();
    }

    @PutMapping("/{id}/approve")
    public ClaimResponse approveClaim(@PathVariable Long id, Principal principal) {
        return claimService.approveClaim(id, principal.getName());
    }

    @PutMapping("/{id}/reject")
    public ClaimResponse rejectClaim(@PathVariable Long id, @RequestBody Map<String, String> payload,
            Principal principal) {
        return claimService.rejectClaim(id, payload.get("reason"), principal.getName());
    }

    @DeleteMapping("/{id}")
    public void deleteClaim(@PathVariable Long id) {
        claimService.softDeleteClaim(id);
    }

    @PutMapping("/{id}/status")
    public ClaimResponse updateStatus(@PathVariable Long id,
            @RequestBody Map<String, String> statusMap) {
        return claimService.updateStatus(id, statusMap.get("status"));
    }
}
