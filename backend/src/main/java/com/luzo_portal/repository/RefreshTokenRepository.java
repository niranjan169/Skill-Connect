package com.luzo_portal.repository;

import com.luzo_portal.entity.RefreshToken;
import com.luzo_portal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUser(User user);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    int deleteByUser(User user);
}
