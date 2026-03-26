package com.luzo_portal.service.impl;

import com.luzo_portal.dto.*;
import com.luzo_portal.entity.*;
import com.luzo_portal.exception.BadRequestException;
import com.luzo_portal.exception.NotFoundException;
import com.luzo_portal.repository.*;
import com.luzo_portal.security.Role;
import com.luzo_portal.service.AuthService;
import com.luzo_portal.service.ActivityLogService;
import com.luzo_portal.service.RecruiterService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class RecruiterServiceImpl implements RecruiterService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;
    private final AuthService authService;

    public RecruiterServiceImpl(JobRepository jobRepository,
            JobApplicationRepository jobApplicationRepository,
            RecruiterProfileRepository recruiterProfileRepository,
            SkillRepository skillRepository,
            UserRepository userRepository,
            ActivityLogService activityLogService,
            AuthService authService) { // Added emailService parameter
        this.jobRepository = jobRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.activityLogService = activityLogService;
        this.authService = authService;
    }

    private User getCurrentUser() {
        Long userId = authService.getCurrentUserId();
        if (userId == null) {
            throw new BadRequestException("No authenticated user");
        }
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    private RecruiterProfile getCurrentRecruiterProfile() {
        User user = getCurrentUser();
        if (user.getRole() != Role.RECRUITER) {
            throw new BadRequestException("Only recruiters can perform this action");
        }
        return recruiterProfileRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("Recruiter profile not found"));
    }

    @Override
    public JobResponse createJob(CreateJobRequest request) {
        RecruiterProfile profile = getCurrentRecruiterProfile();

        Job job = new Job();
        job.setRecruiterProfile(profile);
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setMinExperience(request.getMinExperience());
        job.setMaxExperience(request.getMaxExperience());
        job.setMinSalary(request.getMinSalary());
        job.setMaxSalary(request.getMaxSalary());
        job.setApproved(true); // Auto-approve job to fix visibility issues
        job.setDeleted(false);

        // Set company name (prefer request, fallback to profile)
        String company = request.getCompanyName();
        if (company == null || company.trim().isEmpty()) {
            company = profile.getCompanyName();
        }
        job.setCompanyName(company);

        // Resolve skills
        Set<Skill> skills = new HashSet<>();
        if (request.getRequiredSkills() != null) {
            for (String skillName : request.getRequiredSkills()) {
                if (skillName == null || skillName.trim().isEmpty())
                    continue;
                String trimmed = skillName.trim();
                Skill skill = skillRepository.findByNameIgnoreCase(trimmed)
                        .orElseGet(() -> skillRepository.save(new Skill(trimmed)));
                skills.add(skill);
            }
        }
        job.setRequiredSkills(skills);

        Job saved = jobRepository.save(job);
        activityLogService.log(profile.getUser().getId(), "JOB_CREATED", "Created job: " + saved.getTitle());

        return toJobResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getMyJobs() {
        RecruiterProfile profile = getCurrentRecruiterProfile();
        List<Job> jobs = jobRepository.findByRecruiterProfileIdAndDeletedFalse(profile.getId());
        return jobs.stream().map(this::toJobResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CandidateApplicationResponse> getApplicantsForJob(Long jobId) {
        RecruiterProfile profile = getCurrentRecruiterProfile();
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new NotFoundException("Job not found"));

        if (!job.getRecruiterProfile().getId().equals(profile.getId())) {
            throw new BadRequestException("You can only view applicants for your own jobs");
        }

        List<JobApplication> applications = jobApplicationRepository.findByJob(job);
        return applications.stream()
                .map(app -> toCandidateApplicationResponse(app))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CandidateApplicationResponse> getAllApplicants() {
        User user = getCurrentUser();
        List<JobApplication> applications = jobApplicationRepository.findByJobRecruiterProfileUser(user);
        return applications.stream()
                .map(this::toCandidateApplicationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CandidateApplicationResponse> filterCandidates(Long jobId, CandidateFilterRequest filterRequest) {
        RecruiterProfile profile = getCurrentRecruiterProfile();
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new NotFoundException("Job not found"));

        if (!job.getRecruiterProfile().getId().equals(profile.getId())) {
            throw new BadRequestException("You can only filter candidates for your own jobs");
        }

        List<JobApplication> applications = jobApplicationRepository.findByJob(job);

        return applications.stream()
                .filter(app -> {
                    User candidate = app.getCandidate();

                    // Filter by location
                    if (filterRequest.getLocation() != null && !filterRequest.getLocation().isEmpty()) {
                        if (candidate.getLocation() == null ||
                                !candidate.getLocation().equalsIgnoreCase(filterRequest.getLocation())) {
                            return false;
                        }
                    }

                    // Filter by experience
                    if (filterRequest.getMinExperience() != null) {
                        if (candidate.getYearsOfExperience() == null ||
                                candidate.getYearsOfExperience() < filterRequest.getMinExperience()) {
                            return false;
                        }
                    }
                    if (filterRequest.getMaxExperience() != null) {
                        if (candidate.getYearsOfExperience() != null &&
                                candidate.getYearsOfExperience() > filterRequest.getMaxExperience()) {
                            return false;
                        }
                    }

                    // Filter by education
                    if (filterRequest.getEducation() != null && !filterRequest.getEducation().isEmpty()) {
                        if (candidate.getEducation() == null ||
                                !candidate.getEducation().toLowerCase()
                                        .contains(filterRequest.getEducation().toLowerCase())) {
                            return false;
                        }
                    }

                    // Filter by skills
                    if (filterRequest.getSkills() != null && !filterRequest.getSkills().isEmpty()) {
                        Set<String> candidateSkillNames = candidate.getSkills().stream()
                                .map(Skill::getName)
                                .map(String::toLowerCase)
                                .collect(Collectors.toSet());

                        Set<String> filterSkillNames = filterRequest.getSkills().stream()
                                .map(String::toLowerCase)
                                .collect(Collectors.toSet());

                        boolean hasAllSkills = filterSkillNames.stream()
                                .allMatch(candidateSkillNames::contains);

                        if (!hasAllSkills) {
                            return false;
                        }
                    }

                    return true;
                })
                .map(this::toCandidateApplicationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CandidateApplicationResponse updateApplicationStatus(Long applicationId,
            ApplicationStatus status,
            String recruiterNotes) {
        RecruiterProfile profile = getCurrentRecruiterProfile();
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new NotFoundException("Application not found"));

        if (!application.getJob().getRecruiterProfile().getId().equals(profile.getId())) {
            throw new BadRequestException("You can only update status for applications to your jobs");
        }

        application.setStatus(status);
        if (recruiterNotes != null && !recruiterNotes.isEmpty()) {
            application.setRecruiterNotes(recruiterNotes);
        }

        JobApplication saved = jobApplicationRepository.save(application);

        activityLogService.log(profile.getUser().getId(), "APPLICATION_STATUS_UPDATED",
                "Updated application ID " + applicationId + " to " + status);

        return toCandidateApplicationResponse(saved);
    }

    private JobResponse toJobResponse(Job job) {
        JobResponse response = new JobResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        String company = job.getCompanyName();
        if (company == null || company.isEmpty()) {
            company = (job.getRecruiterProfile() != null) ? job.getRecruiterProfile().getCompanyName() : "N/A";
        }
        response.setCompanyName(company);
        response.setLocation(job.getLocation());
        response.setJobType(job.getJobType());
        response.setMinExperience(job.getMinExperience());
        response.setMaxExperience(job.getMaxExperience());
        response.setMinSalary(job.getMinSalary());
        response.setMaxSalary(job.getMaxSalary());
        response.setApproved(job.isApproved());
        response.setStatus(job.isApproved() ? "APPROVED" : "PENDING");
        response.setSkills(job.getRequiredSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toList()));
        response.setDescription(job.getDescription());
        response.setRequirements(job.getRequirements());
        return response;
    }

    private CandidateApplicationResponse toCandidateApplicationResponse(JobApplication application) {
        CandidateApplicationResponse response = new CandidateApplicationResponse();
        User candidate = application.getCandidate();

        response.setApplicationId(application.getId());
        response.setCandidateId(candidate.getId());
        response.setCandidateName(candidate.getFullName());
        response.setCandidateEmail(candidate.getEmail());
        response.setLocation(candidate.getLocation());
        response.setYearsOfExperience(candidate.getYearsOfExperience());
        response.setEducation(candidate.getEducation());
        response.setSkills(candidate.getSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toList()));
        response.setResumeUrl(candidate.getResumeUrl());
        response.setStatus(application.getStatus());
        response.setRecruiterNotes(application.getRecruiterNotes());
        if (application.getJob() != null) {
            response.setJobId(application.getJob().getId());
            response.setJobTitle(application.getJob().getTitle());
            Set<Skill> jobSkills = application.getJob().getRequiredSkills();
            Set<Skill> candidateSkills = candidate.getSkills();
            if (jobSkills == null || jobSkills.isEmpty()) {
                response.setMatchPercentage(100.0);
                response.setMissingSkills(java.util.Collections.emptyList());
            } else {
                long matchCount = 0;
                List<String> missing = new java.util.ArrayList<>();
                Set<String> candSkillNames = candidateSkills != null ? candidateSkills.stream()
                        .map(s -> s.getName().toLowerCase()).collect(Collectors.toSet()) : java.util.Collections.emptySet();
                for (Skill js : jobSkills) {
                    if (candSkillNames.contains(js.getName().toLowerCase())) {
                        matchCount++;
                    } else {
                        missing.add(js.getName());
                    }
                }
                double matchPercentage = (double) matchCount / jobSkills.size() * 100.0;
                response.setMatchPercentage(Math.round(matchPercentage * 10.0) / 10.0);
                response.setMissingSkills(missing);
            }
        }

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public RecruiterDashboardStats getDashboardStats() {
        RecruiterProfile profile = getCurrentRecruiterProfile();
        User user = profile.getUser();

        List<Job> allJobs = jobRepository.findByRecruiterProfileIdAndDeletedFalse(profile.getId());

        long totalJobsPosted = allJobs.size();
        long approvedJobs = allJobs.stream()
                .filter(Job::isApproved)
                .count();
        long pendingJobs = allJobs.stream()
                .filter(job -> !job.isApproved())
                .count();

        List<JobApplication> allApplications = jobApplicationRepository.findByJobRecruiterProfileUser(user);

        long totalApplications = allApplications.size();
        long newApplications = allApplications.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.APPLIED)
                .count();
        long shortlistedCandidates = allApplications.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.SHORTLISTED)
                .count();
        long rejectedCandidates = allApplications.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.REJECTED)
                .count();
        long selectedCandidates = allApplications.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.SELECTED)
                .count();

        // Calculate average match is no longer needed
        double averageMatchPercentage = 0.0;

        // Fetch top 5 recent candidates
        List<CandidateApplicationResponse> recentCandidates = allApplications.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .map(this::toCandidateApplicationResponse)
                .collect(Collectors.toList());

        Map<String, Long> applicationsPerJob = allJobs.stream()
                .collect(Collectors.toMap(
                        Job::getTitle,
                        job -> (long) jobApplicationRepository.countByJob(job),
                        (existing, replacement) -> existing // Handle duplicate titles if any
                ));

        Map<String, Long> applicationsByStatus = new HashMap<>();
        applicationsByStatus.put("APPLIED", newApplications);
        applicationsByStatus.put("SHORTLISTED", shortlistedCandidates);
        applicationsByStatus.put("REJECTED", rejectedCandidates);
        applicationsByStatus.put("SELECTED", selectedCandidates);

        return new RecruiterDashboardStats(
                totalJobsPosted,
                approvedJobs,
                pendingJobs,
                totalApplications,
                newApplications,
                shortlistedCandidates,
                rejectedCandidates,
                selectedCandidates,
                applicationsByStatus,
                applicationsPerJob,
                profile.getCompanyName(),
                profile.isApproved(),
                recentCandidates);
    }
}
