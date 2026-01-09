import { defineStore } from "pinia";
import type { ToolState } from "../types/tool";

export const useTool = defineStore('tool', {
  state: (): ToolState => ({
    isSidebarOpen: false,
  }),
  actions: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },
  },
  persist: true,
})
