package com.aadlab.ecommerce.controller;

import com.aadlab.ecommerce.dto.AdminOrderResponse;
import com.aadlab.ecommerce.service.OrderService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {
    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<AdminOrderResponse> list() {
        return orderService.getAdminOrders();
    }

    @PatchMapping("/{id}/cancel")
    public AdminOrderResponse cancel(@PathVariable Long id) {
        return orderService.cancelOrder(id);
    }
}
