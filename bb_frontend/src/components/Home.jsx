// /****************** modified to match App.js ***************************** */
// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../firebase";
// import '../App.css';
// import logo from '../BBLogo.png';
// import { PieChart, Pie, Cell, Tooltip, Legend, Scatter, ScatterChart, LineChart, ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid } from "recharts";
//
// // Hard coded - scatter plot daily total spending data
// const totalDailySpending = [11, 39, 25, 140, 130, 75];
// const scatter_data = [];
// totalDailySpending.forEach((value, day) => {
//     scatter_data.push({ x: (day + 1), y: value });
// });
//
// // Hard coded - cumulative line graph data
// let budgetLimit = 500;
// const cumulativeDaySpending = [11, 50, 75, 215, 345, 420]
// const line_data = [];
// cumulativeDaySpending.map((value, day) => {
//     line_data.push({name: "Day " + (day + 1), currentTotal: value, budgetLimit: budgetLimit})
// });
//
// const Home = () => {
//     const location = useLocation();
//     // const [user, setUser] = useState(null);
//     const user = auth.currentUser;
//     const userName = user ? (user.email).match(/([^@]+)/)[0] : "";
//     const [firstTimeVisit, setFirstTimeVisit] = useState(true);
//
//     // useEffect(() => {
//     //     // const unsubscribe = onAuthStateChanged(auth, (user) => {
//     //     //     if (user) {
//     //     //         setUser(user);
//     //     //     } else {
//     //     //         setUser(null);
//     //     //     }
//     //     // });
//     //
//     //     // Check if the user has visited the home page before
//     //     const hasVisitedBefore = Boolean(localStorage.getItem(`hasVisitedHome_${userName}`));
//     //     console.log('hasVisitedBefore:', hasVisitedBefore);
//     //
//     //     if (hasVisitedBefore === false) {
//     //         // If it's the first time, set the flag and show the welcome message
//     //         console.log('Setting localStorage item');
//     //         localStorage.setItem(`hasVisitedHome_${userName}`, 'true');
//     //         setFirstTimeVisit(true);
//     //     } else {
//     //         console.log('Not the first time');
//     //         setFirstTimeVisit(false);
//     //     }
//     //
//     //     // return () => unsubscribe();
//     // }, []);
//
//
//     // hardcoded colors
//     const colors = ["#8884d8", "#82ca9d", "#FFBB28", "#808080"];
//
//     // Hardcoded - pie graph data
//     const categories = ["Rent", "Groceries", "Gym"]
//     const categoryCount = [150, 100, 50];
//     budgetLimit = 500;
//     const sum = categoryCount.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
//     categories.push("Total Remaining");
//     const totalRemainingCount = budgetLimit - sum;
//     categoryCount.push(totalRemainingCount);
//     colors.push("#808080");
//
//     // create pie_data for display
//     const pie_data = [];
//
//     categories.map((category, count) => {
//         pie_data.push({name: category, value: (categoryCount[count] / budgetLimit) * 100});
//     });
//
//     const CustomTooltip = ({ active, payload, label }) => {
//         if (active) {
//             return (
//                 <div
//                     className="custom-tooltip"
//                     style={{
//                         backgroundColor: "#ffffff",
//                         padding: "5px",
//                         border: "1px solid #cccc",
//                     }}
//                 >
//                     <label>{`${payload[0].name} : ${payload[0].value}%`}</label>
//                 </div>
//             );
//         }
//         return null;
//     };
//
//     const MyPieChart = () => {
//         return (
//             <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//                 <h1 className="text-heading">Monthly Spending by Category</h1>
//                 <PieChart width={730} height={300}>
//                     <Pie
//                         data={pie_data}
//                         dataKey="value"
//                         nameKey="name"
//                         cx="50%"
//                         cy="50%"
//                         outerRadius={120}
//                         fill="#8884d8"
//                         labelLine={false} // removing label lines for better visibility
//                         label={(entry) => entry.name} // displaying category names as labels
//                     >
//                         {pie_data?.map((entry, index) => (
//                             <Cell
//                                 key={`cell-${index}`}
//                                 fill={colors[index % colors.length]}
//                             />
//                         ))}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend /> {/* should we include the legend? */}
//                 </PieChart>
//             </div>
//         );
//     }
//
//     const MyLineChart = () => {
//         return (
//             <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//                 <h1 className="text-heading">Cumulative Monthly Spending Chart</h1>
//                 <ResponsiveContainer width="100%" aspect={3}>
//                     <LineChart data={line_data} margin={{ right: 30 }}> {/* Adjusted margin */}
//                         <CartesianGrid strokeDasharray="3 3" /> {/* dashed grid lines */}
//                         <XAxis dataKey="name" interval={"preserveStartEnd"} />
//                         <YAxis />
//                         <Tooltip /> {/* Tooltip for better data visibility */}
//                         <Legend />
//                         <Line type="monotone" dataKey="currentTotal" name="Current Total" stroke="black" activeDot={{ r: 8 }} />
//                         <Line type="monotone" dataKey="budgetLimit" name="Budget Limit" stroke="red" activeDot={{ r: 8 }} />
//                     </LineChart>
//                 </ResponsiveContainer>
//             </div>
//         );
//     }
//
//     const MyScatterChart = () => {
//         return (
//             <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//                 <h1 className="text-heading"> Total Spending By Day</h1>
//                 <ScatterChart width={400} height={400} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis type="number" dataKey="x" name="Day" />
//                     <YAxis yAxisId="left" type="number" dataKey="y" name="Amount" />
//                     <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value, name, props) => [name === 'Amount' ? `$${value}` : value, name]} />
//                     <Scatter yAxisId="left" name="Amount" data={scatter_data} fill="#8884d8" />
//                 </ScatterChart>
//             </div>
//         );
//     }
//
//     return (
//         <div className="App">
//             {/*{firstTimeVisit ? (*/}
//             {/*    <h1>Welcome to the home page, {user ? userName : 'Guest'}!</h1>*/}
//             {/*) : (*/}
//             {/*    <h1>Hi {user ? userName : 'Guest'}</h1>*/}
//             {/*)}*/}
//
//             <MyScatterChart />
//             <MyPieChart />
//             <MyLineChart />
//         </div>
//     );
// }
//
// export default Home;


