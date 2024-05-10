import { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FileUploader } from "react-drag-drop-files";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {  FormControlLabel, Checkbox, CardMedia,CardContent,TextField, Button, Grid, Typography, Select, MenuItem, InputLabel, FormControl, Box, Container } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@mui/styles';


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
    const [file, setFile] = useState(null);
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
    };
    return (
      <Container>
        <Typography variant="h2" sx={{ marginBottom: 2 }}>Crear Cupon</Typography>
        <hr style={{ borderColor: 'black', borderWidth: '1px 0 0 0', margin: 0 }} />
        <Box sx={{ mt: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth label="Código" name="codigo" />
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel id="fidLocatario-label">Locatario</InputLabel>
                  <Select labelId="fidLocatario-label" label="Locatario" name="fidLocatario">
                    {/* Opciones del ComboBox de Tiendas */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
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
              <Grid item xs={6}>
                <TextField fullWidth label="Fecha de Expiración" name="fechaExpiracion" type="date" InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Términos y Condiciones" name="terminosCondiciones" multiline rows={4} />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel control={<Checkbox name="esLimitado" />} label="Es Limitado" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Costo en Puntos" name="costoPuntos" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Cantidad Inicial" name="cantidadInicial" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Orden de Priorización" name="ordenPriorizacion" />
              </Grid>
              <Grid item xs={6}>
                <Card position="center" onClick={handleImageClick}>

                  {imagePreview && (
                    <div>
                      <img alt="Preview" src={imagePreview} />


                    <Button className={classes.overlay} onClick={handleDeleteImage}>
                      <IconButton className={classes.deleteIcon}>
                        <DeleteIcon />
                      </IconButton>
                      <Typography variant="body1">Borrar Imagen</Typography>
                    </Button>
                    </div>
                  )}
                  {showFileUploader && !imagePreview && (
                    <FileUploader handleChange={handleChange} name="file" types={fileTypes} label="Arrastra o carga la imagen del cupon"  classes={classes.fileUpload} />
                  )}
                </Card>
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