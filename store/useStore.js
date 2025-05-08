import { create } from "zustand";

export const useStore = create((set) => ({
  isTeamAddModalOpen: false,
  setTeamAddModalOpen: (value) => set({ isTeamAddModalOpen: value }),

  selectedTeam: null,
  setSelectedTeam: (value) => set({ selectedTeam: value }),
}));
