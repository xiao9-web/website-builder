package com.xiao9.wb.config;

import org.junit.jupiter.api.Test;
import org.springframework.context.support.StaticApplicationContext;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

import static org.assertj.core.api.Assertions.assertThat;

class WebMvcConfigTest {

    @Test
    void registersUploadedMediaAsPublicResources() {
        WebMvcConfig config = new WebMvcConfig();
        ReflectionTestUtils.setField(config, "uploadDir", "./uploads-test");
        ResourceHandlerRegistry registry = new ResourceHandlerRegistry(
                new StaticApplicationContext(),
                null
        );

        config.addResourceHandlers(registry);

        assertThat(registry.hasMappingForPattern("/uploads/**")).isTrue();
    }
}
