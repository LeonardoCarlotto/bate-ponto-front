# Endpoints API - Exemplos cURL

## Autenticação e Usuários

### Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }'
```

### Listar todos os usuários (Admin)
```bash
curl -X GET http://localhost:8080/user/all \
  -H "Authorization: Bearer {token}"
```

### Atualizar perfil do usuário
```bash
curl -X PUT http://localhost:8080/user/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "name": "Novo Nome",
    "email": "novo@email.com",
    "urlPhoto": "https://exemplo.com/foto.jpg"
  }'
```

### Alterar própria senha
```bash
curl -X POST http://localhost:8080/user/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "currentPassword": "senha_atual",
    "newPassword": "nova_senha"
  }'
```

### Alterar senha de outro usuário (Admin)
```bash
curl -X POST http://localhost:8080/user/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "targetUserId": 123,
    "newPassword": "nova_senha"
  }'
```

### Atualizar foto do usuário
```bash
curl -X POST http://localhost:8080/user/photo/change \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "urlPhoto": "https://exemplo.com/nova_foto.jpg"
  }'
```

## Registro de Ponto

### Registrar ponto
```bash
curl -X POST http://localhost:8080/registers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "dataTime": "2026-03-06T10:30:00-03:00"
  }'
```

### Buscar registros do usuário logado
```bash
curl -X GET http://localhost:8080/registers/user \
  -H "Authorization: Bearer {token}"
```

### Buscar registros de usuário específico (Admin)
```bash
curl -X GET http://localhost:8080/registers/user/123 \
  -H "Authorization: Bearer {token}"
```

### Atualizar registro
```bash
curl -X PUT http://localhost:8080/registers/456/edit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "dataTime": "2026-03-06T10:35:00-03:00"
  }'
```

### Criar registro manual
```bash
curl -X POST http://localhost:8080/registers/manual \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "userId": 123,
    "dataTime": "2026-03-06T10:40:00-03:00",
    "observacao": "Registro manual"
  }'
```

### Download PDF relatório próprio
```bash
curl -X GET "http://localhost:8080/registers/user/pdf?mes=3&ano=2026" \
  -H "Authorization: Bearer {token}" \
  --output relatorio_ponto.pdf
```

### Download PDF relatório usuário específico (Admin)
```bash
curl -X GET "http://localhost:8080/registers/user/123/pdf?mes=3&ano=2026" \
  -H "Authorization: Bearer {token}" \
  --output relatorio_ponto_usuario.pdf
```

## Produtos

### Listar produtos
```bash
curl -X GET "http://localhost:8080/produtos?categoria=eletronicos&pagina=1&limite=10" \
  -H "Authorization: Bearer {token}"
```

### Obter produto específico
```bash
curl -X GET http://localhost:8080/produtos/123 \
  -H "Authorization: Bearer {token}"
```

### Criar produto
```bash
curl -X POST http://localhost:8080/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "nome": "Produto Exemplo",
    "descricao": "Descrição do produto",
    "preco": 99.99,
    "estoque": 100,
    "categoriaId": 1,
    "sku": "SKU001"
  }'
```

### Atualizar produto
```bash
curl -X PUT http://localhost:8080/produtos/123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "nome": "Produto Atualizado",
    "preco": 149.99
  }'
```

### Deletar produto
```bash
curl -X DELETE http://localhost:8080/produtos/123 \
  -H "Authorization: Bearer {token}"
```

### Atualizar estoque
```bash
curl -X PATCH http://localhost:8080/produtos/123/estoque \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "quantidade": 50
  }'
```

### Buscar produtos por categoria
```bash
curl -X GET http://localhost:8080/produtos/categoria/eletronicos \
  -H "Authorization: Bearer {token}"
```

## Categorias

### Listar categorias
```bash
curl -X GET http://localhost:8080/categorias \
  -H "Authorization: Bearer {token}"
```

### Criar categoria
```bash
curl -X POST http://localhost:8080/categorias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "nome": "Eletrônicos",
    "descricao": "Produtos eletrônicos"
  }'
```

### Atualizar categoria
```bash
curl -X PUT http://localhost:8080/categorias/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "nome": "Eletrônicos e Gadgets"
  }'
```

### Deletar categoria
```bash
curl -X DELETE http://localhost:8080/categorias/1 \
  -H "Authorization: Bearer {token}"
```

## Imagens de Produtos

### Listar imagens do produto
```bash
curl -X GET http://localhost:8080/produtos/123/imagens \
  -H "Authorization: Bearer {token}"
```

### Adicionar imagem ao produto
```bash
curl -X POST http://localhost:8080/produtos/123/imagens \
  -H "Authorization: Bearer {token}" \
  -F "imagem=@/caminho/da/imagem.jpg"
```

### Remover imagem
```bash
curl -X DELETE http://localhost:8080/produtos/123/imagens/456 \
  -H "Authorization: Bearer {token}"
```

## Variações de Produtos

### Listar variações do produto
```bash
curl -X GET http://localhost:8080/produtos/123/variacoes \
  -H "Authorization: Bearer {token}"
