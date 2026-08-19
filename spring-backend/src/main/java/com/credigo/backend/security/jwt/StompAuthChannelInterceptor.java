package com.credigo.backend.security.jwt;

import com.credigo.backend.entity.User;
import com.credigo.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.security.Principal;

/**
 * Authenticates the STOMP CONNECT frame using the same JWT the client uses
 * for regular REST calls, and assigns a Principal to the WebSocket session
 * whose getName() is the user's numeric ID - matching the identifier the
 * frontend already connects with and NotificationService already sends to.
 *
 * Without this, the WebSocket handshake carries no identity at all, so
 * SimpMessagingTemplate.convertAndSendToUser(userId, ...) has no session to
 * route to and silently drops every per-user notification.
 */
@Component
public class StompAuthChannelInterceptor implements ChannelInterceptor {

  private static final Logger log = LoggerFactory.getLogger(StompAuthChannelInterceptor.class);

  private final JwtTokenProvider tokenProvider;
  private final UserRepository userRepository;

  public StompAuthChannelInterceptor(JwtTokenProvider tokenProvider, UserRepository userRepository) {
    this.tokenProvider = tokenProvider;
    this.userRepository = userRepository;
  }

  @Override
  public Message<?> preSend(Message<?> message, MessageChannel channel) {
    StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

    if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
      String authHeader = accessor.getFirstNativeHeader("Authorization");
      String token = null;
      if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }

      if (StringUtils.hasText(token) && tokenProvider.validateToken(token)) {
        String username = tokenProvider.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username).orElse(null);

        if (user != null) {
          String userId = user.getId().toString();
          accessor.setUser((Principal) () -> userId);
          log.debug("WebSocket session authenticated for user id {}", userId);
        } else {
          log.warn("WebSocket CONNECT: no user found for username '{}'", username);
        }
      } else {
        log.warn("WebSocket CONNECT received without a valid JWT - notifications for this session will not be routable");
      }
    }

    return message;
  }
}
