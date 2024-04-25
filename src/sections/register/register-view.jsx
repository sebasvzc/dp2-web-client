import { useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { Link, useNavigate, Route, useLocation, Navigate } from 'react-router-dom';
import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import fondo from 'src/components/images/pep.png';
import logo from 'src/components/images/logo-plaza.png';
import Iconify from 'src/components/iconify';
import { useAuth } from '../../utils/AuthContext'
import LoginUsuario from '../../_mock/account';
import obtenerUsuarios from '../../_mock/user';
// ----------------------------------------------------------------------

export default function RegisterView() {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    rol:'user',
    tokenReg:token
  });
  const navigate = useNavigate();
  const theme = useTheme();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  useEffect(() => {


      console.log('Token recibido:', token);

  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // const userStringify = JSON.parse(formData);
    console.log(formData);
    // Aquí puedes manejar la lógica de envío del formulario, como enviar los datos al backend
    const fetchData = async () => {
      try {
         const response = await fetch('http://localhost:3000/api/user/signup', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
           body:JSON.stringify(formData)
         });
        console.log(response);

        if(response.status===403 || response.status===401){
          console.log("Cualquiera de 403 o 401")

        }
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = response.json();
        console.log(data)
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

  };
  const renderForm = (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          name="nombre"
          label="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="apellido"
          label="Apellido"
          value={formData.apellido}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="email"
          label="Correo"
          value={formData.email}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="password"
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>


      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        style={{ backgroundColor: "#EE8700", mt: 3 , marginTop: "30px" }}
      >
        Registrarse
      </LoadingButton>
    </form>
  );

  if (typeof (token) === 'undefined') {
    navigate("/login");
  }

  return (
    <Box
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black', // Color de fondo detrás del gradiente o imagen
      }}
    >

      <Box
        sx={{
          ...bgGradient({
            color: alpha(theme.palette.common.black, 0.7),
            imgUrl: fondo,
          }),
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={30}  style={{
          top: 0,
          left: "15%",
          right: "15%",marginLeft:"15%", marginRight:"15%",
          bottom: 0,// Color de fondo detrás del gradiente o imagen
        }}>


          <Card sx={{ p: 5, width: 1}}>
            <div style={{ textAlign: 'center' }}>
              <Typography variant="h4">Crear cuenta</Typography>
            </div>
            <div>
              <br />
            </div>
            {renderForm}
          </Card>
        </Stack>
      </Box>
    </Box>
  );
};

