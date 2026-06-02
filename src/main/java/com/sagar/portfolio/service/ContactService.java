package com.sagar.portfolio.service;

import com.sagar.portfolio.dto.ContactFormDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ContactService {

    /**
     * Processes the contact form submission.
     * In production, wire this to JavaMailSender / SendGrid / Mailgun.
     */
    public boolean processContact(ContactFormDto dto) {
        try {
            log.info("=== NEW CONTACT SUBMISSION ===");
            log.info("From    : {} <{}>", dto.getName(), dto.getEmail());
            log.info("Subject : {}", dto.getSubject());
            log.info("Message : {}", dto.getMessage());
            log.info("==============================");
            // TODO: integrate mail sender here
            return true;
        } catch (Exception e) {
            log.error("Failed to process contact form", e);
            return false;
        }
    }
}
