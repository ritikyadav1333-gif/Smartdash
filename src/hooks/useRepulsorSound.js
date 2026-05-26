import { useCallback, useRef } from "react";

export function useRepulsorSound() {
  const contextRef = useRef(null);

  return useCallback(async () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = contextRef.current || new AudioContext();
    contextRef.current = ctx;
    await ctx.resume();

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.42, now + 0.08);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 3.05);
    master.connect(ctx.destination);

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -22;
    compressor.knee.value = 12;
    compressor.ratio.value = 8;
    compressor.attack.value = 0.006;
    compressor.release.value = 0.18;
    compressor.connect(master);

    const delay = ctx.createDelay(0.5);
    delay.delayTime.value = 0.13;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.28;
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(compressor);

    const makeOsc = (type, startFreq, endFreq, gainValue, endTime) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + endTime);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + endTime);
      osc.connect(gain);
      gain.connect(delay);
      osc.start(now);
      osc.stop(now + endTime + 0.1);
    };

    makeOsc("sawtooth", 74, 34, 0.22, 2.8);
    makeOsc("triangle", 190, 880, 0.11, 1.8);
    makeOsc("sine", 520, 1280, 0.08, 1.2);

    const fireAt = now + 0.62;
    const blastBus = ctx.createGain();
    blastBus.gain.value = 0.9;
    blastBus.connect(compressor);

    const impact = ctx.createOscillator();
    const impactGain = ctx.createGain();
    impact.type = "square";
    impact.frequency.setValueAtTime(118, fireAt);
    impact.frequency.exponentialRampToValueAtTime(42, fireAt + 0.24);
    impactGain.gain.setValueAtTime(0.0001, fireAt);
    impactGain.gain.exponentialRampToValueAtTime(0.38, fireAt + 0.012);
    impactGain.gain.exponentialRampToValueAtTime(0.0001, fireAt + 0.34);
    impact.connect(impactGain);
    impactGain.connect(blastBus);
    impact.start(fireAt);
    impact.stop(fireAt + 0.4);

    const crack = ctx.createOscillator();
    const crackGain = ctx.createGain();
    crack.type = "sawtooth";
    crack.frequency.setValueAtTime(1800, fireAt);
    crack.frequency.exponentialRampToValueAtTime(420, fireAt + 0.16);
    crackGain.gain.setValueAtTime(0.0001, fireAt);
    crackGain.gain.exponentialRampToValueAtTime(0.16, fireAt + 0.008);
    crackGain.gain.exponentialRampToValueAtTime(0.0001, fireAt + 0.2);
    crack.connect(crackGain);
    crackGain.connect(delay);
    crack.start(fireAt);
    crack.stop(fireAt + 0.25);

    const bufferSize = ctx.sampleRate * 1.9;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.8);
    }
    const noise = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const noiseGain = ctx.createGain();
    noise.buffer = noiseBuffer;
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(420, now);
    filter.frequency.exponentialRampToValueAtTime(2600, now + 0.65);
    filter.Q.value = 2.6;
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.85);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(compressor);
    noise.start(now);
    noise.stop(now + 2);

    const blastSize = ctx.sampleRate * 0.62;
    const blastBuffer = ctx.createBuffer(1, blastSize, ctx.sampleRate);
    const blastData = blastBuffer.getChannelData(0);
    for (let i = 0; i < blastSize; i += 1) {
      blastData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / blastSize, 2.8);
    }
    const blast = ctx.createBufferSource();
    const blastFilter = ctx.createBiquadFilter();
    const blastGain = ctx.createGain();
    blast.buffer = blastBuffer;
    blastFilter.type = "lowpass";
    blastFilter.frequency.setValueAtTime(1800, fireAt);
    blastFilter.frequency.exponentialRampToValueAtTime(360, fireAt + 0.48);
    blastGain.gain.setValueAtTime(0.0001, fireAt);
    blastGain.gain.exponentialRampToValueAtTime(0.42, fireAt + 0.018);
    blastGain.gain.exponentialRampToValueAtTime(0.0001, fireAt + 0.58);
    blast.connect(blastFilter);
    blastFilter.connect(blastGain);
    blastGain.connect(blastBus);
    blast.start(fireAt);
    blast.stop(fireAt + 0.65);

    const exitAt = now + 2.72;
    const exitBus = ctx.createGain();
    exitBus.gain.setValueAtTime(0.0001, exitAt);
    exitBus.gain.exponentialRampToValueAtTime(0.82, exitAt + 0.04);
    exitBus.gain.exponentialRampToValueAtTime(0.0001, exitAt + 0.78);
    exitBus.connect(compressor);

    const exitSweep = ctx.createOscillator();
    exitSweep.type = "triangle";
    exitSweep.frequency.setValueAtTime(220, exitAt);
    exitSweep.frequency.exponentialRampToValueAtTime(2400, exitAt + 0.5);
    exitSweep.connect(exitBus);
    exitSweep.start(exitAt);
    exitSweep.stop(exitAt + 0.82);

    const exitHit = ctx.createOscillator();
    const exitHitGain = ctx.createGain();
    exitHit.type = "sine";
    exitHit.frequency.setValueAtTime(72, exitAt + 0.38);
    exitHit.frequency.exponentialRampToValueAtTime(38, exitAt + 0.62);
    exitHitGain.gain.setValueAtTime(0.0001, exitAt + 0.38);
    exitHitGain.gain.exponentialRampToValueAtTime(0.72, exitAt + 0.4);
    exitHitGain.gain.exponentialRampToValueAtTime(0.0001, exitAt + 0.78);
    exitHit.connect(exitHitGain);
    exitHitGain.connect(compressor);
    exitHit.start(exitAt + 0.38);
    exitHit.stop(exitAt + 0.84);
  }, []);
}
