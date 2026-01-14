export interface Config {
  apiUrl: string;
  timeout: number;
  retries: number;
}

export class ConfigManager {
  private config: Config | null = null;

  // 🔴 BREAKING CHANGE: Return type changed from Config to Config | null
  getConfig(): Config | null {
    return this.config;
  }

  setConfig(config: Config): void {
    this.config = config;
  }

  // 🟢 SAFE CHANGE: New method for validation
  validateConfig(): boolean {
    if (!this.config) {
      return false;
    }
    return this.config.apiUrl.length > 0 && this.config.timeout > 0;
  }
}
