import { useState } from "react";

function App() {
  const [algorithm, setAlgorithm] = useState("");

  const algorithms = [
    { value: "fcfs", label: "First Come First Serve" },
    { value: "sjfp", label: "Shortest Job First Preemptive" },
    { value: "sjfnp", label: "Shortest Job First Non-preemptive" },
    { value: "rr", label: "Round Robin" },
    { value: "psp", label: "Priority Scheduling Preemptive" },
    { value: "psnp", label: "Priority Scheduling Non-preemptive" },
  ];

  return (
    <>
      <div className="bg-black text-white py-6 px-4 sm:px-6 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          CPU SCHEDULING ALGORITHMS
        </h1>

        {/* Navigation Bar */}
        <nav className="flex flex-wrap justify-center mb-6 border-b border-gray-700 pb-4">
          <button
            onClick={() => setAlgorithm("")}
            className={`px-3 py-2 mx-1 my-1 rounded-lg transition-colors ${
              algorithm === ""
                ? "bg-white text-black font-medium"
                : "hover:bg-gray-800"
            }`}
          >
            Select Algorithm
          </button>

          {algorithms.map((alg) => (
            <button
              key={alg.value}
              onClick={() => setAlgorithm(alg.value)}
              className={`px-3 py-2 mx-1 my-1 rounded-lg transition-colors ${
                algorithm === alg.value
                  ? "bg-white text-black font-medium"
                  : "hover:bg-gray-800"
              }`}
            >
              {alg.label}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {algorithm === "fcfs" && <FirstComeFirstServe algorithm={algorithm} />}
        {algorithm === "sjfp" && (
          <ShortestJobFirstPreemptive algorithm={algorithm} />
        )}
        {algorithm === "sjfnp" && <ShortestJobFirst algorithm={algorithm} />}
        {algorithm === "rr" && <RoundRobinScheduler algorithm={algorithm} />}
        {algorithm === "psnp" && <PriorityScheduling algorithm={algorithm} />}
        {algorithm === "psp" && (
          <PrioritySchedulingPreemptive algorithm={algorithm} />
        )}
      </div>
    </>
  );
}

export default App;

// API for data fetching
export async function handleFinish(initialProcess, algorithm) {
  const res = await fetch("https://cpu-api-5.onrender.com/api/process", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      input_data: initialProcess,
      algorithm: algorithm,
    }),
  });
  const data = await res.json();
  return data;
}

export async function handleFinish2(initialProcess, algorithm, quantum) {
  const res = await fetch("https://cpu-api-5.onrender.com/api/process", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      input_data: initialProcess,
      algorithm: algorithm,
      quantum: quantum,
    }),
  });
  const data = await res.json();
  return data;
}

// FCFS (First Come First Serve)
// function FirstComeFirstServe({ algorithm }) {
//   const [burstInput, setBurstInput] = useState("");
//   const [finish, setFinish] = useState([]);
//   const [initialProcessses, setInitialProcessses] = useState([]);
//   const [processId, setProcessId] = useState("");
//   const [run, setRun] = useState(false);

//   const averageWaitingTime =
//     finish.reduce((acc, cur) => acc + cur.waiting_time, 0) /
//     initialProcessses.length;

//   const averageTurnTime =
//     finish.reduce((acc, cur) => acc + cur.turnaround_time, 0) /
//     initialProcessses.length;

//   async function handle() {
//     const data = await handleFinish(initialProcessses, algorithm);
//     setFinish(data);
//     setRun(true);
//   }

//   function handleAddProcess() {
//     if (!burstInput) return; // Do nothing if the input is empty
//     const bool = initialProcessses.find((item) => item.id === processId);
//     if (bool) return;

//     const newProcess = {
//       id: processId,
//       burst_time: burstInput,
//     };

//     setInitialProcessses((pro) => [...pro, newProcess]);
//     setBurstInput("");
//     setProcessId("");
//   }

//   function handleClear() {
//     setFinish([]);
//     setInitialProcessses([]);
//     setRun(false);
//   }

//   return (
//     <div className="min-h-screen bg-black flex flex-col items-center justify-center py-5 px-4 sm:px-2 md:px-8">
//       <h2 className="text-2xl font-semibold text-white mb-6 text-center">
//         First Come First Serve Algorithm
//       </h2>

//       {/* Initial process Table inputs */}
//       <div className="mb-6 w-full max-w-4xl">
//         <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-800">
//           <div className="flex items-center w-full sm:w-auto">
//             <p className="text-white mr-2 whitespace-nowrap">Process ID:</p>
//             <input
//               type="number"
//               value={processId}
//               onChange={(e) => setProcessId(Number(e.target.value))}
//               placeholder="Enter ID"
//               className="border border-gray-700 bg-gray-800 p-2 rounded-lg w-full text-white focus:outline-none focus:ring-2 focus:ring-white"
//             />
//           </div>

//           <div className="flex items-center w-full sm:w-auto">
//             <p className="text-white mr-2 whitespace-nowrap">Burst Time:</p>
//             <input
//               type="number"
//               value={burstInput}
//               onChange={(e) => setBurstInput(Number(e.target.value))}
//               placeholder="Enter time"
//               className="border border-gray-700 bg-gray-800 p-2 rounded-lg w-full text-white focus:outline-none focus:ring-2 focus:ring-white"
//             />
//           </div>

