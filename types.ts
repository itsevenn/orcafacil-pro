export enum BudgetStatus {
  DRAFT = 'Rascunho',
  SENT = 'Enviado',
  NEGOTIATION = 'Em Negociação',
  APPROVED = 'Aprovado',
  REJECTED = 'Recusado',
  CONVERTED = 'Venda'
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  segment: string;
  status: 'Active' | 'Inactive';
}

export type SourceType = 'INTERNAL' | 'SINAPI' | 'ORSE';

export interface CatalogItem {
  id: string;
  code: string; // SKU or SINAPI/ORSE code
  name: string;
  price: number;
  unit: string;
  category: string;
  source: SourceType;
  type: 'Product' | 'Service' | 'Composition' | 'Input';
  referenceDate?: string; // For SINAPI/ORSE
  region?: string; // For SINAPI/ORSE
}

// Deprecated in favor of CatalogItem for unified search, but kept for compatibility if needed
export interface Product extends CatalogItem {
  stock: number;
  taxRate: number;
  image?: string;
}

export interface BudgetItem {
  id: string;
  productId: string; // References CatalogItem.id
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number; // Percent
  tax: number; // Calculated value
  total: number;
  source?: SourceType; // Track where it came from
}

export interface Budget {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  expiryDate: string;
  items: BudgetItem[];
  subtotal: number;
  totalTax: number;
  totalDiscount: number;
  grandTotal: number;
  status: BudgetStatus;
  notes?: string;
}

export interface SyncStatus {
  source: 'SINAPI' | 'ORSE';
  lastUpdate: string;
  referenceMonth: string;
  status: 'Synced' | 'Outdated' | 'Syncing' | 'Error';
  region: string;
  itemCount: number;
}

export type ViewState =
  | 'dashboard'
  | 'budgets' | 'budgets_new' | 'budgets_templates'
  | 'compositions' | 'compositions_own' | 'compositions_cpu'
  | 'inputs' | 'inputs_prices'
  | 'planning'
  | 'measurements'
  | 'journal' | 'journal_logs' | 'journal_photos'
  | 'purchases' | 'purchases_requests' | 'purchases_control'
  | 'registrations' | 'clients' | 'suppliers' | 'employees'
  | 'integrations'
  | 'admin' | 'admin_company' | 'admin_sectors' | 'admin_users' | 'databases'
  | 'settings';