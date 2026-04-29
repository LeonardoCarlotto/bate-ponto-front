/**
 * Serviço de API - Módulo Contas a Receber
 * Gerencia: Contas a receber de clientes
 */

const API_BASE_URL = process.env.REACT_APP_API_URL;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// ==================== CONTAS A RECEBER ====================

export const contasReceberService = {
  // Listar contas a receber agrupadas por cliente
  async listar(filtros = {}) {
    try {
      // Buscar todos os pedidos
      const response = await fetch(`${API_BASE_URL}/pedidos`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao listar pedidos');
      }

      const pedidos = await response.json();
      
      // Filtrar pedidos com status diferente de pendente e aprovado
      const pedidosFiltrados = pedidos.filter(pedido => {
        const status = pedido.status?.toLowerCase();
        return status !== 'pendente' && status !== 'aprovado';
      });

      // Agrupar por cliente
      const contasPorCliente = {};
      
      pedidosFiltrados.forEach(pedido => {
        const clienteId = pedido.clienteId || 'sem_cliente';
        const clienteNome = pedido.clienteNome || 'Cliente não identificado';
        
        if (!contasPorCliente[clienteId]) {
          contasPorCliente[clienteId] = {
            clienteId,
            clienteNome,
            pedidos: [],
            totalEmAberto: 0,
            totalPago: 0,
            saldoDevedor: 0
          };
        }
        
        contasPorCliente[clienteId].pedidos.push(pedido);
        contasPorCliente[clienteId].totalEmAberto += parseFloat(pedido.valor || 0);
      });

      // Buscar pagamentos de cada cliente
      const resultado = await Promise.all(
        Object.values(contasPorCliente).map(async (cliente) => {
          try {
            const pagamentosResponse = await fetch(
              `${API_BASE_URL}/contas-receber/cliente/${cliente.clienteId}/pagamentos`,
              {
                method: 'GET',
                headers: getHeaders(),
              }
            );
            
            if (pagamentosResponse.ok) {
              const pagamentos = await pagamentosResponse.json();
              cliente.pagamentos = pagamentos || [];
              cliente.totalPago = pagamentos.reduce((total, pgto) => 
                total + parseFloat(pgto.valor || 0), 0);
            } else {
              cliente.pagamentos = [];
              cliente.totalPago = 0;
            }
          } catch (error) {
            cliente.pagamentos = [];
            cliente.totalPago = 0;
          }
          
          cliente.saldoDevedor = cliente.totalEmAberto - cliente.totalPago;
          return cliente;
        })
      );

      return resultado;
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

      if (!response.ok) {
        throw new Error('Erro ao obter contas do cliente');
      }

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

      if (!response.ok) {
        throw new Error('Erro ao registrar pagamento');
      }

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

      if (!response.ok) {
        throw new Error('Erro ao obter histórico de pagamentos');
      }

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

      if (!response.ok) {
        throw new Error('Erro ao estornar pagamento');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao estornar pagamento:', error);
      throw error;
    }
  },
};
