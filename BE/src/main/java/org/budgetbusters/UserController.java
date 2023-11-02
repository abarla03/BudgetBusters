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
    @PostMapping("/createPurchase")
    public String createPurchase(@RequestBody InputDailySpending inputDailySpending) throws InterruptedException, ExecutionException {
        return userService.createPurchase(inputDailySpending);
    }
    @PostMapping("/createUser")
    public String createUser(@RequestBody User user) throws InterruptedException, ExecutionException {
        return userService.createUser(user);
    }

    @DeleteMapping("/deleteUser")
    public String deleteUser(@RequestParam String userId) throws InterruptedException, ExecutionException {
        return userService.deleteUser(userId);
    }

    @GetMapping("/getBudget/{email}")
    public MonthlyBudget getBudget(@PathVariable String email) throws InterruptedException, ExecutionException {
        MonthlyBudget monthlyBudget = userService.getBudget(email);
        return monthlyBudget;
    }

    @DeleteMapping("/deletePurchase/{email}/{index}")
    public String deletePurchase(@PathVariable String email, @PathVariable Integer index) throws InterruptedException, ExecutionException, BudgetBustersException {
        return userService.deletePurchase(email, index);
    }

    @GetMapping("/getPurchase/{email}")
    public InputDailySpending getPurchase(@PathVariable String email) throws InterruptedException, ExecutionException {
        InputDailySpending inputDailySpending = userService.getPurchase(email);
        return inputDailySpending;
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

    @PutMapping("/updatePurchase")
    public String updatePurchase(@RequestBody InputDailySpending inputDailySpending) throws InterruptedException, ExecutionException, BudgetBustersException {
        return userService.updatePurchase(inputDailySpending);
    }

    @PutMapping("/updateUser")
    public String updateUser(@RequestBody User user) throws InterruptedException, ExecutionException {
        return userService.updateUser(user);
    }
}
