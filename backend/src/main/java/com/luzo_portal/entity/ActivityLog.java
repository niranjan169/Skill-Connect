package com.luzo_portal.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
@Getter
@Setter
public class ActivityLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // Who performed the action

    @Column(nullable = false)
    private String action; // e.g., "JOB_POSTED", "USER_BLOCKED"

    @Column(columnDefinition = "TEXT")
    private String details;

    private LocalDateTime timestamp = LocalDateTime.now();

    // Explicit Getters and Setters for IDE compatibility
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
