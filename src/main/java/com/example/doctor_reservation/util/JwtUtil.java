
package com.example.doctor_reservation.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final String secretKey = "MySecretKeyForJwt12345678901234567890"; // Use a strong secret key
    private final long expiration = 3600000; // 1 hour in milliseconds

    private final Key key = Keys.hmacShaKeyFor(secretKey.getBytes());


    public String generateToken(String username, String fullName,Long id ) {
        return Jwts.builder()
                .setSubject(username)
                .claim("fullName", fullName)
                .claim("userId",id)// Add fullName as a custom claim
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractFullName(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.get("fullName", String.class); // Extract the fullName claim
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
