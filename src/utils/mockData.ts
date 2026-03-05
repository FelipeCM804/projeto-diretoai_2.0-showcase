
export const MOCK_CLIENTES = [
    { id: '1', nome: 'Ana Paula Souza', email: 'anapaula@email.com', whatsapp: '(11) 98888-7777', endereco: 'Rua das Flores, 123', idade_crianca: '2 anos', genero_crianca: 'Feminino', criado_em: '2025-11-10T10:00:00Z' },
    { id: '2', nome: 'Ricardo Santos', email: 'ricardo@email.com', whatsapp: '(11) 97777-6666', endereco: 'Av. das Palmeiras, 1500', idade_crianca: '4 anos', genero_crianca: 'Masculino', criado_em: '2025-11-15T14:30:00Z' },
    { id: '3', nome: 'Bebê Conforto Creche', email: 'diretoria@bebeconforto.com', whatsapp: '(11) 3333-4444', endereco: 'Rua do Brincar, 50', idade_crianca: '6 meses', genero_crianca: 'Neutro', criado_em: '2025-12-01T09:00:00Z' },
    { id: '4', nome: 'Juliana Mendes', email: 'ju@mendes.com', whatsapp: '(11) 96666-5555', endereco: 'Rua Vergueiro, 1000', idade_crianca: '1 ano', genero_crianca: 'Feminino', criado_em: '2026-01-05T11:20:00Z' },
    { id: '5', nome: 'Marcos Oliveira', email: 'marcos@oliveira.com', whatsapp: '(11) 95555-4444', endereco: 'Rua Augusta, 200', idade_crianca: '3 anos', genero_crianca: 'Masculino', criado_em: '2026-02-10T16:45:00Z' },
];

export const MOCK_PRODUTOS = [
    { id: '1', nome: 'Body Bebê Algodão Pima', descricao: 'Body manga longa 100% algodão pima extra macio', categoria: 'Bebês', preco: 89.90, sku: 'BODY-PM-001', estoque: 5, criado_em: '2025-11-01T10:00:00Z' },
    { id: '2', nome: 'Vestido Floral com Renda', descricao: 'Vestido de festa infantil com estampa floral e detalhes em renda', categoria: 'Meninas', preco: 149.90, sku: 'VEST-FL-002', estoque: 12, criado_em: '2025-11-01T10:00:00Z' },
    { id: '3', nome: 'Conjunto Moletom Dinossauro', descricao: 'Conjunto casaco com capuz e calça de moletom forrado', categoria: 'Meninos', preco: 119.00, sku: 'CONJ-DN-003', estoque: 3, criado_em: '2025-12-01T10:00:00Z' },
    { id: '4', nome: 'Sapatinho de Lã Artesanal', descricao: 'Sapatinho feito à mão em lã antialérgica', categoria: 'Acessórios', preco: 45.00, sku: 'SAPA-LA-004', estoque: 25, criado_em: '2025-12-10T10:00:00Z' },
    { id: '5', nome: 'Manta Personalizada', descricao: 'Manta de microfibra com bordado personalizado', categoria: 'Enxoval', preco: 129.90, sku: 'MANT-PS-005', estoque: 2, criado_em: '2026-01-15T10:00:00Z' },
];

export const MOCK_TRANSACOES = [
    // --- DEZEMBRO 2025 (Pico de Vendas Natal) ---
    { id: 'd1', descricao: 'Aluguel - Dezembro', valor: 2500.00, tipo: 'DESPESA', categoria: 'Infraestrutura', data: '2025-12-05', criado_em: '2025-12-05T08:00:00Z' },
    { id: 'd2', descricao: 'Energia Elétrica', valor: 320.50, tipo: 'DESPESA', categoria: 'Contas Fixas', data: '2025-12-10', criado_em: '2025-12-10T08:00:00Z' },
    { id: 'd3', descricao: 'Vendas de Natal - Loja Física', valor: 15400.00, tipo: 'RECEITA', categoria: 'Vendas', data: '2025-12-20', criado_em: '2025-12-20T18:00:00Z' },
    { id: 'd4', descricao: 'Vendas E-commerce - Natal', valor: 8250.00, tipo: 'RECEITA', categoria: 'Vendas', data: '2025-12-24', criado_em: '2025-12-24T10:00:00Z' },
    { id: 'd5', descricao: 'Salários Equipe', valor: 4500.00, tipo: 'DESPESA', categoria: 'RH', data: '2025-12-30', criado_em: '2025-12-30T09:00:00Z' },

    // --- JANEIRO 2026 (Coleção Verão) ---
    { id: 'j1', descricao: 'Aluguel - Janeiro', valor: 2500.00, tipo: 'DESPESA', categoria: 'Infraestrutura', data: '2026-01-05', criado_em: '2026-01-05T08:00:00Z' },
    { id: 'j2', descricao: 'Internet e Telefone', valor: 150.00, tipo: 'DESPESA', categoria: 'Contas Fixas', data: '2026-01-08', criado_em: '2026-01-08T10:00:00Z' },
    { id: 'j3', descricao: 'Lançamento Coleção Verão', valor: 12800.00, tipo: 'RECEITA', categoria: 'Vendas', data: '2026-01-15', criado_em: '2026-01-15T15:00:00Z' },
    { id: 'j4', descricao: 'Marketing Digital (Ads)', valor: 800.00, tipo: 'DESPESA', categoria: 'Marketing', data: '2026-01-20', criado_em: '2026-01-20T11:00:00Z' },
    { id: 'j5', descricao: 'Vendas Bazar de Ano Novo', valor: 4200.00, tipo: 'RECEITA', categoria: 'Vendas', data: '2026-01-25', criado_em: '2026-01-25T17:00:00Z' },
    { id: 'j6', descricao: 'Salários Equipe', valor: 4500.00, tipo: 'DESPESA', categoria: 'RH', data: '2026-01-30', criado_em: '2026-01-30T09:00:00Z' },

    // --- FEVEREIRO 2026 (Liquidação e Preview Outono) ---
    { id: 'f1', descricao: 'Aluguel - Fevereiro', valor: 2500.00, tipo: 'DESPESA', categoria: 'Infraestrutura', data: '2026-02-05', criado_em: '2026-02-05T08:00:00Z' },
    { id: 'f2', descricao: 'Energia Elétrica', valor: 315.10, tipo: 'DESPESA', categoria: 'Contas Fixas', data: '2026-02-12', criado_em: '2026-02-12T08:00:00Z' },
    { id: 'f3', descricao: 'Liquidação Final de Verão', valor: 9400.00, tipo: 'RECEITA', categoria: 'Vendas', data: '2026-02-18', criado_em: '2026-02-18T18:00:00Z' },
    { id: 'f4', descricao: 'Compra Estoque Outono (Fornecedor)', valor: 2200.00, tipo: 'DESPESA', categoria: 'Fornecedores', data: '2026-02-22', criado_em: '2026-02-22T09:00:00Z' },
    { id: 'f5', descricao: 'Vendas Premium - Preview Outono', valor: 7150.00, tipo: 'RECEITA', categoria: 'Vendas', data: '2026-02-26', criado_em: '2026-02-26T21:00:00Z' },
    { id: 'f6', descricao: 'Salários Equipe', valor: 4500.00, tipo: 'DESPESA', categoria: 'RH', data: '2026-02-28', criado_em: '2026-02-28T09:00:00Z' },

    // --- MARÇO 2026 (Atual) ---
    { id: 'm1', descricao: 'Aluguel - Março', valor: 2500.00, tipo: 'DESPESA', categoria: 'Infraestrutura', data: '2026-03-02', criado_em: '2026-03-02T08:00:00Z' },
    { id: 'm2', descricao: 'Venda de Balcão - Kit Pima', valor: 1350.00, tipo: 'RECEITA', categoria: 'Vendas', data: '2026-03-03', criado_em: new Date().toISOString() },
];

