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

public class Notifications {
    private String email;
    private List<String> preferredMethod; // email or text option
    private String notifTime;
    private Integer budgetWarning;  // percentage threshold set by the user
}
