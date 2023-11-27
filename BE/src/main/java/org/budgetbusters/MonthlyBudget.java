package org.budgetbusters;

import lombok.*;

import java.util.Date;
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
    private Date submissionDate;
}
