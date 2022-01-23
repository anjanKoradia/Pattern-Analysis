import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type BarProps = {
  dataSet: {
    labelArray?: any;
    dataArray?: any;
    backgroundColor?: string[];
    borderColor?: string[];
    label?: string;
  };
  className?: string;
};

const BarChart = ({ dataSet, className }: BarProps) => {
  const data = {
    labels: dataSet.labelArray(),
    datasets: [
      {
        label: dataSet.label,
        data: dataSet.dataArray(),
        backgroundColor: dataSet.backgroundColor,
        borderColor: dataSet.borderColor,
        borderWidth: 2,
      },
    ],
  };

  return (
    <>
      <div className={className}>
        <div className="loader"></div>
      </div>
      <Bar data={data} />
    </>
  );
};

export default BarChart;
