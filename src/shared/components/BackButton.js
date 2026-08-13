import React from "react";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function BackButton({
  label = "Voltar",
  variant = "outlined",
  fullWidth = false,
  color = "primary",
  sx = {},
  disabled = false,
  steps = -1,
  to,
  onClick = null,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    if (to) {
      navigate(to);
      return;
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
      size="small"
      disabled={disabled}
      sx={{
        alignSelf: "flex-start",
        marginBottom: 2,
        marginTop: 1,
        ...sx,
      }}
    >
      {label}
    </Button>
  );
}
