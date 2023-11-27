function calcBeatInterval(bpm) {
  return 1 / bpm * 60000
}

export {calcBeatInterval}