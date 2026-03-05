<p align="center">
  <img src="https://wrncxjrdzmdqfxyzpayy.supabase.co/storage/v1/object/public/imagem-do-sistema/DiretoAI_logo.png" alt="Logo DiretoAI" width="250"/>
</p>

<h1 align="center">DiretoAI v2.0 - Showcase / Portfólio</h1>

<p align="center">
  Este repositório é uma demonstração (Showcase) do <strong>DiretoAI v2.0</strong>, um ecossistema ERP moderno e responsivo, projetado para unificar a gestão de empresas integrando IA nativamente em Vendas, Estoque e Recursos Humanos.
</p>

> **Aviso de Privacidade:** Por motivos de segurança e propriedade intelectual, este repositório de Showcase não inclui chaves de API, variáveis de ambiente ou o banco de dados de produção (Supabase). Ele serve exclusivamente para demonstração de arquitetura, qualidade de código e proficiência do desenvolvedor.

---

## 📖 Sobre o Projeto

O **DiretoAI v2.0** é o cérebro operacional de empresas modernas. Diferente de ERPs tradicionais que apenas "registram o passado", o DiretoAI foca na **proatividade**. Ele foi projetado para:
- Consolidar indicadores de todos os departamentos (Financeiro, RH, Operações).
- Emitir "Alertas de Urgência" em tempo real (ex: falta de estoque crítico).
- Integrar-se via Webhooks com agentes de Automação (n8n/Clara) para tomadas de decisão guiadas por IA.

## 🏛️ Arquitetura do Sistema

O sistema adota uma arquitetura em **Micro-Módulos em React (Vite)**, onde cada departamento atua como um subsistema encapsulado:

- **🔐 Autenticação & Contexto Global:** Gerenciado pelo `AuthContext` via Supabase Auth, controlando o nível de acesso (Admin vs Operacional).
- **📊 Módulo: Vendas & Comércio:** Integra painéis de faturamento em tempo real, rankeamento de tickets e gráficos evolutivos com `Recharts`.
- **📦 Módulo: Estoque & Logística:** Monitoramento do giro de SKUs, catálogo dinâmico de produtos e status de níveis.
- **👥 Módulo: Recursos Humanos (RH):** Gestão de Custo com Pessoal, folha de pagamento processada e métricas de turn-over.
- **👁️ Módulo: Gestão Completa (Modo Cockpit):** Um painel consolidado que permite visualização 360° em uma tela "modo apresentação" para reuniões executivas.

## 🛠️ Stack Tecnológico

Uma curadoria das melhores ferramentas modernas de desenvolvimento Web:

| Camada | Tecnologia | Propósito no Showcase |
| :--- | :--- | :--- |
| **Framework Base** | `React + Vite (TypeScript)` | Produtividade, tipagem segura (TS) e tempo de compilação ultra-rápido. |
| **Estilização** | `Tailwind CSS` | Estilização ágil com utilitários. Interface "Dark/Cyberpunk". |
| **Componentes UI** | `shadcn/ui + Radix UI` | Primitivas headless e acessíveis. Alta customização visual. |
| **Estado e Dados** | `@tanstack/react-query` | Cache, invalidação automática e fetching assíncrono inteligente de dados. |
| **Backend as a Service** | `Supabase` | Banco de Dados Postgres (Row Level Security), Storage e Autenticação nativos. |
| **Visualização de Dados** | `Recharts` | Gráficos responsivos de barras, linhas e pizza interativos. |
| **Roteamento** | `React Router DOM` | Navegação fluida tipo SPA (Single Page Application) e proteção de rotas privadas. |

## 🌟 Destaques do Código (Para Avaliadores/Recrutadores)

Se você está explorando o código, recomendo focar em:
1. **Padrão de Proteção de Rotas:** Veja `ProtectedRoute.tsx` para validação de sessões e permissões (Admin).
2. **Uso Avançado do React Query:** Visite `pages/Index.tsx` onde dados de múltiplos módulos são buscados em paralelo e oxigenados no front-end em tempo real.
3. **Gerenciamento de Estado de Apresentação:** O sistema altera toda a interface e oculta funções (como logout) quando no "Modo Demonstração". Veja `AuthContext.tsx`.

## 🤝 Créditos & Autoria

Arquitetura de Front-End, Integração Backend-as-a-Service e Design System foram desenvolvidos e concebidos inteiramente por:

<p align="left">
  <strong>Felipe Costa Morais</strong><br>
  <a href="https://github.com/FelipeCM804">Página do GitHub</a><br>
</p>
