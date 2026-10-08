"use client";

import { create } from "zustand";
import type { ZoneId } from "./world-data";

type WorldState = {
  theme: "day" | "night";
  breeze: boolean;
  expanded: boolean;
  setExpanded: (expanded:boolean) => void;
  breezePulse: number;
  setBreeze: (breeze:boolean) => void;
  gust: () => void;
  preview: ZoneId | null;
  panel: "directory" | "profile" | "contact" | "notebook" | "dice" | "postcard" | null;
  cameraCommand: { kind: "center" | "zoom" | "focus"; value?: number; zone?: ZoneId; sequence: number };
  setTheme: (theme: "day" | "night") => void;
  setPanel: (panel: WorldState["panel"]) => void;
  setPreview: (preview: ZoneId | null) => void;
  travel: { route:string; label:string; zone?:ZoneId; sequence:number } | null;
  travelTo: (route:string,label:string,zone?:ZoneId) => void;
  finishTravel: () => void;
  camera: (kind: "center" | "zoom" | "focus", value?: number, zone?: ZoneId) => void;
};

export const useWorldStore = create<WorldState>((set) => ({
  theme: "day", preview: null, panel: null, breeze:true, breezePulse:0, expanded:false,
  setExpanded:expanded=>set({expanded,preview:null}),
  travel:null,
  travelTo:(route,label,zone)=>set(state=>({travel:{route,label,zone,sequence:(state.travel?.sequence??0)+1},preview:null,panel:null})),
  finishTravel:()=>set({travel:null}),
  setBreeze:breeze=>set({breeze}),
  gust:()=>set(state=>({breeze:true,breezePulse:state.breezePulse+1})),
  cameraCommand: { kind: "center", sequence: 0 },
  setTheme: theme => set({ theme }),
  setPanel: panel => set({ panel, preview: null }),
  setPreview: preview => set({ preview, panel: null }),
  camera: (kind, value, zone) => set(state => ({ cameraCommand: { kind, value, zone, sequence: state.cameraCommand.sequence + 1 } })),
}));
