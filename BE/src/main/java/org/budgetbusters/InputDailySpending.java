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
public class InputDailySpending {
    private String email;
    private Integer numPurchases;
    private List<Purchase> purchases;
    private Double currentDayTotal;
    private List<Double> totalDailySpending; // array with each day’s individual spending
    private List<Double> cumulativeDailySpending; // array with each day’s cumulative spending
    private List<Double> categoryCount; // array with individual category total spending per month
}
