export type Product = {
  serialNumber: string;
  productName: string;
  quantity: number;
  rate: number; // Inventory rate
  billingRate: number; // Billing rate
};

export const initialProducts: Product[] = [
  { serialNumber: 'SN-1001', productName: 'Quantum Laptop Pro', quantity: 100, rate: 500, billingRate: 500 },
  { serialNumber: 'SN-1002', productName: 'Quantum Laptop Air', quantity: 100, rate: 450, billingRate: 450 },
  { serialNumber: 'SN-2001', productName: 'Nebula Smartphone X', quantity: 100, rate: 300, billingRate: 300 },
  { serialNumber: 'SN-2002', productName: 'Nebula Smartphone Y', quantity: 100, rate: 280, billingRate: 280 },
  { serialNumber: 'SN-3001', productName: 'Galaxy Tablet 10', quantity: 100, rate: 250, billingRate: 250 },
  { serialNumber: 'SN-3002', productName: 'Galaxy Tablet 8', quantity: 100, rate: 220, billingRate: 220 },
  { serialNumber: 'SN-4001', productName: 'Pulse Wireless Earbuds', quantity: 100, rate: 50, billingRate: 50 },
  { serialNumber: 'SN-4002', productName: 'Pulse Wireless Headphones', quantity: 100, rate: 70, billingRate: 70 },
  { serialNumber: 'SN-5001', productName: 'Aurora Smart Watch', quantity: 100, rate: 120, billingRate: 120 },
  { serialNumber: 'SN-5002', productName: 'Aurora Fitness Tracker', quantity: 100, rate: 90, billingRate: 90 },
];


