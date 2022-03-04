import "./App.css";
import * as React from "react";

import { Pie } from "react-chartjs-2";


class PieChart extends React.Component {
  render() {
    return (
      <Pie
        // data={this.pie}
        data={{
          labels: this.props.pieLabels,
          datasets: [
            {
              // label: "Portfolio",
              backgroundColor: [
                "#ff6384",
                "#36a2eb",
                "#cc65fe",
                "#ffce56",
                "#B21F00",
                "#C9DE00",
                "#2FDE00",
                "#00A6B4",
                "#6800B4",
              ],
              data: this.props.pieData,
            },
          ],
        }}
        options={{
          plugins: {
            datalabels: {
              borderColor: "white",
              borderRadius: 25,
              borderWidth: 3,
              color: "white",
              font: {
                weight: "bold",
              },
              padding: 6,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    );
  }
}
export default PieChart;
