# 📚 Guia de Desenvolvimento - Módulos

## 🎯 Objetivos dos Módulos

### Módulo Ponto
- Registrar entrada e saída de colaboradores
- Gerenciar usuários e suas permissões
- Gerar relatórios de ponto
- Autenticação de acesso

### Módulo Comercial
- Criar e gerenciar pedidos de clientes
- Controlar produtos disponíveis para venda
- Acompanhar status de pedidos

### Módulo Administrativo
- Cadastrar e gerenciar clientes
- Manter dados de contato
- Gerenciar informações de faturamento

### Módulo Produtos
- Manter catálogo de produtos/serviços
- Controlar preços e estoque
- Categorizar produtos

---

## 📝 Padrões de Tela

Todas as telas seguem um padrão consistente:

### 1. **Tela Home do Módulo**
Exibe opções de acesso rápido aos sub-módulos.

```javascript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';

export default function ModuloHomeScreen() {
  const navigate = useNavigate();
  
  const opcoes = [
    {
      title: 'Opção 1',
      description: 'Descrição da opção',
      path: '/modulo/opcao1',
      icon: <IconComponent />,
    },
  ];

  return (
    <Box sx={{ padding: '30px 20px' }}>
      <Typography variant="h5" gutterBottom>
        Módulo Nome
      </Typography>
      <Grid container spacing={3}>
        {opcoes.map((opcao) => (
          <Grid item xs={12} sm={6} md={4} key={opcao.title}>
            <Card>
              <CardActionArea onClick={() => navigate(opcao.path)}>
                <CardContent>{/* Conteúdo */}</CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
```

### 2. **Tela de Lista**
Exibe dados em tabela com ações (CRUD).

```javascript
import React from 'react';
import { 
  Box, Typography, Button, 
  Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function ListaScreen() {
  const [dados, setDados] = React.useState([]);

  const handleNovo = () => {
    // Abrir formulário
  };

  const handleEditar = (id) => {
    // Editar item
  };

  const handleDeletar = (id) => {
    // Deletar item
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <Typography variant="h5">Lista</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleNovo}>
          Novo
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Coluna 1</TableCell>
              <TableCell>Coluna 2</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dados.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.coluna1}</TableCell>
                <TableCell>{item.coluna2}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleEditar(item.id)}>
                    Editar
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDeletar(item.id)}>
                    Deletar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
```

---

## 🔧 Implementação de CRUD

### 1. Criar Serviço de API
Crie `/src/modules/{modulo}/services/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL;

export const recursoService = {
  async listar() {
    const response = await fetch(`${API_BASE_URL}/recursos`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  },
  
  async criar(dados) {
    const response = await fetch(`${API_BASE_URL}/recursos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(dados)
    });
    return response.json();
  },
  // ... atualizar e deletar
};
```

### 2. Usar em Componente
```javascript
import { recursoService } from './services/api';

export default function ListaScreen() {
  const [recursos, setRecursos] = React.useState([]);
  const [carregando, setCarregando] = React.useState(false);

  React.useEffect(() => {
    carregarRecursos();
  }, []);

  const carregarRecursos = async () => {
    setCarregando(true);
    try {
      const dados = await recursoService.listar();
      setRecursos(dados);
    } catch (error) {
      console.error('Erro:', error);
      // Mostrar toast de erro
    } finally {
      setCarregando(false);
    }
  };

  const handleNovo = async (novoRecurso) => {
    try {
      const criado = await recursoService.criar(novoRecurso);
      setRecursos([...recursos, criado]);
      // Mostrar toast de sucesso
    } catch (error) {
      // Mostrar toast de erro
    }
  };

  return (
    // ... JSX
  );
}
```

---

## 🎨 Componentes Disponíveis

Utilize os componentes compartilhados:

```javascript
// Barra de navegação
import NavBar from '../../../shared/components/NavBar';

// Avatar de usuário
import UserAvatar from '../../../shared/components/UserAvatar';

// Layout privado (com NavBar)
import PrivateLayout from '../../../shared/components/PrivateLayout';
```

---

## 🌍 Internacionalização

O projeto usa i18n para múltiplos idiomas:

```javascript
import i18n from '../../../shared/i18n/index';

// Em um componente:
const { t } = i18n;

<Typography>{t('titulo')}</Typography>
```

**Arquivos de tradução:**
- `/src/shared/i18n/pt-BR.json` - Português
- `/src/shared/i18n/en.json` - Inglês

---

## 🧪 Testes

Cada tela deve ter um arquivo de teste correspondente:

```javascript
// ListaScreen.test.js
import { render, screen } from '@testing-library/react';
import ListaScreen from './ListaScreen';

describe('ListaScreen', () => {
  it('renderiza o título', () => {
    render(<ListaScreen />);
    expect(screen.getByText(/lista/i)).toBeInTheDocument();
  });
});
```

---

## 📊 Estado Global

Para estado compartilhado entre componentes, use React Context:

```javascript
// /src/modules/{modulo}/contexts/{Recurso}Context.js
import React from 'react';

export const RecursoContext = React.createContext();

export function RecursoProvider({ children }) {
  const [recursos, setRecursos] = React.useState([]);

  return (
    <RecursoContext.Provider value={{ recursos, setRecursos }}>
      {children}
    </RecursoContext.Provider>
  );
}

// Em um componente:
const { recursos } = React.useContext(RecursoContext);
```

---

## 📋 Checklist de Implementação

Para cada nova tela, verifique:

- [ ] Criada em `/src/modules/{modulo}/screens/{NomeScreen}.js`
- [ ] Adicionada ao arquivo `routes.js`
- [ ] Implementada autenticação (private: true/false)
- [ ] Serviço de API criado
- [ ] Integração com Material-UI
- [ ] Responsividade mobile
- [ ] Mensagens de erro e sucesso
- [ ] Loading states
- [ ] Validações de entrada
- [ ] Testes unitários

---

## 🚀 Deploy

Antes de fazer deploy:

```bash
npm run build
```

Verifique se todas as rotas estão funcionando corretamente.

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação em `MODULOS.md`
2. Consulte o template de serviço em `TEMPLATE_API_SERVICE.js`
3. Revise os exemplos em telas existentes
