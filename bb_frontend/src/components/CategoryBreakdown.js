import React from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

// Hardcoded - bar graph data
const categories = ["Rent", "Groceries", "Gym"]
const categoryCount = [150, 100, 50];
const budgetLimit = 500;
const sum = categoryCount.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
categories.push("Total Remaining ");
const totalRemainingCount = budgetLimit - sum;
categoryCount.push(totalRemainingCount)
// currently not using colors to display the bar graph
const colors = ["#8884d8", "#82ca9d", "#FFBB28", "#808080"];
colors.push("#808080");

// create pie_data for display
const bar_data = [];

categories.map((category, count) => {
    bar_data.push({category: category, total_spending: (categoryCount[count])});
});
console.log(bar_data);
const CategoryBreakdown = () => {
    // const data = [
    //     { category: "Rent", total_spending: 150 },
    //     { category: "Food", total_spending: 100 },
    //     { category: "Gym", total_spending: 50 },
    //     { category: "Total Remaining ", total_spending: 200 },
    // ];

    const colors = ["#8884d8", "#82ca9d", "#FFBB28", "#808080"];

    const BarGraph = () => {
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

    // Render the BarGraph component
    return (
        <div className="App">
            <h3> Welcome to the Category Breakdown Page! </h3>
            <BarGraph />
        </div>
    );
}

export default CategoryBreakdown;
