// SavedJobRepository.java
package com.luzo_portal.repository;

import com.luzo_portal.entity.Job;
import com.luzo_portal.entity.SavedJob;
import com.luzo_portal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByUser(User user);

    long countByUser(User user);

    Optional<SavedJob> findByUserAndJob(User user, Job job);
}