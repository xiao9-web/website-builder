package com.xiao9.wb.lead.controller;

import com.xiao9.wb.common.response.ApiResponse;
import com.xiao9.wb.lead.dto.LeadDTO;
import com.xiao9.wb.lead.dto.UpdateLeadStatusRequest;
import com.xiao9.wb.lead.service.LeadService;
import com.xiao9.wb.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sites/{siteId}/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @GetMapping
    public ApiResponse<List<LeadDTO>> list(
            @PathVariable Long siteId,
            @RequestParam(required = false) String status,
            @AuthenticationPrincipal User user
    ) {
        List<LeadDTO> leads = leadService.list(siteId, status, user);
        return ApiResponse.success(leads);
    }

    @GetMapping("/{leadId}")
    public ApiResponse<LeadDTO> get(
            @PathVariable Long siteId,
            @PathVariable Long leadId,
            @AuthenticationPrincipal User user
    ) {
        LeadDTO lead = leadService.get(siteId, leadId, user);
        return ApiResponse.success(lead);
    }

    @PatchMapping("/{leadId}/status")
    public ApiResponse<LeadDTO> updateStatus(
            @PathVariable Long siteId,
            @PathVariable Long leadId,
            @Valid @RequestBody UpdateLeadStatusRequest request,
            @AuthenticationPrincipal User user
    ) {
        LeadDTO lead = leadService.updateStatus(siteId, leadId, request.status(), user);
        return ApiResponse.success(lead);
    }
}
