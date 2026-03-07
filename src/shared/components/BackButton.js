import React from "react";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

/**
 * Componente padronizado para botão de voltar
 * @param {Object} props - Propriedades do componente
 * @param {string} props.label - Texto do botão (padrão: "Voltar")
 * @param {string} props.variant - Variante do botão: "text", "outlined", "contained" (padrão: "text")
 * @param {boolean} props.fullWidth - Se o botão deve ocupar toda largura (padrão: false)
 * @param {string} props.color - Cor do botão (padrão: "primary")
 * @param {object} props.sx - Estilos customizados do MUI
 * @param {boolean} props.disabled - Se o botão está desabilitado (padrão: false)
 * @param {number} props.steps - Número de passos para voltar (padrão: -1, volta um passo)
 * @param {function} props.onClick - Função adicional a executar antes de voltar (opcional)
 * @returns {JSX.Element}
 */
export default function BackButton({
  label = "Voltar",
  variant = "text",
  fullWidth = false,
  color = "primary",
  sx = {},
  disabled = false,
  steps = -1,
  onClick = null,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    navigate(steps);
  };

  return (
    <Button
      startIcon={<ArrowBackIcon />}
      onClick={handleClick}
      variant={variant}
      fullWidth={fullWidth}
      color={color}
      disabled={disabled}
      sx={{
        marginBottom: 2,
        marginTop: 2,
        ...sx,
      }}
    >
      {label}
    </Button>
  );
}