```

### Criar variação
```bash
curl -X POST http://localhost:8080/produtos/123/variacoes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "cor": "Azul",
    "tamanho": "M",
    "preco": 109.99,
    "estoque": 20
  }'
```

### Atualizar variação
```bash
curl -X PUT http://localhost:8080/produtos/123/variacoes/456 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "preco": 119.99,
    "estoque": 15
  }'
```

### Deletar variação
```bash
curl -X DELETE http://localhost:8080/produtos/123/variacoes/456 \
  -H "Authorization: Bearer {token}"
```

## Clientes

### Listar clientes
```bash
curl -X GET "http://localhost:8080/clientes?pagina=1&limite=10&nome=joao" \
  -H "Authorization: Bearer {token}"
```

### Obter cliente específico
```bash
curl -X GET http://localhost:8080/clientes/123 \
  -H "Authorization: Bearer {token}"
```

### Criar cliente
```bash
curl -X POST http://localhost:8080/clientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "cpfCnpj": "123.456.789-00",
    "telefone": "(11) 99999-9999",
    "tipo": "PF"
  }'
```

### Atualizar cliente
```bash
curl -X PUT http://localhost:8080/clientes/123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "nome": "João Silva Santos",
    "telefone": "(11) 88888-8888"
  }'
```

### Deletar cliente
```bash
curl -X DELETE http://localhost:8080/clientes/123 \
  -H "Authorization: Bearer {token}"
```

### Buscar cliente por CPF/CNPJ
```bash
curl -X GET http://localhost:8080/clientes/documento/123.456.789-00 \
  -H "Authorization: Bearer {token}"
```

### Buscar cliente por email
```bash
curl -X GET http://localhost:8080/clientes/email/joao@exemplo.com \
  -H "Authorization: Bearer {token}"
```

## Endereços de Clientes

### Listar endereços do cliente
```bash
curl -X GET http://localhost:8080/clientes/123/enderecos \
  -H "Authorization: Bearer {token}"
```

### Adicionar endereço ao cliente
```bash
curl -X POST http://localhost:8080/clientes/123/enderecos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "logradouro": "Rua das Flores",
    "numero": "123",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567",
    "tipo": "residencial"
  }'
```

### Remover endereço
```bash
curl -X DELETE http://localhost:8080/clientes/123/enderecos/456 \
  -H "Authorization: Bearer {token}"
```

## Contatos de Clientes

### Listar contatos do cliente
```bash
curl -X GET http://localhost:8080/clientes/123/contatos \
  -H "Authorization: Bearer {token}"
```

### Adicionar contato ao cliente
```bash
curl -X POST http://localhost:8080/clientes/123/contatos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "tipo": "telefone",
    "valor": "(11) 77777-7777",
    "descricao": "Telefone comercial"
  }'
```

### Remover contato
```bash
curl -X DELETE http://localhost:8080/clientes/123/contatos/456 \
  -H "Authorization: Bearer {token}"
```

## Fornecedores

### Listar fornecedores
```bash
curl -X GET "http://localhost:8080/fornecedores?pagina=1&limite=10&nome=empresa" \
  -H "Authorization: Bearer {token}"
```

### Obter fornecedor específico
```bash
curl -X GET http://localhost:8080/fornecedores/123 \
  -H "Authorization: Bearer {token}"
```

### Criar fornecedor
```bash
curl -X POST http://localhost:8080/fornecedores \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "nome": "Empresa Fornecedora Ltda",
    "cnpj": "12.345.678/0001-90",
    "email": "contato@fornecedor.com",
    "telefone": "(11) 3333-3333",
    "inscricaoEstadual": "123456789"
  }'
```

### Atualizar fornecedor
```bash
curl -X PUT http://localhost:8080/fornecedores/123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "nome": "Empresa Fornecedora S.A.",
    "telefone": "(11) 4444-4444"
  }'
```

### Deletar fornecedor
```bash
curl -X DELETE http://localhost:8080/fornecedores/123 \
  -H "Authorization: Bearer {token}"
```

### Buscar fornecedor por CNPJ
```bash
curl -X GET http://localhost:8080/fornecedores/cnpj/12.345.678/0001-90 \
  -H "Authorization: Bearer {token}"
```

## Contatos de Fornecedores

### Listar contatos do fornecedor
```bash
curl -X GET http://localhost:8080/fornecedores/123/contatos \
  -H "Authorization: Bearer {token}"
```

### Adicionar contato ao fornecedor
```bash
curl -X POST http://localhost:8080/fornecedores/123/contatos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "nome": "José Comprador",
    "cargo": "Gerente de Compras",
    "email": "jose@fornecedor.com",
    "telefone": "(11) 5555-5555"
  }'
```

### Remover contato
```bash
curl -X DELETE http://localhost:8080/fornecedores/123/contatos/456 \
  -H "Authorization: Bearer {token}"
```

## Endereços de Fornecedores

### Listar endereços do fornecedor
```bash
curl -X GET http://localhost:8080/fornecedores/123/enderecos \
  -H "Authorization: Bearer {token}"
