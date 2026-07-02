import { Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js"
ChartJS.register(ArcElement, Tooltip, Legend)

export const PieDiagram = ({
  chartStats,
  labels
}: {
  chartStats: number[]
  labels: string[]
}) => {
  const formattedLabels = labels.map(
    (label) => label.charAt(0).toUpperCase() + label.slice(1)
  )
  const data = {
    labels: formattedLabels,
    datasets: [
      {
        label: "Highlight of match outcomes",
        data: chartStats,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)"
        ],
        borderWidth: 1
      }
    ]
  }
  const optionsDesign = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true
    }
  }
  return <Pie data={data} options={optionsDesign} />
}