//           {burstInput > 0 && (
//             <button
//               onClick={handleAddProcess}
//               className="bg-white text-black p-2 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-white transition-colors w-full sm:w-auto font-medium"
//             >
//               Add Process
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Initial Process Table */}
//       {initialProcessses.length > 0 && (
//         <div className="w-full max-w-4xl mx-auto mt-4 bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-800">
//           <h3 className="text-lg font-medium mb-2 text-white">Process List</h3>
//           <div className="overflow-x-auto">
//             <table className="w-full table-auto border-collapse">
//               <thead>
//                 <tr className="bg-gray-800">
//                   <th className="border border-gray-700 p-2 text-left text-white">
//                     Process ID
//                   </th>
//                   <th className="border border-gray-700 p-2 text-left text-white">
//                     Burst Time
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {initialProcessses.map((process) => (
//                   <tr
//                     key={process.id}
//                     className="odd:bg-gray-900 even:bg-gray-800 hover:bg-gray-700 transition-colors"
//                   >
//                     <td className="border border-gray-700 p-2 text-white">
//                       P{process.id}
//                     </td>
//                     <td className="border border-gray-700 p-2 text-white">
//                       {process.burst_time}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {initialProcessses?.length > 1 && (
//         <button
//           disabled={run}
//           onClick={handle}
//           className="bg-white text-black p-2 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-white mt-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
//         >
//           Simulate
//         </button>
//       )}

//       {/* Results Section */}
//       {run && (
//         <div className="w-full max-w-4xl mt-8">
//           <h3 className="text-xl font-medium mb-4 text-white text-center">
//             Simulation Results
//           </h3>

//           {/* Final Process table */}
//           <div className="bg-gray-900 p-4 rounded-lg shadow-lg mb-6 border border-gray-800">
//             <h4 className="text-lg font-medium mb-2 text-white">
//               Process Details
//             </h4>
//             <div className="overflow-x-auto">
//               <table className="w-full table-auto border-collapse">
//                 <thead>
//                   <tr className="bg-gray-800">
//                     <th className="border border-gray-700 p-2 text-left text-white">
//                       Process ID
//                     </th>
//                     <th className="border border-gray-700 p-2 text-left text-white">
//                       Waiting Time
//                     </th>
//                     <th className="border border-gray-700 p-2 text-left text-white">
//                       Turnaround Time
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {finish?.map((process) => (
//                     <tr
//                       key={process.id}
//                       className="odd:bg-gray-900 even:bg-gray-800 hover:bg-gray-700 transition-colors"
//                     >
//                       <td className="border border-gray-700 p-2 text-white">
//                         P{process.id}
//                       </td>
//                       <td className="border border-gray-700 p-2 text-white">
//                         {process.waiting_time}
//                       </td>
//                       <td className="border border-gray-700 p-2 text-white">
//                         {process.turnaround_time}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Gantt chart table summary */}
//           <div className="bg-gray-900 p-4 rounded-lg shadow-lg mb-6 border border-gray-800">
//             <h4 className="text-lg font-medium mb-2 text-white">
//               Gantt Chart Summary
//             </h4>
//             <div className="overflow-x-auto">
//               <table className="w-full table-auto border-collapse">
//                 <thead>
//                   <tr className="bg-gray-800">
//                     <th className="border border-gray-700 p-2 text-left text-white">
//                       Process ID
//                     </th>
//                     <th className="border border-gray-700 p-2 text-left text-white">
//                       Gantt Summary
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {finish?.map((process) => (
//                     <tr
//                       key={process.id}
//                       className="odd:bg-gray-900 even:bg-gray-800 hover:bg-gray-700 transition-colors"
//                     >
//                       <td className="border border-gray-700 p-2 text-white">
//                         P{process.id}
//                       </td>
//                       <td className="border border-gray-700 p-2 text-white">
//                         ({process.waiting_time} - {process.turnaround_time})
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Average Times */}
//           <div className="bg-gray-900 p-4 rounded-lg shadow-lg mb-6 text-center border border-gray-800">
//             <p className="text-white font-medium">
//               Average Waiting Time:{" "}
//               <span className="font-bold">{averageWaitingTime.toFixed(2)}</span>
//             </p>
//             <p className="text-white font-medium mt-2">
//               Average Turnaround Time:{" "}
//               <span className="font-bold">{averageTurnTime.toFixed(2)}</span>
//             </p>
//           </div>

//           <div className="text-center">
//             <button
//               onClick={handleClear}
//               className="bg-white text-black p-2 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors font-medium"
//             >
//               Clear All Processes
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

function FirstComeFirstServe({ algorithm }) {
  const [burstInput, setBurstInput] = useState("");
  const [finish, setFinish] = useState([]);
  const [initialProcessses, setInitialProcessses] = useState([]);
  const [processId, setProcessId] = useState("");
  const [run, setRun] = useState(false);

  const averageWaitingTime =
    finish.reduce((acc, cur) => acc + cur.waiting_time, 0) /
    initialProcessses.length;

  const averageTurnTime =
    finish.reduce((acc, cur) => acc + cur.turnaround_time, 0) /
    initialProcessses.length;

  async function handle() {
    const data = await handleFinish(initialProcessses, algorithm);
    setFinish(data);
    setRun(true);
  }

  function handleAddProcess() {
    if (!burstInput) return; // Do nothing if the input is empty
    const bool = initialProcessses.find((item) => item.id === processId);
    if (bool) return;

    const newProcess = {
      id: processId,
      burst_time: burstInput,
    };

    setInitialProcessses((pro) => [...pro, newProcess]);
    setBurstInput("");
    setProcessId("");
  }

  function handleClear() {
    setFinish([]);
    setInitialProcessses([]);
    setRun(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center py-5 px-3 sm:px-4 md:px-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-purple-400 mb-6 text-center">
        First Come First Serve Algorithm
      </h2>

      {/* Initial process Table inputs */}
      <div className="mb-6 w-full max-w-3xl">
        <div className="flex flex-col space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
            <p className="text-gray-300 mb-1 sm:mb-0 sm:w-24">Process ID:</p>
            <input
              type="number"
              value={processId}
              onChange={(e) => setProcessId(Number(e.target.value))}
              placeholder="Enter process id"
              className="border p-2 rounded-lg w-full bg-gray-800 border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
            <p className="text-gray-300 mb-1 sm:mb-0 sm:w-24">Burst Time:</p>
            <input
              type="number"
              value={burstInput}
              onChange={(e) => setBurstInput(Number(e.target.value))}
              placeholder="Enter burst time"
              className="border p-2 rounded-lg w-full bg-gray-800 border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex justify-center sm:justify-end mt-2">
            {burstInput > 0 && (
              <button
                onClick={handleAddProcess}
                className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              >
                Add Process
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Initial Process Table */}
      {initialProcessses.length > 0 && (
        <div className="w-full max-w-3xl mx-auto mt-6 bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-purple-400 text-lg mb-3">Process List</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-2 text-left">
                    Process ID
                  </th>
                  <th className="border border-gray-600 p-2 text-left">
                    Burst Time
                  </th>
                </tr>
              </thead>

              <tbody>
                {initialProcessses.map((process) => (
                  <tr key={process.id} className="odd:bg-gray-750">
                    <td className="border border-gray-600 p-2">
                      P{process.id}
                    </td>
                    <td className="border border-gray-600 p-2">
                      {process.burst_time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {initialProcessses?.length > 1 && (
        <button
          disabled={run}
          onClick={handle}
          className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 mt-6 transition-colors disabled:opacity-50"
        >
          Simulate
        </button>
      )}

      {/* Final Process table */}
      {run && (
        <div className="w-full max-w-3xl mx-auto mt-8 bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-purple-400 text-lg mb-3">Results Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-2 text-left">
                    Process ID
                  </th>
                  <th className="border border-gray-600 p-2 text-left">
                    Waiting Time
                  </th>
                  <th className="border border-gray-600 p-2 text-left">
                    Turnaround Time
                  </th>
                </tr>
              </thead>

              <tbody>
                {finish?.map((process) => (
                  <tr key={process.id} className="odd:bg-gray-750">
                    <td className="border border-gray-600 p-2">
                      P{process.id}
                    </td>
                    <td className="border border-gray-600 p-2">
                      {process.waiting_time}
                    </td>
                    <td className="border border-gray-600 p-2">
                      {process.turnaround_time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Gantt chart table summary */}
      {run && (
        <div className="w-full max-w-3xl mx-auto mt-6 bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-purple-400 text-lg mb-3">Gantt Summary Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-2 text-left">
                    Process ID
                  </th>
                  <th className="border border-gray-600 p-2 text-left">
                    Gantt summary
                  </th>
                </tr>
              </thead>

              <tbody>
                {finish?.map((process) => (
                  <tr key={process.id} className="odd:bg-gray-750">
                    <td className="border border-gray-600 p-2">
                      P{process.id}
                    </td>
                    <td className="border border-gray-600 p-2">
                      ({process.waiting_time} - {process.turnaround_time})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {run && (
        <div className="w-full max-w-3xl mx-auto mt-6 flex flex-col sm:flex-row justify-between items-center bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
          <div>
            <p className="text-purple-400 mb-2">
              Average waiting time:{" "}
              <span className="text-white font-medium">
                {averageWaitingTime.toFixed(2)}
              </span>
            </p>
            <p className="text-purple-400">
              Average Turnaround time:{" "}
              <span className="text-white font-medium">
                {averageTurnTime.toFixed(2)}
              </span>
            </p>
          </div>

          <button
            onClick={handleClear}
            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mt-4 sm:mt-0 transition-colors"
          >
            Clear All Processes
          </button>
        </div>
      )}
    </div>
  );
}

function ShortestJobFirstPreemptive({ algorithm }) {
  const [burstInput, setBurstInput] = useState("");
  const [arrival_time, setArrival_time] = useState("");
  const [processId, setProcessId] = useState("");
  const [run, setRun] = useState(false);
  const [initialProcess, setInitialProcess] = useState([]);
  const [finish, setFinish] = useState([]);
  const [finishTimeLine, setFinishTimeLine] = useState([]);

  const averageWaitingTime =
    finish?.reduce((acc, cur) => acc + cur.waiting_time, 0) /
    initialProcess.length;

  const averageTurnTime =
    finish?.reduce((acc, cur) => acc + cur.turnaround_time, 0) /
    initialProcess.length;

  async function handle() {
    const data = await handleFinish(initialProcess, algorithm);
    console.log(data);
    setFinish(data[0].processes);
    setFinishTimeLine(data[0].timeline);
    setRun(true);
  }

  function handleAddProcess(burstInput) {
    if (!burstInput || !processId) return;
    const bool = initialProcess.find((item) => item.id === processId);
    if (bool) return;
    const newProcess = {
      id: processId,
      arrival_time: arrival_time,
      burst_time: burstInput,
    };
    setInitialProcess((item) => [...item, newProcess]);
    setBurstInput("");
    setArrival_time("");
    setProcessId("");
  }

  function handleClear() {
    setFinish([]);
    setInitialProcess([]);
    setRun(false);
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gray-900 text-gray-200">
      <h2 className="text-2xl sm:text-3xl font-semibold text-purple-400 mb-6 text-center">
        Shortest Job First Preemptive
      </h2>

      {/* Initial Process input */}
      <div className="mb-6 w-full max-w-4xl mx-auto">
        <div className="flex flex-col space-y-3 md:space-y-0 md:grid md:grid-cols-7 md:gap-3">
          <input
            type="number"
            value={processId}
            onChange={(e) => setProcessId(Number(e.target.value))}
            placeholder="Enter process id"
            className="border p-2 rounded-md bg-gray-800 border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 md:col-span-2"
          />

          <input
            type="number"
            value={arrival_time}
            onChange={(e) => setArrival_time(Number(e.target.value))}
            placeholder="Enter arrival time"
            className="border p-2 rounded-md bg-gray-800 border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 md:col-span-2"
          />

          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 md:col-span-6">
            <input
              type="number"
              value={burstInput}
              onChange={(e) => setBurstInput(Number(e.target.value))}
              placeholder="Enter burst time"
              className="border p-2 rounded-md bg-gray-800 border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-grow"
            />
            {burstInput > 0 && (
              <button
                onClick={() => handleAddProcess(burstInput)}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              >
                Add Process
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Initial Process Table */}
      {initialProcess.length > 0 && (
        <div className="mt-6 mb-6 overflow-x-auto bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 max-w-4xl mx-auto">
          <h3 className="text-purple-400 text-lg mb-3">Process List</h3>
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="border border-gray-600 p-2 text-left">
                  Process ID
                </th>
                <th className="border border-gray-600 p-2 text-left">
                  Arrival Time
                </th>
                <th className="border border-gray-600 p-2 text-left">
                  Burst Time
                </th>
              </tr>
            </thead>
            <tbody>
              {initialProcess.map((process) => (
                <tr
                  key={process.id}
                  className="odd:bg-gray-750 hover:bg-gray-700 transition-colors"
                >
                  <td className="border border-gray-600 p-2">P{process.id}</td>
                  <td className="border border-gray-600 p-2">
                    {process.arrival_time}
                  </td>
                  <td className="border border-gray-600 p-2">
                    {process.burst_time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {initialProcess.length > 1 && (
        <div className="text-center mt-4">
          <button
            disabled={run}
            onClick={handle}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors disabled:opacity-50"
          >
            Simulate
          </button>
        </div>
      )}

      {/* Final Process Table */}
      {run && (
        <div className="mt-6 mb-6 overflow-x-auto bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 max-w-4xl mx-auto">
          <h3 className="text-purple-400 text-lg mb-3">Results Table</h3>
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="border border-gray-600 p-2 text-left">
                  Process ID
                </th>
                <th className="border border-gray-600 p-2 text-left">
                  Arrival Time
                </th>
                <th className="border border-gray-600 p-2 text-left">
                  Burst Time
                </th>
                <th className="border border-gray-600 p-2 text-left">
                  End Time
                </th>
              </tr>
            </thead>
            <tbody>
              {finish?.map((process) => (
                <tr
                  key={process.id}
                  className="odd:bg-gray-750 hover:bg-gray-700 transition-colors"
                >
                  <td className="border border-gray-600 p-2">P{process.id}</td>
                  <td className="border border-gray-600 p-2">
                    {process.arrival_time}
                  </td>
                  <td className="border border-gray-600 p-2">
                    {process.burst_time}
                  </td>
                  <td className="border border-gray-600 p-2">
                    {process.completion_time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Gantt summary */}
      {run && (
        <div className="mt-6 mb-6 overflow-x-auto bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 max-w-4xl mx-auto">
          <h3 className="text-purple-400 text-lg mb-3">Gantt Chart Summary</h3>
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="border border-gray-600 p-2 text-left">
                  Process ID
                </th>
                <th className="border border-gray-600 p-2 text-left">
                  Gantt Summary
                </th>
              </tr>
            </thead>
            <tbody>
              {finishTimeLine?.map((process) => (
                <tr
                  key={process.id}
                  className="odd:bg-gray-750 hover:bg-gray-700 transition-colors"
                >
                  <td className="border border-gray-600 p-2">P{process.id}</td>
                  <td className="border border-gray-600 p-2">
                    ({process.start_time} - {process.end_time})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {run && (
        <div className="mt-6 mb-6 bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <p className="text-purple-400">
                Average waiting time:{" "}
                <span className="text-white font-medium">
                  {averageWaitingTime.toFixed(2)}
                </span>
              </p>
              <p className="text-purple-400 mt-2">
                Average Turnaround time:{" "}
                <span className="text-white font-medium">
                  {averageTurnTime.toFixed(2)}
                </span>
              </p>
            </div>

            <button
              onClick={handleClear}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              Delete All Processes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ShortestJobFirst({ algorithm }) {
  const [burstInput, setBurstInput] = useState("");
  const [processId, setProcessId] = useState("");
  const [initialProcess, setInitialProcess] = useState([]);
  const [finish, setFinish] = useState([]);
  const [run, setRun] = useState(false);

  const averageWaitingTime =
    finish?.reduce((acc, cur) => acc + cur.waiting_time, 0) /
    initialProcess.length;

  const averageTurnTime =
    finish?.reduce((acc, cur) => acc + cur.turnaround_time, 0) /
    initialProcess.length;

  async function handle() {
    const data = await handleFinish(initialProcess, algorithm);
    setFinish(data);
    setRun(true);
  }

  function handleAddProcess() {
    if (!burstInput || !processId) return;
    const bool = initialProcess.find((item) => item.id === processId);
    if (bool) return;

    const newProcess = {
      id: processId,
      burst_time: burstInput,
    };
    setInitialProcess((item) => [...item, newProcess]);
    setBurstInput("");
    setProcessId("");
  }

  function handleClear() {
    setFinish([]);
    setInitialProcess([]);
    setRun(false);
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-black text-gray-200 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-semibold text-purple-400 mb-6 text-center">
        Shortest Job First Non-Preemptive
      </h2>

      {/* Initial Process Input Fields */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
          <input
            type="number"
            value={processId}
            onChange={(e) => setProcessId(Number(e.target.value))}
            placeholder="Enter process id"
            className="border bg-gray-800 p-2 rounded-md w-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div className="flex space-x-2">
            <input
              type="number"
              value={burstInput}
              onChange={(e) => setBurstInput(Number(e.target.value))}
              placeholder="Enter burst time"
              className="border bg-gray-800 p-2 rounded-md w-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {burstInput > 0 && (
              <button
                onClick={handleAddProcess}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 whitespace-nowrap"
              >
                Add Process
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Initial Process Table */}
      {initialProcess.length > 0 && (
        <div className="mt-6 mb-6 overflow-x-auto bg-gray-900 p-3 rounded-lg shadow-lg border border-gray-700">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 p-2 text-left text-purple-400">
                  Process ID
                </th>
                <th className="border border-gray-700 p-2 text-left text-purple-400">
                  Burst Time
                </th>
              </tr>
            </thead>
            <tbody>
              {initialProcess.map((process) => (
                <tr key={process.id} className="hover:bg-gray-800">
                  <td className="border border-gray-700 p-2">P{process.id}</td>
                  <td className="border border-gray-700 p-2">
                    {process.burst_time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Run Button */}
      {initialProcess.length > 1 && (
        <div className="text-center mt-4">
          <button
            disabled={run}
            onClick={handle}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Simulate
          </button>
        </div>
      )}

      {/* Final Process Table */}
      {run && <p className="mt-6 text-purple-400 font-medium">Results table</p>}
      {run && (
        <div className="mt-2 mb-6 overflow-x-auto bg-gray-900 p-3 rounded-lg shadow-lg border border-gray-700">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 p-2 text-left text-purple-400">
                  Process ID
                </th>
                <th className="border border-gray-700 p-2 text-left text-purple-400">
                  Waiting Time
                </th>
                <th className="border border-gray-700 p-2 text-left text-purple-400">
                  Turnaround Time
                </th>
              </tr>
            </thead>
            <tbody>
              {finish?.map((process) => (
                <tr key={process.id} className="hover:bg-gray-800">
                  <td className="border border-gray-700 p-2">P{process.id}</td>
                  <td className="border border-gray-700 p-2">
                    {process.waiting_time}
                  </td>
                  <td className="border border-gray-700 p-2">
                    {process.turnaround_time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Gantt Chart Summary */}
      {run && (
        <p className="text-purple-400 font-medium">Gantt Chart Summary</p>
      )}
      {run && (
        <div className="mt-2 mb-6 overflow-x-auto bg-gray-900 p-3 rounded-lg shadow-lg border border-gray-700">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 p-2 text-left text-purple-400">
                  Process ID
                </th>
                <th className="border border-gray-700 p-2 text-left text-purple-400">
                  Gantt Summary
                </th>
              </tr>
            </thead>
            <tbody>
              {finish?.map((process) => (
                <tr key={process.id} className="hover:bg-gray-800">
                  <td className="border border-gray-700 p-2">P{process.id}</td>
                  <td className="border border-gray-700 p-2">
                    ({process.waiting_time} - {process.turnaround_time})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Average Times */}
      {run && (
        <div className="text-center mt-4 text-purple-300">
          <p>Average Waiting Time: {averageWaitingTime.toFixed(2)}</p>
          <p>Average Turnaround Time: {averageTurnTime.toFixed(2)}</p>
        </div>
      )}

      {/* Clear Button */}
      {run && (
        <div className="text-center mt-6">
          <button
            onClick={handleClear}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete All Processes
          </button>
        </div>
      )}
    </div>
  );
}

function PrioritySchedulingPreemptive({ algorithm }) {
  const [processId, setProcessId] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [burstInput, setBurstInput] = useState("");
  const [priority, setPriority] = useState("");
  const [processes, setProcesses] = useState([]);
  const [finish, setFinish] = useState([]);
  const [finishTimeLine, setFinishTimeLine] = useState([]);
  const [run, setRun] = useState(false);

  const averageWaitingTime =
    finish?.reduce((acc, cur) => acc + cur.waiting_time, 0) / processes.length;

  const averageTurnTime =
    finish?.reduce((acc, cur) => acc + cur.turnaround_time, 0) /
    processes.length;

  async function handle() {
    const data = await handleFinish(processes, algorithm);
    setFinish(data[1]);
    setFinishTimeLine(data[0]);
    setRun(true);
  }

  function handleClearProcess() {
    setProcesses([]);
    setFinish([]);
    setRun(false);
  }

  function handleAddProcess() {
    if (!burstInput || !priority || !processId || processId < 0) return;
    const bool = processes.find((item) => item.id === processId);
    if (bool) return;
    const newProcess = {
      id: processId,
      arrival_time: arrivalTime,
      burst_time: burstInput,
      priority: priority,
    };
    setProcesses((id) => [...id, newProcess]);
    setBurstInput("");
    setPriority("");
    setProcessId("");
    setArrivalTime("");
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-black text-gray-200 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-semibold text-purple-400 mb-6 text-center">
        Priority Scheduling Algorithm Preemptive
      </h2>

      {/* Process Input Fields */}
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center">
            <span className="text-gray-300 mr-2">Process Id:</span>
            <input
              type="number"
              value={processId}
              onChange={(e) => setProcessId(Number(e.target.value))}
              placeholder="Enter Process ID"
              className="border border-gray-700 bg-gray-800 p-2 rounded-md w-full text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="number"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(Number(e.target.value))}
              placeholder="Enter Arrival Time"
              className="border border-gray-700 bg-gray-800 p-2 rounded-md w-full text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="number"
              value={burstInput}
              onChange={(e) => setBurstInput(Number(e.target.value))}
              placeholder="Enter Burst Time"
              className="border border-gray-700 bg-gray-800 p-2 rounded-md w-full text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="number"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              placeholder="Enter Priority"
              className="border border-gray-700 bg-gray-800 p-2 rounded-md w-full text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {burstInput > 0 && (
            <button
              onClick={handleAddProcess}
              className="bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 col-span-1 sm:col-span-2 md:col-span-4"
            >
              Add Process
            </button>
          )}
        </div>
      </div>

      {/* Process Table */}
      {processes?.length > 0 && (
        <div className="mt-6 overflow-x-auto bg-gray-900 p-2 rounded-lg border border-gray-700">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 p-2 text-left text-purple-400">
                  Process ID
                </th>
                <th className="border border-gray-700 p-2 text-left text-purple-400">
                  Arrival Time
                </th>
                <th className="border border-gray-700 p-2 text-left text-purple-400">
                  Burst Time
                </th>
                <th className="border border-gray-700 p-2 text-left text-purple-400">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process) => (
                <tr key={process.id} className="hover:bg-gray-800">
                  <td className="border border-gray-700 p-2">P{process.id}</td>
                  <td className="border border-gray-700 p-2">
                    {process.arrival_time}
                  </td>
                  <td className="border border-gray-700 p-2">
                    {process.burst_time}
                  </td>
                  <td className="border border-gray-700 p-2">
                    {process.priority}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Run Button */}
      {processes.length > 1 && (
        <button
          disabled={run}
          onClick={handle}
          className="bg-purple-600 text-white p-2 rounded-md mt-6 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 w-full sm:w-auto"
        >
          Simulate
        </button>
      )}

      {/* Final Results */}
      {run && <p className="mt-6 text-purple-400 font-medium">Results Table</p>}
      {run && (
        <div className="mt-2">
          <div className="overflow-x-auto bg-gray-900 p-2 rounded-lg border border-gray-700">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-700 p-2 text-left text-purple-400">
                    Process ID
                  </th>
                  <th className="border border-gray-700 p-2 text-left text-purple-400">
                    Arrival Time
                  </th>
                  <th className="border border-gray-700 p-2 text-left text-purple-400">
                    Burst Time
                  </th>
                  <th className="border border-gray-700 p-2 text-left text-purple-400">
                    End Time
                  </th>
                  <th className="border border-gray-700 p-2 text-left text-purple-400">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody>
                {finish?.map((process) => (
                  <tr key={process.id} className="hover:bg-gray-800">
                    <td className="border border-gray-700 p-2">
                      P{process.id}
                    </td>
                    <td className="border border-gray-700 p-2">
                      {process.arrival_time}
                    </td>
                    <td className="border border-gray-700 p-2">
                      {process.burst_time}
                    </td>
                    <td className="border border-gray-700 p-2">
                      {process.completion_time}
                    </td>
                    <td className="border border-gray-700 p-2">
                      {process.priority}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Gantt Chart Summary */}
          <p className="mt-6 text-purple-400 font-medium">
            Gantt Chart Summary
          </p>
          <div className="overflow-x-auto bg-gray-900 p-2 rounded-lg mt-2 border border-gray-700">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-700 p-2 text-left text-purple-400">
                    Process ID
                  </th>
                  <th className="border border-gray-700 p-2 text-left text-purple-400">
                    Gantt Summary
                  </th>
                </tr>
              </thead>
              <tbody>
                {finishTimeLine?.map((process, index) => (
                  <tr key={index} className="hover:bg-gray-800">
                    <td className="border border-gray-700 p-2">
                      P{process.id}
                    </td>
                    <td className="border border-gray-700 p-2">
                      ({process.start_time} - {process.end_time})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Average Times */}
          <div className="mt-6 text-center text-purple-300">
            <p>Average Waiting Time: {averageWaitingTime.toFixed(2)}</p>
            <p>Average Turnaround Time: {averageTurnTime.toFixed(2)}</p>
          </div>
          {/* Clear Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleClearProcess}
              className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete All Processes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PriorityScheduling({ algorithm }) {
  const [processId, setProcessId] = useState("");
  const [burstInput, setBurstInput] = useState("");
  const [priority, setPriority] = useState("");
  const [processes, setProcesses] = useState([]);
  const [finish, setFinish] = useState([]);
  const [run, setRun] = useState(false);

  const averageWaitingTime =
    finish?.reduce((acc, cur) => acc + cur.waiting_time, 0) / processes.length;

  const averageTurnTime =
    finish?.reduce((acc, cur) => acc + cur.turnaround_time, 0) /
    processes.length;

  async function handle() {
    const data = await handleFinish(processes, algorithm);
    setFinish(data);
    setRun(true);
  }

  function handleClearProcess() {
    setProcesses([]);
    setRun(false);
    setFinish([]);
  }

  function handleAddProcess() {
    if (!burstInput || !priority || !processId) return;
    const bool = processes.find((item) => item.id === processId);
    if (bool) return;
    const newProcess = {
      id: processId,
      burst_time: burstInput,
      Priority: priority,
    };
    setProcesses((id) => [...id, newProcess]);
    setBurstInput("");
    setPriority("");
    setProcessId("");
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-black text-gray-200 rounded-lg shadow-xl">
      <h2 className="text-2xl sm:text-3xl font-semibold text-purple-400 mb-4 sm:mb-6">
        Priority Scheduling Algorithm Non Preemptive
      </h2>

      {/* Initial Process Input */}
      <div className="mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
          <span className="flex items-center text-gray-300 md:col-span-1">
            Process ID:
          </span>
          <input
            type="number"
            value={processId}
            onChange={(e) => setProcessId(Number(e.target.value))}
            placeholder="Enter Process ID"
            className="bg-gray-800 border border-gray-700 p-2 rounded-md md:col-span-1 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />

          <span className="flex items-center text-gray-300 md:col-span-1">
            Burst Time:
          </span>
          <input
            type="number"
            value={burstInput}
            onChange={(e) => setBurstInput(Number(e.target.value))}
            placeholder="Enter Burst Time"
            className="bg-gray-800 border border-gray-700 p-2 rounded-md md:col-span-1 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />

          <span className="flex items-center text-gray-300 md:col-span-1">
            Priority:
          </span>
          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            placeholder="Enter Priority"
            className="bg-gray-800 border border-gray-700 p-2 rounded-md md:col-span-1 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />

          {burstInput > 0 && (
            <button
              onClick={handleAddProcess}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 mt-2 sm:mt-0 sm:col-span-2 md:col-span-6"
            >
              Add Process
            </button>
          )}
        </div>
      </div>

      {/* Process Table */}
      {processes?.length > 0 && (
        <div className="mt-4 sm:mt-6 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 p-2 sm:p-3 text-left text-purple-400">
                  Process ID
                </th>
                <th className="border border-gray-700 p-2 sm:p-3 text-left text-purple-400">
                  Burst Time
                </th>
                <th className="border border-gray-700 p-2 sm:p-3 text-left text-purple-400">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process) => (
                <tr key={process.id} className="hover:bg-gray-900">
                  <td className="border border-gray-700 p-2 sm:p-3">
                    P{process.id}
                  </td>
                  <td className="border border-gray-700 p-2 sm:p-3">
                    {process.burst_time}
                  </td>
                  <td className="border border-gray-700 p-2 sm:p-3">
                    {process.Priority}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Run Button */}
      {processes.length > 1 && (
        <button
          onClick={handle}
          disabled={run}
          className="bg-purple-600 text-white px-4 py-2 rounded-md w-full sm:w-auto mt-4 sm:mt-6 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Simulate
        </button>
      )}

      {/* Final Results */}
      {run && (
        <div className="mt-4 sm:mt-6">
          <table className="min-w-full border-collapse border border-gray-700 rounded-lg overflow-hidden overflow-x-auto">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 p-2 sm:p-3 text-left text-purple-400">
                  Process ID
                </th>
                <th className="border border-gray-700 p-2 sm:p-3 text-left text-purple-400">
                  Waiting Time
                </th>
                <th className="border border-gray-700 p-2 sm:p-3 text-left text-purple-400">
                  Turnaround Time
                </th>
              </tr>
            </thead>
            <tbody>
              {finish?.map((process) => (
                <tr key={process.id} className="hover:bg-gray-900">
                  <td className="border border-gray-700 p-2 sm:p-3">
                    P{process.id}
                  </td>
                  <td className="border border-gray-700 p-2 sm:p-3">
                    {process.waiting_time}
                  </td>
                  <td className="border border-gray-700 p-2 sm:p-3">
                    {process.turnaround_time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Gantt Chart Summary */}
          <p className="mt-4 text-purple-400 font-medium">
            Gantt Chart Summary
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-700 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-700 p-2 sm:p-3 text-left text-purple-400">
                    Process ID
                  </th>
                  <th className="border border-gray-700 p-2 sm:p-3 text-left text-purple-400">
                    Gantt Summary
                  </th>
                </tr>
              </thead>
              <tbody>
                {finish?.map((process) => (
                  <tr key={process.id} className="hover:bg-gray-900">
                    <td className="border border-gray-700 p-2 sm:p-3">
                      P{process.id}
                    </td>
                    <td className="border border-gray-700 p-2 sm:p-3">
                      ({process.waiting_time} - {process.turnaround_time})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Average Waiting and Turnaround Times */}
          <div className="mt-4 text-center">
            <p className="text-purple-400">
              Average Waiting Time:{" "}
              <span className="text-white">
                {averageWaitingTime.toFixed(2)}
              </span>
            </p>
            <p className="text-purple-400">
              Average Turnaround Time:{" "}
              <span className="text-white">{averageTurnTime.toFixed(2)}</span>
            </p>
          </div>

          {/* Clear All Processes Button */}
          <div className="mt-4 text-center">
            <button
              onClick={handleClearProcess}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete All Processes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const RoundRobinScheduler = ({ algorithm }) => {
  const [processId, setProcessId] = useState("");
  const [burst_time, setBurst_time] = useState("");
  const [finalQuantum, setFinalQuantum] = useState("");
  const [finish, setFinish] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [run, setRun] = useState(false);

  let groupedData = finish?.reduce((acc, obj) => {
    if (!acc[obj.pid]) {
      acc[obj.pid] = [];
    }
    acc[obj.pid].push(obj.end);
    return acc;
  }, {});
  let maxValues = Object.values(groupedData).map((arr) => Math.max(...arr));
  let avgWaitingTime =
    maxValues.reduce((sum, val) => sum + val, 0) / maxValues.length;

  function addProcess() {
    if (!burst_time || burst_time < 1 || processId < 0) return;
    const exists = processes.find((item) => item.id === processId);
    if (exists) return;

    const newProcess = { id: processId, burst_time: burst_time };
    setProcesses((prev) => [...prev, newProcess]);
    setBurst_time("");
    setProcessId("");
  }

  function handleClearProcess() {
    setProcesses([]);
    setProcessId("");
    setBurst_time("");
    setFinish([]);
    setRun(false);
    setFinalQuantum("");
  }

  async function handleRun() {
    if (!finalQuantum) return;
    const data = await handleFinish2(processes, algorithm, finalQuantum);
    setFinish(data);
    setRun(true);
  }

  return (
    <div className="p-6 w-full min-h-screen bg-black text-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-300">
        Round Robin Scheduler
      </h2>

      {/* Process Input Fields */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="number"
          value={processId}
          onChange={(e) => setProcessId(Number(e.target.value))}
          placeholder="Process ID"
          className="border p-3 rounded-md w-full bg-gray-800 text-white focus:ring-2 focus:ring-gray-500"
        />

        <input
          type="number"
          value={burst_time}
          onChange={(e) => setBurst_time(Number(e.target.value))}
          placeholder="Burst Time"
          className="border p-3 rounded-md w-full bg-gray-800 text-white focus:ring-2 focus:ring-gray-500"
        />
        <button
          disabled={run}
          onClick={addProcess}
          className="bg-gray-700 text-white p-3 rounded-md w-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-500"
        >
          Add Process
        </button>
      </div>

      {/* Quantum Input */}
      <div className="mb-6">
        <input
          type="number"
          value={finalQuantum}
          onChange={(e) => setFinalQuantum(Number(e.target.value))}
          placeholder="Quantum Time"
          className="border p-3 rounded-md w-full bg-gray-800 text-white focus:ring-2 focus:ring-gray-500"
        />
      </div>

      {/* Processes Table */}
      {processes.length > 0 && (
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-600">
            <thead>
              <tr className="bg-gray-800">
                <th className="border p-3 text-left text-gray-300">
                  Process ID
                </th>
                <th className="border p-3 text-left text-gray-300">
                  Burst Time
                </th>
              </tr>
            </thead>
            <tbody>
              {processes.map((entry, index) => (
                <tr key={index} className="border hover:bg-gray-700">
                  <td className="border p-3">P{entry.id}</td>
                  <td className="border p-3">{entry.burst_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Run Button */}
      {processes.length > 1 && (
        <button
          onClick={handleRun}
          className="bg-gray-700 text-white p-3 rounded-md w-full hover:bg-gray-600 focus:outline-none disabled:bg-gray-500"
          disabled={run}
        >
          Simulate
        </button>
      )}

      {/* Final Process Table */}
      {run && <p className="mt-6 text-lg text-gray-300">Results Table</p>}
      {run && (
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-600">
            <thead>
              <tr className="bg-gray-800">
                <th className="border p-3 text-left text-gray-300">
                  Process ID
                </th>
                <th className="border p-3 text-left text-gray-300">
                  Start Time
                </th>
                <th className="border p-3 text-left text-gray-300">End Time</th>
              </tr>
            </thead>
            <tbody>
              {finish?.map((entry, index) => (
                <tr key={index} className="border hover:bg-gray-700">
                  <td className="border p-3">P{entry.pid}</td>
                  <td className="border p-3">{entry.start}</td>
                  <td className="border p-3">{entry.end}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Gantt Chart Summary */}
      {run && <p className="mt-6 text-lg text-gray-300">Gantt Chart Summary</p>}
      {run && (
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-600">
            <thead>
              <tr className="bg-gray-800">
                <th className="border p-3 text-left text-gray-300">
                  Process ID
                </th>
                <th className="border p-3 text-left text-gray-300">
                  Gantt Summary
                </th>
              </tr>
            </thead>
            <tbody>
              {finish?.map((entry, index) => (
                <tr key={index} className="border hover:bg-gray-700">
                  <td className="border p-3">P{entry.pid}</td>
                  <td className="border p-3">
                    ({entry.start} - {entry.end})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Average Waiting Time */}
      {run && (
        <p className="mt-6 text-lg text-gray-300">
          Average Waiting Time: {avgWaitingTime.toFixed(2)}
        </p>
      )}

      {/* Clear Button */}
      {run && (
        <div className="mt-6 text-center">
          <button
            onClick={handleClearProcess}
            className="bg-red-600 text-white p-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete All Processes
          </button>
        </div>
      )}
    </div>
  );
};
