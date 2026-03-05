<p align="center">
  <img src="https://wrncxjrdzmdqfxyzpayy.supabase.co/storage/v1/object/public/imagem-do-sistema/DiretoAI_logo.png" alt="Logo DiretoAI" width="250"/>
</p>

<h1 align="center">DiretoAI v2.0 - Ecossistema ERP & Inteligência Artificial</h1>

<p align="center">
  <b>Showcase Architecture & Product Portfolio</b>
</p>

<p align="center">
  O <strong>DiretoAI v2.0</strong> não é apenas um sistema de gestão; é um ecossistema operacional autônomo. Construído para unificar e automatizar o Fluxo de Caixa, Controle de Estoque, Recursos Humanos (RH) e Atendimento Inteligente, utilizando Inteligência Artificial (Agentes de Venda e Automações) no centro do negócio.
</p>

<br>

> **🔒 Aviso de Showcase & Segurança:**  
> Este repositório é um **Showcase Público**. Por razões de governança, conformidade técnica e proteção de propriedade intelectual (PI), arquivos com variáveis de ambiente (`.env`), senhas de banco de dados, chaves de API pagas e instâncias do Supabase foram rigorosamente omitidos.  
> *O propósito deste código é demonstrar minha proficiência técnica em arquitetura frontend escalável, engenharia de React, integração clean de BaaS e design de produto centrado no usuário.*

---

## 🎯 A Visão do Produto

Sistemas ERP legados exigem que os humanos alimentem dados para ler relatórios estáticos no fim do mês. O **DiretoAI v2.0** inverte essa lógica: **A máquina trabalha e notifica o humano.**
Com a **Clara** (nossa Agente Virtual embutida), o sistema avisa proativamente via pop-ups ou webhook WhatsApp quando um nível de estoque está crítico, ou quando uma meta de vendas foi atingida. 

---

## 🏗 Arquitetura do Sistema e Design Patterns

### 1. Separação de Contextos (Domain-Driven Design no Frontend)
Em vez de um monolito de UI, o sistema é dividido em domínios de negócio claros, garantindo que o acoplamento de código seja mínimo e a escalabilidade da equipe seja máxima:

*   **🔒 Auth & Tenant:** O `AuthContext` e `ProtectedRoute` garantem o controle rigoroso de sessões (Supabase JWT), bloqueando rotas não autorizadas e gerenciando Permissões (Ex: Apenas `Admin` acessa `Usuarios.tsx`). Também lida com Multitenancy (`lojaId`) caso necessário.
*   **📡 Camada de Dados Otimizada (State Management):** Uso intensivo de `@tanstack/react-query`. Ao invés de `useEffect` verbosos para chamadas de API, os dados de tabelas críticas (como Vendas e Estoque) sãocacheados, recebem *stale-while-revalidate* e são persistidos entre abas. Isso resulta em re-renderizações mínimas e uma UI incrivelmente rápida.
*   **🎨 Design System Consistente:** UI Components totalmente isolados usando a arquitetura de *primitivas* (`shadcn/ui` + `Radix`). Comporte de Dark/Light mode gerido globalmente através de um gerador de variáveis CSS acoplado ao `Tailwind` (`ThemeContext`).

### 2. Módulos & Features Principais

#### 🛒 1. Módulo de Vendas & Financeiro (O Coração)
Mais do que registrar vendas, este módulo metrifica o pulso da empresa.
*   **Dashboard Em Tempo Real:** Gráficos interativos renderizados via `Recharts`, agregando ticket médio, receita diária e produtos campeões em tempo de execução.
*   **Carrinho / PDV Ágil:** Um painel de Vendas "Point of Sale" projetado para zero cliques desnecessários. Filtro de catálogo em memo, state local super responsivo e persistência instantânea no Supabase assim que a venda é confirmada.

#### 📦 2. Módulo de Estoque e Logística
Trata os produtos como ativos vivos.
*   **Gestão de Variantes Avançadas:** Gestão complexa de Produtos Pai e Filhos (SKUs por Tamanho/Cor).
*   **Alertas Visuais:** Estoque baixo = Badge vermelha. Interface de fácil edição em massa (tabelas dinâmicas).
*   **Integração IA:** A "Clara" reserva produtos no banco de dados autônomamente se um cliente fechar uma venda via WhatsApp, evitando *overselling* (vendas duplicadas do mesmo item).

