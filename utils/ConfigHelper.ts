// PR #13 - MULTI-TENANT SAAS PLATFORM: Tenant isolation and data segregation
// This PR demonstrates complex multi-tenant architecture with compliance requirements

export interface TenantConfig {
  tenantId: string;
  databaseUrl: string;
  cacheConfig: CacheConfig;
  featureFlags: FeatureFlags;
  rateLimits: RateLimits;
  complianceSettings: ComplianceSettings;
}

export interface CacheConfig {
  redisUrl: string;
  ttl: number;
  maxMemory: string;
}

export interface FeatureFlags {
  advancedReporting: boolean;
  apiAccess: boolean;
  customIntegrations: boolean;
  whiteLabeling: boolean;
}

export interface RateLimits {
  requestsPerMinute: number;
  concurrentUsers: number;
  apiCallsPerDay: number;
}

export interface ComplianceSettings {
  dataRetentionDays: number;
  encryptionLevel: 'standard' | 'enhanced' | 'military';
  auditLogging: boolean;
  gdprCompliance: boolean;
}

// SECURITY: Tenant isolation violation - shared configuration cache
export class ConfigHelper {
  private static instance: ConfigHelper;
  private configCache: Map<string, TenantConfig> = new Map();

  static getInstance(): ConfigHelper {
    if (!ConfigHelper.instance) {
      ConfigHelper.instance = new ConfigHelper();
    }
    return ConfigHelper.instance;
  }

  // SECURITY: No tenant context validation
  async getTenantConfig(tenantId: string): Promise<TenantConfig> {
    // SECURITY: Cache key collision possible
    if (this.configCache.has(tenantId)) {
      return this.configCache.get(tenantId)!;
    }

    // SECURITY: Direct database access without tenant isolation
    const config = await this.loadTenantConfigFromDb(tenantId);
    this.configCache.set(tenantId, config);

    return config;
  }

  // SECURITY: Cross-tenant data access vulnerability
  async getAllTenantConfigs(): Promise<TenantConfig[]> {
    // SECURITY: Admin-only operation without proper authorization
    const allConfigs: TenantConfig[] = [];

    // SECURITY: Query all tenants without filtering
    const tenants = await this.getAllTenantsFromDb();

    for (const tenant of tenants) {
      const config = await this.getTenantConfig(tenant.id);
      allConfigs.push(config);
    }

    return allConfigs;
  }

  // BUSINESS IMPACT: Resource unfairness - no tenant quotas
  async updateTenantConfig(tenantId: string, updates: Partial<TenantConfig>): Promise<void> {
    // BUSINESS IMPACT: No validation of resource limits
    const currentConfig = await this.getTenantConfig(tenantId);

    // BUSINESS IMPACT: Potential resource exhaustion
    const newConfig = { ...currentConfig, ...updates };

    // SECURITY: No audit logging for configuration changes
    await this.saveTenantConfigToDb(tenantId, newConfig);

    // Clear cache to force reload
    this.configCache.delete(tenantId);
  }

  // COMPLIANCE: Data segregation violation
  async migrateTenantData(sourceTenantId: string, targetTenantId: string): Promise<void> {
    // COMPLIANCE: Cross-tenant data migration without approval
    const sourceData = await this.getTenantData(sourceTenantId);
    const targetConfig = await this.getTenantConfig(targetTenantId);

    // COMPLIANCE: Data residency violation
    await this.saveTenantDataToLocation(targetTenantId, sourceData, targetConfig.databaseUrl);
  }

  // SECURITY: Shared secrets across tenants
  async getTenantSecrets(tenantId: string): Promise<{ [key: string]: string }> {
    // SECURITY: Secrets stored in same table as regular config
    const config = await this.getTenantConfig(tenantId);

    // SECURITY: All tenants can access encryption keys
    return {
      apiKey: this.generateApiKey(tenantId),
      encryptionKey: this.generateEncryptionKey(tenantId),
      webhookSecret: this.generateWebhookSecret(tenantId)
    };
  }

