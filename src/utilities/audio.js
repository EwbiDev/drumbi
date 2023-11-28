import kickFile from "@assets/audio/kick.wav";
import snareFile from "@assets/audio/snare.wav";
import hiHatClosed from "@assets/audio/hiHatClosed.wav";

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

function trackScaffold(barNum, beatsPerBar) {
  function buildBeatArray(barNum, beatsPerBar) {
    const beatArray = [];

    for (let i = 0; i < barNum * beatsPerBar; i++) {
      const beat = { beatId: i, hit: false };
      beatArray.push(beat);
    }

    return beatArray;
  }

  const scaffold = [
    {
      trackName: "hi hat",
      defaultFile: hiHatClosed,
    },
    {
      trackName: "snare",
      defaultFile: snareFile,
    },
    {
      trackName: "kick",
      defaultFile: kickFile,
    },
  ];

  return scaffold.map((item, idx) => {
    return {
      ...item,
      beats: buildBeatArray(barNum, beatsPerBar),
      trackId: idx,
    };
  });
}

export { playSound, trackScaffold };
