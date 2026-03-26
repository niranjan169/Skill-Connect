package com.luzo_portal.controller;

import com.luzo_portal.dto.CandidateApplicationResponse;
import com.luzo_portal.dto.CandidateFilterRequest;
import com.luzo_portal.dto.CreateJobRequest;
import com.luzo_portal.dto.JobResponse;
import com.luzo_portal.dto.RecruiterDashboardStats;
import com.luzo_portal.entity.ApplicationStatus;
import com.luzo_portal.service.RecruiterService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterController {

    private final RecruiterService recruiterService;

    public RecruiterController(RecruiterService recruiterService) {
        this.recruiterService = recruiterService;
    }

    @PostMapping("/jobs")
    public ResponseEntity<JobResponse> createJob(@Valid @RequestBody CreateJobRequest jobRequest) {
        return ResponseEntity.ok(recruiterService.createJob(jobRequest));
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponse>> myJobs() {
        return ResponseEntity.ok(recruiterService.getMyJobs());
    }

    @GetMapping("/jobs/{jobId}/applicants")
    public ResponseEntity<List<CandidateApplicationResponse>> applicants(@PathVariable String jobId) {
        if ("all".equalsIgnoreCase(jobId)) {
            return ResponseEntity.ok(recruiterService.getAllApplicants());
        }
        try {
            Long id = Long.parseLong(jobId);
            return ResponseEntity.ok(recruiterService.getApplicantsForJob(id));
        } catch (NumberFormatException e) {
            throw new com.luzo_portal.exception.BadRequestException("Invalid job ID format: " + jobId);
        }
    }

    @PostMapping("/jobs/{jobId}/applicants/filter")
    public ResponseEntity<List<CandidateApplicationResponse>> filterCandidates(
            @PathVariable String jobId,
            @RequestBody CandidateFilterRequest filterRequest) {
        if ("all".equalsIgnoreCase(jobId)) {
            // For filter all, we might want to implement a service method or just return
            // bad request
            // But let's assume filter is usually for specific jobs.
            // If all is passed, just return bad request for now or parse it.
            throw new com.luzo_portal.exception.BadRequestException("Filtering is only supported for specific jobs");
        }
        try {
            Long id = Long.parseLong(jobId);
            return ResponseEntity.ok(recruiterService.filterCandidates(id, filterRequest));
        } catch (NumberFormatException e) {
            throw new com.luzo_portal.exception.BadRequestException("Invalid job ID format: " + jobId);
        }
    }

    @PatchMapping("/applications/{id}")
    public ResponseEntity<CandidateApplicationResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status,
            @RequestParam(required = false) String notes) {
        return ResponseEntity
                .ok(recruiterService.updateApplicationStatus(id, status, notes));
    }

    // Recruiter Dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<RecruiterDashboardStats> getDashboard() {
        return ResponseEntity.ok(recruiterService.getDashboardStats());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return ResponseEntity.ok(java.util.Map.of("error", "No auth found"));
        return ResponseEntity.ok(java.util.Map.of(
            "name", auth.getName(),
            "authorities", auth.getAuthorities().stream().map(org.springframework.security.core.GrantedAuthority::getAuthority).toList()
        ));
    }
}