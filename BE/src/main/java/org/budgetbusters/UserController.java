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

    @PostMapping("/createTextNotif")
    public String createTextNotif(@RequestBody TextNotifs textNotifs) throws InterruptedException, ExecutionException {
        return userService.createTextNotif(textNotifs);
    }

    @PostMapping("/createNotification")
    public String createNotification(@RequestBody Notifications notifications) throws InterruptedException, ExecutionException {
        return userService.createNotification(notifications);
    }
    @PostMapping("/createPurchase")
    public String createPurchase(@RequestBody InputDailySpending inputDailySpending) throws InterruptedException, ExecutionException {
        return userService.createPurchase(inputDailySpending);
    }
    @PostMapping("/createUser")
    public String createUser(@RequestBody User user) throws InterruptedException, ExecutionException {
        return userService.createUser(user);
    }

    @DeleteMapping("/deleteUser/{email}")
    public String deleteUser(@PathVariable String email) throws InterruptedException, ExecutionException {
        return userService.deleteUser(email);
    }

    @DeleteMapping("/deleteTextNotif/{phoneNumber}")
    public String deleteTextNotif(@PathVariable String phoneNumber) throws InterruptedException, ExecutionException {
        return userService.deleteTextNotif(phoneNumber);
    }

    @DeleteMapping("/deletePurchase/{email}/{index}/{totalDailySpending}")
    public String deletePurchase(@PathVariable String email, @PathVariable Integer index, @PathVariable Double totalDailySpending) throws InterruptedException, ExecutionException, BudgetBustersException {
        return userService.deletePurchase(email, index, totalDailySpending);
    }

    @GetMapping("/getBudget/{email}")
    public MonthlyBudget getBudget(@PathVariable String email) throws InterruptedException, ExecutionException {
        MonthlyBudget monthlyBudget = userService.getBudget(email);
        return monthlyBudget;
    }

    @GetMapping("/getTextNotifs/{phoneNumber}")
    public TextNotifs getTextNotifs(@PathVariable String phoneNumber) throws InterruptedException, ExecutionException {
        TextNotifs textNotifs = userService.getTextNotifs(phoneNumber);
        return textNotifs;
    }

    @GetMapping("/getNotifications/{email}")
    public Notifications getNotifications(@PathVariable String email) throws InterruptedException, ExecutionException {
        Notifications notifications = userService.getNotifications(email);
        return notifications;
    }

    @GetMapping("/getPurchase/{email}")
    public InputDailySpending getPurchase(@PathVariable String email) throws InterruptedException, ExecutionException {
        InputDailySpending inputDailySpending = userService.getPurchase(email);
        return inputDailySpending;
    }

    @GetMapping("/getUser/{email}")
    public User getUser(@PathVariable String email) throws InterruptedException, ExecutionException {
        return userService.getUser(email);
    }

    @PutMapping("/updateBudget")
    public String updateBudget(@RequestBody MonthlyBudget monthlyBudget) throws InterruptedException, ExecutionException, BudgetBustersException {
        return userService.updateMonthlyBudget(monthlyBudget);
    }

    @PutMapping("/updateTextNotifs")
    public String updateTextNotifs(@RequestBody TextNotifs textNotifs) throws InterruptedException, ExecutionException, BudgetBustersException {
        return userService.updateTextNotifs(textNotifs);
    }


    @PutMapping("/updateBudgetColors")
    public String updateBudgetColors(@RequestBody MonthlyBudget monthlyBudget) throws InterruptedException, ExecutionException, BudgetBustersException {
        return userService.updateMonthlyBudgetColors(monthlyBudget);
    }

    @PutMapping("/updateBudgetCategories")
    public String updateBudgetCategories(@RequestBody MonthlyBudget monthlyBudget) throws InterruptedException, ExecutionException, BudgetBustersException {
        return userService.updateMonthlyBudgetCategories(monthlyBudget);
    }
    @PutMapping("/resetBudget")
    public String resetBudget(@RequestBody MonthlyBudget monthlyBudget) throws InterruptedException, ExecutionException, BudgetBustersException {
        return userService.resetBudget(monthlyBudget);
    }

    @PutMapping("/updateNotifications")
    public String updateNotifications(@RequestBody Notifications notifications) throws InterruptedException, ExecutionException, BudgetBustersException {
        return userService.updateNotifications(notifications);
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
