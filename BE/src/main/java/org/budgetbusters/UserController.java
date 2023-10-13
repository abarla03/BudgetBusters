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

    @PostMapping("/createUser")
    public String createUser(@RequestBody User user) throws InterruptedException, ExecutionException {
        return userService.createUser(user);
    }

    @PostMapping("/createGoal")
    public String createGoal(@RequestBody MonthlyGoal monthlyGoal) throws InterruptedException, ExecutionException {
//        System.out.println(monthlyGoal.getUserId() + " : " + monthlyGoal.getMonthlyBudget());
        return userService.createGoal(monthlyGoal);
    }

    @GetMapping("/getUser")
    public User getUser(@RequestParam String userId) throws InterruptedException, ExecutionException {
        return userService.getUser(userId);
    }

    @PutMapping("/updateUser")
    public String updateUser(@RequestBody User user) throws InterruptedException, ExecutionException {
        return userService.updateUser(user);
    }

    @DeleteMapping("/deleteUser")
    public String deleteUser(@RequestParam String userId) throws InterruptedException, ExecutionException {
        return userService.deleteUser(userId);
    }

    @GetMapping("/test")
    public ResponseEntity<String> testGetEndpoint() {
        return ResponseEntity.ok("Test Get Endpoint is Working");
    }

    // use this as a link as an url to connect with react
//    @GetMapping("/url")
//    public ResponseEntity<String> urlGetEndpoint() {
//        return ResponseEntity.ok("Got the JSON file");
//    }
}
