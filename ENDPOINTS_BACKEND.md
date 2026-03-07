# 📋 Endpoints Necessários no Backend

## Resumo Geral

Este documento lista todos os endpoints que precisam ser criados no backend para suportar os serviços do frontend.

**Base URL:** `http://seu-backend.com/api`

---

## 🔐 1. AUTENTICAÇÃO

### Login
```
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "senha": "senha123"
}

Response (200):
{
  "token": "jwt_token_aqui",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "nome": "João Silva",
    "perfil": "colaborador" // ou "admin"
  }
}
```

### Verificar Token
```
GET /auth/verify
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "valido": true
}
```

---

## 📊 2. REGISTROS DE PONTO

### Registrar Ponto (Entrada/Saída)
```
POST /registros
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "tipo": "entrada" // ou "saida"
}

Response (201):
{
  "id": "registro_id",
  "usuarioId": "usuario_id",
  "tipo": "entrada",
  "horario": "2026-03-05T14:30:00Z",
  "data": "2026-03-05"
}
```

### Listar Meus Registros
```
GET /registros/meus?dataInicio=2026-03-01&dataFim=2026-03-31
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "registros": [
    {
      "id": "id1",
      "tipo": "entrada",
      "horario": "2026-03-05T08:00:00Z",
      "data": "2026-03-05"
    },
    {
      "id": "id2",
      "tipo": "saida",
      "horario": "2026-03-05T17:00:00Z",
      "data": "2026-03-05"
    }
  ]
}
```

### Listar Todos os Registros (Admin)
```
GET /registros?usuarioId={userId}&dataInicio={date}&dataFim={date}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "registros": [
    {
      "id": "id1",
      "usuarioId": "user_id",
      "usuarioNome": "João Silva",
      "tipo": "entrada",
      "horario": "2026-03-05T08:00:00Z",
      "data": "2026-03-05"
    }
  ]
}
```

### Obter Registro Específico
```
GET /registros/{registroId}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "id": "registro_id",
  "usuarioId": "usuario_id",
  "tipo": "entrada",
  "horario": "2026-03-05T08:00:00Z",
  "data": "2026-03-05"
}
```

### Editar Registro (Admin)
```
PUT /registros/{registroId}
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "horario": "2026-03-05T09:00:00Z",
  "tipo": "entrada"
}

Response (200):
{
  "id": "registro_id",
  "usuarioId": "usuario_id",
  "tipo": "entrada",
  "horario": "2026-03-05T09:00:00Z",
  "data": "2026-03-05"
}
```

### Deletar Registro (Admin)
```
DELETE /registros/{registroId}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "mensagem": "Registro deletado com sucesso"
}
```

### Obter Último Registro do Usuário
```
GET /registros/ultimo
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "id": "registro_id",
  "tipo": "entrada",
  "horario": "2026-03-05T08:00:00Z",
  "data": "2026-03-05"
}

Response (204): // Se sem registros
```

---

## 👥 3. USUÁRIOS

### Listar Todos os Usuários (Admin)
```
GET /usuarios
Headers:
  Authorization: Bearer {token}

Response (200):
[
  {
    "id": "user_id",
    "email": "user@example.com",
    "nome": "João Silva",
    "perfil": "colaborador",
    "ativo": true,
    "dataCreacao": "2026-01-01T10:00:00Z"
  }
]
```

### Obter Usuário Específico
```
GET /usuarios/{usuarioId}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "id": "user_id",
  "email": "user@example.com",
  "nome": "João Silva",
  "perfil": "colaborador",
  "ativo": true,
  "telefone": "(11) 99999-9999",
  "dataCreacao": "2026-01-01T10:00:00Z"
}
```

### Obter Perfil do Usuário Logado
```
GET /usuarios/perfil/meu
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "id": "user_id",
  "email": "user@example.com",
  "nome": "João Silva",
  "perfil": "colaborador",
  "ativo": true
}
```

