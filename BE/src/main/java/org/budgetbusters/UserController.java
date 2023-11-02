package org.budgetbusters;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
public class UserController {
    public UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/createBudget")
    public String createBudget(@RequestBody MonthlyBudget monthlyBudget) throws InterruptedException, ExecutionException {
        return userService.createMonthlyBudget(monthlyBudget);
    }

    @PostMapping("/createUser")
    public String createUser(@RequestBody User user) throws InterruptedException, ExecutionException {
        return userService.createUser(user);
    }

    @DeleteMapping("/deleteUser")
    public String deleteUser(@RequestParam String userId) throws InterruptedException, ExecutionException {
        return userService.deleteUser(userId);
    }

    @GetMapping("/getBudget")
    public MonthlyBudget getBudget(@RequestParam String email) throws InterruptedException, ExecutionException {
        MonthlyBudget monthlyBudget = userService.getBudget(email);
        return monthlyBudget;
    }


    @GetMapping("/getUser")
    public User getUser(@RequestParam String userId) throws InterruptedException, ExecutionException {
        return userService.getUser(userId);
    }

    @PutMapping("/updateBudget")
    public String updateBudget(@RequestBody MonthlyBudget monthlyBudget) throws InterruptedException, ExecutionException, BudgetBustersException {
        return userService.updateMonthlyBudget(monthlyBudget);
    }

    @PutMapping("/updateBudgetColors")
    public String updateBudgetColors(@RequestBody MonthlyBudget monthlyBudget) throws InterruptedException, ExecutionException, BudgetBustersException {
        return userService.updateMonthlyBudgetColors(monthlyBudget);
    }

    @PutMapping("/updateBudgetCategories")
    public String updateBudgetCategories(@RequestBody MonthlyBudget monthlyBudget) throws InterruptedException, ExecutionException, BudgetBustersException {
        return userService.updateMonthlyBudgetCategories(monthlyBudget);
    }

    @PutMapping("/updateUser")
    public String updateUser(@RequestBody User user) throws InterruptedException, ExecutionException {
        return userService.updateUser(user);
    }
}
