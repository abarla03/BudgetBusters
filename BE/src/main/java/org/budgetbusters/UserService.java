package org.budgetbusters;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
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

    public String createTextNotif(TextNotifs textNotifs) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("textNotifs").document(textNotifs.getPhoneNumber()).set(textNotifs);
        return "Text Notif created for " + textNotifs.getPhoneNumber() + " at " + collectionsApiFuture.get().getUpdateTime();
    }

    public String createEmailNotif(EmailNotifs emailNotifs) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("emailNotifs").document(emailNotifs.getEmail()).set(emailNotifs);
        return "Email Notif created for " + emailNotifs.getEmail() + " at " + collectionsApiFuture.get().getUpdateTime();
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

    public String deleteTextNotif(String phoneNumber) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> writeResult = dbFirestore.collection("textNotifs").document(phoneNumber).delete();
        return "Text Notifications for " + phoneNumber + " is deleted.";
    }

    public String deleteEmailNotif(String email) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> writeResult = dbFirestore.collection("emailNotifs").document(email).delete();
        return "Email Notifications for " + email + " is deleted.";
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

    public TextNotifs getTextNotifs(String phoneNumber) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("textNotifs").document(phoneNumber);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        TextNotifs textNotifs;
        if (document.exists()) {
            textNotifs = document.toObject(TextNotifs.class);
            return textNotifs;
        }
        return null;
    }

    public EmailNotifs getEmailNotifs(String email) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("textNotifs").document(email);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        EmailNotifs emailNotifs;
        if (document.exists()) {
            emailNotifs = document.toObject(EmailNotifs.class);
            return emailNotifs;
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
        if (budget.getMonthlyBudget() != null) {
            budget.setMonthlyBudget(null);
            budget.setColors(null);
            budget.setSubmissionDate(null);
            budget.setAllCategories(null);
            InputDailySpending inputDailySpending = getPurchase(monthlyBudget.getEmail());
            inputDailySpending.setCategoryCount(null);
            inputDailySpending.setTotalDailySpending(null);
            inputDailySpending.setCumulativeDailySpending(null);
            updateMonthlyBudget(budget);
            return "Monthly budget for " + budget.getEmail() + " has been reset.";
        } else {
            return "Nothing has been reset for " + budget.getEmail();
        }
    }

    public String resetPurchases(InputDailySpending inputDailySpending) throws ExecutionException, InterruptedException, BudgetBustersException {
        InputDailySpending inputDailySpending1 = getPurchase(inputDailySpending.getEmail());
        if (inputDailySpending1.getPurchases() != null) {
            inputDailySpending1.setPurchases(null);
            inputDailySpending1.setNumPurchases(null);

            // update the totalDailySpending list and cumulativeDailySpending list HERE
            inputDailySpending1.getTotalDailySpending().add(inputDailySpending1.getCurrentDayTotal());
            double currentCumTotal = 0;
            if (!inputDailySpending1.getCumulativeDailySpending().isEmpty()) {
                currentCumTotal = inputDailySpending1.getCumulativeDailySpending().get(inputDailySpending1.getCumulativeDailySpending().size() - 1);
                inputDailySpending1.getCumulativeDailySpending().add(inputDailySpending1.getCurrentDayTotal() + currentCumTotal);
            } else {
                inputDailySpending1.setCumulativeDailySpending(List.of(inputDailySpending1.getCurrentDayTotal()));
            }

            // add to values from dayCategoryCount to categoryCount at the END OF DAY
            if (inputDailySpending1.getCategoryCount().isEmpty()) {
                int length = inputDailySpending1.getDayCategoryCount().size();
                inputDailySpending1.setCategoryCount(new ArrayList<>(Collections.nCopies(length, 0.0)));
            }
            List<Double> result = addArrays(inputDailySpending1.getDayCategoryCount(), inputDailySpending1.getCategoryCount());
            inputDailySpending1.setCategoryCount(result);

            inputDailySpending1.setDayCategoryCount(null);
            inputDailySpending1.setCurrentDayTotal(null);
            updatePurchase(inputDailySpending1);

            return "Input Daily Purchase for " + inputDailySpending1.getEmail() + " has been reset.";
        } else {
            return "Nothing has been reset for " + inputDailySpending1.getEmail();
        }
    }

    public static List<Double> addArrays(List<Double> list1, List<Double> list2) {
        if (list1.size() != list2.size()) {
            throw new IllegalArgumentException("Lists must be of the same length");
        }

        List<Double> result = new ArrayList<>();
        for (int i = 0; i < list1.size(); i++) {
            result.add(list1.get(i) + list2.get(i));
        }

        return result;
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

    public String updateTextNotifs(TextNotifs textNotifs) throws ExecutionException, InterruptedException, BudgetBustersException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        // check if already exists
        DocumentReference documentReference = dbFirestore.collection("textNotifs").document(textNotifs.getPhoneNumber());
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        if (document == null) {
            throw new BudgetBustersException("No textNotifs exists for user: " + textNotifs.getPhoneNumber());
        }

        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("textNotifs").document(textNotifs.getPhoneNumber()).set(textNotifs);
        return "TextNotifs updated for " + textNotifs.getPhoneNumber() + " at " + collectionsApiFuture.get().getUpdateTime();
    }

    public String updateUser(User user) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("BudgetBusterUser").document(user.getEmail()).set(user);
        return "User Profile Information modified for " + user.getEmail() + " at " + collectionsApiFuture.get().getUpdateTime();
    }


    public String updateEmailNotifs(EmailNotifs emailNotifs) throws ExecutionException, InterruptedException, BudgetBustersException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        // check if already exists
        DocumentReference documentReference = dbFirestore.collection("emailNotifs").document(emailNotifs.getEmail());
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        if (document == null) {
            throw new BudgetBustersException("No emailNotifs exists for user: " + emailNotifs.getEmail());
        }

        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("emailNotifs").document(emailNotifs.getEmail()).set(emailNotifs);
        return "EmailNotifs updated for " + emailNotifs.getEmail() + " at " + collectionsApiFuture.get().getUpdateTime();
    }
}
