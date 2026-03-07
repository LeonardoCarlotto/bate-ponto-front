/**
 * Serviço de API - Módulo Administrativo
 * Gerencia: Clientes
 */

const API_BASE_URL = process.env.REACT_APP_API_URL;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// ==================== CLIENTES ====================

export const clientesService = {
  // Listar todos os clientes
  async listar(filtros = {}) {
    try {
      const queryString = new URLSearchParams(filtros).toString();
      const response = await fetch(
        `${API_BASE_URL}/clientes${queryString ? '?' + queryString : ''}`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao listar clientes');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      throw error;
    }
  },

  // Obter cliente específico
  async obter(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao obter cliente');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter cliente:', error);
      throw error;
    }
  },

  // Criar novo cliente
  async criar(dados) {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar cliente');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  },

  // Atualizar cliente
  async atualizar(id, dados) {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar cliente');
      }

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
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar cliente');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      throw error;
    }
  },

  // Buscar cliente por CPF/CNPJ
  async buscarPorCpfCnpj(cpfCnpj) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/clientes/documento/${cpfCnpj}`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        return null; // Cliente não encontrado
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      return null;
    }
  },

  // Buscar cliente por email
  async buscarPorEmail(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/email/${email}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar cliente por email:', error);
      return null;
    }
  },

  // Listar endereços do cliente
  async listarEnderecos(clienteId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/clientes/${clienteId}/enderecos`,
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

  // Adicionar endereço ao cliente
  async adicionarEndereco(clienteId, endereco) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/clientes/${clienteId}/enderecos`,
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
  async removerEndereco(clienteId, enderecoId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/clientes/${clienteId}/enderecos/${enderecoId}`,
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

  // Listar contatos (telefone, email) do cliente
  async listarContatos(clienteId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/clientes/${clienteId}/contatos`,
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

  // Adicionar contato ao cliente
  async adicionarContato(clienteId, contato) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/clientes/${clienteId}/contatos`,
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
  async removerContato(clienteId, contatoId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/clientes/${clienteId}/contatos/${contatoId}`,
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
};
