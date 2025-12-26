import { defineStore } from "pinia";
import type { User } from "../types/user";
import type { AuthState } from "../types/auth";

export const useAuth = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: null,
  }),

  actions: {
    setToken(token: string | null) {
      this.token = token;
    },

    setUser(user: User | null) {
      this.user = user;
    },

    logout() {
      this.user = null;
      this.token = null;
    },
  },

  persist: true,
});
