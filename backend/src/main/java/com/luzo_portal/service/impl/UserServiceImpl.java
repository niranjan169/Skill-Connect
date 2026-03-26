package com.luzo_portal.service.impl;

import com.luzo_portal.dto.*;
import com.luzo_portal.entity.*;
import com.luzo_portal.exception.BadRequestException;
import com.luzo_portal.exception.NotFoundException;
import com.luzo_portal.repository.*;
import com.luzo_portal.security.Role;
import com.luzo_portal.service.AuthService;
import com.luzo_portal.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

        private final JobRepository jobRepository;
        private final JobApplicationRepository jobApplicationRepository;
        private final SavedJobRepository savedJobRepository;
        private final UserRepository userRepository;
        private final SkillRepository skillRepository;
        private final AuthService authService;

        public UserServiceImpl(JobRepository jobRepository,
                        JobApplicationRepository jobApplicationRepository,
                        SavedJobRepository savedJobRepository,
                        UserRepository userRepository,
                        SkillRepository skillRepository,
                        AuthService authService) {
                this.jobRepository = jobRepository;
                this.jobApplicationRepository = jobApplicationRepository;
                this.savedJobRepository = savedJobRepository;
                this.userRepository = userRepository;
                this.skillRepository = skillRepository;
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

        @Override
        @Transactional(readOnly = true)
        public List<JobResponse> searchJobs(JobFilterRequest filterRequest) {
                String title = (filterRequest != null) ? filterRequest.getTitle() : null;
                String titlePattern = (title == null || title.trim().isEmpty()) ? null
                                : "%" + title.trim().toLowerCase() + "%";

                String loc = (filterRequest != null) ? filterRequest.getLocation() : null;
                String locationPattern = (loc == null || loc.trim().isEmpty()) ? null
                                : "%" + loc.trim().toLowerCase() + "%";

                JobType jobType = (filterRequest != null) ? filterRequest.getJobType() : null;

                List<Job> jobs = jobRepository.searchJobs(
                                titlePattern,
                                locationPattern,
                                jobType,
                                (filterRequest != null) ? filterRequest.getMinExperience() : null,
                                (filterRequest != null) ? filterRequest.getMaxExperience() : null,
                                (filterRequest != null) ? filterRequest.getMinSalary() : null,
                                (filterRequest != null) ? filterRequest.getMaxSalary() : null);

                Set<String> filterSkills = (filterRequest == null || filterRequest.getSkills() == null)
                                ? Collections.emptySet()
                                : filterRequest.getSkills().stream()
                                                .filter(Objects::nonNull)
                                                .map(String::toLowerCase)
                                                .collect(Collectors.toSet());

                User currentUser = null;
                Set<Long> appliedJobIds = new HashSet<>();
                Set<Long> savedJobIds = new HashSet<>();
                try {
                        currentUser = getCurrentUser();
                        appliedJobIds = jobApplicationRepository.findByCandidate(currentUser).stream()
                                        .map(app -> app.getJob().getId())
                                        .collect(Collectors.toSet());
                        savedJobIds = savedJobRepository.findByUser(currentUser).stream()
                                        .map(sj -> sj.getJob().getId())
                                        .collect(Collectors.toSet());
                } catch (Exception e) {
                        // Not logged in or anonymous
                }

                final User user = currentUser;
                final Set<Long> appliedIds = appliedJobIds;
                final Set<Long> savedIds = savedJobIds;
                return jobs.stream()
                                .filter(Objects::nonNull)
                                .map(job -> {
                                        JobResponse res = toJobResponse(job, filterSkills, user);
                                        if (res != null) {
                                                res.setApplied(appliedIds.contains(job.getId()));
                                                res.setSaved(savedIds.contains(job.getId()));
                                        }
                                        return res;
                                })
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional(readOnly = true)
        public JobResponse getJobById(Long jobId) {
                Job job = jobRepository.findById(jobId)
                                .orElseThrow(() -> new NotFoundException("Job not found"));

                if (!job.isApproved() || job.isDeleted()) {
                        throw new NotFoundException("Job not found");
                }

                User currentUser = getCurrentUser();
                Set<Skill> userSkills = (currentUser != null) ? currentUser.getSkills() : Collections.emptySet();

                JobResponse response = toJobResponseWithUserSkills(job, userSkills, currentUser);
                if (response != null && currentUser != null) {
                        response.setApplied(
                                        jobApplicationRepository.findByCandidateAndJob(currentUser, job).isPresent());
                        response.setSaved(savedJobRepository.findByUserAndJob(currentUser, job).isPresent());
                }
                return response;
        }

        @Override
        public void saveJob(Long jobId) {
                User user = getCurrentUser();
                Job job = jobRepository.findById(jobId)
                                .orElseThrow(() -> new NotFoundException("Job not found"));

                if (savedJobRepository.findByUserAndJob(user, job).isPresent()) {
                        return;
                }

                SavedJob savedJob = new SavedJob();
                savedJob.setUser(user);
                savedJob.setJob(job);
                savedJobRepository.save(savedJob);
        }

        @Override
        public void unsaveJob(Long jobId) {
                User user = getCurrentUser();
                Job job = jobRepository.findById(jobId)
                                .orElseThrow(() -> new NotFoundException("Job not found"));

                savedJobRepository.findByUserAndJob(user, job)
                                .ifPresent(savedJobRepository::delete);
        }

        @Override
        @Transactional(readOnly = true)
        public List<JobResponse> getSavedJobs() {
                User user = getCurrentUser();
                List<SavedJob> saved = savedJobRepository.findByUser(user);
                return saved.stream()
                                .filter(sj -> sj.getJob() != null)
                                .map(sj -> {
                                        JobResponse res = toJobResponse(sj.getJob(), Collections.emptySet(), user);
                                        if (res != null) {
                                                res.setSaved(true);
                                                res.setApplied(jobApplicationRepository
                                                                .findByCandidateAndJob(user, sj.getJob()).isPresent());
                                        }
                                        return res;
                                })
                                .collect(Collectors.toList());
        }

        @Override
        public ApplicationResponse applyForJob(ApplicationRequest request) {
                User user = getCurrentUser();
                if (user.getRole() != Role.USER) {
                        throw new BadRequestException("Only users can apply for jobs");
                }

                Job job = jobRepository.findById(request.getJobId())
                                .orElseThrow(() -> new NotFoundException("Job not found"));

                // Guard: prevent applying to the same job twice
                if (jobApplicationRepository.findByCandidateAndJob(user, job).isPresent()) {
                        throw new BadRequestException("You have already applied for this job");
                }

                Set<Skill> candidateSkills = new HashSet<>();
                if (request.getSkills() != null) {
                        for (String skillName : request.getSkills()) {
                                if (skillName == null)
                                        continue;
                                Skill skill = skillRepository.findByNameIgnoreCase(skillName)
                                                .orElseGet(() -> skillRepository.save(new Skill(skillName)));
                                candidateSkills.add(skill);
                        }
                }

                if (request.getEducation() != null) {
            user.setEducation(request.getEducation());
        }
        if (request.getYearsOfExperience() != null) {
            user.setYearsOfExperience(request.getYearsOfExperience());
        }
        if (request.getResumeUrl() != null) {
            user.setResumeUrl(request.getResumeUrl());
        }
        if (candidateSkills != null && !candidateSkills.isEmpty()) {
            if (user.getSkills() == null)
                user.setSkills(new HashSet<>());
            user.getSkills().addAll(candidateSkills);
        }
                JobApplication application = new JobApplication();
                application.setCandidate(user);
                application.setJob(job);

                JobApplication saved = jobApplicationRepository.save(application);

                ApplicationResponse response = new ApplicationResponse();
                response.setApplicationId(saved.getId());
                response.setJobId(job.getId());
                response.setJobTitle(job.getTitle());
                String company = job.getCompanyName();
                if (company == null || company.isEmpty()) {
                        company = (job.getRecruiterProfile() != null) ? job.getRecruiterProfile().getCompanyName()
                                        : "N/A";
                }
                response.setCompanyName(company);
                response.setStatus(saved.getStatus());
                return response;
        }

        @Override
        @Transactional(readOnly = true)
        public List<ApplicationResponse> getMyApplications() {
                User user = getCurrentUser();
                List<JobApplication> apps = jobApplicationRepository.findByCandidate(user);
                return apps.stream()
                                .filter(Objects::nonNull)
                                .map(this::toApplicationResponse)
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional(readOnly = true)
        public List<JobResponse> getSmartRecommendations() {
                User user = getCurrentUser();
                JobFilterRequest filter = new JobFilterRequest();
                filter.setLocation(user.getLocation());
                if (user.getSkills() != null) {
                        filter.setSkills(user.getSkills().stream().map(Skill::getName).collect(Collectors.toList()));
                }

                List<JobResponse> jobs = searchJobs(filter);
                return jobs;
        }

        private JobResponse toJobResponse(Job job, Set<String> preferredSkills, User currentUser) {
                if (job == null)
                        return null;
                JobResponse response = new JobResponse();
                response.setId(job.getId());
                response.setTitle(job.getTitle());
                String company = job.getCompanyName();
                if (company == null || company.isEmpty()) {
                        company = (job.getRecruiterProfile() != null) ? job.getRecruiterProfile().getCompanyName()
                                        : "N/A";
                }
                response.setCompanyName(company);
                response.setLocation(job.getLocation());
                response.setJobType(job.getJobType());
                response.setMinExperience(job.getMinExperience());
                response.setMaxExperience(job.getMaxExperience());
                response.setMinSalary(job.getMinSalary());
                response.setMaxSalary(job.getMaxSalary());

                Set<Skill> jobSkills = (job.getRequiredSkills() != null) ? job.getRequiredSkills()
                                : Collections.emptySet();
                response.setSkills(jobSkills.stream()
                                .map(Skill::getName)
                                .filter(Objects::nonNull)
                                .collect(Collectors.toList()));

                if (currentUser != null && currentUser.getRole() == Role.USER) {
                    Set<Skill> candidateSkills = currentUser.getSkills();
                    if (jobSkills.isEmpty()) {
                        response.setMatchPercentage(100.0);
                        response.setMissingSkills(Collections.emptyList());
                    } else {
                        long matchCount = 0;
                        List<String> missing = new ArrayList<>();
                        Set<String> candSkillNames = candidateSkills != null ? candidateSkills.stream()
                                .map(s -> s.getName().toLowerCase()).collect(Collectors.toSet()) : Collections.emptySet();
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
                } else {
                    response.setMatchPercentage(0.0);
                    response.setMissingSkills(Collections.emptyList());
                }

                response.setApproved(job.isApproved());
                response.setStatus(job.isApproved() ? "APPROVED" : "PENDING");

                return response;
        }

        private ApplicationResponse toApplicationResponse(JobApplication app) {
                if (app == null)
                        return null;
                ApplicationResponse response = new ApplicationResponse();
                response.setApplicationId(app.getId());
                if (app.getJob() != null) {
                        response.setJobId(app.getJob().getId());
                        response.setJobTitle(app.getJob().getTitle());
                        String company = app.getJob().getCompanyName();
                        if (company == null || company.isEmpty()) {
                                company = (app.getJob().getRecruiterProfile() != null)
                                                ? app.getJob().getRecruiterProfile().getCompanyName()
                                                : "N/A";
                        }
                        response.setCompanyName(company);
                }
                response.setStatus(app.getStatus());
                response.setRecruiterNotes(app.getRecruiterNotes());
                return response;
        }

        private JobResponse toJobResponseWithUserSkills(Job job, Set<Skill> userSkills, User currentUser) {
                if (job == null)
                        return null;
                JobResponse response = new JobResponse();
                response.setId(job.getId());
                response.setTitle(job.getTitle());
                String company = job.getCompanyName();
                if (company == null || company.isEmpty()) {
                        company = (job.getRecruiterProfile() != null) ? job.getRecruiterProfile().getCompanyName()
                                        : "N/A";
                }
                response.setCompanyName(company);
                response.setLocation(job.getLocation());
                response.setJobType(job.getJobType());
                response.setMinExperience(job.getMinExperience());
                response.setMaxExperience(job.getMaxExperience());
                response.setMinSalary(job.getMinSalary());
                response.setMaxSalary(job.getMaxSalary());

                Set<Skill> jobSkills = (job.getRequiredSkills() != null) ? job.getRequiredSkills()
                                : Collections.emptySet();
                response.setSkills(jobSkills.stream()
                                .map(Skill::getName)
                                .filter(Objects::nonNull)
                                .collect(Collectors.toList()));

                if (currentUser != null && currentUser.getRole() == Role.USER) {
                    Set<Skill> candidateSkills = currentUser.getSkills();
                    if (jobSkills.isEmpty()) {
                        response.setMatchPercentage(100.0);
                        response.setMissingSkills(Collections.emptyList());
                    } else {
                        long matchCount = 0;
                        List<String> missing = new ArrayList<>();
                        Set<String> candSkillNames = candidateSkills != null ? candidateSkills.stream()
                                .map(s -> s.getName().toLowerCase()).collect(Collectors.toSet()) : Collections.emptySet();
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
                } else {
                    response.setMatchPercentage(0.0);
                    response.setMissingSkills(Collections.emptyList());
                }

                response.setApproved(job.isApproved());
                response.setStatus(job.isApproved() ? "APPROVED" : "PENDING");

                return response;
        }

        @Override
        @Transactional(readOnly = true)
        public UserDashboardStats getDashboardStats() {
                User user = getCurrentUser();

                // Get all applications for the user
                List<JobApplication> applications = jobApplicationRepository.findByCandidate(user);
                if (applications == null)
                        applications = Collections.emptyList();

                // Count applications by status
                long appliedCount = applications.stream()
                                .filter(app -> app != null && app.getStatus() == ApplicationStatus.APPLIED)
                                .count();
                long shortlistedCount = applications.stream()
                                .filter(app -> app != null && app.getStatus() == ApplicationStatus.SHORTLISTED)
                                .count();
                long rejectedCount = applications.stream()
                                .filter(app -> app != null && app.getStatus() == ApplicationStatus.REJECTED)
                                .count();
                long selectedCount = applications.stream()
                                .filter(app -> app != null && app.getStatus() == ApplicationStatus.SELECTED)
                                .count();

                // Match percentage calculation removed as feature is simplified
                double averageMatchPercentage = 0.0;

                // Count saved jobs
                long savedCount = savedJobRepository.countByUser(user);

                // Create status map
                Map<String, Long> applicationsByStatus = new HashMap<>();
                applicationsByStatus.put("APPLIED", appliedCount);
                applicationsByStatus.put("SHORTLISTED", shortlistedCount);
                applicationsByStatus.put("REJECTED", rejectedCount);
                applicationsByStatus.put("SELECTED", selectedCount);

                return new UserDashboardStats(
                                applications.size(), // totalApplications
                                appliedCount,
                                shortlistedCount,
                                rejectedCount,
                                selectedCount,
                                savedCount, // savedJobsCount
                                applicationsByStatus);
        }

        @Override
        @Transactional(readOnly = true)
        public UserResponse getProfile() {
                return mapToUserResponse(getCurrentUser());
        }

        @Override
        public UserResponse updateProfile(UpdateProfileRequest request) {
                User user = getCurrentUser();
                user.setFullName(request.getFullName());
                user.setLocation(request.getLocation());
                user.setYearsOfExperience(request.getYearsOfExperience());
                user.setEducation(request.getEducation());

                // Update skills
                if (request.getSkills() != null) {
                        Set<Skill> newSkills = new HashSet<>();
                        for (String skillName : request.getSkills()) {
                                if (skillName == null || skillName.trim().isEmpty())
                                        continue;
                                String trimmed = skillName.trim();
                                Skill skill = skillRepository.findByNameIgnoreCase(trimmed)
                                                .orElseGet(() -> skillRepository.save(new Skill(trimmed)));
                                newSkills.add(skill);
                        }
                        user.setSkills(newSkills);
                }

                User saved = userRepository.save(user);
                return mapToUserResponse(saved);
        }

        private UserResponse mapToUserResponse(User user) {
                if (user == null)
                        return null;
                UserResponse res = new UserResponse();
                res.setId(user.getId());
                res.setFullName(user.getFullName());
                res.setEmail(user.getEmail());
                res.setRole(user.getRole());
                res.setActive(user.isActive());
                res.setLocation(user.getLocation());
                res.setYearsOfExperience(user.getYearsOfExperience());
                res.setEducation(user.getEducation());
                if (user.getSkills() != null) {
                        res.setSkills(user.getSkills().stream()
                                        .map(Skill::getName)
                                        .collect(Collectors.toList()));
                }
                return res;
        }
}