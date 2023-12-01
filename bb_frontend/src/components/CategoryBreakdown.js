import React, {useEffect, useState} from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import {auth} from "../firebase";
import {get} from "./ApiClient";
function CategoryBreakdown() {


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


    /* category data from backend */
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
    } else {
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
            // displaying only the categories on the bar graph
            bar_data.push({ name: category, total_spending: 0});
        });
    }


    /* Bar Chart components */
    const MyBarChart = () => {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <div style={{ textAlign: "center" }}>
                    <h1 className="text-heading">Monthly Category Breakdown Chart</h1>
                    <BarChart width={600} height={600} data={bar_data}>
                        <Bar dataKey="total_spending" fill="#21234d" />
                        {/*<Bar dataKey="total_spending" fill={(entry, index) => colors[index] || "#21234d"} />*/}
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis />
                    </BarChart>
                </div>
            </div>
        );
    }


    return (
        <div>
            {
                !budgetGoalObj?.colors ? (
                    <h3>Please set your monthly goal and add purchases to view your progress.</h3>
                ) : (
                    <MyBarChart />
                )
            }
        </div>
    );
}
export default CategoryBreakdown;








// import React, {useEffect, useState} from "react";
// import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
// import {auth} from "../firebase";
// import {get} from "./ApiClient";
// function CategoryBreakdown() {
//
//     const user = auth.currentUser;
//     const userEmail = user ? user.email : "";
//
//     const [budgetGoalObj, setBudgetGoalObj] = useState({});
//     const [budgetUpdated, setBudgetUpdated] = useState(false); // to re-fetch budget info whenever update happens
//     const [inputDailyObj, setInputDailyObj] = useState({});
//     const [inputDailyUpdated, setInputDailyUpdated] = useState(false); // to re-fetch input info whenever update happens
//
//     /* obtaining budget goal object from user input */
//     useEffect(() => {
//         function fetchBudgetData() {
//             let data;
//             try {
//                 // Make the GET request to retrieve the budget
//                 data = get(`/getBudget/${userEmail}`)
//             } catch (error) {
//                 console.error("Error creating or fetching budget:", error);
//             }
//             return data;
//         }
//         fetchBudgetData().then((response) => {
//             setBudgetGoalObj(response.data);
//         });
//         setBudgetUpdated(false)
//     }, [userEmail, budgetUpdated]);
//
//     /* obtaining input daily spending object from user input */
//     useEffect(() => {
//         function fetchInputDailyData() {
//             let data;
//             try {
//                 // Make the GET request to retrieve the budget
//                 data = get(`/getPurchase/${userEmail}`);
//                 console.log("inside use effect input daily obj: ", data)
//             } catch (error) {
//                 console.error("Error creating or fetching purchase(s):", error);
//             }
//             return data;
//         }
//         fetchInputDailyData().then((response) => {
//             setInputDailyObj(response.data);
//         });
//         setInputDailyUpdated(false);
//     }, [userEmail, inputDailyUpdated]);
//
//     /* category data from backend */
//     let colors;
//     let categories;
//     let categoryCount;
//     let budgetLimit;
//     let bar_data;
//
//     if (inputDailyObj ) {
//         colors = budgetGoalObj.colors ? [...budgetGoalObj.colors] : [];
//         categories = budgetGoalObj.allCategories ? [...budgetGoalObj.allCategories] : [];
//         categoryCount = inputDailyObj.categoryCount ? [...inputDailyObj.categoryCount] : [];
//         budgetLimit = budgetGoalObj.monthlyBudget;
//
//         let sum = 0;
//         if ((inputDailyObj?.cumulativeDailySpending)?.length > 0) {
//             sum = inputDailyObj?.cumulativeDailySpending[(inputDailyObj?.cumulativeDailySpending)?.length - 1];
//         }
//
//         const totalRemainingCount = parseInt(budgetLimit) - sum;
//         categories.push("Total Remaining");
//         categoryCount.push(totalRemainingCount);
//         colors.push("#808080");
//
//         bar_data = [];
//         categories.map((category, count) => {
//           bar_data.push({ name: category, total_spending: categoryCount[count]});
//         });
//     } else {
//         colors = budgetGoalObj.colors ? [...budgetGoalObj.colors] : [];
//         categories = budgetGoalObj.allCategories ? [...budgetGoalObj.allCategories] : [];
//         categoryCount = inputDailyObj.categoryCount ? [...inputDailyObj.categoryCount] : [];
//         budgetLimit = budgetGoalObj.monthlyBudget;
//
//         let sum = 0;
//         if ((inputDailyObj?.cumulativeDailySpending)?.length > 0) {
//             sum = inputDailyObj?.cumulativeDailySpending[(inputDailyObj?.cumulativeDailySpending)?.length - 1];
//         }
//
//         const totalRemainingCount = parseInt(budgetLimit) - sum;
//         categories.push("Total Remaining");
//         categoryCount.push(totalRemainingCount);
//         colors.push("#808080");
//
//         bar_data = [];
//         categories.map((category, count) => {
//             // displaying only the categories on the bar graph
//             bar_data.push({ name: category, total_spending: 0});
//         });
//     }
//
//     /* Bar Chart components */
//     const MyBarChart = () => {
//         return (
//             <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//                 <div style={{ textAlign: "center" }}>
//                     <h1 className="text-heading">Monthly Category Breakdown</h1>
//                     <BarChart width={600} height={600} data={bar_data}>
//                         <Bar dataKey="total_spending" fill="green" />
//                         {/*<Bar dataKey="total_spending" fill={(entry, index) => colors[index] || "green"} />*/}
//                         <CartesianGrid stroke="#ccc" />
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                     </BarChart>
//                 </div>
//             </div>
//         );
//     }
//
//     return (
//         <div>
//             <h2>Category Breakdown</h2>
//             {
//                 !budgetGoalObj?.colors ? (
//                     <h3>Please set your monthly goal and add purchases to view your progress.</h3>
//                 ) : (
//                     <MyBarChart />
//                 )
//             }
//         </div>
//     );
// }
// export default CategoryBreakdown;
//
