import { create } from "zustand";
import { Guild, License, Product, ProductVersion, User } from "../types";

export enum UserRoles {
  Developer = "developer",
  SystemAdmin = "admin",
  SystemSupport = "support",
  ProductSupport = "product_support",
  ProductAdmin = "product_admin",
  User = "user",
}

interface ProfileStore {
  user: User | null;
  guilds: Guild[] | null;
  licenses: License[] | null;
  role: UserRoles | null;
  setGuilds: (guilds: Guild[]) => void;
  setUser: (user: User) => void;
  setLicenses: (licenses: License[]) => void;
  setRole: (role: UserRoles) => void;
  logout: () => void
}

const useProfile = create<ProfileStore>((set) => ({
  user: null,
  guilds: null,
  licenses: null,
  role: null,
  setGuilds: (guilds: Guild[]) => {
    set((state) => ({
      ...state,
      guilds,
    }));
  },
  setUser: (user: User) => {
    set((state) => ({ ...state, user }));
  },
  setLicenses: (licenses: License[]) => {
    set((state) => ({ ...state, licenses }));
  },
  setRole: (role: UserRoles) => {
    set((state) => ({ ...state, role }));
  },
  logout: () => {
    set({
      user: null,
      guilds: null,
      licenses: null,
      role: null
    })
  }
}));

export default useProfile;
