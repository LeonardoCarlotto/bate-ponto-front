/**
 * Serviço de API - Módulo Contas a Receber
 * Gerencia: Contas a receber de clientes
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

const getErrorMessage = async (response, fallback) => {
  try {
    const data = await response.json();
    return data.message || data.mensagem || fallback;
  } catch (error) {
    return fallback;
  }
};

const ensureOk = async (response, fallback) => {
  if (response.status === 401) {
    throw new Error('Sessão expirada. Faça login novamente.');
  }
  if (response.status === 403) {
    throw new Error('Você não tem permissão para acessar contas a receber.');
  }
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, fallback));
  }
};

// ==================== CONTAS A RECEBER ====================

export const contasReceberService = {
  // Listar contas a receber agrupadas por cliente
  async listar(filtros = {}) {
    try {
      const queryString = new URLSearchParams(filtros).toString();
      const response = await fetch(`${API_BASE_URL}/contas-receber/resumo${queryString ? '?' + queryString : ''}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      await ensureOk(response, 'Erro ao listar contas a receber');

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar contas a receber:', error);
      throw error;
    }
  },

  // Obter contas a receber de um cliente específico
  async obterPorCliente(clienteId) {
    try {
      const response = await fetch(`${API_BASE_URL}/contas-receber/cliente/${clienteId}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      await ensureOk(response, 'Erro ao obter contas do cliente');

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter contas do cliente:', error);
      throw error;
    }
  },

  // Registrar pagamento/abatimento
  async registrarPagamento(dados) {
    try {
      const response = await fetch(`${API_BASE_URL}/contas-receber/pagamento`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(dados),
      });

      await ensureOk(response, 'Erro ao registrar pagamento');

      return await response.json();
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      throw error;
    }
  },

  // Obter histórico de pagamentos de um cliente
  async obterHistoricoPagamentos(clienteId) {
    try {
      const response = await fetch(`${API_BASE_URL}/contas-receber/cliente/${clienteId}/pagamentos`, {
        method: 'GET',
        headers: getHeaders(),
      });

      await ensureOk(response, 'Erro ao obter histórico de pagamentos');

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter histórico de pagamentos:', error);
      throw error;
    }
  },

  // Estornar pagamento
  async estornarPagamento(pagamentoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/contas-receber/pagamento/${pagamentoId}/estornar`, {
        method: 'POST',
        headers: getHeaders(),
      });

      await ensureOk(response, 'Erro ao estornar pagamento');

      return await response.json();
    } catch (error) {
      console.error('Erro ao estornar pagamento:', error);
      throw error;
    }
  },
};
