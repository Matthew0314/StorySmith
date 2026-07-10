package com.StorySmith.Story_Smith.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;



public class JwtUtil {
    private static final String SECRET = "mysecretkeymysecretkeymysecretkey12345";
    private static final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // 1. Update the method signature to accept BOTH email and username
    public static String generateToken(String email, String username) {
        return Jwts.builder()
                .setSubject(email) // Keeps email as the main subject identification
                .claim("username", username) // 2. Add a custom claim containing the actual username!
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public static String extractEmail(String token) {
        return Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public static boolean validate(String token) {
        try {
            extractEmail(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
