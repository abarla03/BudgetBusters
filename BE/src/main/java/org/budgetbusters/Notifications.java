package org.budgetbusters;

import lombok.AllArgsConstructor; // takes care of all the setters and getters
import lombok.Getter;
import lombok.NoArgsConstructor; // takes care of all the setters and getters
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor

public class Notifications {
    private String email;
    private String preferredMethod; // email or text option
}
