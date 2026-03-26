package com.luzo_portal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
public class JobApplication extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "job_id")
    private Job job;

    @ManyToOne(optional = false)
    @JoinColumn(name = "candidate_id")
    private User candidate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Column(length = 2000)
    private String recruiterNotes;

    public JobApplication() {
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public User getCandidate() {
        return candidate;
    }

    public void setCandidate(User candidate) {
        this.candidate = candidate;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getRecruiterNotes() {
        return recruiterNotes;
    }

    public void setRecruiterNotes(String recruiterNotes) {
        this.recruiterNotes = recruiterNotes;
    }
}