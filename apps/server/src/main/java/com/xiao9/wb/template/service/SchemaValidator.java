package com.xiao9.wb.template.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SchemaValidator {

    private final ObjectMapper objectMapper;

    private static final List<String> REQUIRED_TOP_LEVEL_KEYS = List.of("type", "components");

    /**
     * Validates a template schema structure.
     * Returns a list of validation errors. Empty list means valid.
     */
    public List<String> validate(Map<String, Object> schema) {
        List<String> errors = new ArrayList<>();

        if (schema == null || schema.isEmpty()) {
            errors.add("Schema cannot be empty");
            return errors;
        }

        for (String key : REQUIRED_TOP_LEVEL_KEYS) {
            if (!schema.containsKey(key)) {
                errors.add("Missing required top-level key: " + key);
            }
        }

        Object type = schema.get("type");
        if (type != null && !(type instanceof String)) {
            errors.add("'type' must be a string");
        }

        Object components = schema.get("components");
        if (components != null && !(components instanceof List)) {
            errors.add("'components' must be an array");
        }

        return errors;
    }

    public boolean isValid(Map<String, Object> schema) {
        return validate(schema).isEmpty();
    }
}
