import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import * as React from "react";
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Dropzone, FileMosaic } from "@files-ui/react";

import Stack from '@mui/material/Stack';
import { makeStyles } from '@mui/styles';
import SearchIcon from "@mui/icons-material/Search";
import ListSubheader from '@mui/material/ListSubheader';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {TimePicker,LocalizationProvider  } from '@mui/x-date-pickers';
import {Box, Grid, Button, Select, MenuItem, TextField, Container, Typography, InputLabel, FormControl } from '@mui/material';

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
  
  export default function EventoNew() {
    const classes = useStyles();
    const navigate=useNavigate();

    const handleBack = () => {
      navigate('/evento'); 
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

    const [backgroundBtnReg, setBackgroundBtnReg] = useState("#CCCCCC");
    const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);

    const handleSubmit = async (event) => {
      console.log("EntrandoSubmit")
      event.preventDefault();
      try {
        console.log("1")
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        const formData = new FormData();

        console.log(formData.append)
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }
        
        let response="";
        console.log("Respuesta", response);
        response = await fetch(`http://localhost:3000/api/eventos/crear`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            // 'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
            'Refresh-Token': `Bearer ${refreshToken}`
          },

        });
        console.log("Respuesta", response);
        if (response.status === 403 || response.status === 401) {
          localStorage.removeItem('user');
          window.location.reload();
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        toast.success('Evento creada exitosamente', {
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored"
        });
        navigate('/evento');
        return data;
      } catch (error) {
        console.error('Error fetching crear eventos:', error);
        throw error;
      }
    };
    const [files, setFiles] = React.useState([]);
    const updateFiles = (incommingFiles) => {
      console.log(typeof incommingFiles)
      setFiles(incommingFiles);
    };
    const [startTime, setStartTime] = useState(dayjs());
    const [endTime, setEndTime] = useState(dayjs());
    const [eventos, setEventos] = useState([]);
    const [selectedEvento, setSelectedEvento] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [tipoEventoes, setTipoEventoes] = useState([]);
    const [selectedTipoEvento, setSelectedTipoEvento] = useState('');
    const [searchTermTipoEventoes, setSearchTermTipoEventoes] = useState('');



    const getCategoriaEventos = async () => {
      /*
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        let response="";
        console.log(searchTerm)
        if(searchTerm===""){
          response = await fetch(`http://localhost:3000/api/categoriaEvento/listarCategoriaEventosWeb?query=all&page=1&pageSize=10`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Refresh-Token': `Bearer ${refreshToken}`
            }
          });
        }else{
          response = await fetch(`http://localhost:3000/api/categoriaEvento/listarCategoriaEventosWeb?query=${searchTerm}&page=1&pageSize=10`, {
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
    };

    
    const getTipoEventoes = async () => {
      /*
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        let response="";
        console.log(searchTermTipoEventoes)
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
  
    const handleCrear = () => {
      navigate('/evento'); // Redirige al usuario a la ruta especificada
    };
    
    const handleSearch = async (e) => {
      e.preventDefault();
      const results = await getCategoriaEventos();
      
    };
    
    const changeTermSearch = async (e) => {
      e.preventDefault();
      setSearchTerm(e.target.value)
    };
    
    const handleSearchTipoEvento = async (e) => {
      
    };
    const changeTermSearchTipoEvento = async (e) => {
      e.preventDefault();
      setSearchTermTipoEventoes(e.target.value)
    };

    const [formDatos, setFormDatos] = useState({
      nombre: '',  
      descripcion: '',
      locacion: '',
      aforo: '',
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormDatos((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    const [mostrarTxtNombre, setMostrarTxtNombre] = useState('');
    const [mostrarTxtDescripcion, setMostrarTxtDescripcion] = useState('');
    const [mostrarTxtLocacion, setMostrarTxtLocacion] = useState('');
    const [mostrarTxtAforo, setMostrarTxtAforo] = useState('');
    const [mostrarTxtApertura, setMostrarTxtApertura] = useState('');
    const [mostrarTxtCierre, setMostrarTxtCierre] = useState('');

    /*
    useEffect(() => {
      const horaApertura = startTime.format("HH:mm:ss");
      const horaCierre = endTime.format("HH:mm:ss");
      const horaAperturaDate = new Date(`1970-01-01T${  horaApertura}`);
      const horaCierreDate = new Date(`1970-01-01T${  horaCierre}`);
      if (formDatos.nombre.length !== 0
        && selectedEvento.length !== 0
        && formDatos.aforo.length !== 0
        && formDatos.descripcion.length !== 0
        && formDatos.locacion.length !== 0
        && startTime.length !== 0
        && endTime.length !== 0
        && files.length !== 0
        && horaAperturaDate < horaCierreDate
      ) {
        setBackgroundBtnReg("#003B91");
        setBotonDeshabilitado(false);
      } else {
        setBackgroundBtnReg("#CCCCCC");
        setBotonDeshabilitado(true);
      }
      
      console.log(horaAperturaDate);
      console.log(horaCierreDate);

    if (horaAperturaDate > horaCierreDate) {
      setMostrarTxtApertura('La hora de apertura es mayor que la hora de cierre.');
    }else {
      setMostrarTxtApertura("");
    }
  
    },[formDatos.nombre,selectedEvento,formDatos.aforo,
      formDatos.descripcion, formDatos.locacion,startTime,endTime,files]); // Cierra correctamente con un corchete    
    */

    return (
      <Container sx={{  borderLeft: '1 !important', borderRight: '1 !important', maxWidth: 'unset !important' , padding: 0 }} >
       <Stack direction="row" alignItems="center" spacing={2}>
          <ArrowBackIcon onClick={handleBack} style={{ cursor: 'pointer' }}/>
          <Typography variant="h2" sx={{ marginBottom: 2 }}>Crear Evento</Typography>
        </Stack>
        <hr style={{ borderColor: 'black', borderWidth: '1px 0 0 0', margin: 0 }} />
        <Box sx={{ mt: 3 , borderRadius: '8px',  padding: '2%' , border: '2px solid #CCCCCC', backgroundColor: '#F5F5F5' }}>
        <p>
            <strong>(*) Todos los campos son obligatorios para poder crear una evento</strong>
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
                onChange={handleChange}
                label="Locacion" name="locacion" />
              </Grid>
              
            </Grid>
          </form>
        </Box>
      </Container>
    );

  }