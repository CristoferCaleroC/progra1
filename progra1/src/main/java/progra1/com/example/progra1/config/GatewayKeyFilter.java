package progra1.com.example.progra1.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class GatewayKeyFilter extends OncePerRequestFilter {

    @Value("${gateway.key:}")
    private String gatewayKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        // Sin clave configurada (ejecución local): no se valida
        if (gatewayKey == null || gatewayKey.isBlank()) {
            chain.doFilter(request, response);
            return;
        }
        if (!gatewayKey.equals(request.getHeader("x-gateway-key"))) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
            return;
        }
        chain.doFilter(request, response);
    }
}