#### 👥 3. Recursos Humanos (RH) e Equipe
Pensado para evitar o uso do Excel por equipes pequenas e médias.
*   **Gestão de Colaboradores e Turn-over:** Histórico de contratações e demissões.
*   **Folha de Pagamento Dinâmica:** (Conceitual no UI) Dashboards de RH que apontam o Custo Total de Colaboradores versus Faturamento do mês.

#### 🎙 4. Gestão Executiva ("Modo Cockpit")
Uma feature diferenciada: o **Modo Apresentação** (`user.isPresentationMode`). Ao ativar esse toggle no perfil, o ERP entra em um estado limpo de "apenas leitura", ocultando botões sensíveis, menus de edição e o botão de "Sair". É projetado para que o gerente possa transmitir a tela numa TV corporativa exibindo gráficos de BI (Business Intelligence) do momento.

---

## 🛠 Stack Tecnológico Escolhida a Dedo

O projeto foi construído tomando decisões opinativas, fugindo da complexidade desnecessária e focando em "Time to Market" sem sacrificar a escalabilidade.

| Tecnologia / Ferramenta | O papel fundamental no Ecossistema |
| :--- | :--- |
| **React 18 + TypeScript** | A espinha dorsal. Tipagem forte previne 90% dos *runtime errors* relacionados a modelagem de banco de dados no Frontend. |
| **Vite** | Compilador ultra-veloz (HMR instantâneo). Essencial para manter a produtividade alta. |
| **Tailwind CSS + Lucide Icons** | Design utility-first. Criei um arquivo `index.css` de tokens vibrantes, focando no *Glassmorphism* moderno (cards translúcidos, overlays desfocados). Lucide traz leveza em SVG puro. |
| **React Router DOM** | Roteamento Client-Side para navegação em menos de `50ms` de transição entre módulos do ERP. |
| **React Query (TanStack V5)** | A "cola" de estado de dados do servidor. Elimina todo o *Redux boilerplate*. |
| **Supabase (BaaS)** | PostgreSQL nativo, Realtime WebSockets, Storage S3-like e Edge Auth, tudo envelopado numa API Typescript super amigável (`supabase/supabase-js`). |
| **shadcn/ui** | Não é uma biblioteca (NPM binded), mas *ownable code*. Os componentes React formam a base acessível e testável da UI. |
| **Recharts** | Biblioteca React imperativa baseada em SVG e D3 para criação de Gráficos Financeiros e Heatmaps. |

---

## 🔒 Postura de Segurança e Boas Práticas (Security & Auth)

1.  **Fail-Safes Locais:** Se variáveis `.env` essenciais (como as chaves públicas do DB) estiverem faltando (Ex: um clone local mal configurado), a aplicação não trava (White Screen of Death). Ela entra num fluxo de contenção amigável do `AuthContext`, exibindo as chaves faltantes na interface.
2.  **Stateless Sessões:** Persistência de Sessão JWT através da biblioteca do Supabase atrelada ao LocalStorage, revalidando de forma *lazy* sem degradar a primeira renderização do usuário.
3.  **Client-Side RLS (Row Level Security):** O design em tese assume que o Backend (Postgres) lida com Data-Leakage via Policies de RLS (só leio minha loja / meu tenant), de forma que o vazamento da chave *Publishable* não represente perigo de engenharia social.

---

## 👨‍💻 Desenvolvedor Mestre & Architect
<br>
<table>
  <tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/211750118?v=4" width="100px;" alt="Felipe Costa Morais"/><br />
      <sub><b>Felipe Costa Morais</b></sub>
    </td>
    <td>
      Engenheiro de Produto Focado em Criar Sistemas Inteligentes e Beautiful UIs.<br><br>
      💼 <b>Conecte-se comigo:</b><br>
      • <a href="https://github.com/FelipeCM804">Meu Perfil no GitHub</a><br>
      • Especialista em: React, TypeScript, Sistemas de Gestão (ERP), Automações com IA (n8n/Make).
    </td>
  </tr>
</table>

<br>
<p align="center">
  <i>"Software não deve ser apenas útil. Ele deve ser um trunfo inteligente da empresa."</i>
</p>
