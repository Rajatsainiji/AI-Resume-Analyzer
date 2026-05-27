import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const data = [
    {
      name: "ATS Score",
      value: 80,
    },
    {
      name: "Remaining",
      value: 20,
    },
  ];

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-10">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-5">
        <div className="border p-5 rounded">
          <h2 className="text-xl font-bold">
            ATS Score
          </h2>

          <p className="text-5xl mt-5 font-bold">
            80%
          </p>
        </div>

        <div className="border p-5 rounded">
          <h2 className="text-xl font-bold">
            AI Detection
          </h2>

          <p className="text-5xl mt-5 font-bold">
            30%
          </p>
        </div>

        <div className="border p-5 rounded">
          <h2 className="text-xl font-bold">
            Skills Match
          </h2>

          <p className="text-5xl mt-5 font-bold">
            75%
          </p>
        </div>
      </div>

      <div className="mt-10 border p-5 rounded">
        <h2 className="text-2xl font-bold mb-5">
          ATS Overview
        </h2>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                outerRadius={100}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}