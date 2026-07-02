import {
  Chart as ChartJS,
  CategoryScale,
  type TooltipItem,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"
import { Line } from "react-chartjs-2"
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export const LineChartDiagram = ({
  labels,
  results
}: {
  labels: string[]
  results: number[]
}) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            return `${context.dataset.label}: ${context.parsed.y}%`
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value: string | number) => value + "%"
        },
        min: 0,
        max: 100
      }
    }
  } as const

  const data = {
    labels,
    datasets: [
      {
        label: "Win rate:",
        data: results,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)"
      }
    ]
  }
  return <Line data={data} options={options} />
}
