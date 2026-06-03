import { create } from "zustand";

export type PublishState = "idle" | "publishing" | "done" | "error";

interface UiState {
  publishState: PublishState;
  publishMessage: string;
  setPublishState: (state: PublishState, message?: string) => void;
  collapsedGroups: Record<string, boolean>;
  toggleGroup: (group: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  publishState: "idle",
  publishMessage: "",
  setPublishState: (publishState, publishMessage = "") =>
    set({ publishState, publishMessage }),
  collapsedGroups: {},
  toggleGroup: (group) =>
    set((s) => ({
      collapsedGroups: { ...s.collapsedGroups, [group]: !s.collapsedGroups[group] },
    })),
}));
