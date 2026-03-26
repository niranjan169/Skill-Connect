// RecruiterProfileRepository.java
package com.luzo_portal.repository;

import com.luzo_portal.entity.RecruiterProfile;
import com.luzo_portal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecruiterProfileRepository extends JpaRepository<RecruiterProfile, Long> {
    Optional<RecruiterProfile> findByUser(User user);
}