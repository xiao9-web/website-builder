package com.xiao9.wb.lead.dto;

import com.xiao9.wb.lead.entity.Lead;

import java.time.LocalDateTime;

public record LeadDTO(
        Long id,
        Long siteId,
        String name,
        String phone,
        String companyName,
        String cooperationType,
        String message,
        String sourcePage,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static LeadDTO from(Lead lead) {
        return new LeadDTO(
                lead.getId(),
                lead.getSite().getId(),
                lead.getName(),
                lead.getPhone(),
                lead.getCompanyName(),
                lead.getCooperationType(),
                lead.getMessage(),
                lead.getSourcePage(),
                lead.getStatus().name(),
                lead.getCreatedAt(),
                lead.getUpdatedAt()
        );
    }
}
