// ResponseChart.jsx - Survey responses ka Pie chart
// Recharts library use ki gayi hai
// Abhi dummy data hai - TODO: Props se real data pass karna hai
import { PieChart, Pie } from "recharts";

export default function ResponseChart() {
  // TODO: Yeh data props se aana chahiye
  const data = [
    { name: "Yes", value: 60 },
    { name: "No", value: 40 },
  ];

  return (
    // width/height Recharts mein pixels mein dena zaroori hai
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        dataKey="value" // Konsa field chart ki size determine karega
        outerRadius={100}
      />
    </PieChart>
  );
}
