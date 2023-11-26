import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, Scatter, ScatterChart, LineChart, ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid } from "recharts";

// hard coded - scatter plot daily total spending data
const data = [
  { x: 1, y: 11 },
  { x: 2, y: 39 },
  { x: 3, y: 25 },
  { x: 4, y: 140 },
  { x: 5, y: 130 },
  { x: 6, y: 75 },
];

// hard coded - cumulative line graph data
const pdata = [
  { name: "Day 1", currentTotal: 11, budgetLimit: 500 },
  { name: "Day 2", currentTotal: 50, budgetLimit: 500 },
  { name: "Day 3", currentTotal: 75, budgetLimit: 500 },
  { name: "Day 4", currentTotal: 215, budgetLimit: 500 },
  { name: "Day 5", currentTotal: 345, budgetLimit: 500 },
  { name: "Day 6", currentTotal: 420, budgetLimit: 500 },
];

class App extends React.Component {
  COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#808080"];

  // hardcoded - pie graph data
  pieData = [
    { name: "Rent", value: (150/500) * 100 },
    { name: "Groceries", value: (100/500) * 100 },
    { name: "Gym", value: (50/500) * 100 },
    { name: "Yet to spend", value: (200/500) * 100 }
  ];
  CustomTooltip = ({ active, payload, label }) => {
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
            <label>{`${payload[0].name} : ${payload[0].value}%`}</label>
          </div>
      );
    }
    return null;
  };

  render() {
    return (
        <div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1 className="text-heading">Monthly Spending by Category</h1>
            <PieChart width={730} height={300}>
              <Pie
                  data={this.pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  labelLine={false} // removing label lines for better visibility
                  label={(entry) => entry.name} // displaying category names as labels
              >
                {this.pieData?.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={this.COLORS[index % this.COLORS.length]}
                    />
                ))}
              </Pie>
              <Tooltip content={<this.CustomTooltip />} />
              <Legend /> // should we include the legend?
            </PieChart>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1 className="text-heading">Cumulative Monthly Spending Chart</h1>
            <ResponsiveContainer width="100%" aspect={3}>
              <LineChart data={pdata} margin={{ right: 30 }}> {/* Adjusted margin */}
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

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1 className="text-heading"> Total Spending By Day</h1>
            <ScatterChart width={400} height={400} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="x" name="Day" />
              <YAxis yAxisId="left" type="number" dataKey="y" name="Amount" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value, name, props) => [name === 'Amount' ? `$${value}` : value, name]} />
              <Scatter yAxisId="left" name="Amount" data={data} fill="#8884d8" />
            </ScatterChart>
          </div>
        </div>
    );
  }
}
export default App;
