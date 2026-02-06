package com.claim.demo.dto;

public class NotificationDTO {

    private String eventType;
    private Long claimId;
    private String status;

    public NotificationDTO() {}

    public NotificationDTO(String eventType, Long claimId, String status) {
        this.eventType = eventType;
        this.claimId = claimId;
        this.status = status;
    }

    public String getEventType() {
        return eventType;
    }

    public Long getClaimId() {
        return claimId;
    }

    public String getStatus() {
        return status;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public void setClaimId(Long claimId) {
        this.claimId = claimId;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
