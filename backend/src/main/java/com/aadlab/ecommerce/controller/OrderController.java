package com.aadlab.ecommerce.controller;

import com.aadlab.ecommerce.dto.AdminOrderResponse;
import com.aadlab.ecommerce.dto.OrderRequest;
import com.aadlab.ecommerce.dto.OrderResponse;
import com.aadlab.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<AdminOrderResponse> listMine(@RequestAttribute String accountUsername) {
        return orderService.getUserOrders(accountUsername);
    }

    @PatchMapping("/{id}/cancel")
    public AdminOrderResponse cancelMine(
            @RequestAttribute String accountUsername,
            @PathVariable Long id
    ) {
        return orderService.cancelUserOrder(id, accountUsername);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(
            @RequestAttribute String accountUsername,
            @Valid @RequestBody OrderRequest request
    ) {
        return orderService.createOrder(request, accountUsername);
    }
}