### Criar Novo Usuário (Admin)
```
POST /usuarios
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "email": "newuser@example.com",
  "nome": "Maria Santos",
  "senha": "senhaTemporaria123",
  "perfil": "colaborador" // ou "admin"
}

Response (201):
{
  "id": "new_user_id",
  "email": "newuser@example.com",
  "nome": "Maria Santos",
  "perfil": "colaborador",
  "ativo": true
}
```

### Atualizar Usuário
```
PUT /usuarios/{usuarioId}
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "nome": "Maria Santos Silva",
  "telefone": "(11) 98888-8888",
  "ativo": true
}

Response (200):
{
  "id": "user_id",
  "nome": "Maria Santos Silva",
  "email": "user@example.com",
  "perfil": "colaborador",
  "ativo": true
}
```

### Atualizar Perfil do Usuário Logado
```
PUT /usuarios/perfil/meu
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "nome": "João Silva Atualizado",
  "telefone": "(11) 97777-7777"
}

Response (200):
{
  "id": "user_id",
  "nome": "João Silva Atualizado",
  "email": "user@example.com",
  "perfil": "colaborador"
}
```

### Deletar Usuário (Admin)
```
DELETE /usuarios/{usuarioId}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "mensagem": "Usuário deletado com sucesso"
}
```

### Mudar Senha
```
POST /usuarios/senha/mudar
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "senhaAtual": "senhaAntiga123",
  "novaSenha": "senhaNovaForte123"
}

Response (200):
{
  "mensagem": "Senha alterada com sucesso"
}
```

---

## 📈 4. RELATÓRIOS

### Relatório de Ponto do Usuário
```
GET /relatorios/ponto?dataInicio=2026-03-01&dataFim=2026-03-31
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "usuarioNome": "João Silva",
  "periodo": "Março 2026",
  "registros": [
    {
      "data": "2026-03-01",
      "entrada": "08:00",
      "saida": "17:00",
      "horas": "9:00"
    }
  ],
  "totalHoras": "180:00",
  "diasTrabalhados": 20
}
```

### Relatório Geral (Admin)
```
GET /relatorios/ponto/geral?dataInicio=2026-03-01&dataFim=2026-03-31&usuarioId={userId}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "periodo": "Março 2026",
  "usuarios": [
    {
      "usuarioId": "user_id",
      "usuarioNome": "João Silva",
      "totalHoras": "180:00",
      "dias": 20,
      "registros": [...]
    }
  ]
}
```

### Exportar PDF
```
GET /relatorios/exportar/pdf?dataInicio=2026-03-01&dataFim=2026-03-31
Headers:
  Authorization: Bearer {token}

Response (200):
[PDF File]
Content-Type: application/pdf
Content-Disposition: attachment; filename="relatorio.pdf"
```

### Exportar CSV
```
GET /relatorios/exportar/csv?dataInicio=2026-03-01&dataFim=2026-03-31
Headers:
  Authorization: Bearer {token}

Response (200):
[CSV File]
Content-Type: text/csv
Content-Disposition: attachment; filename="relatorio.csv"
```

---

## 🛍️ 5. PEDIDOS

### Listar Pedidos
```
GET /pedidos?status=pendente&dataInicio=2026-03-01&dataFim=2026-03-31
Headers:
  Authorization: Bearer {token}

Response (200):
[
  {
    "id": "pedido_id",
    "clienteId": "cliente_id",
    "clienteNome": "Cliente XYZ",
    "data": "2026-03-05T10:00:00Z",
    "status": "pendente",
    "valor": 1500.00
  }
]
```

### Obter Pedido Específico
```
GET /pedidos/{pedidoId}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "id": "pedido_id",
  "clienteId": "cliente_id",
  "clienteNome": "Cliente XYZ",
  "data": "2026-03-05T10:00:00Z",
  "status": "pendente",
  "valor": 1500.00,
  "descricao": "Fotos de eventos",
  "itens": [
    {
      "id": "item_id",
      "produtoId": "produto_id",
      "quantidade": 2,
      "precoUnitario": 500.00,
      "subtotal": 1000.00
    }
  ]
}
```

