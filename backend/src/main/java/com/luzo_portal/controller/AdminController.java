package com.luzo_portal.controller;

import com.luzo_portal.dto.AdminDashboardStats;
import com.luzo_portal.dto.JobResponse;
import com.luzo_portal.dto.RecruiterProfileResponse;
import com.luzo_portal.dto.UserResponse;
import com.luzo_portal.entity.ActivityLog;
import com.luzo_portal.entity.Report;
import com.luzo_portal.entity.ReportStatus;
import com.luzo_portal.repository.ActivityLogRepository;
import com.luzo_portal.repository.ReportRepository;
import com.luzo_portal.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final ReportRepository reportRepository;
    private final ActivityLogRepository activityLogRepository;

    public AdminController(AdminService adminService,
            ReportRepository reportRepository,
            ActivityLogRepository activityLogRepository) {
        this.adminService = adminService;
        this.reportRepository = reportRepository;
        this.activityLogRepository = activityLogRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardStats> dashboard() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/recruiters")
    public ResponseEntity<List<RecruiterProfileResponse>> getAllRecruiters() {
        return ResponseEntity.ok(adminService.getAllRecruiters());
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponse>> getAllJobs() {
        return ResponseEntity.ok(adminService.getAllJobs());
    }

    @GetMapping("/jobs/pending")
    public ResponseEntity<List<JobResponse>> pendingJobs() {
        return ResponseEntity.ok(adminService.getPendingJobs());
    }

    @PostMapping("/jobs/{jobId}/approve")
    public ResponseEntity<JobResponse> approveJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(adminService.approveJob(jobId));
    }

    @DeleteMapping("/jobs/{jobId}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long jobId) {
        adminService.deleteJob(jobId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/recruiters/{profileId}/approve")
    public ResponseEntity<Void> approveRecruiter(@PathVariable Long profileId) {
        adminService.approveRecruiter(profileId);
        return ResponseEntity.ok().build();
    }

    // Renamed from /block to /status (active=true to unblock, active=false to
    // block)
    @PostMapping("/users/{userId}/status")
    public ResponseEntity<Void> setUserStatus(@PathVariable Long userId,
            @RequestParam boolean active) {
        adminService.blockUser(userId, active);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getReports(
            @RequestParam(required = false) ReportStatus status) {
        if (status != null) {
            return ResponseEntity.ok(reportRepository.findByStatus(status));
        }
        return ResponseEntity.ok(reportRepository.findAll());
    }

    @PostMapping("/reports/{reportId}/resolve")
    public ResponseEntity<Void> resolveReport(@PathVariable Long reportId, @RequestParam String notes) {
        adminService.resolveReport(reportId, notes);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/activities")
    public ResponseEntity<List<ActivityLog>> getActivities() {
        return ResponseEntity.ok(activityLogRepository.findAll());
    }
}