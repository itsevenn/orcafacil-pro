import { Budget, BudgetStatus, Client, Product, CatalogItem, SyncStatus } from './types';

export const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Roberto Silva', email: 'roberto@techsolutions.com', phone: '(11) 99999-1234', company: 'Tech Solutions Ltda', segment: 'Tecnologia', status: 'Active' },
  { id: '2', name: 'Amanda Costa', email: 'amanda@construtora.com', phone: '(21) 98888-5678', company: 'Construtora Horizonte', segment: 'Construção', status: 'Active' },
  { id: '3', name: 'Carlos Oliveira', email: 'carlos@varejo.com', phone: '(31) 97777-4321', company: 'Super Varejo SA', segment: 'Varejo', status: 'Inactive' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', code: 'SW-ERP-001', name: 'Licença Software ERP (Anual)', price: 2500.00, category: 'Software', stock: 999, taxRate: 15, source: 'INTERNAL', unit: 'UN', type: 'Product' },
  { id: 'p2', code: 'SRV-CONS-002', name: 'Consultoria Especializada (Hora)', price: 350.00, category: 'Serviços', stock: 100, taxRate: 5, source: 'INTERNAL', unit: 'H', type: 'Service' },
  { id: 'p3', code: 'HW-SRV-003', name: 'Servidor Rack 2U', price: 12000.00, category: 'Hardware', stock: 15, taxRate: 18, source: 'INTERNAL', unit: 'UN', type: 'Product' },
  { id: 'p4', code: 'SRV-MANT-004', name: 'Manutenção Mensal', price: 800.00, category: 'Serviços', stock: 50, taxRate: 5, source: 'INTERNAL', unit: 'MÊS', type: 'Service' },
];

export const MOCK_SINAPI: CatalogItem[] = [
  { id: 'sin-87301', code: '87301', name: 'ARGAMASSA TRAÇO 1:1:6 (EM VOLUME DE CIMENTO, CAL E AREIA MÉDIA ÚMIDA) PARA EMBOÇO/MASSA ÚNICA/ASSENTAMENTO DE ALVENARIA', price: 540.23, category: 'ARGAMASSAS', source: 'SINAPI', unit: 'M3', type: 'Composition', referenceDate: '10/2023', region: 'SP' },
  { id: 'sin-92540', code: '92540', name: 'TRAMA DE MADEIRA COMPOSTA POR RIPAS, CAIBROS E TERÇAS PARA TELHADOS DE ATÉ 2 AGUAS', price: 68.45, category: 'COBERTURAS', source: 'SINAPI', unit: 'M2', type: 'Composition', referenceDate: '10/2023', region: 'SP' },
  { id: 'sin-ins-34', code: '000034', name: 'AJUDANTE DE PEDREIRO COM ENCARGOS COMPLEMENTARES', price: 18.50, category: 'MÃO DE OBRA', source: 'SINAPI', unit: 'H', type: 'Input', referenceDate: '10/2023', region: 'SP' },
];

export const MOCK_ORSE: CatalogItem[] = [
  { id: 'orse-102', code: '00102', name: 'Escavação manual de valas em material de 1ª categoria, profundidade até 1,50m', price: 45.30, category: 'MOVIMENTAÇÃO DE TERRA', source: 'ORSE', unit: 'M3', type: 'Composition', referenceDate: '09/2023', region: 'SE' },
  { id: 'orse-550', code: '00550', name: 'Reaterro manual de valas com compactação mecanizada', price: 32.10, category: 'MOVIMENTAÇÃO DE TERRA', source: 'ORSE', unit: 'M3', type: 'Composition', referenceDate: '09/2023', region: 'SE' },
];

// Combined Catalog for searching
export const MOCK_CATALOG: CatalogItem[] = [
  ...MOCK_PRODUCTS,
  ...MOCK_SINAPI,
  ...MOCK_ORSE
];

export const MOCK_SYNC_STATUS: SyncStatus[] = [
  { source: 'SINAPI', lastUpdate: '2023-10-15 14:30', referenceMonth: '10/2023', status: 'Synced', region: 'SP', itemCount: 4520 },
  { source: 'ORSE', lastUpdate: '2023-09-01 09:00', referenceMonth: '09/2023', status: 'Outdated', region: 'SE', itemCount: 9850 },
];

export const MOCK_BUDGETS: Budget[] = [
  {
    id: 'orc-001',
    clientId: '1',
    clientName: 'Tech Solutions Ltda',
    date: '2023-10-01',
    expiryDate: '2023-10-15',
    status: BudgetStatus.APPROVED,
    subtotal: 12350,
    totalTax: 1500,
    totalDiscount: 0,
    grandTotal: 13850,
    items: [
      { id: 'i1', productId: 'p3', name: 'Servidor Rack 2U', quantity: 1, unitPrice: 12000, discount: 0, tax: 2160, total: 12000, source: 'INTERNAL' },
      { id: 'i2', productId: 'p2', name: 'Consultoria Especializada (Hora)', quantity: 1, unitPrice: 350, discount: 0, tax: 17.5, total: 350, source: 'INTERNAL' }
    ]
  },
  {
    id: 'orc-002',
    clientId: '2',
    clientName: 'Construtora Horizonte',
    date: '2023-10-05',
    expiryDate: '2023-10-20',
    status: BudgetStatus.SENT,
    subtotal: 5000,
    totalTax: 750,
    totalDiscount: 250,
    grandTotal: 5500,
    items: [
      { id: 'i3', productId: 'p1', name: 'Licença Software ERP', quantity: 2, unitPrice: 2500, discount: 5, tax: 375, total: 5000, source: 'INTERNAL' }
    ]
  },
  {
    id: 'orc-003',
    clientId: '3',
    clientName: 'Super Varejo SA',
    date: '2023-10-10',
    expiryDate: '2023-10-25',
    status: BudgetStatus.DRAFT,
    subtotal: 800,
    totalTax: 40,
    totalDiscount: 0,
    grandTotal: 840,
    items: []
  }
];