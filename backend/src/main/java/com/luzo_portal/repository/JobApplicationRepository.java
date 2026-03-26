// JobApplicationRepository.java
package com.luzo_portal.repository;

import com.luzo_portal.entity.ApplicationStatus;
import com.luzo_portal.entity.Job;
import com.luzo_portal.entity.JobApplication;
import com.luzo_portal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByCandidate(User candidate);

    List<JobApplication> findByJob(Job job);

    @Query("SELECT a FROM JobApplication a WHERE a.job.recruiterProfile.user = :recruiterUser")
    List<JobApplication> findByJobRecruiterProfileUser(@Param("recruiterUser") User recruiterUser);

    List<JobApplication> findByStatus(ApplicationStatus status);

    long countByJob(Job job);

    /** Used to prevent duplicate applications */
    Optional<JobApplication> findByCandidateAndJob(User candidate, Job job);

    long countByCandidate(User candidate);
}