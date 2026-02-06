package com.claim.demo.controller;

import com.claim.demo.dto.ClaimResponse;
import com.claim.demo.service.ClaimService;
import com.claim.demo.service.ExcelService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final ClaimService claimService;
    private final ExcelService excelService;

    public ReportController(ClaimService claimService, ExcelService excelService) {
        this.claimService = claimService;
        this.excelService = excelService;
    }

    @GetMapping("/claims/download")
    public ResponseEntity<Resource> downloadReport(@RequestParam(required = false) String status) {
        List<ClaimResponse> claims = claimService.getAllClaims();

        // Simple filtering here for demo. ideally move to service/repo
        if (status != null && !status.isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            claims = claims.stream()
                    .filter(c -> c.getStatus().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }

        InputStreamResource file = new InputStreamResource(excelService.generateClaimsReport(claims));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=claims_report.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
                .body(file);
    }
}
