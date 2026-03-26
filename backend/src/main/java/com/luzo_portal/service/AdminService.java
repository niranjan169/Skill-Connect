package com.luzo_portal.service;

import com.luzo_portal.dto.AdminDashboardStats;
import com.luzo_portal.dto.JobResponse;
import com.luzo_portal.dto.RecruiterProfileResponse;
import com.luzo_portal.dto.UserResponse;

import java.util.List;

public interface AdminService {

    AdminDashboardStats getDashboardStats();

    List<JobResponse> getPendingJobs();

    JobResponse approveJob(Long jobId);

    void deleteJob(Long jobId);

    void approveRecruiter(Long recruiterProfileId);

    void blockUser(Long userId, boolean active);

    List<UserResponse> getAllUsers();

    List<RecruiterProfileResponse> getAllRecruiters();

    List<JobResponse> getAllJobs();

    void resolveReport(Long reportId, String adminNotes);
}