// CURRENT MAIN 11/29
/****************** modified to match App.cs ***************************** */
import React, {useEffect, useState} from 'react';
import '../App.css';
import logo from '../BBLogo.png';
import { Route, Routes, Link  } from 'react-router-dom';
import SetMonthlyGoal from './SetMonthlyGoal'; // Import your components
import CategoryBreakdown from './CategoryBreakdown'; // Import your components
import InputDailySpending from './InputDailySpending'; // Import your components
import { auth } from "../firebase";
import {post, put, get, del} from "./ApiClient";

function Home() {
    console.log("Home component is rendering.");
    const user = auth.currentUser;
    const userEmail = user ? user.email : "";

    const [userObj, setUserObj] = useState({});
    const [userUpdated, setUserUpdated] = useState(false); // to re-fetch budget info whenever update happens

    const [budgetGoalObj, setBudgetGoalObj] = useState({});
    const [budgetUpdated, setBudgetUpdated] = useState(false); // to re-fetch budget info whenever update happens

    const [inputDailyObj, setInputDailyObj] = useState({});
    const [inputDailyUpdated, setInputDailyUpdated] = useState(false); // to re-fetch input info whenever update happens

    /* obtaining user object from user profile input */
    useEffect(() => {
        function fetchUserData() {
            let data;
            try {
                // Make the GET request to retrieve the user
                data = get(`/getUser/${userEmail}`)
            } catch (error) {

                console.error("Error creating or fetching user:", error);
            }
            return data;
        }
        fetchUserData().then((response) => {
            setUserObj(response.data);
        });
        setUserUpdated(false)
    }, [userEmail, userUpdated]);

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
                data = get(`/getPurchase/${userEmail}`)
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


    return (
        <div>
            {budgetGoalObj?.colors ? (
                <div>
                    <h3>Hi {userObj?.fullName}! </h3>
                    <h3>Your monthly budget is: ${budgetGoalObj?.monthlyBudget} </h3>

                    {inputDailyObj?.cumulativeDailySpending ? (
                        <div>
                            <h3>Your total spending for the month is: $
                                {inputDailyObj?.cumulativeDailySpending[inputDailyObj?.cumulativeDailySpending.length - 1]} </h3>
                            <h3>Here’s a visual breakdown of your spending habits so far this month:</h3>
                        </div>
                    ) : (
                        <div>
                            <h3> no purchases made. </h3>
                        </div>
                    )}

                    {inputDailyObj?.numPurchases > 0 ? (
                        <h3></h3>
                    ) : (
                        <>
                            <h3>Spending pie chart unavailable until purchases are made.</h3>
                            <h3>Spending pie chart unavailable until purchases are made.</h3>
                        </>
                    )}
                </div>
            ) : (
                <div>
                    <h3>Welcome {userObj?.fullName}!</h3>
                    <p>Insert instructions</p>
                    <h3>You have not set your budget goal for this month yet. Navigate to the Set Monthly Goal page to get started!</h3>
                </div>
            )}
        </div>
    );

    // return (
    //     <div>
    //         {budgetGoalObj?.colors ? (
    //             <div>
    //                 <h3>Hi {userObj?.fullName}! </h3>
    //                 <h3>Your monthly budget is: ${budgetGoalObj?.monthlyBudget} </h3>
    //             </div>
    //
    //             {inputDailyObj?.cumulativeDailySpending ? (
    //                 <div>
    //                     <h3>Your total spending for the month is: $
    //                         {inputDailyObj?.cumulativeDailySpending[inputDailyObj?.cumulativeDailySpending.length - 1]} </h3>
    //                     <h3>Here’s a visual breakdown of your spending habits so far this month:</h3>
    //                 </div>
    //             ) : (
    //                 <div>
    //                     <h3> no purchases made. </h3>
    //                 </div>
    //             )}
    //
    //             {inputDailyObj?.numPurchases > 0 ? (
    //                 <h3></h3>
    //             ) : (
    //                 <h3>Spending pie chart unavailable until purchases are made.</h3>
    //                 <h3>Spending pie chart unavailable until purchases are made.</h3>
    //             )}
    //         ) : (
    //             <div>
    //                 <h3>Welcome {userObj?.fullName}!</h3>
    //                 <p>Insert instructions</p>
    //                 <h3>You have not set your budget goal for this month yet.
    //                     Navigate to the Set Monthly Goal page to get started!</h3>
    //             </div>
    //         )}
    //
    //
    //         {!inputDailyObj?.cumulativeDailySpending ? (
    //         //     <div>
    //         //         <h3> no purchases made. </h3>
    //         //     </div>
    //         // ) : (
    //         //     <div>
    //         //         <h3>Your total spending for the month is: $
    //         //             {inputDailyObj?.cumulativeDailySpending[inputDailyObj?.cumulativeDailySpending.length - 1]} </h3>
    //         //         <h3>Here’s a visual breakdown of your spending habits so far this month:</h3>
    //         //     </div>
    //         // )}
    //
    //     </div>
    // );
    //
    //
    //
    //
    // //
    // //
    // // return (
    // //     <div>
    // //         <h3 className="App">
    // //             {userObj.firstTimeRegister ? (
    // //                 <h3>Welcome {userObj.fullName}!</h3>
    //             ) : (
    //                 <h3>Hi {userObj.fullName}</h3>
    //             )}
    //         </h3>
    //     </div>
    // );
}

export default Home;

