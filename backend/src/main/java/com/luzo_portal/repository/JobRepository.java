package com.luzo_portal.repository;

import com.luzo_portal.entity.Job;
import com.luzo_portal.entity.JobType;
import com.luzo_portal.entity.RecruiterProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

  /** All approved+visible jobs with optional filters – used by user search */
  @Query("""
      select distinct j from Job j
      where j.approved = true
        and j.deleted = false
        and (:titlePattern is null or lower(j.title) like :titlePattern)
        and (:locationPattern is null or lower(j.location) like :locationPattern)
        and (:jobType is null or j.jobType = :jobType)
        and (:minExp is null or j.minExperience >= :minExp)
        and (:maxExp is null or j.maxExperience <= :maxExp)
        and (:minSalary is null or j.minSalary >= :minSalary)
        and (:maxSalary is null or j.maxSalary <= :maxSalary)
      """)
  List<Job> searchJobs(@Param("titlePattern") String titlePattern,
      @Param("locationPattern") String locationPattern,
      @Param("jobType") JobType jobType,
      @Param("minExp") Integer minExp,
      @Param("maxExp") Integer maxExp,
      @Param("minSalary") BigDecimal minSalary,
      @Param("maxSalary") BigDecimal maxSalary);

  /** All non-deleted jobs – used by admin getAllJobs */
  List<Job> findByDeletedFalse();

  long countByDeletedFalse();

  List<Job> findByApprovedFalseAndDeletedFalse();

  List<Job> findByRecruiterProfileIdAndDeletedFalse(Long recruiterProfileId);

  long countByRecruiterProfile(RecruiterProfile recruiterProfile);
}