
const obtenerClientes = async (page,pageSize,searchName) => {
  try {
    const userData = await getUsers(page,pageSize,searchName); // Obtener los clientes de manera asíncrona
    console.log('Usuarios obtenidos:', userData);
    // Puedes hacer más cosas con los datos de clientes si es necesario
    return userData; // Devolver los datos de clientes obtenidos
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    throw error; // Lanzar el error para manejarlo en el componente que llama a obtenerClientes
  }
};

const getUsers = async (page,pageSize,searchName) => {
  try {
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    console.log(userStringify.token);
    const accessToken = userStringify.token;
    const {refreshToken} = userStringify;

    if(searchName===""){
      searchName="all";
    }
    const response = await fetch(`http://3.220.179.149/api/api/user/listusers?query=${searchName}&page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Refresh-Token': `Bearer ${refreshToken}`
      }
    });
    console.log(response);

    if(response.status===403 || response.status===401){
        localStorage.removeItem('user');
        window.location.reload();
    }
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

export default obtenerClientes;