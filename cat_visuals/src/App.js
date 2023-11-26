import React from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

const App = () => {
    // Sample data
    const data = [
        { category: "Rent", total_spending: 150 },
        { category: "Food", total_spending: 100 },
        { category: "Gym", total_spending: 50 },
        { category: "Yet to Spend", total_spending: 200 },
    ];

    const colors = ["#8884d8", "#82ca9d", "#FFBB28", "#808080"];

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div style={{ textAlign: "center" }}>
            <h1 className="text-heading">Monthly Category Breakdown</h1>
            <BarChart width={600} height={600} data={data}>
                <Bar dataKey="total_spending" fill="green" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="category" />
                <YAxis />
            </BarChart>
        </div>
        </div>
    );
};

export default App;
