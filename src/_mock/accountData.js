const apiUrl = process.env.REACT_APP_API_URL;

export const fetchAccountData = async () => {
  try {
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    console.log(userStringify.token);
    const accessToken = userStringify.token;
    const {refreshToken} = userStringify;
    console.log("estoy consultando el usuario para el navbar");
    const response = await fetch(REACT_APP_API_URL + '/api/user/extraerData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Refresh-Token': `Bearer ${refreshToken}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Could not fetch user data');
    }
    return data;
  } catch (error) {
    console.error('Failed to fetch account data:', error);
    throw error;
  }
};