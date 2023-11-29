const interval = 25;

let intervalId = null;

function startSchedulerInterval() {
  intervalId = setInterval(() => console.log(Date.now()), interval);
}

function stopSchedulerInterval() {
  clearInterval(intervalId);
}

export { startSchedulerInterval, stopSchedulerInterval };
