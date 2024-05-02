import { useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Link from '@mui/material/Link';
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
import { useRouter } from 'src/routes/hooks';
import { bgGradient } from 'src/theme/css';
import fondo from 'src/components/images/fondo.avif';
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { useAuth } from '../../utils/AuthContext'
import LoginUsuario from '../../_mock/account';
import { useNavigate } from 'react-router-dom';
// ----------------------------------------------------------------------

export default function NuevaContrasenaView() {
  const router = useRouter();
  const { user, loginUser } = useAuth();
  const [message,setMessage]=useState('');
  const navigate=useNavigate();
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  },);
  const theme = useTheme();
  const emailRef = useRef(null);
  const nuevaContra2 = useRef(null);
  const passwordRef = useRef(null);

  const handleClick = async (e) => {
    console.log('emailRef', emailRef.current.value)
    
    const nuevaContrasenia=emailRef.current.value
    const idUsuario = sessionStorage.getItem('UsuarioIDRecupracion')
    const codigoValidacion = sessionStorage.getItem('CodigoRecuperacion')


    try {
      const response = await fetch('http://localhost:3000/api/password/cambiarPasswordWeb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({idUsuario,nuevaContrasenia,codigoValidacion}) // Propiedad abreviada
      });
  
      const responseData  = await response.json();
  
      console.log('SOY LA DATA DE RESPUESTA')
      console.log(responseData)
      console.log(emailRef.current.value)
      console.log(nuevaContra2)
      if(emailRef.current.value!=nuevaContra2.current.value){
        setMessage('Ambos campos deben tener la misma contraseña')
      }
      else if(responseData.estado!=1 && responseData.estado!=0){

        setMessage(responseData.message)

      }
      else if(responseData.estado==0){
        setMessage(responseData.message)
      }
      else{
        console.log('Todo bien')
        navigate('/login')
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error; // Lanzar el error para manejarlo en el componente que llama a getUsers
    }
  };

  const renderForm = (
    <>
    <Stack spacing={3}>
        <p>Ingrese su nueva contraseña</p>
        <TextField inputRef={emailRef} name="email" label="Nueva Contraseña" />
        <p>Vuelva a ingresar su nueva contraseña</p>
        <TextField inputRef={nuevaContra2} name="email2" label="Reingrese Nueva Contraseña" />
    {message}
    </Stack>
    <Stack direction="row" alignItems="center" justifyContent="flex-start" sx={{ my: 3 }}>
     
    </Stack>
    <Box mb={2}>
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        style={{ background: 'linear-gradient(135deg, #003B91, #0081CF)',
        color: 'white'}}
        onClick={handleClick}
      >
        Cambiar Contraseña
      </LoadingButton>
    </Box>
    </>
  );

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
      }}
    >
      <Box
        sx={{
          ...bgGradient({
            color: alpha(theme.palette.background.default, 0.1),
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
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, md: 24 },
            left: { xs: 16, md: 24 },
          }}
        />
        <Card sx={{ p: 4, width: '25%', maxWidth: 1200, maxHeight: '95vh'}}>
          <div style={{ textAlign: 'center' }}>
            <Typography variant="h4">Nueva Contraseña</Typography>
          </div>
          <div>
            <br />
          </div>
          {renderForm}
        </Card>
      </Box>
    </Box>
  );
}
export { default as NuevaContrasenaView } from './nuevaContrasena-View';
