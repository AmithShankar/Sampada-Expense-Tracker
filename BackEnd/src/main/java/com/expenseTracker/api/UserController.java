package com.expenseTracker.api;


import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.expenseTracker.dto.ForgotPasswordRequest;
import com.expenseTracker.dto.LoginRequest;
import com.expenseTracker.dto.RegisterRequest;
import com.expenseTracker.entity.User;
import com.expenseTracker.repository.UserRepository;
import com.expenseTracker.resources.ResponseModel;
import com.expenseTracker.service.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class UserController {

    private final AuthenticationManager authManager;
    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public UserController(AuthenticationManager authManager,
                          UserRepository repo,
                          PasswordEncoder encoder,
                          JwtService jwtService) {
        this.authManager = authManager;
        this.repo = repo;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    @PostMapping("/register")
    public ResponseModel register(@RequestBody RegisterRequest req) {
    	ResponseModel response = new ResponseModel();
    	LOGGER.info(req.toString());
    	try {
    		Optional<User> existingUser = repo.findByUserid(req.getUserid());
    		if (existingUser.isPresent()) {
    		    response.setErrors("User ID already taken");
    		    return response;
    		}

    		
    		LOGGER.info("Registering user");
    		User u = new User();
    		u.setUsername(req.getUsername());
    		u.setPassword(encoder.encode(req.getPassword()));
    		u.setRole(req.getRole());
    		u.setUserid(req.getUserid());
    		u.setEmail(req.getEmail());
    		u.setDefaultCurrency(req.getDefaultCurrency());

    		repo.save(u);
    		response.setData("User registered successfully");
    		response.setErrors(null);
    		LOGGER.info("Registration successful for user " + req.getUsername());
    	} catch (Exception e) {
    		response.setData(null);
    		response.setErrors("Registration failed: " + e.getMessage());
    		LOGGER.error("Registration failed: " + e);

    	}
        return response;
    }
    
    @PostMapping("/login")
    public ResponseModel login(@RequestBody LoginRequest req) {
    	ResponseModel response = new ResponseModel();

    	try {
    		authManager.authenticate(new UsernamePasswordAuthenticationToken(req.userid, req.password));

    		String token = jwtService.generateToken(req.userid);
    		var user = repo.findByUserid(req.userid).orElseThrow();
    		Map<String, Object> data = new HashMap<>();
            data.put("message", "Login successful");
            data.put("authorization", token);
            data.put("userName", user.getUsername());
            data.put("email", user.getEmail());
            data.put("role", user.getRole());
            data.put("userId", user.getUserid());
            data.put("defaultCurrency", user.getDefaultCurrency());
            response.setData(data);
            LOGGER.info("Login Successful for user " + user.getUsername());
    	} catch (BadCredentialsException e) {
    		response.setErrors("Invalid username or password");
    		LOGGER.error("Invalid username or password");
    	} catch (Exception e) {
    		response.setErrors("Login failed: " + e.getMessage());
    		LOGGER.error("Registration failed: " + e);
    	}

    	return response;
    }
    
    @PostMapping("/forgotPassword")
    public ResponseModel forgotPassword(@RequestBody ForgotPasswordRequest req) {
        ResponseModel response = new ResponseModel();

        try {
            if (!req.getNewPassword().equals(req.getConfirmPassword())) {
                response.setErrors("Passwords do not match");
                return response;
            }

            Optional<User> optionalUser = repo.findByUserid(req.getUserid());
            if (optionalUser.isEmpty()) {
                response.setErrors("User not found");
                return response;
            }

            User user = optionalUser.get();
            if (encoder.matches(req.getNewPassword(), user.getPassword())) {
                response.setErrors("New password cannot be the same as the old password");
                return response;
            }
            
            user.setPassword(encoder.encode(req.getNewPassword()));
            repo.save(user);

            response.setData("Password reset successful");
            response.setErrors(null);

            LOGGER.info("Password reset successful for user {}", req.getUserid());

        } catch (Exception e) {
            response.setData(null);
            response.setErrors("Password reset failed: " + e.getMessage());
            LOGGER.error("Password reset failed", e);
        }

        return response;
    }
    
    @PostMapping("/updateUser")
    public ResponseModel updateUser(@RequestBody RegisterRequest req) {
    	ResponseModel response = new ResponseModel();
    	LOGGER.info(req.toString());
    	try {
    		LOGGER.info("Updating user");
    		Optional<User> optionalUser = repo.findByUserid(req.getUserid());
            if (optionalUser.isEmpty()) {
                response.setErrors("User not found");
                return response;
            }

            User u = optionalUser.get();
    		if (req.getUsername() != null && !req.getUsername().isEmpty()) {
    		    u.setUsername(req.getUsername());
    		}

    		if (req.getPassword() != null && !req.getPassword().isEmpty()) {
    		    u.setPassword(encoder.encode(req.getPassword()));
    		}

    		if (req.getEmail() != null && !req.getEmail().isEmpty()) {
    		    u.setEmail(req.getEmail());
    		}

    		repo.save(u);
    		response.setData("User updated successfully");
    		response.setErrors(null);
    		LOGGER.info("Updating successful for user " + req.getUsername());
    	} catch (Exception e) {
    		response.setData(null);
    		response.setErrors("Updating failed: " + e.getMessage());
    		LOGGER.error("Updatting failed: " + e);

    	}
        return response;
    }
    
    @GetMapping("/me")
    public Map<String, String> me() {
        return Map.of("message", "secured endpoint works");
    }
}
