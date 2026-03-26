package com.luzo_portal.service;

import com.luzo_portal.entity.ActivityLog;
import com.luzo_portal.repository.ActivityLogRepository;
import com.luzo_portal.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;

    public ActivityLogService(ActivityLogRepository activityLogRepository, UserRepository userRepository) {
        this.activityLogRepository = activityLogRepository;
        this.userRepository = userRepository;
    }

    public void log(Long userId, String action, String details) {
        ActivityLog log = new ActivityLog();
        if (userId != null) {
            userRepository.findById(userId).ifPresent(log::setUser);
        }
        log.setAction(action);
        log.setDetails(details);
        activityLogRepository.save(log);
    }
}
