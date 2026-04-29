/**
 * Serviço de API - Módulo Contas a Pagar
 * Gerencia: Contas a Pagar
 */

const API_BASE_URL = process.env.REACT_APP_API_URL;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// ==================== CONTAS A PAGAR ====================

export const contasPagarService = {
  // Listar todas as contas a pagar
  async listar(filtros = {}) {
    try {
      const queryString = new URLSearchParams(filtros).toString();
      const response = await fetch(
        `${API_BASE_URL}/contas-pagar${queryString ? '?' + queryString : ''}`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao listar contas a pagar');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar contas a pagar:', error);
      throw error;
    }
  },

  // Obter conta a pagar específica
  async obter(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/contas-pagar/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao obter conta a pagar');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter conta a pagar:', error);
      throw error;
    }
  },

  // Criar nova conta a pagar
  async criar(dados) {
    try {
      const response = await fetch(`${API_BASE_URL}/contas-pagar`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar conta a pagar');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar conta a pagar:', error);
      throw error;
    }
  },

  // Atualizar conta a pagar
  async atualizar(id, dados) {
    try {
      const response = await fetch(`${API_BASE_URL}/contas-pagar/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar conta a pagar');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar conta a pagar:', error);
      throw error;
    }
  },

  // Deletar conta a pagar
  async deletar(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/contas-pagar/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar conta a pagar');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao deletar conta a pagar:', error);
      throw error;
    }
  },

  // Atualizar status da conta a pagar
  async atualizarStatus(id, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/contas-pagar/${id}/status`, {
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

  // Registrar pagamento
  async registrarPagamento(id, pagamentoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/contas-pagar/${id}/pagar`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(pagamentoData),
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar pagamento');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      throw error;
    }
  },

  // Listar contas vencidas
  async listarVencidas() {
    try {
      const response = await fetch(`${API_BASE_URL}/contas-pagar/vencidas`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao listar contas vencidas');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar contas vencidas:', error);
      throw error;
    }
  },

  // Listar contas a vencer (próximos X dias)
  async listarAVencer(dias = 7) {
    try {
      const response = await fetch(`${API_BASE_URL}/contas-pagar/a-vencer?dias=${dias}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao listar contas a vencer');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar contas a vencer:', error);
      throw error;
    }
  },
};
