package com.aadlab.ecommerce.security;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final Base64.Encoder URL_ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder URL_DECODER = Base64.getUrlDecoder();

    private final String secret;
    private final long expirationMinutes;

    public JwtUtil(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-minutes}") long expirationMinutes
    ) {
        this.secret = secret;
        this.expirationMinutes = expirationMinutes;
    }

    public String createToken(String username, String role) {
        Map<String, Object> header = Map.of("alg", "HS256", "typ", "JWT");
        Map<String, Object> payload = Map.of(
                "sub", username,
                "role", role,
                "exp", Instant.now().plusSeconds(expirationMinutes * 60).getEpochSecond()
        );

        String headerPart = encodeJson(header);
        String payloadPart = encodeJson(payload);
        String data = headerPart + "." + payloadPart;
        return data + "." + sign(data);
    }

    public boolean isValidAdminToken(String token) {
        return isValidTokenWithRole(token, "ADMIN");
    }

    public boolean isValidUserToken(String token) {
        return isValidTokenWithRole(token, "USER");
    }

    public boolean isValidToken(String token) {
        try {
            Map<String, Object> payload = readPayload(token);
            Number expiresAt = (Number) payload.get("exp");
            Object role = payload.get("role");
            return ("ADMIN".equals(role) || "USER".equals(role))
                    && expiresAt != null
                    && expiresAt.longValue() > Instant.now().getEpochSecond();
        } catch (RuntimeException exception) {
            return false;
        }
    }

    public String getUsername(String token) {
        Object username = readPayload(token).get("sub");
        if (username instanceof String usernameValue && !usernameValue.isBlank()) {
            return usernameValue;
        }

        throw new IllegalArgumentException("Invalid username");
    }

    private boolean isValidTokenWithRole(String token, String role) {
        try {
            Map<String, Object> payload = readPayload(token);
            Number expiresAt = (Number) payload.get("exp");
            return role.equals(payload.get("role"))
                    && expiresAt != null
                    && expiresAt.longValue() > Instant.now().getEpochSecond();
        } catch (RuntimeException exception) {
            return false;
        }
    }

    private Map<String, Object> readPayload(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Invalid token");
        }

        String data = parts[0] + "." + parts[1];
        String expectedSignature = sign(data);
        if (!MessageDigest.isEqual(expectedSignature.getBytes(StandardCharsets.UTF_8), parts[2].getBytes(StandardCharsets.UTF_8))) {
            throw new IllegalArgumentException("Invalid signature");
        }

        try {
            byte[] json = URL_DECODER.decode(parts[1]);
            return OBJECT_MAPPER.readValue(json, new TypeReference<>() {
            });
        } catch (Exception exception) {
            throw new IllegalArgumentException("Invalid payload", exception);
        }
    }

    private String encodeJson(Map<String, Object> value) {
        try {
            return URL_ENCODER.encodeToString(OBJECT_MAPPER.writeValueAsBytes(value));
        } catch (Exception exception) {
            throw new IllegalStateException("Token could not be created", exception);
        }
    }

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return URL_ENCODER.encodeToString(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("Token could not be signed", exception);
        }
    }
}
