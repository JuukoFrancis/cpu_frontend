import { useState } from "react";
import { handleFinish } from "./api";
// import Gantt from "./Gantt";
import React from "react";

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
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center py-10 px-4 sm:px-6 md:px-8">
      <h2 className="text-2xl font-semibold text-blue-800 mb-6 text-center">
        First Come First Serve Algorithm
      </h2>

      {/* Initial process Table inputs*/}

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <p>Enter burst time:</p>

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
            <>
              <button
                onClick={handleAddProcess}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Process
              </button>
            </>
          )}
        </div>
      </div>

      {/* Inintial Process Table */}

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

      {initialProcessses?.length > 0 && (
        <button onClick={handle}>Run First come</button>
      )}
      {run && <button onClick={handleClear}>Clear All Processes</button>}

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

      {run && <p>AVerage waiting time {averageWaitingTime.toFixed(2)}</p>}
      {run && <p>AVerage Turnaround time {averageTurnTime.toFixed(2)}</p>}

      {/* <GanttChart processes={initialProcessses} /> */}
    </div>
  );
}

export default FirstComeFirstServe;
