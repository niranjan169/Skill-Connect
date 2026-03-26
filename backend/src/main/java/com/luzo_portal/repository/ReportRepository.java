package com.luzo_portal.repository;

import com.luzo_portal.entity.Report;
import com.luzo_portal.entity.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByStatus(ReportStatus status);
}
