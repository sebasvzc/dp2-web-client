import { useState, useEffect } from 'react';
import * as React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { FileUploader } from "react-drag-drop-files";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {  FormControlLabel, Checkbox, CardMedia,CardContent,TextField, Button, Grid, Typography, Select, MenuItem, InputLabel, FormControl, Box, Container } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Dropzone, FileMosaic } from "@files-ui/react";
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@mui/styles';
import ListSubheader from '@mui/material/ListSubheader';
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from '@mui/material/InputAdornment';

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
  export default function CuponNew() {
    const classes = useStyles();

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
    const handleSubmit = (event) => {
      event.preventDefault();
      // Lógica para manejar la submisión del formulario
    };
    const [files, setFiles] = React.useState([]);
    const updateFiles = (incommingFiles) => {
      setFiles(incommingFiles);
    };
    const [tiendas, setTiendas] = useState([]);
    const [selectedTienda, setSelectedTienda] = useState('');
    const [searchTerm, setSearchTerm] = useState('all');
    const getTiendas = async () => {
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
    return (
      <Container>
        <Typography variant="h2" sx={{ marginBottom: 2 }}>Crear Cupon</Typography>
        <hr style={{ borderColor: 'black', borderWidth: '1px 0 0 0', margin: 0 }} />
        <Box sx={{ mt: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <FormControlLabel control={<Checkbox name="esLimitado" />} label="Es Limitado" />
              </Grid>
              <Grid item xs={2}>
                <TextField fullWidth label="Código" name="codigo" />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel id="search-select-label">Tienda</InputLabel>
                  <Select
                    // Disables auto focus on MenuItems and allows TextField to be in focus
                    MenuProps={{ autoFocus: false }}
                    labelId="search-select-label"
                    id="search-select"
                    value={selectedTienda}
                    label="Elegir Tienda"
                    onChange={(e) => setSelectedTienda(e.target.value)}
                    onClose={() => setSearchTerm("all")}
                    // This prevents rendering empty string in Select's value
                    // if search text would exclude currently selected option.
                    renderValue={() => selectedTienda}
                  >
                    <ListSubheader>
                      <TextField
                        size="small"
                        // Autofocus on textfield
                        autoFocus
                        placeholder="Busca una tienda por nombre..."
                        fullWidth
                        onChange={changeTermSearch}
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
                      <MenuItem key={i} value={option.nombre}>
                        {option.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel id="fidTipoCupon-label">Tipo de Cupón</InputLabel>
                  <Select labelId="fidTipoCupon-label" label="Tipo de Cupón" name="fidTipoCupon">
                    {/* Opciones del ComboBox de Tipos de Cupon */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Sumilla" name="sumilla" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Descripción Completa" name="descripcionCompleta" multiline rows={4} />
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth label="Términos y Condiciones" name="terminosCondiciones" multiline rows={4} />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth label="Fecha de Expiración" name="fechaExpiracion" type="date" InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth label="Costo en Puntos" name="costoPuntos" />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth label="Cantidad Inicial" name="cantidadInicial" />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth label="Orden de Priorización" name="ordenPriorizacion" />
              </Grid>
              <Grid item xs={6}>
                <Dropzone onChange={updateFiles} value={files} label="Arrastra y suelta tus archivos" maxFiles={1} footer={false} localization="ES-es" accept="image/*">
                  {files.map((file) => (
                    <FileMosaic {...file} preview   localization="ES-es" style={{width: '80%'}}/>
                  ))}
                </Dropzone>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">Crear</Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    );

  }