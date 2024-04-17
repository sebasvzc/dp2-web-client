const LoginUsuario = async (email, password) => {
  try {
    console.log("LoginUsuario", email, password)
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password }) // Propiedad abreviada
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; // Lanzar el error para manejarlo en el componente que llama a getUsers
  }
};

export default LoginUsuario;