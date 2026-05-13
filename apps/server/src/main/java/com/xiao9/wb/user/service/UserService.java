package com.xiao9.wb.user.service;

import com.xiao9.wb.common.exception.BusinessException;
import com.xiao9.wb.common.exception.ErrorCode;
import com.xiao9.wb.user.dto.UserDTO;
import com.xiao9.wb.user.entity.User;
import com.xiao9.wb.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return UserDTO.from(user);
    }

    @Transactional(readOnly = true)
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return UserDTO.from(user);
    }

    @Transactional
    public UserDTO updateProfile(Long id, String name, String avatar) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (name != null && !name.isBlank()) {
            user.setName(name);
        }
        if (avatar != null) {
            user.setAvatar(avatar);
        }

        userRepository.save(user);
        return UserDTO.from(user);
    }
}
