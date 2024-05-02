import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useAuth } from '../../../utils/AuthContext'


// ----------------------------------------------------------------------

export default function ForgottenPasswordView() {
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

  const handleClick = async (e) => {
    const regEx=/[a-zA-Z0-9+_%+-]+@[a-z0-9]+\.[a-z]{2,8}(.[a-z{2,8}])?/g

    if(regEx.test(emailRef.current.value)){
        console.log('emailRef', emailRef.current.value)
        try {
            const response = await fetch('http://localhost:3000/api/password/olvidoPasswordWeb ', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({email:emailRef.current.value}) // Propiedad abreviada
            });
        
            const responseData  = await response.json();
        
            console.log('SOY LA DATA DE RESPUESTA')
            console.log(responseData.id)
            if (responseData.id!==0) {
              console.log('HURRA')
              sessionStorage.setItem('UsuarioIDRecupracion',responseData.id)
              sessionStorage.setItem('CodigoRecuperacion',responseData.codigo)
              setMessage('')
              navigate('/CodeValidation')
            }
            else{
                setMessage('No existe un usuario asociado a este correo')
            }
          } catch (error) {
            console.error('Error fetching users:', error);
            throw error; // Lanzar el error para manejarlo en el componente que llama a getUsers
          }
    }
    else{
        console.log('Correo invalido')
        setMessage('El correo no es válido')
    }
  };

  const renderForm = (
    <>
    <Stack spacing={3}>
        <p>Ingresa el correo de la cuenta asociada. Se te enviará un mail para recuperar tu contraseña</p>
        <TextField inputRef={emailRef} name="email" label="Correo" />
        {message}
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
        Recuperar contraseña
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
            <Typography variant="h4">Recuperar Contraseña</Typography>
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

