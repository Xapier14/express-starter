export interface IConfigService {
  get(key: string): string;
  isDevelopment(): boolean;
}
