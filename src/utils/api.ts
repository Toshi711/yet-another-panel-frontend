import axios, { AxiosInstance, AxiosResponse } from "axios";
import { License, Product, ProductVersion, UserRoles, Version } from "../types";

interface LicenseDTO {
  userId: string;
  timeAmount: number;
  productId: number;
}

interface ProductDTO {
  title: string;
  description: string;
  version: string;
  download: string;
}

class Api {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "http://localhost:3000/",
      withCredentials: true,
    });
  }

  private async request<T>(method: 'get' | 'post' | 'patch' | 'delete', url: string, data?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance[method](url, data);
      return response.data;
    } catch (error) {
      console.error(`Error in ${method.toUpperCase()} ${url}:`, error);
      throw error;
    }
  }

  // Authentication and User Management
  getJWT = () => this.request<any>('get', "/auth/jwt");
  getMe = () => this.request<any>('get', "/auth");
  logout = () => this.request<any>('post', 'auth/logout')
  getUsers = () => this.request<any>('get', "/users");
  getUser = (discordId: string) => this.request<any>('get', `/users/${discordId}`);
  appointUser = (discordId: string, role: UserRoles) => this.request<any>('post', "/users/role", { id: discordId, role });

  // Discord-related methods
  getDiscord = (accessToken: string) => this.request<any>('get', "https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  getGuilds = (accessToken: string) => this.request<any>('get', "https://discord.com/api/users/@me/guilds", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  getGuild = (licenseId: number) => this.request<any>('get', `/discord/guild/${licenseId}`);

  // Product-related methods
  getProducts = () => this.request<Product[]>('get', "/products");
  getProduct = (id: number) => this.request<Product>('get', `/products/${id}`);
  createProduct = (product: ProductDTO) => this.request<Product>('post', "/products", product);
  editProduct = (id: number, product: ProductDTO) => this.request<Product>('patch', `/products/${id}`, product);
  appointProduct = (discordId: string, productId: number, role: UserRoles) => 
    this.request<any>('post', `/products/${productId}/staff`, { userId: discordId, productId, role });
  deleteFromProduct = (discordId: string, productId: number, role: UserRoles) => 
    this.request<any>('delete', `/products/${productId}/staff`, { data: { userId: discordId, productId, role } });

  // Version-related methods
  createVersion = (version: Version) => this.request<any>('post', "/products/version", version);
  editVersion = (version: ProductVersion) => this.request<any>('patch', `products/version/${version.id}`, version);
  deleteVersion = (versionId: number) => this.request<any>('delete', `/products/version/${versionId}`);

  // License-related methods
  getLicenses = (discordId: string) => this.request<License[]>('get', `/licenses/${discordId}`);
  createLicense = (license: LicenseDTO) => this.request<any>('post', "/licenses/", license);
  deleteLicense = (productId: number, licenseId: number) => this.request<ProductVersion[]>('delete', `/licenses/${productId}/${licenseId}`);
  getLicensesByProductId = (productId: number) => this.request<any>('get', `/products/${productId}/licenses`);

  // Configuration-related methods
  getConfig = (licenseId: number) => this.request<any>('get', `/config/${licenseId}`);
  changeConfigVersion = (licenseId: number, versionId: number) => 
    this.request<any>('patch', "/config", { licenseId, versionId });
  updateConfig = (licenseId: number, config: string) => this.request<any>('post', `/config/${licenseId}`, { config });
  changeServer = (licenseId: number, serverId: string) => 
    this.request<any>('patch', "/config/server", { licenseId, serverId });
  changeToken = (licenseId: number, token: string) => this.request<any>('patch', "/config/token", { licenseId, token });

  // Promo-related methods
  getKeysByProductId = (productId: number) => this.request<any>('get', `/products/${productId}/keys`);
  createKey = (productId: number, timeAmount: number) => this.request<any>('post', '/promo', { productId, timeAmount });
  deleteKey = (productId: number, keyId: number) => this.request<any>('delete', `/promo/${productId}/${keyId}`, { productId, key: keyId });
  activateKey = (key: string) => this.request<License>('post', `/promo/${key}`)
}

export default new Api();