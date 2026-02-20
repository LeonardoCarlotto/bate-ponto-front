const API_URL = "http://localhost:8080";

export async function registerPoint(token) {
  const response = await fetch(`${API_URL}/registers`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error("Erro ao registrar ponto");

  return await response.json();
}

export async function getUserRegisters(token) {
  const response = await fetch(`${API_URL}/registers/user`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error("Erro ao buscar registros");

  return await response.json();
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  if (!response.ok) throw new Error("Credenciais inválidas");

  return await response.json();
}

export const updateRegister = async (token, id, payload) => {
  const response = await fetch(
    `http://localhost:8080/registers/${id}/edit`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao atualizar");
  }

  return response.json();
};

export const createManualRegister = async (token, payload) => {
  const response = await fetch("http://localhost:8080/registers/manual", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar registro manual");
  }

  return response.json();
};

export const reportPdf = async (token, mes, ano) => {
  const response = await fetch(`http://localhost:8080/registers/user/pdf?mes=${mes}&ano=${ano}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao baixar o PDF');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));

  const a = document.createElement('a');
  a.href = url;
  a.download = `relatorio_ponto_${String(mes).padStart(2,'0')}_${ano}.pdf`;
  a.click();

  // Liberar URL depois do download
  window.URL.revokeObjectURL(url);
};