### Criar Pedido
```
POST /pedidos
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "clienteId": "cliente_id",
  "descricao": "Fotos de eventos",
  "itens": [
    {
      "produtoId": "produto_id",
      "quantidade": 2,
      "precoUnitario": 500.00
    }
  ]
}

Response (201):
{
  "id": "new_pedido_id",
  "clienteId": "cliente_id",
  "data": "2026-03-05T10:00:00Z",
  "status": "pendente",
  "valor": 1000.00
}
```

### Atualizar Pedido
```
PUT /pedidos/{pedidoId}
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "descricao": "Fotos de eventos atualizadas",
  "status": "confirmado"
}

Response (200):
{
  "id": "pedido_id",
  "descricao": "Fotos de eventos atualizadas",
  "status": "confirmado",
  "valor": 1000.00
}
```

### Deletar Pedido
```
DELETE /pedidos/{pedidoId}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "mensagem": "Pedido deletado com sucesso"
}
```

### Atualizar Status do Pedido
```
PATCH /pedidos/{pedidoId}/status
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "status": "entregue" // ou "pendente", "preparacao", "enviado", "cancelado"
}

Response (200):
{
  "id": "pedido_id",
  "status": "entregue"
}
```

### Listar Itens do Pedido
```
GET /pedidos/{pedidoId}/itens
Headers:
  Authorization: Bearer {token}

Response (200):
[
  {
    "id": "item_id",
    "produtoId": "produto_id",
    "produtoNome": "Foto 10x15",
    "quantidade": 2,
    "precoUnitario": 50.00,
    "subtotal": 100.00
  }
]
```

### Adicionar Item ao Pedido
```
POST /pedidos/{pedidoId}/itens
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "produtoId": "produto_id",
  "quantidade": 3,
  "precoUnitario": 75.00
}

Response (201):
{
  "id": "item_id",
  "produtoId": "produto_id",
  "quantidade": 3,
  "precoUnitario": 75.00,
  "subtotal": 225.00
}
```

### Remover Item do Pedido
```
DELETE /pedidos/{pedidoId}/itens/{itemId}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "mensagem": "Item removido com sucesso"
}
```

---

## 📦 6. PRODUTOS (COMERCIAL)

### Listar Produtos Comerciais
```
GET /comercial/produtos?categoria=fotos&estoque=true
Headers:
  Authorization: Bearer {token}

Response (200):
[
  {
    "id": "produto_id",
    "nome": "Foto 10x15",
    "descricao": "Fotografia tamanho 10x15",
    "preco": 50.00,
    "estoque": 100,
    "categoria": "fotos",
    "ativo": true
  }
]
```

### Obter Produto Específico
```
GET /comercial/produtos/{produtoId}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "id": "produto_id",
  "nome": "Foto 10x15",
  "descricao": "Fotografia tamanho 10x15",
  "preco": 50.00,
  "estoque": 100,
  "categoria": "fotos",
  "ativo": true
}
```

### Criar Produto
```
POST /comercial/produtos
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "nome": "Foto 15x21",
  "descricao": "Fotografia tamanho 15x21",
  "preco": 75.00,
  "estoque": 50,
  "categoria": "fotos"
}

Response (201):
{
  "id": "new_produto_id",
  "nome": "Foto 15x21",
  "preco": 75.00,
  "estoque": 50
}
```

### Atualizar Produto
```
PUT /comercial/produtos/{produtoId}
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "preco": 80.00,
  "descricao": "Descrição atualizada"
}

Response (200):
{
  "id": "produto_id",
  "nome": "Foto 15x21",
  "preco": 80.00,
  "descricao": "Descrição atualizada"
}
```

