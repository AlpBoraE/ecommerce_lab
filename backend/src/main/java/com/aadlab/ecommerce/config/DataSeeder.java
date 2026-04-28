package com.aadlab.ecommerce.config;

import com.aadlab.ecommerce.entity.Category;
import com.aadlab.ecommerce.entity.Product;
import com.aadlab.ecommerce.repository.CategoryRepository;
import com.aadlab.ecommerce.repository.ProductRepository;
import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public DataSeeder(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            return;
        }

        Category electronics = categoryRepository.save(new Category("Electronics"));
        Category accessories = categoryRepository.save(new Category("Accessories"));
        Category home = categoryRepository.save(new Category("Home"));

        saveProduct("Wireless Headphones", "Bluetooth headphones with long battery life.", new BigDecimal("1299.90"), 12, electronics, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80");
        saveProduct("Smart Watch", "Simple smart watch for notifications and activity tracking.", new BigDecimal("2199.90"), 8, electronics, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80");
        saveProduct("Laptop Stand", "Aluminum stand for a clean study desk.", new BigDecimal("499.90"), 20, accessories, "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=80");
        saveProduct("Desk Lamp", "Adjustable LED desk lamp for night study sessions.", new BigDecimal("349.90"), 15, home, "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80");
    }

    private void saveProduct(String name, String description, BigDecimal price, int stock, Category category, String imageUrl) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStock(stock);
        product.setCategory(category);
        product.setImageUrl(imageUrl);
        productRepository.save(product);
    }
}
