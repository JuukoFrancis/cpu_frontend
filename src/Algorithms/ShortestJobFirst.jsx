import { useState } from "react";
import { handleFinish } from "./api";
// import Gantt from "./Gantt";

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
  console.log(finish);
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

  return (
    <div className="p-6 sm:p-8 md:p-12">
      <h2 className="text-3xl font-semibold text-blue-800 mb-6">
        Shortest Job First Non-Preemptive
      </h2>

      {/* Initial Process input Fields */}

      <div className="mb-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <input
            type="number"
            value={processId}
            onChange={(e) => setProcessId(Number(e.target.value))}
            placeholder="Enter process id"
            className="border p-2 rounded-md w-full sm:w-1/3 text-blue-800"
          />
          <input
            type="number"
            value={burstInput}
            onChange={(e) => setBurstInput(Number(e.target.value))}
            placeholder="Enter burst time"
            className="border p-2 rounded-md w-full sm:w-1/3 text-blue-800"
          />
          {burstInput > 0 && (
            <button
              onClick={handleAddProcess}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              Add Process
            </button>
          )}
        </div>
      </div>

      {/* INITial process table */}

      <div className="mt-6 mb-6">
        <p>Initial Processess Table</p>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-100">
              <th className="border p-2 text-left">Process ID</th>
              <th className="border p-2 text-left">Burst Time</th>
            </tr>
          </thead>
          <tbody>
            {initialProcess.map((process) => (
              <tr key={process.id} className="hover:bg-gray-50">
                <td className="border p-2">P{process.id}</td>
                <td className="border p-2">{process.burst_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={handle}>Run sjf nonPreemptive</button>
      {/* Final Process Table */}

      {run && (
        <div className="mt-6 mb-6">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-2 text-left">Process ID</th>
                <th className="border p-2 text-left">Waiting Time </th>
                <th className="border p-2 text-left">Turnaround Time</th>
              </tr>
            </thead>
            <tbody>
              {finish?.map((process) => (
                <tr key={process.id} className="hover:bg-gray-50">
                  <td className="border p-2">P{process.id}</td>
                  <td className="border p-2">{process.waiting_time}</td>
                  <td className="border p-2">{process.turnaround_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {run && <p>AVerage waiting time {averageWaitingTime.toFixed(2)}</p>}
      {run && <p>AVerage Turnaround time {averageTurnTime.toFixed(2)}</p>}
    </div>
  );
}

export default ShortestJobFirst;
