import { useCallback, useEffect, useRef, useState } from "react";

export function useJarvisAudio() {
  const contextRef = useRef(null);
  const nodesRef = useRef([]);
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    nodesRef.current.forEach((node) => {
      try {
        node.stop?.();
        node.disconnect?.();
      } catch {
        node.disconnect?.();
      }
    });
    nodesRef.current = [];
    setPlaying(false);
  }, []);

  const start = useCallback(async () => {
    if (playing) {
      stop();
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = contextRef.current || new AudioContext();
    contextRef.current = ctx;
    await ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0.055;
    master.connect(ctx.destination);

    const delay = ctx.createDelay(0.8);
    delay.delayTime.value = 0.34;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.22;
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(master);

    const now = ctx.currentTime;
    const bass = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bass.type = "sawtooth";
    bass.frequency.value = 46.25;
    bassGain.gain.value = 0.18;
    bass.connect(bassGain);
    bassGain.connect(master);
    bass.start(now);

    const pulse = ctx.createOscillator();
    const pulseGain = ctx.createGain();
    pulse.type = "triangle";
    pulse.frequency.value = 92.5;
    pulseGain.gain.setValueAtTime(0.0001, now);
    for (let i = 0; i < 64; i += 1) {
      const t = now + i * 0.5;
      pulseGain.gain.exponentialRampToValueAtTime(0.08, t + 0.03);
      pulseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
    }
    pulse.connect(pulseGain);
    pulseGain.connect(delay);
    pulse.start(now);

    const lead = ctx.createOscillator();
    const leadGain = ctx.createGain();
    lead.type = "sine";
    leadGain.gain.value = 0.035;
    [277.18, 329.63, 246.94, 369.99].forEach((freq, index) => {
      lead.frequency.setValueAtTime(freq, now + index * 2);
      lead.frequency.setValueAtTime(freq, now + 8 + index * 2);
    });
    lead.connect(leadGain);
    leadGain.connect(delay);
    lead.start(now);

    nodesRef.current = [bass, bassGain, pulse, pulseGain, lead, leadGain, delay, feedback, master];
    setPlaying(true);
  }, [playing, stop]);

  useEffect(() => stop, [stop]);

  return { playing, toggleAudio: start };
}
