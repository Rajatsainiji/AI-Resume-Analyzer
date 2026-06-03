// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
// } from "recharts";

// export default function Dashboard() {
//   const data = [
//     {
//       name: "ATS Score",
//       value: 80,
//     },
//     {
//       name: "Remaining",
//       value: 20,
//     },
//   ];

//   return (
//     <div className="p-10">
//       <h1 className="text-4xl font-bold mb-10">
//         Dashboard
//       </h1>

//       <div className="grid grid-cols-3 gap-5">
//         <div className="border p-5 rounded">
//           <h2 className="text-xl font-bold">
//             ATS Score
//           </h2>

//           <p className="text-5xl mt-5 font-bold">
//             80%
//           </p>
//         </div>

//         <div className="border p-5 rounded">
//           <h2 className="text-xl font-bold">
//             AI Detection
//           </h2>

//           <p className="text-5xl mt-5 font-bold">
//             30%
//           </p>
//         </div>

//         <div className="border p-5 rounded">
//           <h2 className="text-xl font-bold">
//             Skills Match
//           </h2>

//           <p className="text-5xl mt-5 font-bold">
//             75%
//           </p>
//         </div>
//       </div>

//       <div className="mt-10 border p-5 rounded">
//         <h2 className="text-2xl font-bold mb-5">
//           ATS Overview
//         </h2>

//         <div style={{ width: "100%", height: 300 }}>
//           <ResponsiveContainer>
//             <PieChart>
//               <Pie
//                 data={data}
//                 dataKey="value"
//                 outerRadius={100}
//               />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }


import {
  FileText,
  Brain,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Upload,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const scoreData = [
    { name: "Score", value: 82 },
    { name: "Remaining", value: 18 },
  ];

  const COLORS = ["#3B82F6", "#1E293B"];

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* HEADER */}
      <div className="border-b border-white/10 px-6 lg:px-10 py-5 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            ATS Dashboard
          </h1>

          <p className="text-gray-400">
            Resume Performance Overview
          </p>
        </div>

        <button className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 rounded-xl flex items-center gap-2">
          <Upload size={18} />
          Upload Resume
        </button>
      </div>

      <div className="p-6 lg:p-10">
        {/* WELCOME */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold mb-3">
            Welcome Back 👋
          </h2>

          <p className="text-gray-400">
            Analyze resumes and improve ATS score.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* ATS */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex justify-between">
              <FileText className="text-blue-400" />
              <TrendingUp className="text-green-400" />
            </div>

            <h3 className="text-gray-400 mt-5">
              ATS Score
            </h3>

            <h2 className="text-5xl font-bold mt-2">
              82%
            </h2>
          </div>

          {/* AI */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <Brain className="text-purple-400" />

            <h3 className="text-gray-400 mt-5">
              AI Detection
            </h3>

            <h2 className="text-5xl font-bold mt-2">
              22%
            </h2>
          </div>

          {/* SKILLS */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <Target className="text-cyan-400" />

            <h3 className="text-gray-400 mt-5">
              Skills Match
            </h3>

            <h2 className="text-5xl font-bold mt-2">
              78%
            </h2>
          </div>

          {/* JOB FIT */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <CheckCircle2 className="text-green-400" />

            <h3 className="text-gray-400 mt-5">
              Job Fit
            </h3>

            <h2 className="text-5xl font-bold mt-2">
              85%
            </h2>
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          {/* ATS OVERVIEW */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-6">
              ATS Overview
            </h2>

            <div className="h-[320px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={scoreData}
                    dataKey="value"
                    innerRadius={70}
                    outerRadius={110}
                  >
                    {scoreData.map(
                      (entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index]}
                        />
                      )
                    )}
                  </Pie>

                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="28"
                    fontWeight="bold"
                  >
                    82%
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI SUGGESTIONS */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-6">
              AI Suggestions
            </h2>

            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
                ✅ Add more technical keywords.
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                ⚠ Improve project descriptions.
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                💡 Include measurable achievements.
              </div>

              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                🚨 Reduce AI generated content.
              </div>
            </div>
          </div>
        </div>

        {/* KEYWORDS */}
        <div className="mt-10 bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-5">
            Missing Keywords
          </h2>

          <div className="flex flex-wrap gap-3">
            {[
              "Node.js",
              "MongoDB",
              "Docker",
              "AWS",
              "Redis",
              "CI/CD",
              "Microservices",
            ].map((skill) => (
              <span
                key={skill}
                className="bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* HISTORY */}
        <div className="mt-10 bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-6">
            Recent Analysis
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="pb-4">
                    Resume
                  </th>

                  <th className="pb-4">
                    ATS Score
                  </th>

                  <th className="pb-4">
                    AI Score
                  </th>

                  <th className="pb-4">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="py-4">
                    Resume_v3.pdf
                  </td>
                  <td>82%</td>
                  <td>22%</td>
                  <td>Today</td>
                </tr>

                <tr>
                  <td className="py-4">
                    Resume_v2.pdf
                  </td>
                  <td>76%</td>
                  <td>31%</td>
                  <td>Yesterday</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}