import { Doughnut } from "react-chartjs-2";

function TeamProgress() {
  const data = {
    labels: ["Completed", "In Progress", "Not Started"],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Team Progress</h2>
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

export default TeamProgress;
