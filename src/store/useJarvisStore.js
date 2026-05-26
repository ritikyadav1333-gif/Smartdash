import { create } from "zustand";

export const useJarvisStore = create((set) => ({
  bootComplete: false,
  activeCommand: null,
  commandTick: 0,
  energyBurst: 0,
  introProgress: 0,
  focusMode: "diagnostics",
  setBootComplete: (bootComplete) => set({ bootComplete }),
  setIntroProgress: (introProgress) => set({ introProgress }),
  setFocusMode: (focusMode) => set({ focusMode }),
  triggerCommand: (activeCommand) => {
    set((state) => ({
      activeCommand,
      commandTick: state.commandTick + 1,
      energyBurst: activeCommand === "overdrive" ? 1.35 : 1
    }));
    window.clearTimeout(window.__jarvisBurstTimer);
    window.__jarvisBurstTimer = window.setTimeout(() => set({ energyBurst: 0 }), 720);
    window.clearTimeout(window.__jarvisCommandTimer);
    window.__jarvisCommandTimer = window.setTimeout(() => set({ activeCommand: null }), 2600);
  },
  triggerEnergyBurst: () => {
    set({ energyBurst: 1 });
    window.clearTimeout(window.__jarvisBurstTimer);
    window.__jarvisBurstTimer = window.setTimeout(() => set({ energyBurst: 0 }), 520);
  }
}));
