package com.java.firebase;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class User {
//    private String documentId;
//    private String name;
//    private String profession;

    private String firstName;
    private String lastName;
    private Integer birthYear;
    private String email;
    private String userId;
    private Integer phoneNumber;
    private Integer monthlyBudget;
    private List<String> categories;
//    private Map<String, String> categories; use for category + color

//    public String getFirst_name() {
//        return first_name;
//    }
//
//    public void setFirst_name(String first_name) {
//        this.first_name = first_name;
//    }
//
//    public String getLast_name() {
//        return last_name;
//    }
//
//    public void setLast_name(String last_name) {
//        this.last_name = last_name;
//    }
//
//    public Integer getBirth_year() {
//        return birth_year;
//    }
//
//    public void setBirth_year(Integer birth_year) {
//        this.birth_year = birth_year;
//    }
//
//    public String getEmail() {
//        return email;
//    }
//
//    public void setEmail(String email) {
//        this.email = email;
//    }
//
//    public String getUserId() {
//        return userId;
//    }
//
//    public void setUserId(String userId) {
//        this.userId = userId;
//    }
//
//    public Integer getPhone_number() {
//        return phone_number;
//    }
//
//    public void setPhone_number(Integer phone_number) {
//        this.phone_number = phone_number;
//    }
//
//    public Integer getMonthly_budget() {
//        return monthly_budget;
//    }
//
//    public void setMonthly_budget(Integer monthly_budget) {
//        this.monthly_budget = monthly_budget;
//    }
//
//    public List<String> getCategories() {
//        return categories;
//    }
//
//    public void setCategories(List<String> categories) {
//        this.categories = categories;
//    }
}
