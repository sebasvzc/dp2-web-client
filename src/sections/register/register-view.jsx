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
import Logo from 'src/components/logo';
import fondo from 'src/components/images/fondo.avif';
import { bgGradient } from 'src/theme/css';
import logo from 'src/components/images/logo-plaza.png';
import Iconify from 'src/components/iconify';
import { useAuth } from '../../utils/AuthContext'
import LoginUsuario from '../../_mock/account';
import obtenerUsuarios from '../../_mock/user';
// ----------------------------------------------------------------------

export default function RegisterView() {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  const [mostrarTxtNomb, setMostrarTxtNomb] = useState("");
  const [mostrarTxtApp, setMostrarTxtApp] = useState("");
  const [mostrarTxtCorreo, setMostrarTxtCorreo] = useState("");
  const [mostrarTxtCont, setMostrarTxtCont] = useState("");

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

  const [backgroundBtnReg, setBackgroundBtnReg] = useState("#CCCCCC");
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);

  function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  }

  function validarNombre(nombre) {
    const regexNombre = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/;
    return regexNombre.test(nombre);
  }

  useEffect(() => {
    const tieneAlMenosUnNumero = /\d/.test(formData.password);
    const tieneAlMenosUnaMayuscula = /[A-Z]/.test(formData.password);

    let tamanho = false;
    if (formData.password.length >= 8) {
      tamanho=true;
    }
    if(tieneAlMenosUnNumero && tieneAlMenosUnaMayuscula && tamanho 
      && formData.email.length!==0 && validarEmail(formData.email)
      && formData.nombre.length!==0 && validarNombre(formData.nombre)
      && formData.apellido.length!==0 && validarNombre(formData.apellido)){
      setBackgroundBtnReg("#EE8700");
      setBotonDeshabilitado(false);
    }else{
      setBackgroundBtnReg("#CCCCCC");
      setBotonDeshabilitado(true);
    }
    if ((formData.nombre.length!==0 && validarNombre(formData.nombre)) || formData.nombre.length===0) {
      setMostrarTxtNomb("");
    } else {
      setMostrarTxtNomb("Nombre inválido");
    }
    if ((formData.apellido.length!==0 && validarNombre(formData.apellido)) || formData.apellido.length===0 ) {
      setMostrarTxtApp("");
    } else {
      setMostrarTxtApp("Apellido Paterno inválido");
    }
    if ((formData.email.length!==0 && validarEmail(formData.email)) || formData.email.length===0) {
      setMostrarTxtCorreo("");
    } else {
      setMostrarTxtCorreo("Correo inválido");
    }
    if ((tieneAlMenosUnNumero && tieneAlMenosUnaMayuscula && tamanho && formData.password.trim().length !== 0) || formData.password.trim().length===0 ) {
      setMostrarTxtCont("");
    } else {
      setMostrarTxtCont("Debe tener 8 digitos (mayúsculas,minúsculas y número)");
    }
  }, [formData.password,formData.email,formData.nombre,formData.apellido]);


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
      <Stack spacing={1}>
        <Stack spacing={0}>
          <TextField
            name="nombre"
            label="Nombres"
            value={formData.nombre}
            onChange={handleChange}
            fullWidth
          />
          <input className="inputEspecialAC" type="text" value={mostrarTxtNomb} onChange={handleChange} 
          style={{width: "100%", color: 'red',border: 'none',backgroundColor: 'white',outline: 'none'}}
          disabled/>
        </Stack>
        <Stack spacing={0}>
          <TextField
            name="apellido"
            label="Apellidos"
            value={formData.apellido}
            onChange={handleChange}
            fullWidth
          />
          <input className="inputEspecialAC" type="text" value={mostrarTxtApp} onChange={handleChange} 
          style={{width: "100%", color: 'red',border: 'none',backgroundColor: 'white',outline: 'none'}}
          disabled/>
        </Stack>
        <Stack spacing={0}>
          <TextField
            name="email"
            label="Correo"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          <input className="inputEspecialAC" type="text" value={mostrarTxtCorreo} onChange={handleChange} 
          style={{width: "100%", color: 'red',border: 'none',backgroundColor: 'white',outline: 'none'}}
          disabled/>
        </Stack>
        <Stack spacing={0}>
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
          <input className="inputEspecialAC" type="text" value={mostrarTxtCont} onChange={handleChange} 
          style={{width: "100%", color: 'red',border: 'none',backgroundColor: 'white',outline: 'none'}}
          disabled/>
        </Stack>
      </Stack>


      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        style={{ backgroundColor: backgroundBtnReg, mt: 3 , marginTop: "30px" }}
        disabled={botonDeshabilitado}
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
        
          <Card sx={{ p: 4, width: '25%', maxWidth: 1200, maxHeight: '95vh' }}>
            <div style={{ textAlign: 'center' }}>
              <Typography variant="h4">Crear cuenta</Typography>
            </div>
            <div>
              <br />
            </div>
            {renderForm}
          </Card>
      
      </Box>
    </Box>
  );
};

