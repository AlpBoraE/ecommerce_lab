package com.aadlab.ecommerce.service;

import com.aadlab.ecommerce.dto.AdminOrderItemResponse;
import com.aadlab.ecommerce.dto.AdminOrderResponse;
import com.aadlab.ecommerce.dto.OrderItemRequest;
import com.aadlab.ecommerce.dto.OrderRequest;
import com.aadlab.ecommerce.dto.OrderResponse;
import com.aadlab.ecommerce.entity.Customer;
import com.aadlab.ecommerce.entity.CustomerOrder;
import com.aadlab.ecommerce.entity.OrderItem;
import com.aadlab.ecommerce.entity.OrderStatus;
import com.aadlab.ecommerce.entity.Product;
import com.aadlab.ecommerce.exception.ApiException;
import com.aadlab.ecommerce.repository.CustomerRepository;
import com.aadlab.ecommerce.repository.OrderRepository;
import com.aadlab.ecommerce.repository.ProductRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Sort;
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
    public OrderResponse createOrder(OrderRequest request, String accountUsername) {
        Customer customer = customerRepository.findByEmail(request.customerEmail())
                .orElseGet(() -> new Customer(request.customerName(), request.customerEmail(), request.address()));
        customer.setName(request.customerName());
        customer.setAddress(request.address());
        customer = customerRepository.save(customer);

        CustomerOrder order = new CustomerOrder();
        order.setCustomer(customer);
        order.setCreatedAt(LocalDateTime.now());
        order.setAccountUsername(accountUsername);
        order.setStatus(OrderStatus.PLACED);

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

    @Transactional(readOnly = true)
    public List<AdminOrderResponse> getAdminOrders() {
        return orderRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::toAdminOrderResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdminOrderResponse> getUserOrders(String accountUsername) {
        return orderRepository.findByAccountUsernameOrderByCreatedAtDesc(accountUsername)
                .stream()
                .map(this::toAdminOrderResponse)
                .toList();
    }

    @Transactional
    public AdminOrderResponse cancelOrder(Long orderId) {
        CustomerOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));

        return cancelExistingOrder(order);
    }

    @Transactional
    public AdminOrderResponse cancelUserOrder(Long orderId, String accountUsername) {
        CustomerOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));

        if (!accountUsername.equals(order.getAccountUsername())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You can only cancel your own orders");
        }

        return cancelExistingOrder(order);
    }

    private AdminOrderResponse cancelExistingOrder(CustomerOrder order) {
        if (OrderStatus.CANCELED.equals(order.getStatus())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Order is already canceled");
        }

        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
        }

        order.setStatus(OrderStatus.CANCELED);
        return toAdminOrderResponse(order);
    }

    private AdminOrderResponse toAdminOrderResponse(CustomerOrder order) {
        List<AdminOrderItemResponse> items = order.getItems()
                .stream()
                .map(item -> new AdminOrderItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
                ))
                .toList();

        return new AdminOrderResponse(
                order.getId(),
                order.getCustomer().getName(),
                order.getCustomer().getEmail(),
                order.getCustomer().getAddress(),
                order.getCreatedAt(),
                order.getTotalPrice(),
                order.getStatus().name(),
                items
        );
    }
}
