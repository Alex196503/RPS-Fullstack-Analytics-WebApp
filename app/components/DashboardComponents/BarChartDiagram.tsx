import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export const BarChartDiagram = ({
  labels,
  barValues
}: {
  labels: string[]
  barValues: number[]
}) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const
      }
    }
  } as const
  const data = {
    labels,
    datasets: [
      {
        label: "Matches played",
        data: barValues,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
        categoryPercentage: 0.5,
        barPercentage: 0.6
      }
    ]
  }
  return <Bar options={options} data={data}></Bar>
}
