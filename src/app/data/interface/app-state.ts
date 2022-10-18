import { AppMode } from 'src/app/data/enum/app-mode';

export interface AppState {
  devOpenCDMSorg: {
    domains: any,
    apis: APIConfig[],
    defaultLanguage: string,
    mode: AppMode
  }
}

interface APIConfig {
  name: string;
  base: string;
  default?: boolean;
}
