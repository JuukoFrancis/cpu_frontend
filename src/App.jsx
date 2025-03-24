import { useState } from "react";

function App() {
  const [algorithm, setAlgorithm] = useState("");
  return (
    <>
      {/* <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center py-10 px-4 sm:px-6 md:px-8"> */}
      <div className="h-1/5 bg-blue-50 flex flex-col items-center justify-center py-10 px-4 sm:px-6 md:px-8">
        <h1 className="text-4xl text-blue-600 font-semibold mb-6">
          CPU SCHEDULING ALGORITHMS
        </h1>
        <p className="text-lg text-gray-700 mb-4">Choose an Algorithm</p>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="border p-3 rounded-lg w-full sm:w-1/2 md:w-1/3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a process</option>
          <option value="fcfs">First Come First Serve</option>
          <option value="sjfp">Shortest Job First Preemptive</option>
          <option value="sjfnp">Shortest Job First Non-preemptive</option>
          <option value="rr">Round Robin</option>
          <option value="psp">Priority Scheduling Preemptive</option>
          <option value="psnp">Priority Scheduling Non-preemptive</option>
        </select>
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

// Gantt Chart
const GanttChart = ({ processes }) => {
  return (
    <div className="w-full my-6">
      {/* Gantt Blocks */}
      <div className="flex border border-gray-700 h-14 bg-gray-300">
        {processes?.map((process) => (
          <div
            key={process.id}
            className="flex items-center justify-center border-r border-gray-700 text-gray-800 font-semibold"
            style={{
              flex: process.burst_time,
            }}
          >
            P{process.id}
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="flex justify-between mt-2 text-sm text-gray-800">
        {processes
          ?.reduce(
            (acc, process) => {
              const last = acc.length ? acc[acc.length - 1] : 0;
              acc.push(last + process.burst_time);
              return acc;
            },
            [0]
          )
          ?.map((time, index) => (
            <div
              key={index}
              className="absolute"
              style={{
                left: `${
                  (time /
                    processes.reduce(
                      (acc, process) => acc + process.burst_time,
                      0
                    )) *
                  100
                }%`, // Position relative to total width
              }}
            ></div>
          ))}
      </div>
    </div>
  );
};

// FCFS (First Come First Serve)
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
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center py-5 px-4 sm:px-2 md:px-8">
      <h2 className="text-2xl font-semibold text-blue-800 mb-6 text-center">
        First Come First Serve Algorithm
      </h2>

      {/* Initial process Table inputs */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <p className="text-gray-700">Enter id & burst time</p>

          <input
            type="number"
            value={processId}
            onChange={(e) => setProcessId(Number(e.target.value))}
            placeholder="Enter process id"
            className="border p-2 rounded-lg w-full sm:w-1/3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            value={burstInput}
            onChange={(e) => setBurstInput(Number(e.target.value))}
            placeholder="Enter burst time"
            className="border p-2 rounded-lg w-full sm:w-1/3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {burstInput > 0 && (
            <button
              onClick={handleAddProcess}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Process
            </button>
          )}
        </div>
      </div>

      {/* Initial Process Table */}
      {initialProcessses.length > 0 && (
        <div className="w-full max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-2 text-left">Process ID</th>
                <th className="border p-2 text-left">Burst Time</th>
              </tr>
            </thead>

            <tbody>
              {initialProcessses.map((process) => (
                <tr key={process.id} className="odd:bg-gray-50">
                  <td className="border p-2">P{process.id}</td>
                  <td className="border p-2">{process.burst_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {initialProcessses?.length > 1 && (
        <button
          disabled={run}
          onClick={handle}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
        >
          Run Processes
        </button>
      )}
      {run && (
        <button
          onClick={handleClear}
          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 mt-4"
        >
          Clear All Processes
        </button>
      )}

      {/* Final Process table */}
      {run && (
        <div className="w-full max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-2 text-left">Process ID</th>
                <th className="border p-2 text-left">Waiting Time</th>
                <th className="border p-2 text-left">Turnaround Time</th>
              </tr>
            </thead>

            <tbody>
              {finish?.map((process) => (
                <tr key={process.id} className="odd:bg-gray-50">
                  <td className="border p-2">P{process.id}</td>
                  <td className="border p-2">{process.waiting_time}</td>
                  <td className="border p-2">{process.turnaround_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {run && (
        <p className="text-blue-700 mt-4">
          Average waiting time {averageWaitingTime.toFixed(2)}
        </p>
      )}
      {run && (
        <p className="text-blue-700 mt-4">
          Average Turnaround time {averageTurnTime.toFixed(2)}
        </p>
      )}

      {run && <GanttChart processes={initialProcessses} />}
    </div>
  );
}

// SJF PREEMPTIVE

function ShortestJobFirstPreemptive({ algorithm }) {
  const [burstInput, setBurstInput] = useState("");
  const [arrival_time, setArrival_time] = useState("");
  const [processId, setProcessId] = useState("");
  const [run, setRun] = useState(false);
  const [initialProcess, setInitialProcess] = useState([]);
  const [finish, setFinish] = useState([]);

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

  function handleAddProcess(burstInput) {
    if (!burstInput || arrival_time < 0 || !processId) return;
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
    <div className="p-6 sm:p-8 md:p-12 bg-blue-50">
      <h2 className="text-3xl font-semibold text-blue-800 mb-6 text-center">
        Shortest Job First Preemptive
      </h2>

      {/* Initial Process input */}
      <div className="mb-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <input
            type="number"
            value={processId}
            onChange={(e) => setProcessId(Number(e.target.value))}
            placeholder="Enter process id"
            className="border p-2 rounded-md w-full sm:w-1/3 text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={arrival_time}
            onChange={(e) => setArrival_time(Number(e.target.value))}
            placeholder="Enter arrival time"
            className="border p-2 rounded-md w-full sm:w-1/3 text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={burstInput}
            onChange={(e) => setBurstInput(Number(e.target.value))}
            placeholder="Enter burst time"
            className="border p-2 rounded-md w-full sm:w-1/3 text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {burstInput > 0 && (
            <button
              onClick={() => handleAddProcess(burstInput)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Process
            </button>
          )}
        </div>
      </div>

      {/* Initial Process Table */}
      {initialProcess.length > 0 && (
        <div className="mt-6 mb-6 overflow-x-auto bg-white p-4 rounded-lg shadow-lg">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-2 text-left">Process ID</th>
                <th className="border p-2 text-left">Arrival Time</th>
                <th className="border p-2 text-left">Burst Time</th>
              </tr>
            </thead>
            <tbody>
              {initialProcess.map((process) => (
                <tr key={process.id} className="hover:bg-gray-50">
                  <td className="border p-2">P{process.id}</td>
                  <td className="border p-2">{process.arrival_time}</td>
                  <td className="border p-2">{process.burst_time}</td>
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
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Run Processes
          </button>
        </div>
      )}

      {run && (
        <div className="text-center mt-4">
          <button
            onClick={handleClear}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Clear All Processes
          </button>
        </div>
      )}

      {/* Final Process Table */}
      {run && (
        <div className="mt-6 mb-6 overflow-x-auto bg-white p-4 rounded-lg shadow-lg">
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

      {run && (
        <div className="mt-4 text-center">
          <p className="text-blue-800">
            Average waiting time: {averageWaitingTime.toFixed(2)}
          </p>
          <p className="text-blue-800">
            Average Turnaround time: {averageTurnTime.toFixed(2)}
          </p>
        </div>
      )}

      {run && <GanttChart processes={initialProcess} />}
    </div>
  );
}

// SHORTEST JOB FIRST NON PREEMPTIVE

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
    <div className="p-6 sm:p-8 md:p-12 bg-blue-50">
      <h2 className="text-3xl font-semibold text-blue-800 mb-6 text-center">
        Shortest Job First Non-Preemptive
      </h2>

      {/* Initial Process Input Fields */}
      <div className="mb-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <input
            type="number"
            value={processId}
            onChange={(e) => setProcessId(Number(e.target.value))}
            placeholder="Enter process id"
            className="border p-2 rounded-md w-full sm:w-1/3 text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={burstInput}
            onChange={(e) => setBurstInput(Number(e.target.value))}
            placeholder="Enter burst time"
            className="border p-2 rounded-md w-full sm:w-1/3 text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {burstInput > 0 && (
            <button
              onClick={handleAddProcess}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Process
            </button>
          )}
        </div>
      </div>

      {/* Initial Process Table */}
      {initialProcess.length > 0 && (
        <div className="mt-6 mb-6 overflow-x-auto bg-white p-4 rounded-lg shadow-lg">
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
      )}

      {/* Run Button */}
      {initialProcess.length > 1 && (
        <div className="text-center mt-4">
          <button
            disabled={run}
            onClick={handle}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Run Processes
          </button>
        </div>
      )}

      {/* Clear Button */}
      {run && (
        <div className="text-center mt-4">
          <button
            onClick={handleClear}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Clear All Processes
          </button>
        </div>
      )}

      {/* Final Process Table */}
      {run && (
        <div className="mt-6 mb-6 overflow-x-auto bg-white p-4 rounded-lg shadow-lg">
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

      {/* Average Times */}
      {run && (
        <div className="text-center mt-4 text-blue-800">
          <p>Average Waiting Time: {averageWaitingTime.toFixed(2)}</p>
          <p>Average Turnaround Time: {averageTurnTime.toFixed(2)}</p>
        </div>
      )}

      {/* Gantt Chart */}
      {run && (
        <div className="mt-4 text-center">
          <p className="text-blue-800">Gantt Chart</p>
          <GanttChart processes={initialProcess} />
        </div>
      )}
    </div>
  );
}

// ROUND ROBIN SCHEDULER
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
    if (!burst_time || burst_time < 1 || processId < 0) return; // Do nothing if the input is empty
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
  console.log(finish);
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Round Robin Scheduler
      </h2>
      {/* Process Input Fields */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="number"
          value={processId}
          onChange={(e) => setProcessId(Number(e.target.value))}
          placeholder="Process id"
          className="border p-3 rounded-md w-full text-blue-800 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          value={burst_time}
          onChange={(e) => setBurst_time(Number(e.target.value))}
          placeholder="Burst Time"
          className="border p-3 rounded-md w-full text-blue-800 focus:ring-2 focus:ring-blue-500"
        />
        <button
          disabled={run}
          onClick={addProcess}
          className="bg-blue-600 text-white p-3 rounded-md w-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="border p-3 rounded-md w-full text-blue-800 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* Processes Table */}
      {processes.length > 0 && (
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-3 text-left">Process ID</th>
                <th className="border p-3 text-left">Burst Time</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((entry, index) => (
                <tr key={index} className="border hover:bg-gray-50">
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
          className="bg-blue-600 text-white p-3 rounded-md w-full hover:bg-blue-700 focus:outline-none disabled:bg-blue-400"
          disabled={run}
        >
          Run Processes
        </button>
      )}
      {/* Clear Button */}
      {run && (
        <div className="mt-6 text-center">
          <button
            onClick={handleClearProcess}
            className="bg-red-600 text-white p-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Clear All Processes
          </button>
        </div>
      )}
      {/* Final Process Table */}
      {run && (
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-3 text-left">Process ID</th>
                <th className="border p-3 text-left">Start Time</th>
                <th className="border p-3 text-left">End Time</th>
              </tr>
            </thead>
            <tbody>
              {finish?.map((entry, index) => (
                <tr key={index} className="border hover:bg-gray-50">
                  <td className="border p-3">P{entry.pid}</td>
                  <td className="border p-3">{entry.start}</td>
                  <td className="border p-3">{entry.end}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Average Waiting Time */}
      {run && (
        <p className="mt-6 text-lg text-blue-800">
          Average Waiting Time: {avgWaitingTime.toFixed(2)}
        </p>
      )}
      {/* Gantt Chart */}
      {run && (
        <>
          <div className="w-full my-6">
            {/* Gantt Blocks */}
            <div className="flex border border-gray-700 h-14 bg-gray-300">
              {finish?.map((process) => (
                <div
                  key={process.start}
                  className="flex items-center justify-center border-r border-gray-700 text-gray-800 font-semibold"
                  style={{
                    flex: process.end,
                  }}
                >
                  P{process.pid}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// PRIORITY SCHEDULING PREEMPTIVE

function PrioritySchedulingPreemptive({ algorithm }) {
  const [processId, setProcessId] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
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
      Priority: priority,
    };
    setProcesses((id) => [...id, newProcess]);
    setBurstInput("");
    setPriority("");
    setProcessId("");
    setArrivalTime("");
  }

  return (
    <div className="p-6 sm:p-8 md:p-12 bg-gray-50">
      <h2 className="text-3xl font-semibold text-blue-800 mb-6">
        Priority Scheduling Algorithm Preemptive
      </h2>

      {/* Process Input Fields */}
      <div className="mb-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <input
            type="number"
            value={processId}
            onChange={(e) => setProcessId(Number(e.target.value))}
            placeholder="Enter Process ID"
            className="border p-3 rounded-md w-full sm:w-1/4 text-blue-800 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(Number(e.target.value))}
            placeholder="Enter Arrival Time"
            className="border p-3 rounded-md w-full sm:w-1/4 text-blue-800 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={burstInput}
            onChange={(e) => setBurstInput(Number(e.target.value))}
            placeholder="Enter Burst Time"
            className="border p-3 rounded-md w-full sm:w-1/4 text-blue-800 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            placeholder="Enter Priority"
            className="border p-3 rounded-md w-full sm:w-1/4 text-blue-800 focus:ring-2 focus:ring-blue-500"
          />
          {burstInput > 0 && (
            <button
              onClick={handleAddProcess}
              className="bg-blue-600 text-white px-6 py-3 rounded-md w-full sm:w-auto hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Process
            </button>
          )}
        </div>
      </div>

      {/* Process Table */}
      {processes?.length > 0 && (
        <div className="mt-6">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-3 text-left">Process ID</th>
                <th className="border p-3 text-left">Arrival Time</th>
                <th className="border p-3 text-left">Burst Time</th>
                <th className="border p-3 text-left">Priority</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process) => (
                <tr key={process.id} className="hover:bg-gray-50">
                  <td className="border p-3">P{process.id}</td>
                  <td className="border p-3">{process.arrival_time}</td>
                  <td className="border p-3">{process.burst_time}</td>
                  <td className="border p-3">{process.Priority}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Clear Button */}
          {run && (
            <div className="mt-6 text-center">
              <button
                onClick={handleClearProcess}
                className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Clear All Processes
              </button>
            </div>
          )}
        </div>
      )}

      {/* Run Button */}
      {processes.length > 1 && (
        <button
          disabled={run}
          onClick={handle}
          className="bg-blue-600 text-white px-6 py-3 rounded-md w-full sm:w-auto mt-6 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Run Processes
        </button>
      )}

      {/* Final Results */}
      {run && (
        <div className="mt-6">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-3 text-left">Process ID</th>
                <th className="border p-3 text-left">Waiting Time</th>
                <th className="border p-3 text-left">Turnaround Time</th>
              </tr>
            </thead>
            <tbody>
              {finish?.map((process) => (
                <tr key={process.id} className="hover:bg-gray-50">
                  <td className="border p-3">P{process.id}</td>
                  <td className="border p-3">{process.waiting_time}</td>
                  <td className="border p-3">{process.turnaround_time}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Average Times */}
          <div className="mt-4 text-center text-blue-800">
            <p>Average Waiting Time: {averageWaitingTime.toFixed(2)}</p>
            <p>Average Turnaround Time: {averageTurnTime.toFixed(2)}</p>
          </div>

          {/* Gantt Chart */}
          <div className="mt-6 text-center">
            <p className="text-lg text-blue-800">Gantt Chart</p>
            <GanttChart processes={processes} />
          </div>
        </div>
      )}
    </div>
  );
}

// PRIORITY NON PREEMPTIVE
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
    <div className="p-6 sm:p-8 md:p-12 bg-gray-50">
      <h2 className="text-3xl font-semibold text-blue-800 mb-6">
        Priority Scheduling Algorithm Non Preemptive
      </h2>

      {/* Initial Process Input */}
      <div className="mb-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <input
            type="number"
            value={processId}
            onChange={(e) => setProcessId(Number(e.target.value))}
            placeholder="Enter Process ID"
            className="border p-3 rounded-md w-full sm:w-1/4 text-blue-800 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={burstInput}
            onChange={(e) => setBurstInput(Number(e.target.value))}
            placeholder="Enter Burst Time"
            className="border p-3 rounded-md w-full sm:w-1/4 text-blue-800 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            placeholder="Enter Priority Time"
            className="border p-3 rounded-md w-full sm:w-1/4 text-blue-800 focus:ring-2 focus:ring-blue-500"
          />
          {burstInput > 0 && (
            <button
              onClick={handleAddProcess}
              className="bg-blue-600 text-white px-6 py-3 rounded-md w-full sm:w-auto hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Process
            </button>
          )}
        </div>
      </div>

      {/* Process Table */}
      {processes?.length > 0 && (
        <div className="mt-6">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-3 text-left">Process ID</th>
                <th className="border p-3 text-left">Burst Time</th>
                <th className="border p-3 text-left">Priority Time</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process) => (
                <tr key={process.id} className="hover:bg-gray-50">
                  <td className="border p-3">P{process.id}</td>
                  <td className="border p-3">{process.burst_time}</td>
                  <td className="border p-3">{process.Priority}</td>
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
          className="bg-blue-600 text-white px-6 py-3 rounded-md w-full sm:w-auto mt-6 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Run Processes
        </button>
      )}

      {/* Clear All Processes Button */}
      {run && (
        <div className="mt-4 text-center">
          <button
            onClick={handleClearProcess}
            className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Clear All Processes
          </button>
        </div>
      )}

      {/* Final Results */}
      {run && (
        <div className="mt-6">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-3 text-left">Process ID</th>
                <th className="border p-3 text-left">Waiting Time</th>
                <th className="border p-3 text-left">Turnaround Time</th>
              </tr>
            </thead>
            <tbody>
              {finish?.map((process) => (
                <tr key={process.id} className="hover:bg-gray-50">
                  <td className="border p-3">P{process.id}</td>
                  <td className="border p-3">{process.waiting_time}</td>
                  <td className="border p-3">{process.turnaround_time}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Average Waiting and Turnaround Times */}
          <div className="mt-4 text-center text-blue-800">
            <p>Average Waiting Time: {averageWaitingTime.toFixed(2)}</p>
            <p>Average Turnaround Time: {averageTurnTime.toFixed(2)}</p>
          </div>

          {/* Gantt Chart */}
          <div className="mt-6 text-center">
            <p className="text-lg text-blue-800">Gantt Chart</p>
            <GanttChart processes={processes} />
          </div>
        </div>
      )}
    </div>
  );
}
