import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BackButton from "../../../shared/components/BackButton";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupIcon from "@mui/icons-material/Group";
import HistoryIcon from "@mui/icons-material/History";
import { API_URL } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function PontoHomeScreen() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const { handleUnauthorized } = useAuth();

  useEffect(() => {
    async function fetchUserType() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        if (response.ok) {
          const data = await response.json();
          setUserType(data.type);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchUserType();
  }, [handleUnauthorized]);

  const opcoes = [
    {
      title: "Meu Perfil",
      description: "Edite suas informações e altere sua senha.",
      path: "/ponto/edit-profile",
      icon: <PersonIcon style={{ fontSize: 50, color: "#4CAF50" }} />,
    },
    {
      title: "Registrar Ponto",
      description: "Marque suas entradas e saídas.",
      path: "/ponto/dashboard",
      icon: <AccessTimeIcon style={{ fontSize: 50, color: "#ff9900" }} />,
    },

    {
      title: "Relatórios",
      description: "Visualize seus relatórios de ponto.",
      path: "/ponto/report",
      icon: <AssignmentIcon style={{ fontSize: 50, color: "#9C27B0" }} />,
    },
  ];

  const opcoesAdmin = [
    {
      title: "Criar Usuário",
      description: "Cadastre um novo usuário.",
      path: "/ponto/create-user",
      icon: <PersonAddIcon style={{ fontSize: 50, color: "#4CAF50" }} />,
    },
    {
      title: "Colaboradores",
      description: "Gerencie usuários e colaboradores.",
      path: "/ponto/users",
      icon: <GroupIcon style={{ fontSize: 50, color: "#FF5722" }} />,
    },
    {
      title: "Pontos Editados",
      description: "Visualize registros editados.",
      path: "/ponto/admin",
      icon: <HistoryIcon style={{ fontSize: 50, color: "#607D8B" }} />,
    },
  ];

  return (
    <Box sx={{ padding: "30px 20px" }}>
      <BackButton />
      <Typography variant="h5" gutterBottom sx={{ marginBottom: 1 }}>
        Configurações
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        gutterBottom
        sx={{ marginBottom: 3 }}
      >
        Registre seu ponto e gerencie suas informações
      </Typography>

      <Grid container spacing={3}>
        {opcoes.map((opcao) => (
          <Grid item xs={12} sm={6} md={4} key={opcao.title}>
            <Card>
              <CardActionArea onClick={() => navigate(opcao.path)}>
                <CardContent
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "30px 20px",
                  }}
                >
                  {opcao.icon}
                  <Typography
                    variant="h6"
                    style={{ marginTop: 15, marginBottom: 10 }}
                    align="center"
                  >
                    {opcao.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                  >
                    {opcao.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}

        {userType === "ADMIN" && (
          <>
            {opcoesAdmin.map((opcao) => (
              <Grid item xs={12} sm={6} md={4} key={opcao.title}>
                <Card>
                  <CardActionArea onClick={() => navigate(opcao.path)}>
                    <CardContent
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "30px 20px",
                      }}
                    >
                      {opcao.icon}
                      <Typography
                        variant="h6"
                        style={{ marginTop: 15, marginBottom: 10 }}
                        align="center"
                      >
                        {opcao.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        align="center"
                      >
                        {opcao.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </Box>
  );
}
