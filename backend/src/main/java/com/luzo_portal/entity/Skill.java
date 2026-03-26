package com.luzo_portal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "skills")
public class Skill extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    public Skill() {
    }

    public Skill(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}