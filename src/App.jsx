import { useState } from "react";
import ShortestJobFirst from "./Algorithms/ShortestJobFirst";
import FirstComeFirstServe from "./Algorithms/FirstComeFirstServe";
import ShortestJobFirstPreemptive from "./Algorithms/ShortestJobFirstPreemptive";
import RoundRobinScheduler from "./Algorithms/RoundRobinScheduler";
import PriorityScheduling from "./Algorithms/PriorityScheduling";
import PrioritySchedulingPreemptive from "./Algorithms/PrioritySchedulingPreemptive";

function App() {
  const [algorithm, setAlgorithm] = useState("");
  return (
    <>
      <div>
        <h1 className="text-blue-200">Hello Flask React!!</h1>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
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