export const MOCK_COLABORADORES = [
    { id: '1', nome: 'Carla Dias', cpf: '123.456.789-00', cargo: 'Vendedora Sênior', salario: 2000.00, data_admissao: '2023-01-15', status: 'ATIVO', criado_em: new Date().toISOString() },
    { id: '2', nome: 'Beatriz Lima', cpf: '987.654.321-11', cargo: 'Gerente da Loja', salario: 2500.00, data_admissao: '2022-11-10', status: 'ATIVO', criado_em: new Date().toISOString() },
];

export const MOCK_FORNECEDORES = [
    { id: '1', nome_fantasia: 'Malharia Kids Brasil', razao_social: 'Malhas e Fios Infantis LTDA', cnpj: '11.222.333/0001-44', contato: 'Marcos Ferreira', telefone: '(11) 4004-5555', email: 'pedidos@kidsbrasil.com' },
    { id: '2', nome_fantasia: 'Pezinho de Anjo', razao_social: 'Calçados Infantis Pezinho de Anjo Eireli', cnpj: '22.333.444/0001-55', contato: 'Luciana', telefone: '(11) 3222-1111', email: 'vendas@pezinhodeanjo.com' },
];

export const MOCK_VENDAS = [
    { id: 'v1', cliente_id: '1', valor_total: 239.80, status: 'PAGO', data_venda: '2025-12-15T10:00:00Z', clientes: { nome: 'Ana Paula Souza' } },
    { id: 'v2', cliente_id: '2', valor_total: 119.00, status: 'PAGO', data_venda: '2025-12-22T14:00:00Z', clientes: { nome: 'Ricardo Santos' } },
    { id: 'v3', cliente_id: '3', valor_total: 8520.00, status: 'PAGO', data_venda: '2026-01-10T09:30:00Z', clientes: { nome: 'Bebê Conforto Creche' } },
    { id: 'v4', cliente_id: '4', valor_total: 1450.00, status: 'PAGO', data_venda: '2026-01-25T16:20:00Z', clientes: { nome: 'Juliana Mendes' } },
    { id: 'v5', cliente_id: '5', valor_total: 7150.00, status: 'PAGO', data_venda: '2026-02-15T11:00:00Z', clientes: { nome: 'Marcos Oliveira' } },
    { id: 'v6', cliente_id: '1', valor_total: 1350.00, status: 'PAGO', data_venda: '2026-03-03T10:00:00Z', clientes: { nome: 'Ana Paula Souza' } },
];

export const MOCK_RESERVAS = [
    { id: 1, Produto: 'Body Bebê Algodão Pima', Nome: 'Fernanda Lima', Whatsapp: '(11) 91234-5678', "Data Reserva": "2026-03-01", "Data de Expiração": "2026-03-08", Status: 'Reservado' },
    { id: 2, Produto: 'Vestido Floral com Renda', Nome: 'Paula Rocha', Whatsapp: '(11) 92345-6789', "Data Reserva": "2026-03-02", "Data de Expiração": "2026-03-09", Status: 'Reservado' },
    { id: 3, Produto: 'Sapatinho de Lã Artesanal', Nome: 'Cláudia Silva', Whatsapp: '(11) 93456-7890', "Data Reserva": "2026-03-03", "Data de Expiração": "2026-03-10", Status: 'Reservado' },
];
