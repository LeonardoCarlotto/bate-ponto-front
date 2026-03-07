import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BackButton from "../../../shared/components/BackButton";
import { produtosService } from "../services/api";

export default function ListaProdutosScreen() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [erro, setErro] = React.useState(null);

  React.useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    setLoading(true);
    setErro(null);
    try {
      const data = await produtosService.listar();
      setProdutos(data || []);
    } catch (error) {
      setErro("Erro ao carregar produtos");
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoProduto = () => {
    navigate("/produtos/cadastro");
  };

  const handleEditar = (produtoId) => {
    navigate(`/produtos/cadastro/${produtoId}`);
  };

  const handleDeletar = async (produtoId) => {
    if (window.confirm("Tem certeza que deseja deletar este produto?")) {
      try {
        await produtosService.deletar(produtoId);
        setProdutos((prevState) => prevState.filter((p) => p.id !== produtoId));
      } catch (error) {
        setErro("Erro ao deletar produto");
        console.error("Erro ao deletar:", error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ paddingX: 2 }}>
        <BackButton to="/produtos" />
      </Box>

      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <Typography variant="h5">Lista de Produtos</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleNovoProduto}
          >
            Novo Produto
          </Button>
        </Box>

        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}

        {loading && (
          <Typography
            color="textSecondary"
            sx={{ textAlign: "center", padding: 3 }}
          >
            Carregando produtos...
          </Typography>
        )}

        {!loading && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell align="right">Preço</TableCell>
                  <TableCell align="center">Estoque</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {produtos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ padding: 3 }}>
                      <Typography color="textSecondary">
                        Nenhum produto cadastrado
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  produtos.map((produto) => (
                    <TableRow key={produto.id} hover>
                      <TableCell>{produto.id}</TableCell>
                      <TableCell>{produto.nome}</TableCell>
                      <TableCell>{produto.categoria}</TableCell>
                      <TableCell align="right">
                        R$ {produto.preco.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">{produto.estoque}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            backgroundColor: produto.ativo
                              ? "#e8f5e9"
                              : "#ffebee",
                            color: produto.ativo ? "#2e7d32" : "#c62828",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            textAlign: "center",
                            fontSize: "0.85rem",
                          }}
                        >
                          {produto.ativo ? "Ativo" : "Inativo"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          color="primary"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditar(produto.id)}
                          sx={{ mr: 1 }}
                        >
                          Editar
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeletar(produto.id)}
                        >
                          Deletar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
}
