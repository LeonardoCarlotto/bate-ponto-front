import React from "react";
import { Avatar } from "@mui/material";

/**
 * Componente reutilizável para exibir foto do usuário.
 * Se urlPhoto estiver disponível, exibe a imagem; caso contrário, exibe iniciais.
 */
export default function UserAvatar({ name, urlPhoto, size = 40 }) {
  // Pega as iniciais do nome
  const getInitials = (fullName) => {
    if (!fullName) return "";
    const names = fullName.trim().split(" ");
    return names
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("");
  };

  return (
    <Avatar
      src={urlPhoto}
      alt={name}
      sx={{ width: size, height: size, cursor: "pointer" }}
    >
      {getInitials(name)}
    </Avatar>
  );
}
