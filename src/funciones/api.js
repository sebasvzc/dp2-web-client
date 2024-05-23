export async function getTiendas(token, refreshToken, searchTerm) {
  try {
    let response="";
    console.log(searchTerm)
    if(searchTerm==="" || searchTerm === undefined){
      response = await fetch(`http://3.220.179.149/api/api/tiendas/listartiendas?query=all&page=1&pageSize=10`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Refresh-Token': `Bearer ${refreshToken}`
        }
      });
    }else{
      response = await fetch(`http://3.220.179.149/api/api/tiendas/listartiendas?query=${searchTerm}&page=1&pageSize=10`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Refresh-Token': `Bearer ${refreshToken}`
        }
      });
    }


    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('user');
      window.location.reload();
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cupones:', error);
    throw error;
  }
}

export async function getTipoCupones(token, refreshToken, searchTermTipoCupones) {
  try {

    let response="";
    if(searchTermTipoCupones==="" || searchTermTipoCupones === undefined){
      response = await fetch(`http://3.220.179.149/api/api/tipocupones/listartipocupones?query=all&page=1&pageSize=10`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Refresh-Token': `Bearer ${refreshToken}`
        }
      });
    }else{
      response = await fetch(`http://3.220.179.149/api/api/tipocupones/listartipocupones?query=${searchTermTipoCupones}&page=1&pageSize=10`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Refresh-Token': `Bearer ${refreshToken}`
        }
      });
    }


    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('user');
      window.location.reload();
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cupones:', error);
    throw error;
  }
}