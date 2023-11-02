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
//        return "Monthly Budget created: " + collectionsApiFuture.get().getUpdateTime();
        return "Monthly Budget created for " + monthlyBudget.getEmail() + " at " + collectionsApiFuture.get().getUpdateTime();
    }

    public String createUser(User user) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("crud_user").document(user.getEmail()).set(user);
        return "You have successfully created an account." + collectionsApiFuture.get().getUpdateTime();
    }

    public String deleteUser(String userId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> writeResult = dbFirestore.collection("crud_user").document(userId).delete();
        return "Successfully deleted " + userId;
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

    public User getUser(String userId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("crud_user").document(userId);
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

    public String updateUser(User user) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("crud_user").document(user.getEmail()).set(user);
        return "User Profile Information modified" + collectionsApiFuture.get().getUpdateTime();
    }

    public String updateMonthlyBudgetColors(MonthlyBudget monthlyBudget) throws ExecutionException, InterruptedException, BudgetBustersException {
        MonthlyBudget budget = getBudget(monthlyBudget.getEmail());
        budget.setColors(monthlyBudget.getColors());
        updateMonthlyBudget(budget);
        return "Colors updated for " + budget.getEmail();
    }

    public String updateMonthlyBudgetCategories(MonthlyBudget monthlyBudget) throws ExecutionException, InterruptedException, BudgetBustersException {
        MonthlyBudget budget = getBudget(monthlyBudget.getEmail());
        budget.setAllCategories(monthlyBudget.getAllCategories());
        updateMonthlyBudget(budget);
        return "Categories updated for " + budget.getEmail();
    }
}
