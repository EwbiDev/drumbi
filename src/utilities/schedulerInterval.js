import { clearScheduler, scheduler } from "./scheduler";

const interval = 25; // milliseconds

let intervalId = null;

function startSchedulerInterval() {
  intervalId = setInterval(scheduler, interval);
}

function stopSchedulerInterval() {
  clearInterval(intervalId);
  clearScheduler();
}

export { startSchedulerInterval, stopSchedulerInterval };
