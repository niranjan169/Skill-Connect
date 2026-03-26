package com.luzo_portal.dto;

import com.luzo_portal.entity.ReportType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportRequest {

    @NotNull
    private ReportType targetType;

    @NotNull
    private Long targetId;

    @NotBlank
    private String reason;

    // Explicit getters/setters for IDE compatibility
    public ReportType getTargetType() {
        return targetType;
    }

    public void setTargetType(ReportType targetType) {
        this.targetType = targetType;
    }

    public Long getTargetId() {
        return targetId;
    }

    public void setTargetId(Long targetId) {
        this.targetId = targetId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
