async function playSound(context, url, startTime) {
  try {
    const response = await fetch(url);
    const audioData = await response.arrayBuffer();
    const audioBuffer = await context.decodeAudioData(audioData);

    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);

    const scheduledTime = startTime - context.currentTime;
    if (scheduledTime > 0) {
      source.start(context.currentTime + scheduledTime);
      source.scheduledStartTime = startTime;
    } else {
      source.start();
      source.scheduledStartTime = null;
    }

    return source;
  } catch (error) {
    console.error("error", error);
    return null;
  }
}

export { playSound };
