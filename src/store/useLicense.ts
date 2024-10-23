import { create } from "zustand";
import {
  Guild,
  License,
  Product,
  ProductVersion,
  Role,
  Channel,
  GuildInfo,
} from "../types";

interface LicenseStore {
  license: License | null;
  config: Object | null;
  versions: ProductVersion[] | null;
  currentVersion: ProductVersion | null;
  product: Product | null;
  guild: Guild | null;
  roles: Role[] | null;
  channels: Channel[] | null;
  clear: () => void;
  setLicense: (license: License) => void;
  setGuild: (guild: Guild) => void;
  setCurrentVersion: (product: ProductVersion) => void;
  setGuildInfo: (info: GuildInfo) => void;
}

const useLicense = create<LicenseStore>((set) => ({
  license: null,
  config: null,
  versions: [],
  currentVersion: null,
  product: null,
  guild: null,
  roles: null,
  channels: null,
  clear: () => set({}),
  setLicense: (license: License) => {
    set((state) => ({
      ...state,
      license,
      config: license.config,
      versions: license.product.versions,
      product: license.product,
      currentVersion: license.currentProductVersion,
    }));
  },
  setGuild: (guild: Guild) => {
    set((state) => ({ ...state, guild }));
  },
  setCurrentVersion: (product: ProductVersion) => {
    set((state) => ({ ...state, currentVersion: product }));
  },
  setGuildInfo: (info: GuildInfo) => {
    set((state) => ({ ...state, ...info }));
  },
}));

export default useLicense;
