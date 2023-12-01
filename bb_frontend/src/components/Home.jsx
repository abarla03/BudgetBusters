import React, {useEffect, useState} from 'react';
import '../App.css';
import { auth } from "../firebase";
import {get} from "./ApiClient";
import { PieChart, Pie, Cell, Tooltip, Legend, Scatter, ScatterChart, LineChart, ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid } from "recharts";


function Home() {
    // console.log("Home component is rendering.");
    const user = auth.currentUser;
    const userEmail = user ? user.email : "";
    const [userObj, setUserObj] = useState({});
    const [userUpdated, setUserUpdated] = useState(false); // to re-fetch user info whenever update happens
    const [budgetGoalObj, setBudgetGoalObj] = useState({});
    const [budgetUpdated, setBudgetUpdated] = useState(false); // to re-fetch budget info whenever update happens
    const [inputDailyObj, setInputDailyObj] = useState({});
    const [inputDailyUpdated, setInputDailyUpdated] = useState(false); // to re-fetch input info whenever update happens




    /* userObj, budgetGoalObj, inputDailyObj get userInfo, budgetGoalInfo, and inputDailyInfo from backend */


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


    /* Graph Data */


    // scatter plot daily total spending data
    let totalDailySpending;
    let scatter_data;
    if (inputDailyObj) {
        totalDailySpending = inputDailyObj?.totalDailySpending;
        scatter_data = [];
        totalDailySpending?.forEach((value, day) => {
            scatter_data.push({x: (day + 1), y: value});
        });
    }


    // pie chart data
    let colors;
    let categories;
    let categoryCount;
    let budgetLimit;
    let pie_data = [];


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


        // create pie_data for display
        categories?.map((category, count) => {
            pie_data?.push({name: category, value: (categoryCount[count] / budgetLimit) * 100});
        });
    }


    // cumulative line graph data
    let cumulativeDaySpending;
    let line_data;
    if(inputDailyObj) {
        cumulativeDaySpending = inputDailyObj?.cumulativeDailySpending;
        line_data = [];
        cumulativeDaySpending?.forEach((value, day) => {
            line_data.push({name: "Day " + (day + 1), currentTotal: value, budgetLimit: budgetGoalObj?.monthlyBudget})
        });
    } else {
        // case when only the monthly budget is set
        const length = 31; // Set the desired length of the array
        const zerosArray = Array(length).fill(0);
        line_data = [];
        let day = 0;
        zerosArray?.forEach((value, day) => {
            line_data.push({name: "Day " + (day + 1), currentTotal: 0, budgetLimit: budgetGoalObj?.monthlyBudget})
        });
    }


    // assign colors & labels for pie chart data
    const CustomTooltip = ({ active, payload, label }) => {
        if (active) {
            return (
                <div
                    className="custom-tooltip"
                    style={{
                        backgroundColor: "#ffffff",
                        padding: "5px",
                        border: "1px solid #cccc",
                    }}
                >
                    <label>{`${payload[0].name} : ${payload[0].value.toFixed(2)}%`}</label>
                </div>
            );
        }
        return null;
    };


    /* Scatter, Pie, and Line Chart components */
    const MyScatterChart = () => {
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h1 className="text-heading"> Total Spending By Day</h1>
                <ScatterChart width={400} height={400} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="x" name="Day" />
                    <YAxis yAxisId="left" type="number" dataKey="y" name="Amount" />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value, name, props) => [name === 'Amount' ? `$${value}` : value, name]} />
                    <Scatter yAxisId="left" name="Amount" data={scatter_data} fill="#8884d8" />
                </ScatterChart>
            </div>
        );
    }


    const MyPieChart = () => {
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h1 className="text-heading">Monthly Spending by Category</h1>
                <PieChart width={730} height={300}>
                    <Pie
                        data={pie_data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        labelLine={false} // removing label lines for better visibility
                        label={(entry) => entry.name} // displaying category names as labels
                    >
                        {pie_data?.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend /> {/* should we include the legend? */}
                </PieChart>
            </div>
        );
    }


    const MyLineChart = () => {
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h1 className="text-heading">Cumulative Monthly Spending Chart</h1>
                <ResponsiveContainer width="100%" aspect={3}>
                    <LineChart data={line_data} margin={{ right: 30 }}> {/* Adjusted margin */}
                        <CartesianGrid strokeDasharray="3 3" /> {/* dashed grid lines */}
                        <XAxis dataKey="name" interval={"preserveStartEnd"} />
                        <YAxis />
                        <Tooltip /> {/* Tooltip for better data visibility */}
                        <Legend />
                        <Line type="monotone" dataKey="currentTotal" name="Current Total" stroke="black" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="budgetLimit" name="Budget Limit" stroke="red" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }


    const MyBudgetOnlyLineChart = () => {
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h1 className="text-heading">Cumulative Monthly Spending Chart</h1>
                <ResponsiveContainer width="100%" aspect={3}>
                    <LineChart data={line_data} margin={{ right: 30 }}> {/* Adjusted margin */}
                        <CartesianGrid strokeDasharray="3 3" /> {/* dashed grid lines */}
                        <XAxis dataKey="name" interval={"preserveStartEnd"} />
                        <YAxis />
                        <Tooltip /> {/* Tooltip for better data visibility */}
                        <Legend />
                        {/*<Line type="monotone" dataKey="currentTotal" name="Current Total" stroke="black" activeDot={{ r: 8 }} />*/}
                        <Line type="monotone" dataKey="budgetLimit" name="Budget Limit" stroke="red" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
    return (
        <div>
            {budgetGoalObj?.colors ? (
                <div>
                    <h3>Hi {userObj?.fullName}! </h3>
                    <h3>Your monthly budget is: ${budgetGoalObj?.monthlyBudget} </h3>


                    {(inputDailyObj?.cumulativeDailySpending)?.length > 0 ? (
                        <div>
                            <h3>Your total spending for the month is: $
                                {inputDailyObj?.cumulativeDailySpending[(inputDailyObj?.cumulativeDailySpending)?.length - 1]} </h3>
                            <h3>Here’s a visual breakdown of your spending habits so far this month:</h3>
                            <MyScatterChart />
                            <MyPieChart />
                            <MyLineChart/>


                        </div>
                    ) : (
                        <div>
                            <p>Daily Spending scatter plot unavailable until purchases are made.</p>
                            <p>Spending pie chart unavailable until purchases are made.</p>
                            <p>Spending cumulative line graph unavailable until purchases are made. </p>
                            <MyBudgetOnlyLineChart/>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <h3>Welcome to Budget Busters! We’re so happy to have you here.</h3>
                    {/* step by step */}
                    <h13>Step 1:</h13>
                    <h15>Go to Settings, and then navigate to the Profile page to update your personal information.</h15>


                    <h13>Step 2:</h13>
                    <h16>Navigate to the Notifications page to set your notification preferences. Notifications can be set for daily spending, monthly goal setting, and more! </h16>


                    <h13>Step 3:</h13>
                    <h17>Set your budget goal for the month by going to the Set Monthly Goal Page. You can reference and edit your goal whenever you'd like on this page.</h17>


                    <h13>Step 4:</h13>
                    <h18>Now, you're ready to start inputting your daily purchases! Navigate to the Input Daily Spending page to enter your daily spending. </h18>


                    <h13>Step 5:</h13>
                    <h19>Visit Home and the Category Breakdown Page to view your spending data and visualize your progress in relation to your monthly goal. </h19>


                    <h3>You have not set your budget goal for this month yet. Navigate to the Set Monthly Goal page to get started!</h3>
                </div>
            )}
        </div>
    );
}


export default Home;






// import React, {useEffect, useState} from 'react';
// import '../App.css';
// import { auth } from "../firebase";
// import {get} from "./ApiClient";
// import { PieChart, Pie, Cell, Tooltip, Legend, Scatter, ScatterChart, LineChart, ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid } from "recharts";
//
// function Home() {
//     // console.log("Home component is rendering.");
//     const user = auth.currentUser;
//     const userEmail = user ? user.email : "";
//     const [userObj, setUserObj] = useState({});
//     const [userUpdated, setUserUpdated] = useState(false); // to re-fetch user info whenever update happens
//     const [budgetGoalObj, setBudgetGoalObj] = useState({});
//     const [budgetUpdated, setBudgetUpdated] = useState(false); // to re-fetch budget info whenever update happens
//     const [inputDailyObj, setInputDailyObj] = useState({});
//     const [inputDailyUpdated, setInputDailyUpdated] = useState(false); // to re-fetch input info whenever update happens
//
//
//     /* userObj, budgetGoalObj, inputDailyObj get userInfo, budgetGoalInfo, and inputDailyInfo from backend */
//
//     /* obtaining user object from user profile input */
//     useEffect(() => {
//         function fetchUserData() {
//             let data;
//             try {
//                 // Make the GET request to retrieve the user
//                 data = get(`/getUser/${userEmail}`)
//             } catch (error) {
//                 console.error("Error creating or fetching user:", error);
//             }
//             return data;
//         }
//         fetchUserData().then((response) => {
//             setUserObj(response.data);
//         });
//         setUserUpdated(false)
//     }, [userEmail, userUpdated]);
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
//     /* Graph Data */
//
//     // scatter plot daily total spending data
//     let totalDailySpending;
//     let scatter_data;
//     if (inputDailyObj) {
//         totalDailySpending = inputDailyObj?.totalDailySpending;
//         scatter_data = [];
//         totalDailySpending?.forEach((value, day) => {
//             scatter_data.push({x: (day + 1), y: value});
//         });
//     }
//
//     // pie chart data
//     let colors;
//     let categories;
//     let categoryCount;
//     let budgetLimit;
//     let pie_data = [];
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
//         // create pie_data for display
//         categories?.map((category, count) => {
//             pie_data?.push({name: category, value: (categoryCount[count] / budgetLimit) * 100});
//         });
//     }
//
//     // cumulative line graph data
//     let cumulativeDaySpending;
//     let line_data;
//     if(inputDailyObj) {
//         cumulativeDaySpending = inputDailyObj?.cumulativeDailySpending;
//         line_data = [];
//         cumulativeDaySpending?.forEach((value, day) => {
//             line_data.push({name: "Day " + (day + 1), currentTotal: value, budgetLimit: budgetGoalObj?.monthlyBudget})
//         });
//     } else {
//         // case when only the monthly budget is set
//         const length = 31; // Set the desired length of the array
//         const zerosArray = Array(length).fill(0);
//         line_data = [];
//         let day = 0;
//         zerosArray?.forEach((value, day) => {
//                 line_data.push({name: "Day " + (day + 1), currentTotal: 0, budgetLimit: budgetGoalObj?.monthlyBudget})
//         });
//     }
//
//     // assign colors & labels for pie chart data
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
//     /* Scatter, Pie, and Line Chart components */
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
//     const MyBudgetOnlyLineChart = () => {
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
//                         {/*<Line type="monotone" dataKey="currentTotal" name="Current Total" stroke="black" activeDot={{ r: 8 }} />*/}
//                         <Line type="monotone" dataKey="budgetLimit" name="Budget Limit" stroke="red" activeDot={{ r: 8 }} />
//                     </LineChart>
//                 </ResponsiveContainer>
//             </div>
//         );
//     }
//
//     return (
//         <div>
//             {budgetGoalObj?.colors ? (
//                 <div>
//                     <h3>Hi {userObj?.fullName}! </h3>
//                     <h3>Your monthly budget is: ${budgetGoalObj?.monthlyBudget} </h3>
//
//                     {(inputDailyObj?.cumulativeDailySpending)?.length > 0 ? (
//                         <div>
//                             <h3>Your total spending for the month is: $
//                                 {inputDailyObj?.cumulativeDailySpending[(inputDailyObj?.cumulativeDailySpending)?.length - 1]} </h3>
//                             <h3>Here’s a visual breakdown of your spending habits so far this month:</h3>
//                             <h3>display graphs</h3>
//                             <MyScatterChart />
//                             <MyPieChart />
//                             <MyLineChart/>
//
//                         </div>
//                     ) : (
//                         <div>
//                             <h3> no purchases made. </h3>
//                             <h3>Daily Spending scatter plot unavailable until purchases are made.</h3>
//                             <h3>Spending pie chart unavailable until purchases are made.</h3>
//                             <h3>Spending cumulative line graph unavailable until purchases are made. </h3>
//                             <MyBudgetOnlyLineChart/>
//                         </div>
//                     )}
//                 </div>
//             ) : (
//                 <div>
//                     <h3>Welcome {userObj?.fullName}!</h3>
//                     <p>Welcome to Budget Busters! We’re so happy to have you here. <br />
//                         1. You can get started on your account by clicking the settings icon and updating the profile page. <br />
//                         2. Then you can head to the notifications page to set the notifications to a specific time. <br />
//                         3. You can then head to Set Monthly Goal and set your monthly goals by completing the form. <br />
//                         4. Then with each day, you can head to Input Daily Spending and input your daily purchases. <br />
//                         5. To see a visual progress of your monthly goal and daily spending habits, you can access the homepage and Category Breakdown page.<br />
//                     </p>
//                     <h3>You have not set your budget goal for this month yet. Navigate to the Set Monthly Goal page to get started!</h3>
//                 </div>
//             )}
//         </div>
//     );
// }
//
// export default Home;
//