### Deletar Produto
```
DELETE /comercial/produtos/{produtoId}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "mensagem": "Produto deletado com sucesso"
}
```

### Atualizar Estoque
```
PATCH /comercial/produtos/{produtoId}/estoque
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "quantidade": 150
}

Response (200):
{
  "id": "produto_id",
  "estoque": 150
}
```

---

## 👥 7. CLIENTES

### Listar Clientes
```
GET /clientes?nome=João&ativo=true
Headers:
  Authorization: Bearer {token}

Response (200):
[
  {
    "id": "cliente_id",
    "nome": "João Silva",
    "cpfCnpj": "123.456.789-00",
    "email": "joao@example.com",
    "telefone": "(11) 99999-9999",
    "ativo": true,
    "dataCadastro": "2026-01-01T10:00:00Z"
  }
]
```

### Obter Cliente Específico
```
GET /clientes/{clienteId}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "id": "cliente_id",
  "nome": "João Silva",
  "cpfCnpj": "123.456.789-00",
  "email": "joao@example.com",
  "telefone": "(11) 99999-9999",
  "dataAbertura": "2026-01-01",
  "ativo": true,
  "dataCadastro": "2026-01-01T10:00:00Z"
}
```

### Criar Cliente
```
POST /clientes
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "nome": "Maria Santos",
  "cpfCnpj": "987.654.321-00",
  "email": "maria@example.com",
  "telefone": "(11) 98888-8888",
  "dataAbertura": "2026-03-05"
}

Response (201):
{
  "id": "new_cliente_id",
  "nome": "Maria Santos",
  "cpfCnpj": "987.654.321-00",
  "ativo": true
}
```

### Atualizar Cliente
```
PUT /clientes/{clienteId}
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "nome": "Maria Santos Silva",
  "email": "maria.silva@example.com",
  "ativo": true
}

Response (200):
{
  "id": "cliente_id",
  "nome": "Maria Santos Silva",
  "email": "maria.silva@example.com",
  "ativo": true
}
```

### Deletar Cliente
```
DELETE /clientes/{clienteId}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "mensagem": "Cliente deletado com sucesso"
}
```

### Buscar por CPF/CNPJ
```
GET /clientes/documento/{cpfCnpj}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "id": "cliente_id",
  "nome": "João Silva",
  "cpfCnpj": "123.456.789-00",
  "email": "joao@example.com"
}

Response (404): // Não encontrado
{
  "erro": "Cliente não encontrado"
}
```

### Buscar por Email
```
GET /clientes/email/{email}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "id": "cliente_id",
  "nome": "João Silva",
  "email": "joao@example.com"
}
```

### Listar Endereços do Cliente
```
GET /clientes/{clienteId}/enderecos
Headers:
  Authorization: Bearer {token}

Response (200):
[
  {
    "id": "endereco_id",
    "rua": "Rua Principal",
    "numero": "123",
    "complemento": "Apt 456",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01310-100",
    "principal": true
  }
]
```

### Adicionar Endereço
```
POST /clientes/{clienteId}/enderecos
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "rua": "Avenida Paulista",
  "numero": "1000",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01311-100",
  "principal": false
}

Response (201):
{
  "id": "new_endereco_id",
  "rua": "Avenida Paulista",
  "numero": "1000",
  "cidade": "São Paulo"
}
```

### Remover Endereço
```
DELETE /clientes/{clienteId}/enderecos/{enderecoId}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "mensagem": "Endereço removido com sucesso"
}
```

### Listar Contatos do Cliente
```
GET /clientes/{clienteId}/contatos
Headers:
  Authorization: Bearer {token}

Response (200):
[
  {
    "id": "contato_id",
    "tipo": "email", // ou "telefone", "celular"
    "valor": "contato@example.com",
    "principal": true
  }
]
```

