package com.credigo.backend.repository;

import com.credigo.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
  boolean existsByUsername(String username);
  boolean existsByEmail(String email);

  Optional<User> findByUsername(String username);
  Optional<User> findByEmail(String email);

  Optional<User> findByProviderAndProviderId(String provider, String providerId);

  /**
   * Fetches all users with their roles and wallet eagerly joined in a single
   * query, avoiding the N+1 select-per-user pattern that plain findAll()
   * triggers when roles/wallet are subsequently accessed (e.g. for admin
   * listings that map every user to a response DTO).
   */
  @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.roles LEFT JOIN FETCH u.wallet")
  List<User> findAllWithRolesAndWallet();
}
