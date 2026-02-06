package com.claim.demo.service;

import com.claim.demo.dto.ClaimResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExcelService {

    public ByteArrayInputStream generateClaimsReport(List<ClaimResponse> claims) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Claims");

            // Header
            String[] headers = { "ID", "Claim Number", "Amount", "Status", "Date", "Rejection Reason", "Approved By",
                    "Rejected By" };
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                CellStyle style = workbook.createCellStyle();
                Font font = workbook.createFont();
                font.setBold(true);
                style.setFont(font);
                cell.setCellStyle(style);
            }

            // Data
            int rowIdx = 1;
            for (ClaimResponse claim : claims) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(claim.getId());
                row.createCell(1).setCellValue(claim.getClaimNumber());
                row.createCell(2).setCellValue(claim.getAmount());
                row.createCell(3).setCellValue(claim.getStatus());
                row.createCell(4).setCellValue(claim.getCreatedAt().toString());
                row.createCell(5).setCellValue(claim.getRejectionReason() != null ? claim.getRejectionReason() : "");
                row.createCell(6).setCellValue(claim.getApprovedBy() != null ? claim.getApprovedBy() : "");
                row.createCell(7).setCellValue(claim.getRejectedBy() != null ? claim.getRejectedBy() : "");
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("fail to import data to Excel file: " + e.getMessage());
        }
    }
}
