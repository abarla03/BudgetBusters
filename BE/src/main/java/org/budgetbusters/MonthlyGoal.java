package org.budgetbusters;

import lombok.AllArgsConstructor; // takes care of all the setters and getters
import lombok.Getter;
import lombok.NoArgsConstructor; // takes care of all the setters and getters
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyGoal {

    private String userId;
    private Integer monthlyBudget;

}
