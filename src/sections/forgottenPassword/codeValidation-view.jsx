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

export default function CodeValidationView() {
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
  const passwordRef = useRef(null);

  const handleClick = async (e) => {
    console.log('emailRef', emailRef.current.value)
    
    let codigoSesion=sessionStorage.getItem('CodigoRecuperacion')

    if(codigoSesion==emailRef.current.value){
      console.log('Codigo Valido')
      navigate('/NewPassword')
    }
    else{
      console.log('Codigo Invalido')
      setMessage('Código Inválido')
    }
  };

  const renderForm = (
    <>
    <Stack spacing={3}>
        <p>Se le ha enviado un código por correo. Por favor ingresarlo</p>
        <TextField inputRef={emailRef} name="email" label="Código" />
    </Stack>
    <Stack direction="row" alignItems="center" justifyContent="flex-start" sx={{ my: 3 }}>
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
        Validar Código
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
            <Typography variant="h4">Ingrese el código</Typography>
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
