/**
 * Serviço de API - Módulo Comercial
 * Gerencia: Pedidos, Produtos
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const NFSE_API_BASE_URL = process.env.REACT_APP_NFSE_API_URL || 'http://localhost:8081';
const NFSE_API_KEY = process.env.REACT_APP_NFSE_API_KEY || '';
const NFSE_CODIGO_SERVICO = process.env.REACT_APP_NFSE_CODIGO_SERVICO || '';

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
    throw new Error('Você não tem permissão para acessar pedidos.');
  }
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, fallback));
  }
};

const getNfseHeaders = () => ({
  'Content-Type': 'application/json',
  'X-API-Key': NFSE_API_KEY,
});

const getNfseErrorMessage = async (response, fallback) => {
  try {
    const data = await response.json();
    return data.message || data.mensagem || fallback;
  } catch (error) {
    return fallback;
  }
};

const ensureNfseConfigured = () => {
  if (!NFSE_API_KEY) {
    throw new Error('Configure REACT_APP_NFSE_API_KEY para usar o nfse-service.');
  }
};

const getTipoPessoa = (cpfCnpj = '') => {
  const digits = String(cpfCnpj).replace(/\D/g, '');
  return digits.length > 11 ? 'PJ' : 'PF';
};

const downloadBlob = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// ==================== NFS-E ====================

export const nfseService = {
  isConfigured() {
    return Boolean(NFSE_API_KEY);
  },

  async consultarPorPedido(pedidoId) {
    ensureNfseConfigured();

    const response = await fetch(`${NFSE_API_BASE_URL}/api/v1/nfse/pedido/${pedidoId}`, {
      method: 'GET',
      headers: getNfseHeaders(),
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(await getNfseErrorMessage(response, 'Erro ao consultar NFS-e'));
    }

    return await response.json();
  },

  async emitirPorPedido(pedido, cliente) {
    ensureNfseConfigured();

    const cpfCnpj = cliente?.cpfCnpj || '';
    if (!cpfCnpj) {
      throw new Error('Cliente sem CPF/CNPJ cadastrado.');
    }

    const payload = {
      pedidoId: Number(pedido.id),
      cliente: {
        tipoPessoa: getTipoPessoa(cpfCnpj),
        cpfCnpj,
        nome: cliente?.nome || pedido.clienteNome || 'Cliente',
        email: cliente?.email || undefined,
      },
      servico: {
        descricao: pedido.descricao || `Pedido #${pedido.id}`,
        valor: Number(pedido.valor || 0),
        codigoServico: NFSE_CODIGO_SERVICO || undefined,
      },
    };

    const response = await fetch(`${NFSE_API_BASE_URL}/api/v1/nfse`, {
      method: 'POST',
      headers: {
        ...getNfseHeaders(),
        'Idempotency-Key': `pedido-${pedido.id}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(await getNfseErrorMessage(response, 'Erro ao emitir NFS-e'));
    }

    return await response.json();
  },

  async baixarPdf(nfseId, pedidoId) {
    ensureNfseConfigured();

    const response = await fetch(`${NFSE_API_BASE_URL}/api/v1/nfse/${nfseId}/pdf`, {
      method: 'GET',
      headers: {
        'X-API-Key': NFSE_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(await getNfseErrorMessage(response, 'Erro ao baixar DANFSe'));
    }

    const blob = await response.blob();
    downloadBlob(blob, `danfse-pedido-${pedidoId}.pdf`);
  },

  async baixarXml(nfseId, pedidoId) {
    ensureNfseConfigured();

    const response = await fetch(`${NFSE_API_BASE_URL}/api/v1/nfse/${nfseId}/xml`, {
      method: 'GET',
      headers: {
        'X-API-Key': NFSE_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(await getNfseErrorMessage(response, 'Erro ao baixar XML'));
    }

    const xml = await response.text();
    downloadBlob(new Blob([xml], { type: 'application/xml' }), `nfse-pedido-${pedidoId}.xml`);
  },
};

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

      await ensureOk(response, 'Erro ao listar pedidos');

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

      await ensureOk(response, 'Erro ao obter pedido');

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

      await ensureOk(response, 'Erro ao criar pedido');

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

      await ensureOk(response, 'Erro ao atualizar pedido');

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      throw error;
    }
  },

  // Cancelar pedido
  async deletar(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      await ensureOk(response, 'Erro ao cancelar pedido');

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

      await ensureOk(response, 'Erro ao atualizar status');

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

      await ensureOk(response, 'Erro ao listar itens');

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

      await ensureOk(response, 'Erro ao adicionar item');

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

      await ensureOk(response, 'Erro ao remover item');

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

  // Buscar aniversariantes do dia
  async buscarAniversariantesDoDia() {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/aniversariantes-hoje`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar aniversariantes do dia');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar aniversariantes do dia:', error);
      throw error;
    }
  },
};
