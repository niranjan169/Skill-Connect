package com.luzo_portal.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "saved_jobs",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "job_id"}))
public class SavedJob extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "job_id")
    private Job job;

    public SavedJob() {
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }
}