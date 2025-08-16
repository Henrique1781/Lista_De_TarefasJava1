package br.com.sualistapessoal.gerenciador_tarefas.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Mapeia a URL /icons/** para a pasta static/icons/ no classpath
        registry.addResourceHandler("/icons/**")
                .addResourceLocations("classpath:/static/icons/");

        // Mapeia a URL /sounds/** para a pasta static/sounds/ no classpath
        registry.addResourceHandler("/sounds/**")
                .addResourceLocations("classpath:/static/sounds/");
    }
}