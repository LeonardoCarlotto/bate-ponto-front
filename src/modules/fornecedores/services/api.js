/**
 * Serviço de API - Módulo Fornecedores
 * Gerencia: Fornecedores
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// ==================== FORNECEDORES ====================

export const fornecedoresService = {
  // Listar todos os fornecedores
  async listar(filtros = {}) {
    try {
      const queryString = new URLSearchParams(filtros).toString();
      const response = await fetch(
        `${API_BASE_URL}/fornecedores${queryString ? '?' + queryString : ''}`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao listar fornecedores');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar fornecedores:', error);
      throw error;
    }
  },

  // Obter fornecedor específico
  async obter(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/fornecedores/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao obter fornecedor');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter fornecedor:', error);
      throw error;
    }
  },

  // Criar novo fornecedor
  async criar(dados) {
    try {
      const response = await fetch(`${API_BASE_URL}/fornecedores`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar fornecedor');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error);
      throw error;
    }
  },

  // Atualizar fornecedor
  async atualizar(id, dados) {
    try {
      const response = await fetch(`${API_BASE_URL}/fornecedores/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar fornecedor');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error);
      throw error;
    }
  },

  // Deletar fornecedor
  async deletar(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/fornecedores/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar fornecedor');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao deletar fornecedor:', error);
      throw error;
    }
  },

  // Buscar fornecedor por CNPJ
  async buscarPorCnpj(cnpj) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/fornecedores/cnpj/${cnpj}`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        return null; // Fornecedor não encontrado
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar fornecedor:', error);
      return null;
    }
  },

  // Listar contatos do fornecedor
  async listarContatos(fornecedorId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/fornecedores/${fornecedorId}/contatos`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao listar contatos');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar contatos:', error);
      throw error;
    }
  },

  // Adicionar contato ao fornecedor
  async adicionarContato(fornecedorId, contato) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/fornecedores/${fornecedorId}/contatos`,
        {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(contato),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao adicionar contato');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao adicionar contato:', error);
      throw error;
    }
  },

  // Remover contato
  async removerContato(fornecedorId, contatoId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/fornecedores/${fornecedorId}/contatos/${contatoId}`,
        {
          method: 'DELETE',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao remover contato');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao remover contato:', error);
      throw error;
    }
  },

  // Listar endereços do fornecedor
  async listarEnderecos(fornecedorId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/fornecedores/${fornecedorId}/enderecos`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao listar endereços');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar endereços:', error);
      throw error;
    }
  },

  // Adicionar endereço ao fornecedor
  async adicionarEndereco(fornecedorId, endereco) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/fornecedores/${fornecedorId}/enderecos`,
        {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(endereco),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao adicionar endereço');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao adicionar endereço:', error);
      throw error;
    }
  },

  // Remover endereço
  async removerEndereco(fornecedorId, enderecoId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/fornecedores/${fornecedorId}/enderecos/${enderecoId}`,
        {
          method: 'DELETE',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao remover endereço');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao remover endereço:', error);
      throw error;
    }
  },
};
