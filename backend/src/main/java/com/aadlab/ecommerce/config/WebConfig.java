package com.aadlab.ecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final AdminAuthInterceptor adminAuthInterceptor;
    private final AuthenticatedAuthInterceptor authenticatedAuthInterceptor;

    public WebConfig(
            AdminAuthInterceptor adminAuthInterceptor,
            AuthenticatedAuthInterceptor authenticatedAuthInterceptor
    ) {
        this.adminAuthInterceptor = adminAuthInterceptor;
        this.authenticatedAuthInterceptor = authenticatedAuthInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authenticatedAuthInterceptor).addPathPatterns("/api/orders/**");
        registry.addInterceptor(adminAuthInterceptor).addPathPatterns("/api/admin/**");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("http://localhost:*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