### Adicionar Contato
```
POST /clientes/{clienteId}/contatos
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "tipo": "celular",
  "valor": "(11) 99999-9999",
  "principal": false
}

Response (201):
{
  "id": "new_contato_id",
  "tipo": "celular",
  "valor": "(11) 99999-9999"
}
```

### Remover Contato
```
DELETE /clientes/{clienteId}/contatos/{contatoId}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "mensagem": "Contato removido com sucesso"
}
```

---

## 📦 8. PRODUTOS (GERAL)

### Listar Produtos
```
GET /produtos?categoria=servicos&estoque=true
Headers:
  Authorization: Bearer {token}

Response (200):
[
  {
    "id": "produto_id",
    "nome": "Sessão Fotográfica",
    "categoria": "servicos",
    "preco": 500.00,
    "estoque": 999,
    "status": "ativo"
  }
]
```

### Obter Produto
```
GET /produtos/{produtoId}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "id": "produto_id",
  "nome": "Sessão Fotográfica",
  "descricao": "Sessão de fotos profissional",
  "categoria": "servicos",
  "preco": 500.00,
  "estoque": 999,
  "status": "ativo"
}
```

### Criar Produto
```
POST /produtos
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "nome": "Álbum Personalizado",
  "descricao": "Álbum com fotos personalizadas",
  "categoria": "produtos",
  "preco": 300.00,
  "estoque": 50,
  "status": "ativo"
}

Response (201):
{
  "id": "new_produto_id",
  "nome": "Álbum Personalizado",
  "preco": 300.00
}
```

### Atualizar Produto
```
PUT /produtos/{produtoId}
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "preco": 350.00,
  "estoque": 45
}

Response (200):
{
  "id": "produto_id",
  "preco": 350.00,
  "estoque": 45
}
```

### Deletar Produto
```
DELETE /produtos/{produtoId}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "mensagem": "Produto deletado com sucesso"
}
```

### Atualizar Estoque
```
PATCH /produtos/{produtoId}/estoque
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "quantidade": 100
}

Response (200):
{
  "id": "produto_id",
  "estoque": 100
}
```

### Buscar por Categoria
```
GET /produtos/categoria/{categoria}
Headers:
  Authorization: Bearer {token}

Response (200):
[
  {
    "id": "produto_id",
    "nome": "Produto",
    "categoria": "servicos",
    "preco": 500.00
  }
]
```

### Listar Categorias
```
GET /produtos/categorias
Headers:
  Authorization: Bearer {token}

Response (200):
[
  {
    "id": "cat_id_1",
    "nome": "Serviços",
    "descricao": "Serviços fotográficos"
  },
  {
    "id": "cat_id_2",
    "nome": "Produtos",
    "descricao": "Produtos impressos"
  }
]
```

### Criar Categoria
```
POST /categorias
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "nome": "Acessórios",
  "descricao": "Acessórios fotográficos"
}

Response (201):
{
  "id": "new_cat_id",
  "nome": "Acessórios"
}
```

### Atualizar Categoria
```
PUT /categorias/{categoriaId}
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "nome": "Acessórios Fotográficos",
  "descricao": "Acessórios e itens fotográficos"
}

Response (200):
{
  "id": "categoria_id",
  "nome": "Acessórios Fotográficos"
}
```

### Deletar Categoria
```
DELETE /categorias/{categoriaId}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "mensagem": "Categoria deletada com sucesso"
}
```

### Listar Imagens do Produto
```
GET /produtos/{produtoId}/imagens
Headers:
  Authorization: Bearer {token}

Response (200):
[
  {
    "id": "imagem_id",
    "url": "https://cdn.example.com/produto-1.jpg",
    "principal": true,
    "ordem": 1
  }
]
```

### Adicionar Imagem
```
POST /produtos/{produtoId}/imagens
Headers:
  Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
  imagem: [arquivo_imagem]

Response (201):
{
  "id": "new_imagem_id",
  "url": "https://cdn.example.com/produto-novo.jpg",
  "principal": false
}
```

