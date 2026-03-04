// base URL for backend, configurable via environment variable
export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

/**
 * Wrapper around fetch that handles 401/403 responses
 * @param {string} url - the request URL
 * @param {object} options - fetch options
 * @param {function} onUnauthorized - callback when 401/403 is received
 */
async function fetchWithAuth(url, options = {}, onUnauthorized) {
  const response = await fetch(url, options);

  // Handle unauthorized: token expired, invalid, or missing
  if (response.status === 401 || response.status === 403) {
    if (onUnauthorized && typeof onUnauthorized === "function") {
      onUnauthorized();
    }
    throw new Error(`Unauthorized (${response.status})`);
  }

  return response;
}

export async function registerPoint(token, onUnauthorized) {
  const response = await fetchWithAuth(`${API_URL}/registers`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  }, onUnauthorized);

  if (!response.ok) throw new Error("Erro ao registrar ponto");

  return await response.json();
}

export async function getUserRegisters(token, onUnauthorized) {
  const response = await fetchWithAuth(`${API_URL}/registers/user`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  }, onUnauthorized);

  if (!response.ok) throw new Error("Erro ao buscar registros");

  return await response.json();
}

export async function getRegistersForUser(token, userId, onUnauthorized) {
  const response = await fetchWithAuth(`${API_URL}/registers/user/${userId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  }, onUnauthorized);

  if (!response.ok) throw new Error("Erro ao buscar registros do usu·rio");

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

  if (!response.ok) throw new Error("Credenciais inv√°lidas");

  return await response.json();
}

export const updateRegister = async (token, id, payload, onUnauthorized) => {
  const response = await fetchWithAuth(
    `${API_URL}/registers/${id}/edit`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
    onUnauthorized
  );

  if (!response.ok) {
    throw new Error("Erro ao atualizar");
  }

  return response.json();
};

export const createManualRegister = async (token, payload, onUnauthorized) => {
  const response = await fetchWithAuth(`${API_URL}/registers/manual`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  }, onUnauthorized);

  if (!response.ok) {
    throw new Error("Erro ao criar registro manual");
  }

  return response.json();
};

export const reportPdf = async (token, mes, ano, onUnauthorized) => {
  const response = await fetchWithAuth(`${API_URL}/registers/user/pdf?mes=${mes}&ano=${ano}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  }, onUnauthorized);

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

// admin download for arbitrary user
export const reportPdfForUser = async (token, userId, mes, ano, onUnauthorized) => {
  const response = await fetchWithAuth(`${API_URL}/registers/user/${userId}/pdf?mes=${mes}&ano=${ano}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  }, onUnauthorized);

  if (!response.ok) {
    throw new Error('Erro ao baixar o PDF do usu·rio');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));

  const a = document.createElement('a');
  a.href = url;
  a.download = `relatorio_ponto_usuario_${userId}_${String(mes).padStart(2,'0')}_${ano}.pdf`;
  a.click();

  window.URL.revokeObjectURL(url);
};

// new user-related endpoints
export async function getAllUsers(token, onUnauthorized) {
  const response = await fetchWithAuth(`${API_URL}/user/all`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }, onUnauthorized);
  if (!response.ok) throw new Error("Erro ao buscar usu√°rios");
  return await response.json();
}

export async function changeMyPassword(token, currentPassword, newPassword, onUnauthorized) {
  const response = await fetchWithAuth(`${API_URL}/user/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  }, onUnauthorized);
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Erro ao alterar senha");
  }
  return await response;
}

export async function changeUserPassword(token, targetUserId, newPassword, onUnauthorized) {
  const response = await fetchWithAuth(`${API_URL}/user/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ targetUserId, newPassword }),
  }, onUnauthorized);
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Erro ao alterar senha do usu√°rio");
  }
  return await response;
}

export async function updateUserPhoto(token, userId, urlPhoto, onUnauthorized) {
  const response = await fetchWithAuth(`${API_URL}/user/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ urlPhoto }),
  }, onUnauthorized);
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Erro ao atualizar foto do usu·rio");
  }
  return await response.json();
}