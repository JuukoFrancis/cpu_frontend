import { useState } from "react";
import { handleFinish } from "./api";

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
  console.log(finish);
  console.log(processes);
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
    <div className="p-6 sm:p-8 md:p-12">
      <h2 className="text-3xl font-semibold text-blue-800 mb-6">
        Priority Scheduling Algorithm Non Preemptive
      </h2>

      {/* Initial Process input */}

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
          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            placeholder="Enter priority time"
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

      {/* Initial Process Table */}
      {processes?.length > 0 && (
        <div className="mt-6">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-2 text-left">Process ID</th>
                <th className="border p-2 text-left">Burst Time</th>
                <th className="border p-2 text-left">Priority Time</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process) => (
                <tr key={process.id} className="hover:bg-gray-50">
                  <td className="border p-2"> P{process.id}</td>
                  <td className="border p-2">{process.burst_time}</td>
                  <td className="border p-2">{process.Priority}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {processes.length > 1 && (
            <div className="mt-4 text-center">
              <button
                onClick={handleClearProcess}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none"
              >
                Clear All Processes
              </button>
            </div>
          )}
        </div>
      )}

      {processes.length > 1 && (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
          onClick={handle}
          disabled={run}
        >
          Run psnp
        </button>
      )}
      {processes.length > 1 && (
        <div className="mt-4 text-center">
          <button
            onClick={handleClearProcess}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none"
          >
            Clear All Processes
          </button>
        </div>
      )}
      {/* Final Process Table */}

      {run && (
        <div className="mt-6">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-2 text-left">Process ID</th>
                <th className="border p-2 text-left">Waiting Time</th>
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

export default PriorityScheduling;
