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
  // setFinish(data);
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
  // setFinish(data);
}
