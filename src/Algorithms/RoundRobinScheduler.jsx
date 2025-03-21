//

import React, { useState } from "react";
import { handleFinish2 } from "./api";

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
    if (!burst_time && burst_time < 1) return; // Do nothing if the input is empty
    const bool = processes.find((item) => item.id === processId);
    if (bool) return;
    // Create a new process with an auto-generated ID
    const newProcess = {
      id: processId,
      burst_time: burst_time,
    };

    setProcesses((item) => [...item, newProcess]);
    setBurst_time("");
    setProcessId("");
  }
  function handleClearProcess() {
    setProcesses([]);
    setProcessId("");
    setBurst_time("");
  }

  async function handleRun() {
    if (!finalQuantum) return;
    const data = await handleFinish2(processes, algorithm, finalQuantum);
    setFinish(data);
    setRun(true);
  }
  console.log(finalQuantum);
  console.log(finish);
  console.log(processes);
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Round Robin Scheduler
      </h2>
      <div className="mb-4 flex flex-col sm:flex-row space-x-0 sm:space-x-2 space-y-2 sm:space-y-0">
        <input
          type="number"
          value={processId}
          onChange={(e) => setProcessId(Number(e.target.value))}
          placeholder="Process id "
          className="border p-2 rounded w-full sm:w-1/3"
        />
        <input
          type="number"
          value={burst_time}
          onChange={(e) => setBurst_time(Number(e.target.value))}
          placeholder="Burst Time"
          className="border p-2 rounded w-full sm:w-1/3"
        />
        <button
          onClick={addProcess}
          className="bg-blue-500 text-white p-2 rounded w-full sm:w-1/3"
        >
          Add Process
        </button>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row space-x-0 sm:space-x-2 space-y-2 sm:space-y-0">
        <input
          type="number"
          value={finalQuantum}
          onChange={(e) => setFinalQuantum(Number(e.target.value))}
          placeholder="Quantum Time"
          className="border p-2 rounded w-full sm:w-1/3"
        />
      </div>

      {processes.length > 0 && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Process ID</th>
              <th className="border p-2">Burst Time</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((entry, index) => (
              <tr key={index} className="border">
                <td className="border p-2">P{entry.id}</td>
                <td className="border p-2">{entry.burst_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {processes.length > 1 && (
        <div className="mt-4 text-center">
          <button
            onClick={handleClearProcess}
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Clear All Processes
          </button>
        </div>
      )}

      {processes.length > 1 && (
        <button
          onClick={handleRun}
          className="bg-blue-500 text-white p-2 rounded w-full sm:w-1/3"
          disabled={run}
        >
          Ruun Processes
        </button>
      )}

      {run && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Process ID</th>
              <th className="border p-2">Start Time</th>
              <th className="border p-2">End Time</th>
            </tr>
          </thead>
          <tbody>
            {finish?.map((entry, index) => (
              <tr key={index} className="border">
                <td className="border p-2">P{entry.pid}</td>
                <td className="border p-2">{entry.start}</td>
                <td className="border p-2">{entry.end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {run && <p>AVerage waiting time {avgWaitingTime.toFixed(2)}</p>}
    </div>
  );
};

export default RoundRobinScheduler;
