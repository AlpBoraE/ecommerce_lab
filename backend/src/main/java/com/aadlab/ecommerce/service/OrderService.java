package com.aadlab.ecommerce.service;

import com.aadlab.ecommerce.dto.OrderItemRequest;
import com.aadlab.ecommerce.dto.OrderRequest;
import com.aadlab.ecommerce.dto.OrderResponse;
import com.aadlab.ecommerce.entity.Customer;
import com.aadlab.ecommerce.entity.CustomerOrder;
import com.aadlab.ecommerce.entity.OrderItem;
import com.aadlab.ecommerce.entity.Product;
import com.aadlab.ecommerce.exception.ApiException;
import com.aadlab.ecommerce.repository.CustomerRepository;
import com.aadlab.ecommerce.repository.OrderRepository;
import com.aadlab.ecommerce.repository.ProductRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    public OrderService(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            CustomerRepository customerRepository
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        Customer customer = customerRepository.findByEmail(request.customerEmail())
                .orElseGet(() -> new Customer(request.customerName(), request.customerEmail(), request.address()));
        customer.setName(request.customerName());
        customer.setAddress(request.address());
        customer = customerRepository.save(customer);

        CustomerOrder order = new CustomerOrder();
        order.setCustomer(customer);
        order.setCreatedAt(LocalDateTime.now());

        BigDecimal total = BigDecimal.ZERO;
        for (OrderItemRequest itemRequest : request.items()) {
            Product product = productRepository.findById(itemRequest.productId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));

            if (product.getStock() < itemRequest.quantity()) {
                throw new ApiException(HttpStatus.BAD_REQUEST, product.getName() + " does not have enough stock");
            }

            product.setStock(product.getStock() - itemRequest.quantity());
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.quantity());
            orderItem.setUnitPrice(product.getPrice());
            order.addItem(orderItem);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity())));
        }

        order.setTotalPrice(total);
        CustomerOrder savedOrder = orderRepository.save(order);
        return new OrderResponse(savedOrder.getId(), savedOrder.getTotalPrice(), "Order created successfully");
    }
}
