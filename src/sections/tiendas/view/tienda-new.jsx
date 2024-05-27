import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import { useState, useEffect } from 'react';
import * as React from "react";
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import {  FormControlLabel, Checkbox, CardMedia,CardContent,TextField, Button, Grid, Typography, Select, MenuItem, InputLabel, FormControl, Box, Container } from '@mui/material';

// eslint-disable-next-line import/no-extraneous-dependencies
import { Dropzone, FileMosaic } from "@files-ui/react";
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@mui/styles';
import ListSubheader from '@mui/material/ListSubheader';
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from '@mui/material/InputAdornment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DatePicker,LocalizationProvider,TimePicker  } from '@mui/x-date-pickers';

dayjs.locale('es-mx');

const useStyles = makeStyles((theme) => ({
  hideNavigationButton: {
    display: 'none !important',
  },
  paginationContainer: {
    display: 'inline-block',
  },
  centeredPagination: {
    margin: 'auto',
    maxWidth: 'fit-content',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    cursor: 'pointer',
  },
  deleteIcon: {
    color: 'white',
  },
  fileUpload:{
    alignItems: 'center',
  }
}));
  // ----------------------------------------------------------------------
  const scrollContainerStyle = {
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 470px)',
    paddingRight: '0.1%',
    boxSizing: 'border-box', // Añade esta propiedad para incluir el padding en el ancho total
  };
  const fileTypes = ["JPG", "PNG"];
  
  export default function TiendaNew() {
    const classes = useStyles();
    const navigate=useNavigate();

    const handleBack = () => {
      navigate('/tienda'); 
    }
    /* const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('/public/a/tu/imagen.jpg');
    const [showFileUploader, setShowFileUploader] = useState(true);

    const handleChange = (fileX) => {
      setFile(fileX);
      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };

      reader.readAsDataURL(fileX);
      setShowFileUploader(false);
    };

    const handleImageClick = () => {
      setShowFileUploader(true);
    };

    const handleDeleteImage = () => {
      setFile(null);
      setImagePreview(null);
      setShowFileUploader(true);
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      // Lógica para manejar la submisión del formulario
    }; */

    const handleSubmit = async (event) => {
      /*
      event.preventDefault();
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        const formData = new FormData();

        formData.append("file", files[0].file)
        formData.append("esLimitado", event.target.esLimitado.checked ? "1" : "0");
        formData.append("codigo", event.target.codigo.value);
        formData.append("sumilla", event.target.sumilla.value);
        formData.append("descripcionCompleta", event.target.descripcionCompleta.value);
        formData.append("terminosCondiciones", event.target.terminosCondiciones.value);
        formData.append("fechaExpiracion", startDate.format("YYYY-MM-DD"));  // Asegúrate de que startDate es manejado correctamente
        formData.append("costoPuntos", event.target.costoPuntos.value);
        formData.append("cantidadInicial", event.target.cantidadInicial.value);
        formData.append("ordenPriorizacion", event.target.ordenPriorizacion.value);
        formData.append("fidLocatario", selectedTienda);
        formData.append("fidTipoTienda", selectedTipoTienda);
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }

         let response="";
        response = await fetch(`http://localhost:3000/api/cupones/crear`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            // 'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
            'Refresh-Token': `Bearer ${refreshToken}`
          },

        });
        if (response.status === 403 || response.status === 401) {
          localStorage.removeItem('user');
          window.location.reload();
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        toast.success('Tienda creado exitosamente', {
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored"
        });
        navigate('/cupon');
        return data;
      } catch (error) {
        console.error('Error fetching crear cupones:', error);
        throw error;
      }
      */
    };
    const [files, setFiles] = React.useState([]);
    const updateFiles = (incommingFiles) => {
      console.log(typeof incommingFiles)
      setFiles(incommingFiles);
    };
    const [startTime, setStartTime] = useState(dayjs());
    const [tiendas, setTiendas] = useState([]);
    const [selectedTienda, setSelectedTienda] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [tipoTiendaes, setTipoTiendaes] = useState([]);
    const [selectedTipoTienda, setSelectedTipoTienda] = useState('');
    const [searchTermTipoTiendaes, setSearchTermTipoTiendaes] = useState('');

    const getTiendas = async () => {
      /*
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        let response="";
        console.log(searchTerm)
        if(searchTerm===""){
          response = await fetch(`http://localhost:3000/api/tiendas/listartiendas?query=all&page=1&pageSize=10`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Refresh-Token': `Bearer ${refreshToken}`
            }
          });
        }else{
          response = await fetch(`http://localhost:3000/api/tiendas/listartiendas?query=${searchTerm}&page=1&pageSize=10`, {
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
      */
    };

    const getTipoTiendaes = async () => {
      /*
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        let response="";
        console.log(searchTermTipoTiendaes)
        if(searchTerm===""){
          response = await fetch(`http://localhost:3000/api/tipocupones/listartipocupones?query=all&page=1&pageSize=10`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Refresh-Token': `Bearer ${refreshToken}`
            }
          });
        }else{
          response = await fetch(`http://localhost:3000/api/tipocupones/listartipocupones?query=${searchTerm}&page=1&pageSize=10`, {
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
      */
    };
    const handleSearch = async (e) => {
      e.preventDefault();
      const results = await getTiendas();
      console.log("viendo resultados", results.tiendas)
      setTiendas(results.tiendas);
    };
    const changeTermSearch = async (e) => {
      e.preventDefault();
      setSearchTerm(e.target.value)
    };
    const handleSearchTipoTienda = async (e) => {
      e.preventDefault();
      const results = await getTipoTiendaes();
      console.log("viendo resultados", results.tipoTiendaes)
      setTipoTiendaes(results.tipoTiendaes);
    };
    const changeTermSearchTipoTienda = async (e) => {
      e.preventDefault();
      setSearchTermTipoTiendaes(e.target.value)
    };

    return (
      <Container sx={{  borderLeft: '1 !important', borderRight: '1 !important', maxWidth: 'unset !important' , padding: 0 }} >
       <Stack direction="row" alignItems="center" spacing={2}>
          <ArrowBackIcon onClick={handleBack} style={{ cursor: 'pointer' }}/>
          <Typography variant="h2" sx={{ marginBottom: 2 }}>Crear Tienda</Typography>
        </Stack>
        <hr style={{ borderColor: 'black', borderWidth: '1px 0 0 0', margin: 0 }} />
        <Box sx={{ mt: 3 , borderRadius: '8px',  padding: '2%' , border: '2px solid #CCCCCC', backgroundColor: '#F5F5F5' }}>
        <p>
            <strong>(*) Todos los campos son obligatorios para poder crear una tienda</strong>
          </p>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={2}>
            <Grid item xs={12} >
                    <Dropzone onChange={updateFiles} value={files} label="Arrastra y suelta tus archivos" 
                    maxFiles={1} footer={false} localization="ES-es" accept="image/*"
                    >
                      {files.map((file) => (
                        <FileMosaic {...file} preview   localization="ES-es" style={{width: '70%'}}/>
                      ))}
                    </Dropzone>
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth 
                
                label="Nombre" name="nombre" />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel 
                  id="search-select-label" >Categoría</InputLabel>
                  <Select
                    // Disables auto focus on MenuItems and allows TextField to be in focus
                    MenuProps={{ autoFocus: false }}
                    labelId="search-select-label"
                    id="search-select"
                    value={selectedTienda}
                    label="Elegir Tienda"
                    onChange={(e) => setSelectedTienda(e.target.value)}
                    // This prevents rendering empty string in Select's value
                    // if search text would exclude currently selected option.

                  >
                    <ListSubheader>
                      <TextField
                        size="small"
                        autoFocus
                        placeholder="Busca una tienda por nombre..."
                        fullWidth
                        value={searchTerm}
                        onChange={changeTermSearch}
                        onKeyDown={(e) => e.stopPropagation()} // Detener la propagación del evento
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon onClick={handleSearch} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </ListSubheader>
                    {tiendas.map((option, i) => (
                      <MenuItem key={i} value={option.id}>
                        {option.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth 
                
                label="Locacion" name="locacion" />
              </Grid>
              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                  <TimePicker
                    label="Hora Apertura"
                    value={startTime}
                    onChange={setStartTime}
                    sx={{ width: '100%', marginBottom: 0, paddingBottom: 0 }}
                />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                  <TimePicker
                    label="Hora Cierre"
                    value={startTime}
                    onChange={setStartTime}
                    sx={{ width: '100%', marginBottom: 0, paddingBottom: 0 }}
                />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth 
                
                label="Aforo" name="aforo" />
              </Grid>
            <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" >Crear</Button>
            </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    );

  }