/**
 * Serviço de API - Módulo Produtos
 * Gerencia: Produtos Gerais
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// ==================== PRODUTOS ====================

export const produtosService = {
  // Listar todos os produtos
  async listar(filtros = {}) {
    try {
      const queryString = new URLSearchParams(filtros).toString();
      const response = await fetch(
        `${API_BASE_URL}/produtos${queryString ? '?' + queryString : ''}`,
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
      const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
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

  // Criar novo produto
  async criar(dados) {
    try {
      const response = await fetch(`${API_BASE_URL}/produtos`, {
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
      const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
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
      const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
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
      const response = await fetch(`${API_BASE_URL}/produtos/${id}/estoque`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ quantidade }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar estoque');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      throw error;
    }
  },

  // Buscar produtos por categoria
  async buscarPorCategoria(categoria) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/produtos/categoria/${categoria}`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar produtos por categoria');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      throw error;
    }
  },

  // Listar categorias
  async listarCategorias() {
    try {
      const response = await fetch(`${API_BASE_URL}/produtos/categorias`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao listar categorias');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      throw error;
    }
  },

  // Criar categoria
  async criarCategoria(dados) {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar categoria');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  },

  // Atualizar categoria
  async atualizarCategoria(id, dados) {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar categoria');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
  },

  // Deletar categoria
  async deletarCategoria(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar categoria');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      throw error;
    }
  },

  // Listar imagens do produto
  async listarImagens(produtoId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/produtos/${produtoId}/imagens`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao listar imagens');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar imagens:', error);
      throw error;
    }
  },

  // Adicionar imagem ao produto
  async adicionarImagem(produtoId, file) {
    try {
      const formData = new FormData();
      formData.append('imagem', file);

      const response = await fetch(
        `${API_BASE_URL}/produtos/${produtoId}/imagens`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao adicionar imagem');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao adicionar imagem:', error);
      throw error;
    }
  },

  // Remover imagem
  async removerImagem(produtoId, imagemId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/produtos/${produtoId}/imagens/${imagemId}`,
        {
          method: 'DELETE',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao remover imagem');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      throw error;
    }
  },
};

// ==================== VARIAÇÕES DE PRODUTOS ====================

export const variacoesProdutoService = {
  // Listar variações do produto (cores, tamanhos, etc)
  async listar(produtoId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/produtos/${produtoId}/variacoes`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao listar variações');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar variações:', error);
      throw error;
    }
  },

  // Criar variação
  async criar(produtoId, dados) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/produtos/${produtoId}/variacoes`,
        {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(dados),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao criar variação');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar variação:', error);
      throw error;
    }
  },

  // Atualizar variação
  async atualizar(produtoId, variacaoId, dados) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/produtos/${produtoId}/variacoes/${variacaoId}`,
        {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(dados),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao atualizar variação');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar variação:', error);
      throw error;
    }
  },

  // Deletar variação
  async deletar(produtoId, variacaoId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/produtos/${produtoId}/variacoes/${variacaoId}`,
        {
          method: 'DELETE',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao deletar variação');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao deletar variação:', error);
      throw error;
    }
  },
};
