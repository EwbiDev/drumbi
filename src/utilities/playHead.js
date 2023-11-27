function nextPlayHeadPos(playHeadPos, totalBeats) {
  return (playHeadPos + 1) % totalBeats
}

export {nextPlayHeadPos}