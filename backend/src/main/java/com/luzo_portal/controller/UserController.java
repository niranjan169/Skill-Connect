package com.luzo_portal.controller;

import com.luzo_portal.dto.*;
import com.luzo_portal.service.UserService;
import com.luzo_portal.service.AuthService;
import com.luzo_portal.service.FileStorageService;
import com.luzo_portal.repository.UserRepository;
import com.luzo_portal.repository.ReportRepository;
import com.luzo_portal.entity.User;
import com.luzo_portal.entity.Report;
import com.luzo_portal.exception.NotFoundException;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasRole('USER')")
public class UserController {

    private final UserService userService;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;
    private final AuthService authService;
    private final ReportRepository reportRepository;

    public UserController(UserService userService,
            FileStorageService fileStorageService,
            UserRepository userRepository,
            AuthService authService,
            ReportRepository reportRepository) {
        this.userService = userService;
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
        this.authService = authService;
        this.reportRepository = reportRepository;
    }

    // View all jobs (no filter)
    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponse>> getAllJobs() {
        JobFilterRequest emptyFilter = new JobFilterRequest();
        return ResponseEntity.ok(userService.searchJobs(emptyFilter));
    }

    // View + filter jobs
    @PostMapping("/jobs/search")
    public ResponseEntity<List<JobResponse>> searchJobs(@RequestBody JobFilterRequest filterRequest) {
        return ResponseEntity.ok(userService.searchJobs(filterRequest));
    }

    // View single job details with match percentage
    @GetMapping("/jobs/{jobId}")
    public ResponseEntity<JobResponse> getJobDetails(@PathVariable Long jobId) {
        return ResponseEntity.ok(userService.getJobById(jobId));
    }

    // Save job
    @PostMapping("/jobs/{jobId}/save")
    public ResponseEntity<Void> saveJob(@PathVariable Long jobId) {
        userService.saveJob(jobId);
        return ResponseEntity.ok().build();
    }

    // Unsave job
    @DeleteMapping("/jobs/{jobId}/save")
    public ResponseEntity<Void> unsaveJob(@PathVariable Long jobId) {
        userService.unsaveJob(jobId);
        return ResponseEntity.noContent().build();
    }

    // Get saved jobs
    @GetMapping("/saved-jobs")
    public ResponseEntity<List<JobResponse>> getSavedJobs() {
        return ResponseEntity.ok(userService.getSavedJobs());
    }

    // Apply for job
    @PostMapping("/applications")
    public ResponseEntity<ApplicationResponse> applyJob(@Valid @RequestBody ApplicationRequest request) {
        return ResponseEntity.ok(userService.applyForJob(request));
    }

    // Track my applications
    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationResponse>> myApplications() {
        return ResponseEntity.ok(userService.getMyApplications());
    }

    // Smart recommendations
    @GetMapping("/recommendations")
    public ResponseEntity<List<JobResponse>> recommendations() {
        return ResponseEntity.ok(userService.getSmartRecommendations());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<UserDashboardStats> getDashboard() {
        return ResponseEntity.ok(userService.getDashboardStats());
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile() {
        return ResponseEntity.ok(userService.getProfile());
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @PostMapping("/resume/upload")
    public ResponseEntity<String> uploadResume(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);

        Long userId = authService.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
        user.setResumeUrl(fileName);
        userRepository.save(user);

        return ResponseEntity.ok(fileName);
    }

    @GetMapping("/resume/download/{fileName}")
    @PreAuthorize("hasAnyRole('USER', 'RECRUITER', 'ADMIN')")
    public ResponseEntity<Resource> downloadResume(@PathVariable String fileName) {
        Resource resource = fileStorageService.loadFileAsResource(fileName);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @PostMapping("/report")
    public ResponseEntity<Void> reportIssue(@Valid @RequestBody ReportRequest request) {
        User reporter = userRepository.findById(authService.getCurrentUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Report report = new Report();
        report.setReporter(reporter);
        report.setTargetType(request.getTargetType());
        report.setTargetId(request.getTargetId());
        report.setReason(request.getReason());

        reportRepository.save(report);
        return ResponseEntity.ok().build();
    }
}