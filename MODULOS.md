# Estrutura de Módulos - Bate Ponto Front

## 📋 Visão Geral
Este projeto é um sistema web para gerenciamento de ponto, produtos e clientes em um estúdio fotográfico. A aplicação está organizada em módulos independentes, cada um responsável por uma área específica do sistema.

## 🗂️ Estrutura de Módulos

### 1. **Módulo Home** (`/src/modules/home`)
Ponto de entrada da aplicação que exibe um painel com acesso rápido a todos os módulos.

**Telas:**
- `HomeScreen.js` - Painel principal com 4 cartões de acesso:
  - Registrar Ponto
  - Comercial
  - Administrativo
  - Produtos

**Rotas:**
```
/ - HomeScreen (painel de módulos)
```

---

### 2. **Módulo Ponto** (`/src/modules/ponto`)
Gerenciamento de ponto eletrônico para colaboradores.

**Telas:**
- `PontoHomeScreen.js` - Menu do módulo ponto
- `LoginScreen.js` - Autenticação de usuários
- `DashboardScreen.js` - Registro de ponto (entrada/saída)
- `EditUserScreen.js` - Edição de perfil
- `ChangePasswordScreen.js` - Alteração de senha
- `ReportScreen.js` - Relatórios de ponto
- `AdminEditedRegistersScreen.js` - Edição de registros (admin)
- `CreateUserScreen.js` - Criação de novos usuários (admin)
- `UserListScreen.js` - Lista de usuários (admin)

**Rotas:**
```
/login                    - LoginScreen
/ponto                    - PontoHomeScreen (home do módulo)
/ponto/dashboard          - DashboardScreen (registro de ponto)
/ponto/edit-profile       - EditUserScreen
/ponto/change-password    - ChangePasswordScreen
/ponto/report             - ReportScreen
/ponto/admin              - AdminEditedRegistersScreen (admin)
/ponto/create-user        - CreateUserScreen (admin)
/ponto/users              - UserListScreen (admin)
```

---

### 3. **Módulo Comercial** (`/src/modules/comercial`)
Gerenciamento de pedidos e produtos comerciais.

**Telas:**
- `ComercialHomeScreen.js` - Menu do módulo comercial
- `PedidosScreen.js` - Gerenciamento de pedidos
- `ProdutosComercialScreen.js` - Gerenciamento de produtos

**Rotas:**
```
/comercial              - ComercialHomeScreen (home do módulo)
/comercial/pedidos      - PedidosScreen
/comercial/produtos     - ProdutosComercialScreen
```

---

### 4. **Módulo Administrativo** (`/src/modules/administrativo`)
Gerenciamento de clientes e informações administrativas.

**Telas:**
- `AdministrativoHomeScreen.js` - Menu do módulo administrativo
- `ClientesScreen.js` - Gerenciamento de clientes

**Rotas:**
```
/administrativo              - AdministrativoHomeScreen (home do módulo)
/administrativo/clientes     - ClientesScreen
```

---

### 5. **Módulo Produtos** (`/src/modules/produtos`)
Controle de produtos e serviços.

**Telas:**
- `ProdutosHomeScreen.js` - Menu do módulo produtos
- `ListaProdutosScreen.js` - Lista completa de produtos

**Rotas:**
```
/produtos       - ProdutosHomeScreen (home do módulo)
/produtos/lista - ListaProdutosScreen
```

---

## 🔄 Fluxo de Navegação

```
Login (/login)
    ↓
Home (/)
    ├─ Ponto (/ponto)
    │  ├─ Dashboard (/ponto/dashboard)
    │  ├─ Meu Perfil (/ponto/edit-profile)
    │  ├─ Mudar Senha (/ponto/change-password)
    │  ├─ Relatórios (/ponto/report)
    │  └─ Admin (/ponto/admin, /ponto/create-user, /ponto/users)
    │
    ├─ Comercial (/comercial)
    │  ├─ Pedidos (/comercial/pedidos)
    │  └─ Produtos (/comercial/produtos)
    │
    ├─ Administrativo (/administrativo)
    │  └─ Clientes (/administrativo/clientes)
    │
    └─ Produtos (/produtos)
       └─ Lista (/produtos/lista)
```

---

## 📁 Estrutura de Arquivos

Cada módulo segue a seguinte estrutura:

```
/src/modules/{modulo}/
├── routes.js           # Definição das rotas do módulo
├── screens/            # Telas do módulo
│   ├── {TelaScreen}.js
│   └── ...
├── services/           # (Opcional) Serviços de API
├── contexts/           # (Opcional) Contextos React
└── hooks/              # (Opcional) Hooks customizados
```

---

## 🔌 Integração de Rotas

As rotas são centralizadas em `/src/routes/index.js` e importam as rotas de cada módulo:

```javascript
import pontoRoutes from "../modules/ponto/routes.js";
import homeRoutes from "../modules/home/routes.js";
import comercialRoutes from "../modules/comercial/routes.js";
import administrativoRoutes from "../modules/administrativo/routes.js";
import produtosRoutes from "../modules/produtos/routes.js";

export const routes = [
  ...homeRoutes,
  ...pontoRoutes,
  ...comercialRoutes,
  ...administrativoRoutes,
  ...produtosRoutes,
];
```

---

## 🔐 Autenticação

As rotas são classificadas como:
- **public** (`private: false`): Acessíveis sem autenticação (ex: `/login`)
- **private** (`private: true`): Requerem autenticação (todos os módulos exceto login)

A autenticação é gerenciada pelo `AuthContext` do módulo ponto e controlada pelo `RouteRenderer`.

---

## 🚀 Como Adicionar uma Novo Módulo

1. Crie uma pasta em `/src/modules/{novo-modulo}/`
2. Crie as pastas `screens/` (e outras conforme necessário)
3. Crie o arquivo `routes.js` com as rotas do módulo
4. Importe e adicione as rotas em `/src/routes/index.js`
5. Atualize o `HomeScreen` com um novo card para acessar o módulo

---

## 🎨 Componentes Reutilizáveis

Os seguintes componentes estão disponíveis em `/src/shared/components/`:
- `PrivateLayout.js` - Layout privado com NavBar
- `NavBar.js` - Barra de navegação
- `UserAvatar.js` - Avatar do usuário

---

## 📝 Próximos Passos

- [ ] Implementar chamadas de API nos serviços
- [ ] Adicionar validações nos formulários
- [ ] Implementar lógica de CRUD para cada módulo
- [ ] Adicionar testes unitários
- [ ] Melhorar design e UX das telas
