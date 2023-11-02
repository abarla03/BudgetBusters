package org.budgetbusters;

import lombok.AllArgsConstructor; // takes care of all the setters and getters
import lombok.Getter;
import lombok.NoArgsConstructor; // takes care of all the setters and getters
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyBudget {
    private String email;
    private Integer monthlyBudget;
    private List<String> allCategories;
    private List<String> colors;
}