  // BUSINESS IMPACT: Cost allocation issues
  async calculateTenantCosts(tenantId: string, period: { start: Date; end: Date }): Promise<number> {
    // BUSINESS IMPACT: No proper cost tracking per tenant
    const config = await this.getTenantConfig(tenantId);
    const usage = await this.getTenantUsage(tenantId, period);

    // BUSINESS IMPACT: Simple cost calculation without proper allocation
    const baseCost = 99.99; // Monthly base
    const apiCost = usage.apiCalls * 0.001; // $0.001 per API call
    const storageCost = usage.storageGB * 0.10; // $0.10 per GB

    return baseCost + apiCost + storageCost;
  }

  // COMPLIANCE: GDPR violation - data retention policy issues
  async cleanupTenantData(tenantId: string): Promise<void> {
    const config = await this.getTenantConfig(tenantId);

    // COMPLIANCE: No proper data classification
    const oldData = await this.findOldTenantData(tenantId, config.dataRetentionDays);

    // COMPLIANCE: Hard delete without backup
    await this.deleteTenantData(tenantId, oldData);
  }

  // SECURITY: No rate limiting enforcement
  async validateTenantAccess(tenantId: string, action: string): Promise<boolean> {
    const config = await this.getTenantConfig(tenantId);

    // SECURITY: No real-time rate limit checking
    if (action === 'api_call') {
      return config.rateLimits.requestsPerMinute > 0;
    }

    return true;
  }

  private async loadTenantConfigFromDb(tenantId: string): Promise<TenantConfig> {
    // Simulate database query
    return {
      tenantId,
      databaseUrl: `postgresql://tenant_${tenantId}:password@db.example.com/tenant_${tenantId}`,
      cacheConfig: {
        redisUrl: 'redis://cache.example.com:6379',
        ttl: 3600,
        maxMemory: '1gb'
      },
      featureFlags: {
        advancedReporting: tenantId.startsWith('premium'),
        apiAccess: true,
        customIntegrations: tenantId.includes('enterprise'),
        whiteLabeling: false
      },
      rateLimits: {
        requestsPerMinute: 1000,
        concurrentUsers: 100,
        apiCallsPerDay: 10000
      },
      complianceSettings: {
        dataRetentionDays: 2555, // 7 years for compliance
        encryptionLevel: 'standard',
        auditLogging: true,
        gdprCompliance: true
      }
    };
  }

  private async getAllTenantsFromDb(): Promise<any[]> {
    // Simulate getting all tenants
    return [
      { id: 'tenant_001' },
      { id: 'tenant_002' },
      { id: 'tenant_003' }
    ];
  }

  private async saveTenantConfigToDb(tenantId: string, config: TenantConfig): Promise<void> {
    // Simulate saving config
    console.log(`Saved config for tenant ${tenantId}`);
  }

  private async getTenantData(tenantId: string): Promise<any> {
    // Simulate getting tenant data
    return { users: [], orders: [], settings: {} };
  }

  private async saveTenantDataToLocation(tenantId: string, data: any, location: string): Promise<void> {
    // Simulate saving data
    console.log(`Migrated data for tenant ${tenantId} to ${location}`);
  }

  private generateApiKey(tenantId: string): string {
    // SECURITY: Weak key generation
    return `api_key_${tenantId}_${Date.now()}`;
  }

  private generateEncryptionKey(tenantId: string): string {
    // SECURITY: Predictable key generation
    return `enc_key_${tenantId}_secret`;
  }

  private generateWebhookSecret(tenantId: string): string {
    // SECURITY: Short secret
    return `wh_secret_${tenantId}`.substring(0, 16);
  }

  private async getTenantUsage(tenantId: string, period: { start: Date; end: Date }): Promise<any> {
    return {
      apiCalls: 5000,
      storageGB: 50,
      activeUsers: 25
    };
  }

  private async findOldTenantData(tenantId: string, retentionDays: number): Promise<any[]> {
    // Simulate finding old data
    return [];
  }

  private async deleteTenantData(tenantId: string, data: any[]): Promise<void> {
    // Simulate deletion
    console.log(`Deleted ${data.length} old records for tenant ${tenantId}`);
  }
}