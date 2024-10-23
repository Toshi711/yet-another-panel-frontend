import { TableProps } from "antd";

export interface ProductVersion {
  id: number;
  product: Product[];
  config: string;
  version: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  version: string;
  download: string;
  closed: boolean;
  licenses: License[];
  supports: User[];
  admins: User[];
  versions: ProductVersion[];
  createdAt: Date;
}

export interface License {
  id: number;
  creatorId: string;
  token: string;
  userId: string;
  serverId: string;
  key: string;
  timeAmount: number;
  product: Product;
  currentProductVersion: ProductVersion;
  createdAt: Date;
  updatedAt: Date;
  config: string;
  user?: User
}

export enum UserRoles {
  Developer = "developer",
  SystemAdmin = "admin",
  SystemSupport = "support",
  ProductSupport = "product_support",
  ProductAdmin = "product_admin",
  User = "user",
}

export interface User {
  id: string;
  discordId: string;
  username: string;
  globalName: string;
  avatar: string;
  email: string;
  role: UserRoles;
  productSupport: Product[];
  productAdmin: Product[];
  configs: Config[];
}

export interface Config {
  id: number;
  user: User;
  productId: number;
  config: string;
  license: License;
}

export interface Version {
  config: string;
  version: string;
  productId: number;
}

export enum ComponentType {
  Switch = "switch",
  Array = "array",
  Input = "input",
  Channel = "channel",
  Checkbox = "checkbox",
  Color = "color",
  Role = "role",
  Embed = "embed",
  Flex = "flex",
}

export interface Guild {
  id: string;
  name: string;
  icon: string;
  banner: string | null;
}

export interface Property {
  type: string;
  _name: string;
  _grow?: boolean;
  _description: string;
  _placeholder: string;
  _component: ComponentType;
  _multi?: boolean;
  properties?: Property;
  items?: Property[];
}

export interface ConfigProperty {
  properties: {
    [index: string]: Property;
  };
}

export enum ChannelType {
  GuildText = 0,
  DM = 1,
  GuildVoice = 2,
  GroupDM = 3,
  GuildCategory = 4,
  GuildAnnouncement = 5,
  AnnouncementThread = 10,
  PublicThread = 11,
  PrivateThread = 12,
  GuildStageVoice = 13,
  GuildDirectory = 14,
  GuildForum = 15,
  GuildMedia = 16,
  GuildNews = 5,
  GuildNewsThread = 10,
  GuildPublicThread = 11,
  GuildPrivateThread = 12,
}

export interface Role {
  id: number;
  name: string;
  color: string;
}

export interface Channel {
  id: number;
  name: string;
}

export interface GuildInfo {
  roles: Role[];
  channels: Channel[];
}

export interface Promo {
  id: number;
  key: string;
  createdBy: string;
  product: Product;
  timeAmount: number;
}


export type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

export interface LicensesDataType {
  key: React.Key;
  user: string;
  expiresAt: string;
  status: string;
}

export interface KeysDataType {
  key: React.Key;
  promo: string;
  expiresAt: string;
}