/**
 * Template de Serviço de API para Módulos
 * 
 * Este arquivo serve como exemplo para criar serviços de API
 * em cada módulo do projeto.
 */

// Exemplo: /src/modules/comercial/services/api.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// ==================== PEDIDOS ====================

export const pedidosService = {
  // Listar todos os pedidos
  async listar() {
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      throw error;
    }
  },

  // Criar novo pedido
  async criar(pedido) {
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(pedido),
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  },

  // Atualizar pedido
  async atualizar(id, pedido) {
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(pedido),
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      throw error;
    }
  },

  // Deletar pedido
  async deletar(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao deletar pedido:', error);
      throw error;
    }
  },

  // Obter pedido específico
  async obter(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter pedido:', error);
      throw error;
    }
  },
};

// ==================== PRODUTOS ====================

export const produtosService = {
  // Listar todos os produtos
  async listar() {
    try {
      const response = await fetch(`${API_BASE_URL}/produtos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      throw error;
    }
  },

  // Criar novo produto
  async criar(produto) {
    try {
      const response = await fetch(`${API_BASE_URL}/produtos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(produto),
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  },

  // Atualizar produto
  async atualizar(id, produto) {
    try {
      const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(produto),
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  },

  // Deletar produto
  async deletar(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  },
};

// ==================== CLIENTES ====================

export const clientesService = {
  // Listar todos os clientes
  async listar() {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      throw error;
    }
  },

  // Criar novo cliente
  async criar(cliente) {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(cliente),
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  },

  // Atualizar cliente
  async atualizar(id, cliente) {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(cliente),
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  },

  // Deletar cliente
  async deletar(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      throw error;
    }
  },

  // Obter cliente específico
  async obter(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter cliente:', error);
      throw error;
    }
  },
};

/**
 * Exemplos de Uso:
 * 
 * import { pedidosService, produtosService, clientesService } from './services/api';
 * 
 * // Em um componente React:
 * const [pedidos, setPedidos] = React.useState([]);
 * 
 * React.useEffect(() => {
 *   pedidosService.listar()
 *     .then(data => setPedidos(data))
 *     .catch(error => console.error('Erro:', error));
 * }, []);
 * 
 * const handleCriarPedido = (novoPedido) => {
 *   pedidosService.criar(novoPedido)
 *     .then(data => {
 *       setPedidos([...pedidos, data]);
 *       // Mostrar mensagem de sucesso
 *     })
 *     .catch(error => console.error('Erro ao criar:', error));
 * };
 */
