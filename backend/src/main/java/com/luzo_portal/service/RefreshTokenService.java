package com.luzo_portal.service;

import com.luzo_portal.entity.RefreshToken;
import com.luzo_portal.entity.User;
import com.luzo_portal.exception.BadRequestException;
import com.luzo_portal.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final long refreshExpirationMs;

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository,
            @Value("${security.jwt.refresh-expiration-ms}") long refreshExpirationMs) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    /**
     * Creates (or replaces) a refresh token for the given user.
     * Deletes any existing token first so each user has exactly one.
     */
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = refreshTokenRepository.findByUser(user)
                .orElse(new RefreshToken());

        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshExpirationMs));

        return refreshTokenRepository.save(refreshToken);
    }

    /**
     * Looks up a refresh token string. Validates expiry.
     * If expired, deletes it from DB and throws BadRequestException.
     */
    public RefreshToken verifyExpiration(String tokenValue) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new BadRequestException("Refresh token not found. Please log in again."));

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new BadRequestException("Refresh token expired. Please log in again.");
        }

        return refreshToken;
    }

    /**
     * Deletes all refresh tokens for a user (used on logout).
     */
    @Transactional
    public void deleteByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }
}
