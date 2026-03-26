package com.luzo_portal.config;

import com.luzo_portal.entity.User;
import com.luzo_portal.repository.UserRepository;
import com.luzo_portal.security.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        String adminEmail = "karthi@gmail.com";
        
        // Disable Wiping as per mission requirements
        // jdbcTemplate.execute("TRUNCATE TABLE ... CASCADE");
        
        if (!userRepository.findByEmailIgnoreCase(adminEmail).isPresent()) {
            System.out.println("⭐ Creating Solaris Master Admin Node: " + adminEmail);
            User admin = new User();
            admin.setFullName("Admin Karthi");
            admin.setEmail(adminEmail);
            admin.setPasswordHash(passwordEncoder.encode("12345678"));
            admin.setRole(Role.ADMIN);
            admin.setActive(true);
            userRepository.save(admin);
        } else {
            System.out.println("✅ Solaris Master Admin Node already active.");
        }
    }
}