### Remover Imagem
```
DELETE /produtos/{produtoId}/imagens/{imagemId}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "mensagem": "Imagem removida com sucesso"
}
```

### Listar Variações
```
GET /produtos/{produtoId}/variacoes
Headers:
  Authorization: Bearer {token}

Response (200):
[
  {
    "id": "variacao_id",
    "nome": "Tamanho",
    "valores": ["10x15", "15x21", "20x30"],
    "estoque": { "10x15": 50, "15x21": 30, "20x30": 20 }
  }
]
```

### Criar Variação
```
POST /produtos/{produtoId}/variacoes
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "nome": "Cor",
  "valores": ["Preto", "Branco", "Cinza"]
}

Response (201):
{
  "id": "new_variacao_id",
  "nome": "Cor",
  "valores": ["Preto", "Branco", "Cinza"]
}
```

### Atualizar Variação
```
PUT /produtos/{produtoId}/variacoes/{variacaoId}
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "valores": ["Preto", "Branco", "Cinza", "Vermelho"]
}

Response (200):
{
  "id": "variacao_id",
  "valores": ["Preto", "Branco", "Cinza", "Vermelho"]
}
```

### Deletar Variação
```
DELETE /produtos/{produtoId}/variacoes/{variacaoId}
Headers:
  Authorization: Bearer {token}

Response (200):
{
  "mensagem": "Variação deletada com sucesso"
}
```

---

## 📋 Tratamento de Erros

Todos os endpoints devem retornar os seguintes erros padrão:

### 400 Bad Request
```json
{
  "erro": "Dados inválidos",
  "detalhes": "O campo 'email' é obrigatório"
}
```

### 401 Unauthorized
```json
{
  "erro": "Token inválido ou expirado",
  "message": "Faça login novamente"
}
```

### 403 Forbidden
```json
{
  "erro": "Acesso negado",
  "message": "Você não tem permissão para acessar este recurso"
}
```

### 404 Not Found
```json
{
  "erro": "Recurso não encontrado",
  "message": "O registro solicitado não existe"
}
```

### 500 Internal Server Error
```json
{
  "erro": "Erro interno do servidor",
  "message": "Ocorreu um erro ao processar sua solicitação"
}
```

---

## 🔑 Variáveis de Ambiente Frontend

Adicione ao arquivo `.env` na raiz do projeto:

```env
REACT_APP_API_URL=http://const API_BASE_URL = process.env.REACT_APP_API_URL;:3001/api
```

---

## 📝 Notas Importantes

1. **Autenticação**: Todos os endpoints (exceto login) requerem o header `Authorization: Bearer {token}`
2. **CORS**: Certifique-se de que o backend permite requisições do frontend
3. **Validação**: O frontend faz validações básicas, mas o backend deve fazer validações completas
4. **Tratamento de Erros**: Sempre retorne mensagens de erro claras e códigos HTTP apropriados
5. **Paginação**: Considere adicionar paginação para endpoints que retornam listas grandes
6. **Rate Limiting**: Implemente rate limiting para proteger a API

---

## 🚀 Checklist de Implementação Backend

- [ ] Configurar autenticação JWT
- [ ] Implementar endpoints de login/logout
- [ ] Criar e implementar serviço de registros de ponto
- [ ] Criar e implementar serviço de usuários
- [ ] Criar e implementar serviço de pedidos
- [ ] Criar e implementar serviço de produtos
- [ ] Criar e implementar serviço de clientes
- [ ] Criar e implementar serviço de relatórios
- [ ] Adicionar validações em todos os endpoints
- [ ] Implementar tratamento de erros padrão
- [ ] Adicionar logs para auditoria
- [ ] Configurar CORS corretamente
- [ ] Testar todos os endpoints com Postman/Insomnia
- [ ] Documentar qualquer comportamento especial
