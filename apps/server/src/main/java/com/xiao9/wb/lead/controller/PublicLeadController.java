package com.xiao9.wb.lead.controller;

import com.xiao9.wb.common.response.ApiResponse;
import com.xiao9.wb.lead.dto.CreateLeadRequest;
import com.xiao9.wb.lead.dto.PublicLeadResponse;
import com.xiao9.wb.lead.service.LeadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/sites/{slug}/leads")
@RequiredArgsConstructor
public class PublicLeadController {

    private final LeadService leadService;

    @PostMapping
    public ApiResponse<PublicLeadResponse> submit(
            @PathVariable String slug,
            @Valid @RequestBody CreateLeadRequest request
    ) {
        PublicLeadResponse lead = leadService.submitPublicLead(slug, request);
        return ApiResponse.success(lead);
    }
}
