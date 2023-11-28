package org.budgetbusters;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class UserService {

    public String createMonthlyBudget(MonthlyBudget monthlyBudget) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("monthlyBudget").document(monthlyBudget.getEmail()).set(monthlyBudget);
        return "Monthly Budget created for " + monthlyBudget.getEmail() + " at " + collectionsApiFuture.get().getUpdateTime();
    }

    public String createNotification(Notifications notifications) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("Notifications").document(notifications.getEmail()).set(notifications);
        return "Preferred method selected is " + notifications.getPreferredMethod() + " for " + notifications.getEmail() + " at " + collectionsApiFuture.get().getUpdateTime();

    }

    public String createPurchase(InputDailySpending inputDailySpending) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("DailyPurchases").document(inputDailySpending.getEmail()).set(inputDailySpending);
        return "Purchase created for " + inputDailySpending.getEmail() + " at " + collectionsApiFuture.get().getUpdateTime();

    }

    public String createUser(User user) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("BudgetBusterUser").document(user.getEmail()).set(user);
        return "Account for " + user.getEmail() + "has been created at " + collectionsApiFuture.get().getUpdateTime();
    }

    public String deleteUser(String email) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> writeResult = dbFirestore.collection("BudgetBusterUser").document(email).delete();
        return "Successfully deleted account of " + email;
    }

    public String deletePurchase(String email, int index, double currentDayTotal) throws ExecutionException, InterruptedException, BudgetBustersException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        InputDailySpending inputDailySpending = getPurchase(email);
        if (index < 0 || index >= inputDailySpending.getNumPurchases()) {
            throw new BudgetBustersException("Invalid Index " + index);
        }
        inputDailySpending.getPurchases().remove(index);
        inputDailySpending.setNumPurchases(inputDailySpending.getNumPurchases() - 1);
        inputDailySpending.setCurrentDayTotal(currentDayTotal);
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("DailyPurchases").document(inputDailySpending.getEmail()).set(inputDailySpending);
        return "Purchase at " + index + " deleted. "+ collectionsApiFuture.get().getUpdateTime();
    }

    public MonthlyBudget getBudget(String email) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("monthlyBudget").document(email);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        MonthlyBudget monthlyBudget;
        if (document.exists()) {
            monthlyBudget = document.toObject(MonthlyBudget.class);
            return monthlyBudget;
        }
        return null;
    }

    public Notifications getNotifications(String email) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("Notifications").document(email);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        Notifications notifications;
        if (document.exists()) {
            notifications = document.toObject(Notifications.class);
            return notifications;
        }
        return null;
    }

    public InputDailySpending getPurchase(String email) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("DailyPurchases").document(email);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        InputDailySpending inputDailySpending;
        if (document.exists()) {
            inputDailySpending = document.toObject(InputDailySpending.class);
            return inputDailySpending;
        }
        return null;
    }

    public User getUser(String email) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("BudgetBusterUser").document(email);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        User user;
        if (document.exists()) {
            user = document.toObject(User.class);
            return user;
        }
        return null;
    }

    public String updateMonthlyBudget(MonthlyBudget monthlyBudget) throws ExecutionException, InterruptedException, BudgetBustersException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        // check if already exists
        DocumentReference documentReference = dbFirestore.collection("monthlyBudget").document(monthlyBudget.getEmail());
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        if (document == null) {
            throw new BudgetBustersException("No monthlyBudget exists for user: " + monthlyBudget.getEmail());
        }

        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("monthlyBudget").document(monthlyBudget.getEmail()).set(monthlyBudget);
        return "Monthly Budget updated: " + collectionsApiFuture.get().getUpdateTime();
    }

    public String updateMonthlyBudgetColors(MonthlyBudget monthlyBudget) throws ExecutionException, InterruptedException, BudgetBustersException {
        MonthlyBudget budget = getBudget(monthlyBudget.getEmail());
        budget.setColors(monthlyBudget.getColors());
        budget.setSubmissionDate(monthlyBudget.getSubmissionDate());
        updateMonthlyBudget(budget);
        return "Colors updated for " + budget.getEmail();
    }

    public String updateMonthlyBudgetCategories(MonthlyBudget monthlyBudget) throws ExecutionException, InterruptedException, BudgetBustersException {
        MonthlyBudget budget = getBudget(monthlyBudget.getEmail());
        budget.setAllCategories(monthlyBudget.getAllCategories());
        updateMonthlyBudget(budget);
        return "Categories updated for " + budget.getEmail();
    }

    public String resetBudget(MonthlyBudget monthlyBudget) throws ExecutionException, InterruptedException, BudgetBustersException {
        MonthlyBudget budget = getBudget(monthlyBudget.getEmail());
        budget.setMonthlyBudget(null);
        budget.setColors(null);
        budget.setSubmissionDate(null);
        budget.setAllCategories(null);
        updateMonthlyBudget(budget);
        return "Monthly budget for " + budget.getEmail() + " has been reset.";
    }

    public String resetPurchases(InputDailySpending inputDailySpending) throws ExecutionException, InterruptedException, BudgetBustersException {
        InputDailySpending inputDailySpending1 = getPurchase(inputDailySpending.getEmail());
        inputDailySpending1.setPurchases(null);
        inputDailySpending1.setNumPurchases(null);

        // update the totalDailySpending list and cumulativeDailySpending list HERE


//        List<Double> totalTempDailySpending = inputDailySpending1.getTotalDailySpending();
//        if (inputDailySpending1.getTotalDailySpending().isEmpty()) {
////            List<Double> totalTempDailySpending = new ArrayList<Double>();
////            inputDailySpending1.setTotalDailySpending(totalTempDailySpending);
////            totalTempDailySpending.add(inputDailySpending.getCurrentDayTotal());
////            inputDailySpending1.setTotalDailySpending(totalTempDailySpending);
//            inputDailySpending1.getTotalDailySpending().add(inputDailySpending.getCurrentDayTotal());
//            inputDailySpending1.setTotalDailySpending(totalTempDailySpending);
//
////            inputDailySpending1.getTotalDailySpending().add(inputDailySpending.getCurrentDayTotal());
//
//        }
//        inputDailySpending1.getTotalDailySpending().add(inputDailySpending.getCurrentDayTotal());
//        inputDailySpending1.getTotalDailySpending().add(inputDailySpending.getCurrentDayTotal());

//        // get last index
//        int lastIndex = inputDailySpending1.getCumulativeDailySpending().size() - 1;
//        if (inputDailySpending.getCumulativeDailySpending() != null) {
//            (inputDailySpending1.getCumulativeDailySpending()).get(lastIndex);
//        }
//        inputDailySpending1.getCumulativeDailySpending().add(inputDailySpending.getCurrentDayTotal() + );

        inputDailySpending1.setCurrentDayTotal(null);
        updatePurchase(inputDailySpending1);
        return "Input Daily Purchase for " + inputDailySpending1.getEmail() + " has been reset.";
    }

    public String updateNotifications(Notifications notifications) throws ExecutionException, InterruptedException, BudgetBustersException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        // check if already exists
        DocumentReference documentReference = dbFirestore.collection("Notifications").document(notifications.getEmail());
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        if (document == null) {
            throw new BudgetBustersException("No preferred method selected for user: " + notifications.getEmail());
        }

        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("Notifications").document(notifications.getEmail()).set(notifications);
        return "Preferred method updated for " + notifications.getEmail() + " at " + collectionsApiFuture.get().getUpdateTime();
    }

    public String updatePurchase(InputDailySpending inputDailySpending) throws ExecutionException, InterruptedException, BudgetBustersException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        // check if already exists
        DocumentReference documentReference = dbFirestore.collection("DailyPurchases").document(inputDailySpending.getEmail());
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        if (document == null) {
            throw new BudgetBustersException("No purchase exists for user: " + inputDailySpending.getEmail());
        }

        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("DailyPurchases").document(inputDailySpending.getEmail()).set(inputDailySpending);
        return "Purchase updated: " + collectionsApiFuture.get().getUpdateTime();

    }

    public String updateUser(User user) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("BudgetBusterUser").document(user.getEmail()).set(user);
        return "User Profile Information modified for " + user.getEmail() + " at " + collectionsApiFuture.get().getUpdateTime();
    }

}
