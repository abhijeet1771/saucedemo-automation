// BREAKING: Complete restructuring of exports
// Old imports will break - everything moved to subdirectories

export * from './types/CoreTypes';

// BREAKING: Page objects now require configuration
export { LoginPage } from './pages/LoginPage';
export { ProductPage } from './pages/ProductPage';
export { CartPage } from './pages/CartPage';

// BREAKING: Services now use dependency injection
export { AuthService, AuthServiceFactory } from './services/AuthService';
export { OrderService } from './services/OrderService';

// BREAKING: Utils now have async initialization
export { ConfigHelper } from './utils/ConfigHelper';
export { DataGenerator } from './utils/DataGenerator';
export { TestDataHelper } from './utils/TestDataHelper';
export { ValidationHelper } from './utils/ValidationHelper';

// BREAKING: New factory pattern required
export class AutomationFramework {
    private config: any;

    constructor(config: {
        baseUrl: string;
        timeout: number;
        retries: number;
        environment: 'dev' | 'staging' | 'prod';
    }) {
        this.config = config;
    }

    // BREAKING: Factory method instead of direct construction
    static async create(config: any): Promise<AutomationFramework> {
        // BREAKING: Async initialization required
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async setup
        return new AutomationFramework(config);
    }

    // BREAKING: All methods now async
    async createLoginPage(page: any): Promise<any> {
        const { LoginPage } = await import('./pages/LoginPage');
        return new LoginPage(page, this.config);
    }

    async createProductPage(page: any): Promise<any> {
        const { ProductPage } = await import('./pages/ProductPage');
        return new ProductPage(page, this.config);
    }

    async createCartPage(page: any): Promise<any> {
        const { CartPage } = await import('./pages/CartPage');
        return new CartPage(page, this.config);
    }

    async getAuthService(): Promise<any> {
        const { AuthService } = await import('./services/AuthService');
        return AuthService.getInstance();
    }

    async getOrderService(): Promise<any> {
        const { OrderService } = await import('./services/OrderService');
        return new OrderService(this.config);
    }
}

// BREAKING: Default export changed
export default AutomationFramework;
