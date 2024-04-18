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

import fondo from 'src/components/images/pep.png';
import logo from 'src/components/images/logo-plaza.png';
import Iconify from 'src/components/iconify';
import { useAuth } from '../../utils/AuthContext'
import LoginUsuario from '../../_mock/account';
// ----------------------------------------------------------------------

export default function LoginView() {
  const router = useRouter();
  const { user, loginUser } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  },);
  const theme = useTheme();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);


  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async (e) => {
    console.log('emailRef', emailRef.current.value)
    console.log('passwordRef', passwordRef.current.value)
    const data = await LoginUsuario(emailRef.current.value, passwordRef.current.value);
    console.log(data)
    loginUser(data)

  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField inputRef={emailRef} name="email" label="Correo" />

        <TextField
          inputRef={passwordRef}
          name="password"
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
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

      <Stack direction="row" alignItems="center" justifyContent="flex-start" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover" style={{ color: "#EE8700" }}>
          ¿Olvido su contraseña?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        style={{ backgroundColor: "#EE8700" }}
        onClick={handleClick}
      >
        Ingresar
      </LoadingButton>
    </>
  );


  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.common.black, 0.7),
          imgUrl: fondo,
        }),
        height: 1,
      }}
    >
      <Stack direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}>
        <div>
          <Typography variant="h1" color="white">Bienvenido(a)</Typography>
          <img
            src={logo}
            alt=""
            style={{
              height: 'auto',
              marginTop: '10%'
            }}

          />
        </div>

        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Typography variant="h4">Iniciar Sesión</Typography>
          </div>
          <div>
            <br />
          </div>
          {renderForm}
        </Card>

      </Stack>
    </Box>
  );
}
