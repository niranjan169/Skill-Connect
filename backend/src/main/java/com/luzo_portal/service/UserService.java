package com.luzo_portal.service;

import com.luzo_portal.dto.ApplicationRequest;
import com.luzo_portal.dto.ApplicationResponse;
import com.luzo_portal.dto.JobFilterRequest;
import com.luzo_portal.dto.JobResponse;
import com.luzo_portal.dto.UpdateProfileRequest;
import com.luzo_portal.dto.UserDashboardStats;
import com.luzo_portal.dto.UserResponse;

import java.util.List;

public interface UserService {

    List<JobResponse> searchJobs(JobFilterRequest filterRequest);

    JobResponse getJobById(Long jobId);

    void saveJob(Long jobId);

    void unsaveJob(Long jobId);

    List<JobResponse> getSavedJobs();

    ApplicationResponse applyForJob(ApplicationRequest request);

    List<ApplicationResponse> getMyApplications();

    List<JobResponse> getSmartRecommendations();

    UserDashboardStats getDashboardStats();

    UserResponse getProfile();

    UserResponse updateProfile(UpdateProfileRequest request);
}