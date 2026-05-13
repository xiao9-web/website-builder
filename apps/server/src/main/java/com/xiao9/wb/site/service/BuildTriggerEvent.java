package com.xiao9.wb.site.service;

import com.xiao9.wb.site.entity.Site;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class BuildTriggerEvent extends ApplicationEvent {

    private final Site site;
    private final String triggeredBy;

    public BuildTriggerEvent(Object source, Site site, String triggeredBy) {
        super(source);
        this.site = site;
        this.triggeredBy = triggeredBy;
    }
}
