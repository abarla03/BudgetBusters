import React, {useEffect, useState} from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import {auth} from "../firebase";
import {get} from "./ApiClient";
function CategoryBreakdown() {

    // get user
    const user = auth.currentUser;
    const userEmail = user ? user.email : "";

    const [budgetGoalObj, setBudgetGoalObj] = useState({});
    const [budgetUpdated, setBudgetUpdated] = useState(false); // to re-fetch budget info whenever update happens
    const [inputDailyObj, setInputDailyObj] = useState({});
    const [inputDailyUpdated, setInputDailyUpdated] = useState(false); // to re-fetch input info whenever update happens

    /* obtaining budget goal object from user input */
    useEffect(() => {
        function fetchBudgetData() {
            let data;
            try {
                // Make the GET request to retrieve the budget
                data = get(`/getBudget/${userEmail}`)
            } catch (error) {
                console.error("Error creating or fetching budget:", error);
            }
            return data;
        }
        fetchBudgetData().then((response) => {
            setBudgetGoalObj(response.data);
        });
        setBudgetUpdated(false)
    }, [userEmail, budgetUpdated]);

    /* obtaining input daily spending object from user input */
    useEffect(() => {
        function fetchInputDailyData() {
            let data;
            try {
                // Make the GET request to retrieve the budget
                data = get(`/getPurchase/${userEmail}`);
                console.log("inside use effect input daily obj: ", data)
            } catch (error) {
                console.error("Error creating or fetching purchase(s):", error);
            }
            return data;
        }
        fetchInputDailyData().then((response) => {
            setInputDailyObj(response.data);
        });
        setInputDailyUpdated(false);
    }, [userEmail, inputDailyUpdated]);

    // const data = [
    //     { category: "Rent", total_spending: 150 },
    //     { category: "Food", total_spending: 100 },
    //     { category: "Gym", total_spending: 50 },
    //     { category: "Yet to Spend", total_spending: 200 },
    // ];
    //
    // const colors = ["#8884d8", "#82ca9d", "#FFBB28", "#808080"];


    // // hard coded category breakdown data - pull from backend
// const categories = budgetGoalObj?
// const colors = ["#8884d8", "#82ca9d", "#FFBB28"];
// const categoryCount = [150, 100, 50];
//
// // creating the Yet to Spend category
// budgetLimit = 500;
// const sum = categoryCount.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
// categories.push("Yet to Spend");
// const yetToSpendCount = budgetLimit - sum;
// categoryCount.push(yetToSpendCount);
// colors.push("#808080");
//
// // create bar_data for display
// const bar_data = [];
// categories.map((category, count) => {
//   bar_data.push({ name: category, total_spending: categoryCount[count]});
// });
// console.log(bar_data);

    let colors;
    let categories;
    let categoryCount;
    let budgetLimit;
    let bar_data;

    if (inputDailyObj ) {
        colors = budgetGoalObj.colors ? [...budgetGoalObj.colors] : [];
        categories = budgetGoalObj.allCategories ? [...budgetGoalObj.allCategories] : [];
        categoryCount = inputDailyObj.categoryCount ? [...inputDailyObj.categoryCount] : [];
        budgetLimit = budgetGoalObj.monthlyBudget;

        let sum = 0;
        if ((inputDailyObj?.cumulativeDailySpending)?.length > 0) {
            sum = inputDailyObj?.cumulativeDailySpending[(inputDailyObj?.cumulativeDailySpending)?.length - 1];
        }

        const totalRemainingCount = parseInt(budgetLimit) - sum;
        categories.push("Total Remaining");
        categoryCount.push(totalRemainingCount);
        colors.push("#808080");

        bar_data = [];
        categories.map((category, count) => {
          bar_data.push({ name: category, total_spending: categoryCount[count]});
        });
    }

    /* Bar Chart components */
    const MyBarChart = () => {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <div style={{ textAlign: "center" }}>
                    <h1 className="text-heading">Monthly Category Breakdown</h1>
                    <BarChart width={600} height={600} data={bar_data}>
                        <Bar dataKey="total_spending" fill="green" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="category" />
                        <YAxis />
                    </BarChart>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2>Category Breakdown</h2>
            <MyBarChart/>
            {/* Add content and logic for category breakdown */}
        </div>
    );
}
export default CategoryBreakdown;

