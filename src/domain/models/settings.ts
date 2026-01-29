export interface CompanySettings {
    name: string;
    document: string; // CNPJ or CPF
    email: string;
    phone: string;
    address: string;
    website?: string;
    logo?: string; // Base64 string for the image
    termsAndConditions?: string; // Default texts for budgets
}

export interface AppSettings {
    company: CompanySettings;
    theme: 'light' | 'dark';
    currency: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
    company: {
        name: 'Sua Empresa de Construção',
        document: '00.000.000/0001-00',
        email: 'contato@suaempresa.com.br',
        phone: '(11) 99999-9999',
        address: 'Rua Exemplo, 123 - Cidade/UF',
        termsAndConditions: '1. Validade da proposta: 15 dias.\n2. Pagamento: 50% entrada, 50% na conclusão.\n3. Não inclui serviços não listados.'
    },
    theme: 'light',
    currency: 'BRL'
};