```

### Adicionar endereço ao fornecedor
```bash
curl -X POST http://localhost:8080/fornecedores/123/enderecos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "logradouro": "Av. Industrial",
    "numero": "1000",
    "bairro": "Distrito Industrial",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "04567-890",
    "tipo": "comercial"
  }'
```

### Remover endereço
```bash
curl -X DELETE http://localhost:8080/fornecedores/123/enderecos/456 \
  -H "Authorization: Bearer {token}"
```

## Pedidos

### Listar pedidos
```bash
curl -X GET "http://localhost:8080/pedidos?status=pendente&pagina=1&limite=10" \
  -H "Authorization: Bearer {token}"
```

### Obter pedido específico
```bash
curl -X GET http://localhost:8080/pedidos/123 \
  -H "Authorization: Bearer {token}"
```

### Criar pedido
```bash
curl -X POST http://localhost:8080/pedidos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "clienteId": 123,
    "dataPedido": "2026-03-06T10:30:00-03:00",
    "status": "pendente",
    "valorTotal": 299.97,
    "observacoes": "Pedido de teste"
  }'
```

### Atualizar pedido
```bash
curl -X PUT http://localhost:8080/pedidos/123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "status": "aprovado",
    "observacoes": "Pedido aprovado"
  }'
```

### Deletar pedido
```bash
curl -X DELETE http://localhost:8080/pedidos/123 \
  -H "Authorization: Bearer {token}"
```

### Atualizar status do pedido
```bash
curl -X PATCH http://localhost:8080/pedidos/123/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "status": "enviado"
  }'
```

## Itens de Pedidos

### Listar itens do pedido
```bash
curl -X GET http://localhost:8080/pedidos/123/itens \
  -H "Authorization: Bearer {token}"
```

### Adicionar item ao pedido
```bash
curl -X POST http://localhost:8080/pedidos/123/itens \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "produtoId": 456,
    "quantidade": 2,
    "precoUnitario": 99.99,
    "desconto": 10.00
  }'
```

### Remover item do pedido
```bash
curl -X DELETE http://localhost:8080/pedidos/123/itens/456 \
  -H "Authorization: Bearer {token}"
```

## Produtos Comerciais

### Listar produtos comerciais
```bash
curl -X GET "http://localhost:8080/comercial/produtos?disponivel=true&pagina=1" \
  -H "Authorization: Bearer {token}"
```

### Obter produto comercial
```bash
curl -X GET http://localhost:8080/comercial/produtos/123 \
  -H "Authorization: Bearer {token}"
```

### Criar produto comercial
```bash
curl -X POST http://localhost:8080/comercial/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "produtoId": 456,
    "precoVenda": 199.99,
    "descontoMaximo": 20.00,
    "comissao": 5.00,
    "ativo": true
  }'
```

### Atualizar produto comercial
```bash
curl -X PUT http://localhost:8080/comercial/produtos/123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "precoVenda": 219.99,
    "descontoMaximo": 25.00
  }'
```

### Deletar produto comercial
```bash
curl -X DELETE http://localhost:8080/comercial/produtos/123 \
  -H "Authorization: Bearer {token}"
```

### Atualizar estoque comercial
```bash
curl -X PATCH http://localhost:8080/comercial/produtos/123/estoque \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "quantidade": 75
  }'
```

## Pacotes

### Listar pacotes
```bash
curl -X GET "http://localhost:8080/pacotes?pagina=1&limite=10" \
  -H "Authorization: Bearer {token}"
```

### Obter pacote específico
```bash
curl -X GET http://localhost:8080/pacotes/123 \
  -H "Authorization: Bearer {token}"
```

### Criar pacote
```bash
curl -X POST http://localhost:8080/pacotes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "nome": "Pacote Premium",
    "descricao": "Pacote com produtos selecionados",
    "preco": 499.99,
    "produtos": [
      {
        "produtoId": 1,
        "quantidade": 2
      },
      {
        "produtoId": 2,
        "quantidade": 1
      }
    ],
    "ativo": true
  }'
```

### Atualizar pacote
```bash
curl -X PUT http://localhost:8080/pacotes/123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "nome": "Pacote Premium Atualizado",
    "preco": 599.99
  }'
```

### Deletar pacote
```bash
curl -X DELETE http://localhost:8080/pacotes/123 \
  -H "Authorization: Bearer {token}"
```

## Observações Gerais

- **Base URL**: Substitua `http://localhost:8080` pela URL real do seu backend
- **Token**: Substitua `{token}` pelo token JWT válido obtido no login
- **IDs**: Substitua os IDs numéricos (123, 456, etc.) pelos IDs reais dos recursos
- **Content-Type**: A maioria das requisições usa `application/json`
- **Upload de arquivos**: Requisições de upload usam `multipart/form-data`
- **Query Parameters**: Parâmetros de consulta são opcionais e podem ser combinados
- **Respostas esperadas**: 
  - 200/201: Sucesso
  - 401: Não autorizado (token inválido/expirado)
  - 403: Proibido (sem permissão)
  - 404: Não encontrado
  - 500: Erro interno do servidor
