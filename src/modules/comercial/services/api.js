/**
 * Serviço de API - Módulo Comercial
 * Gerencia: Pedidos, Produtos
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// ==================== PEDIDOS ====================

export const pedidosService = {
  // Listar todos os pedidos
  async listar(filtros = {}) {
    try {
      const queryString = new URLSearchParams(filtros).toString();
      const response = await fetch(
        `${API_BASE_URL}/pedidos${queryString ? '?' + queryString : ''}`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao listar pedidos');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      throw error;
    }
  },

  // Obter pedido específico
  async obter(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao obter pedido');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter pedido:', error);
      throw error;
    }
  },

  // Criar novo pedido
  async criar(dados) {
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar pedido');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  },

  // Atualizar pedido
  async atualizar(id, dados) {
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar pedido');
      }

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
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar pedido');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao deletar pedido:', error);
      throw error;
    }
  },

  // Atualizar status do pedido
  async atualizarStatus(id, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  },

  // Listar itens do pedido
  async listarItens(pedidoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos/${pedidoId}/itens`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao listar itens');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar itens:', error);
      throw error;
    }
  },

  // Adicionar item ao pedido
  async adicionarItem(pedidoId, itemData) {
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos/${pedidoId}/itens`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar item');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      throw error;
    }
  },

  // Remover item do pedido
  async removerItem(pedidoId, itemId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/pedidos/${pedidoId}/itens/${itemId}`,
        {
          method: 'DELETE',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao remover item');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao remover item:', error);
      throw error;
    }
  },
};

// ==================== PRODUTOS (COMERCIAL) ====================

export const produtosComercialService = {
  // Listar produtos disponíveis para venda
  async listar(filtros = {}) {
    try {
      const queryString = new URLSearchParams(filtros).toString();
      const response = await fetch(
        `${API_BASE_URL}/comercial/produtos${
          queryString ? '?' + queryString : ''
        }`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao listar produtos');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      throw error;
    }
  },

  // Obter produto específico
  async obter(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/comercial/produtos/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao obter produto');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter produto:', error);
      throw error;
    }
  },

  // Criar produto
  async criar(dados) {
    try {
      const response = await fetch(`${API_BASE_URL}/comercial/produtos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar produto');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  },

  // Atualizar produto
  async atualizar(id, dados) {
    try {
      const response = await fetch(`${API_BASE_URL}/comercial/produtos/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar produto');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  },

  // Deletar produto
  async deletar(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/comercial/produtos/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar produto');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  },

  // Atualizar estoque
  async atualizarEstoque(id, quantidade) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/comercial/produtos/${id}/estoque`,
        {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({ quantidade }),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao atualizar estoque');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      throw error;
    }
  },
};
