package com.luzo_portal.service;

import com.luzo_portal.dto.CandidateApplicationResponse;
import com.luzo_portal.dto.CandidateFilterRequest;
import com.luzo_portal.dto.CreateJobRequest;
import com.luzo_portal.dto.JobResponse;
import com.luzo_portal.dto.RecruiterDashboardStats;
import com.luzo_portal.entity.ApplicationStatus;

import java.util.List;

public interface RecruiterService {

    JobResponse createJob(CreateJobRequest jobRequest);

    List<JobResponse> getMyJobs();

    List<CandidateApplicationResponse> getApplicantsForJob(Long jobId);

    List<CandidateApplicationResponse> getAllApplicants();

    List<CandidateApplicationResponse> filterCandidates(Long jobId, CandidateFilterRequest filterRequest);

    CandidateApplicationResponse updateApplicationStatus(Long applicationId,
            ApplicationStatus status,
            String recruiterNotes);

    RecruiterDashboardStats getDashboardStats();
}