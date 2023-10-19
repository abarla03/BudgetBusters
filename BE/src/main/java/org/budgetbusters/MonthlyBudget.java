package org.budgetbusters;
import lombok.AllArgsConstructor; // takes care of all the setters and getters
import lombok.Getter;
import lombok.NoArgsConstructor; // takes care of all the setters and getters
import lombok.Setter;

import java.util.List;
import java.util.Map;
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyBudget {
    private String emailAddress;
    private Integer monthlyBudget;
    private List<String> categories;
//    private Map<String, String> catAndCol; // use for category + color
}
