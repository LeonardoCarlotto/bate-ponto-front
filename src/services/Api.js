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