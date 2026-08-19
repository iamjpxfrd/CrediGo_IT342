package com.credigo.backend.controller;

import com.credigo.backend.dto.UserResponse;
import com.credigo.backend.entity.User;
import com.credigo.backend.repository.ProductRepository;
import com.credigo.backend.service.TransactionService;
import com.credigo.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final ProductRepository productRepository;
    private final TransactionService transactionService;

    @Autowired
    public AdminController(UserService userService, ProductRepository productRepository, TransactionService transactionService) {
        this.userService = userService;
        this.productRepository = productRepository;
        this.transactionService = transactionService;
    }

    // List all users (admin only)
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = userService.findAllUsers();
        List<UserResponse> userResponses = users.stream()
                .map(userService::mapToUserResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userResponses);
    }

    // Create user (admin)
    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> createUser(@RequestBody User user) {
        User created = userService.createUser(user);
        return ResponseEntity.ok(userService.mapToUserResponse(created));
    }

    // Update user (admin)
    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody User user) {
        User updated = userService.updateUser(id, user);
        return ResponseEntity.ok(userService.mapToUserResponse(updated));
    }

    // Delete user (admin)
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    // Promote user to admin
    @PostMapping("/users/{id}/promote")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> promoteToAdmin(@PathVariable Long id) {
        try {
            userService.promoteToAdmin(id);
            return ResponseEntity.ok("User promoted to admin.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Demote admin to user
    @PostMapping("/users/{id}/demote")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> demoteToUser(@PathVariable Long id) {
        try {
            userService.demoteToUser(id);
            return ResponseEntity.ok("User demoted to regular user.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Admin dashboard stats endpoint
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminStats() {
        java.util.List<User> allUsers = userService.findAllUsers();
        long totalUsers = allUsers.size();
        // Active users (for demo: count users created in last 30 days)
        long activeUsers = allUsers.stream()
            .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusDays(30)))
            .count();
        long totalProducts = productRepository.count();
        java.util.List<com.credigo.backend.dto.TransactionResponse> allTransactions = transactionService.getAllTransactions();
        long totalTransactions = allTransactions.size();
        java.util.List<com.credigo.backend.dto.TransactionResponse> recentTransactions = allTransactions.stream()
            .limit(5)
            .collect(Collectors.toList());
        java.util.Map<String, Long> transactionsByStatus = allTransactions.stream()
            .collect(Collectors.groupingBy(t -> t.getStatus().name(), Collectors.counting()));
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("totalProducts", totalProducts);
        stats.put("totalTransactions", totalTransactions);
        stats.put("recentTransactions", recentTransactions);
        stats.put("transactionsByStatus", transactionsByStatus);
        return ResponseEntity.ok(stats);
    }
}
