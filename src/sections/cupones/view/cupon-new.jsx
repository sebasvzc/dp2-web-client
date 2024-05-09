import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import { Checkbox, FormControlLabel, FormGroup , Avatar } from '@mui/material';
import { DatePicker } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import EditIcon from '@mui/icons-material/Edit';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import obtenerCupones  from 'src/_mock/cupon';
import Iconify from 'src/components/iconify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import defaultImage from '../../../../public/assets/images/covers/cupon.jpg';

  const useStyles = makeStyles((theme) => ({
    hideNavigationButton: {
      display: 'none !important', // Oculta el botón de navegación
    },
    paginationContainer: {

      display: "inline-block"
    },
    centeredPagination: {
      margin: 'auto', // Centra horizontalmente el componente
      maxWidth: 'fit-content', // Ajusta el ancho al contenido
    },
  }));
  // ----------------------------------------------------------------------
  const scrollContainerStyle = {
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 470px)',
    paddingRight: '0.1%',
    boxSizing: 'border-box', // Añade esta propiedad para incluir el padding en el ancho total
  };
  export default function CuponNew() {
    const [error, setError] = useState(null);
    const [codigo, setCodigo] = useState('');
    const [fidLocatario, setFidLocatario] = useState('');
    const [fidTipoCupon, setFidTipoCupon] = useState('');
    const [sumilla, setSumilla] = useState('');
    const [descripcionCompleta, setDescripcionCompleta] = useState('');
    const [fechaExpiracion, setFechaExpiracion] = useState(null);
    const [terminosCondiciones, setTerminosCondiciones] = useState('');
    const [esLimitado, setEsLimitado] = useState(false);
    const [costoPuntos, setCostoPuntos] = useState('');
    const [cantidadInicial, setCantidadInicial] = useState('');
    const [cantidadDisponible, setCantidadDisponible] = useState('');
    const [ordenPriorizacion, setOrdenPriorizacion] = useState('');
    const [rutaFoto, setRutaFoto] = useState('');
    const [activo, setActivo] = useState(false);
    const [editingImage, setEditingImage] = useState(false);
   
    const [imagen, setImagen] = useState(defaultImage); // Imagen predefinida
    const [imageFile, setImageFile] = useState(null); // Para manejar el archivo de imagen seleccionado

    const handleDateChange = (date) => {
    setSelectedDate(date);
  };

    const handleSubmit = (event) => {
      event.preventDefault();
      // Aquí puedes enviar los datos del formulario a tu servidor
      console.log({
        codigo,
        fidLocatario,
        fidTipoCupon,
        sumilla,
        descripcionCompleta,
        fechaExpiracion,
        terminosCondiciones,
        esLimitado,
        costoPuntos,
        cantidadInicial,
        cantidadDisponible,
        ordenPriorizacion,
        rutaFoto,
        activo
      });
    };

    
  const navigate = useNavigate();

  const handleCrear = () => {
    navigate('/cupon'); // Redirige al usuario a la ruta especificada
  };

  const handleBack = () => {
    navigate('/cupon'); // Redirige al usuario a la ruta especificada
  };

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
  
      reader.onloadend = () => {
        setImagen(reader.result);
      };
  
      if (file) {
        reader.readAsDataURL(file);
        setImageFile(file);
      } else {
        setImagen(null); // Cambia a null si no se selecciona ninguna imagen
        setImageFile(null);
      }
    };

    const handleEditImage = () => {
      setEditingImage(!editingImage); // Cambia el estado de editingImage
      if (!editingImage) {
        // Limpiar imagen y archivo si se cancela la edición
        setImagen(null);
        setImageFile(null);
      }
    };

    if (error) {
      return <div>Error al cargar datos de cupones</div>; // Manejar errores de obtención de datos
    }
    return (
      
      <Container sx={{  borderLeft: '1 !important', borderRight: '1 !important', maxWidth: 'unset !important' , padding: 0}} >
        <Stack direction="row" alignItems="center" spacing={2}>
          <ArrowBackIcon onClick={handleBack} style={{ cursor: 'pointer' }}/>
          <Typography variant="h2" sx={{ marginBottom: 2 }}>Crear Cupón</Typography>
        </Stack>
        <hr style={{ borderColor: 'black', borderWidth: '1px 0 0 0', margin: 0 , marginBottom:40}} />
        <Box borderRadius={2} padding={6} variant="outlined"  sx={{ border: 0.1 , background: 'linear-gradient(to bottom, rgba(135, 206, 250, 0.05), rgba(0, 191, 255, 0.01))', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)'}}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                {editingImage ? (
                    <input
                      type="file"
                      accept="image/*"
                      id="image-upload"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                  ) : (
                    <Avatar src={imagen} alt="Imagen del cupón" sx={{ width: 200, height: 200, border: '2px solid #ccc', cursor: 'pointer' }} />
                  )}
                
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: 'left' }}>
                <Box display="flex">
                <label htmlFor="image-upload">
                <Button variant="contained" color="info" sx={{ backgroundColor: "#003B91", color:"#FFFFFF" }}
                  component="span"
                  startIcon={<EditIcon />}
                >Cambiar Imagen</Button>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="image-upload"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="ID Locatario" value={fidLocatario} onChange={(e) => setFidLocatario(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="ID Tipo Cupón" value={fidTipoCupon} onChange={(e) => setFidTipoCupon(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Sumilla" value={sumilla} onChange={(e) => setSumilla(e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline label="Descripción Completa" value={descripcionCompleta} onChange={(e) => setDescripcionCompleta(e.target.value)} />
              </Grid>
              
              <Grid item xs={12}>
              <DatePicker
                  label="Fecha de Expiración"
                  value={selectedDate}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField fullWidth multiline label="Términos y Condiciones" value={terminosCondiciones} onChange={(e) => setTerminosCondiciones(e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={esLimitado} onChange={(e) => setEsLimitado(e.target.checked)} />} label="Es Limitado" />
                  
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Costo en Puntos" value={costoPuntos} onChange={(e) => setCostoPuntos(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Cantidad Inicial" value={cantidadInicial} onChange={(e) => setCantidadInicial(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Cantidad Disponible" value={cantidadDisponible} onChange={(e) => setCantidadDisponible(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Orden de Priorización" value={ordenPriorizacion} onChange={(e) => setOrdenPriorizacion(e.target.value)} />
              </Grid>
            </Grid>
          </form>
        </Box>
        <Grid item xs={12} sx={{ textAlign: 'right' , marginTop: '20px'}} >
            <Button variant="contained" color="info" sx={{ backgroundColor: "#003B91", color:"#FFFFFF" }} onClick={handleCrear}>Crear Cupón</Button>
        </Grid>
      </Container>
    );
  }