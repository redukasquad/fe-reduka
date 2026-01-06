import { defineStore } from "pinia";
import type { User } from "../types/user";
import type { AuthState } from "../types/auth";
import { AuthService } from "../services/auth";

export const useAuth = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: null,
  }),

  actions: {
    async setToken(token: string | null) {
      this.token = token;
      const res=await AuthService.me()

      console.log(res)
      this.user=res.data as User;
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
