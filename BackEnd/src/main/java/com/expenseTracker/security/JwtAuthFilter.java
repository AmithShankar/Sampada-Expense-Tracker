package com.expenseTracker.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import com.expenseTracker.service.JwtService;
import com.expenseTracker.service.UserLoginImpl;

import java.io.IOException;

@Component
public class JwtAuthFilter extends GenericFilter {

	private final JwtService jwtService;
	private final UserLoginImpl userDetailsService;

	public JwtAuthFilter(JwtService jwtService, UserLoginImpl userDetailsService) {
		this.jwtService = jwtService;
		this.userDetailsService = userDetailsService;
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws IOException, ServletException {

		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;

		String auth = request.getHeader("Authorization");

		try {
			if (auth != null && auth.startsWith("Bearer ")) {
				String token = auth.substring(7);
				String username = jwtService.extractUsername(token);

				var userDetails = userDetailsService.loadUserByUsername(username);

				var authToken = new UsernamePasswordAuthenticationToken(userDetails, null,
						userDetails.getAuthorities());

				authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

				SecurityContextHolder.getContext().setAuthentication(authToken);
			}

			chain.doFilter(req, res);
		} catch (io.jsonwebtoken.ExpiredJwtException e) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType("application/json");
			response.getWriter().write("{\"error\": \"Logged In Session has ended\", \"status\": 401}");
		}
	}
}
