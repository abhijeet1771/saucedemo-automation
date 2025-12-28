export interface Product {
  id: string;
  // BREAKING: Removed 'name' field
  price: number;
  category: string;
  inStock: boolean;
  sku: string; // BREAKING: New required field
  description: string; // BREAKING: Now required
}

export class ProductService {
  private products: Product[] = [
    {
      id: '1',
      price: 29.99,
      category: 'electronics',
      inStock: true,
      sku: 'SKU-001', // BREAKING: Required field
      description: 'Product description' // BREAKING: Required field
    }
  ];

  // BREAKING: Changed return type and added required parameter
  async getProducts(includeInactive: boolean = false): Promise<Product[]> {
    return includeInactive ? this.products : this.products.filter(p => p.inStock);
  }
}
