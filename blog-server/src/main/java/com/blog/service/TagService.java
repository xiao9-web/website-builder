package com.blog.service;

import com.blog.dto.tag.CreateTagRequest;
import com.blog.dto.tag.TagResponse;
import com.blog.dto.tag.UpdateTagRequest;
import com.blog.entity.Tag;
import com.blog.exception.ResourceNotFoundException;
import com.blog.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    @Transactional
    public Tag create(CreateTagRequest request) {
        Tag tag = Tag.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .build();
        return tagRepository.save(tag);
    }

    @Transactional
    public Tag update(Long id, UpdateTagRequest request) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found"));

        if (request.getName() != null) {
            tag.setName(request.getName());
        }
        if (request.getSlug() != null) {
            tag.setSlug(request.getSlug());
        }

        return tagRepository.save(tag);
    }

    @Transactional
    public void delete(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found"));
        tagRepository.delete(tag);
    }

    @Transactional(readOnly = true)
    public List<TagResponse> list() {
        return tagRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private TagResponse toResponse(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .slug(tag.getSlug())
                .build();
    }
}
