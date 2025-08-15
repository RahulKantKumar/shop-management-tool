export interface CreateProductRequest {
  // Preferred unique key in DB
  index?: string;
  name: string;
  description: string;
  price: number; // keep for compatibility; often equals billingRate
  category: string;
  stock: number;
  isActive: boolean;
  // Optional rate fields expected by Inventory UI
  inventoryRate?: number;
  billingRate?: number;
}

export interface CreatedProductResponse {
  id?: string | number;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  isActive?: boolean;
  // Allow unknown extra fields from backend
  [key: string]: unknown;
}

export interface ServerProduct extends CreatedProductResponse {
  // Preferred key sent by backend
  index?: string;
  // Back-compat: some servers might send serialNumber instead
  serialNumber?: string;
  inventoryRate?: number;
  billingRate?: number;
}

const API_BASE_URL = 'http://localhost:3000';

export async function createProduct(payload: CreateProductRequest): Promise<CreatedProductResponse> {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to create product: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
  }

  return (await response.json().catch(() => ({}))) as CreatedProductResponse;
}

export async function updateProduct(
  id: string | number,
  payload: Partial<CreateProductRequest>
): Promise<CreatedProductResponse> {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to update product: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
  }

  return (await response.json().catch(() => ({}))) as CreatedProductResponse;
}

export async function deleteProduct(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to delete product: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
  }
}

export async function updateProductByIndex(
  index: string,
  payload: Partial<CreateProductRequest>
): Promise<CreatedProductResponse> {
  const response = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(index)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to update product by index: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
  }
  return (await response.json().catch(() => ({}))) as CreatedProductResponse;
}

export async function deleteProductByIndex(index: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(index)}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to delete product by index: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
  }
}

export async function getProducts(): Promise<ServerProduct[]> {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
  }
  const data = (await response.json().catch(() => [])) as unknown;
  return Array.isArray(data) ? (data as ServerProduct[]) : [];
}


