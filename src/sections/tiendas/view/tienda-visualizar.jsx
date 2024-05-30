import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import * as React from 'react';
import utc from 'dayjs/plugin/utc';
import { useState, useEffect } from 'react';
import { Dropzone, FileMosaic } from '@files-ui/react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import ListSubheader from '@mui/material/ListSubheader';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import {
  Grid,
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel, FormControl,
} from '@mui/material';  // Extiende dayjs con el plugin UTC
import { toast } from 'react-toastify';  // Importa el plugin UTC para manejar correctamente las fechas UTC
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import TablePagination from '@mui/material/TablePagination';

import Iconify from '../../../components/iconify';
import UserTableToolbar from '../../user/user-table-toolbar';
import { getTiendas, getCategoriaTiendas } from '../../../funciones/api';
import DashboardCuponClient from '../../overview/dashboardCuponClient';
import FictionBooksSalesChart from '../../overview/FictionBooksSalesChart';



dayjs.extend(utc);
dayjs.extend(customParseFormat);
export default function TiendaDetail() {
  const [view, setView] = useState('datos');
  const { id: idParam } = useParams();
  const [editable, setEditable] = useState(false);
  const [editableImg, setEditableImg] = useState(false);
  const [order, setOrder] = useState('asc');
  const [searchName, setSearchName] = useState("all");
  const [dataClients, setDataClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [habilitarCupones, setHabilitarCupones] = useState(true);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [orderBy, setOrderBy] = useState('id');
  const [backgroundBtnHabilitar, setBackgroundBtnHabilitar] = useState("#CCCCCC");
  const [backgroundBtnDeshabilitar, setBackgroundBtnDeshabilitar] = useState("#CCCCCC");
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);
  const [fileUrl, setFileUrl] = useState('');
  const filterName= useState("")
  const [dataDash, setDataDash] = useState({ fechas: [], cantidades: [] });
  const [totalClientsCupon, setTotalClientsCupon] = useState(10);
  const [tiendaText, setTiendaText] = useState('');
  const [esLimitadoText, setEsLimitadoText] = useState(false);
  const [esLimitadoDesp, setEsLimitadoDesp] = useState(false);
  const [sumillaText, setSumillaText] = useState('');
  const [descripcionText, setDescripcionText] = useState('');
  const [terminosText, setTerminosText] = useState('');
  const [horaCierre, setHoraCierre] = useState(dayjs());
  const [horaApertura, setHoraApertura] = useState(dayjs());
  const [locacionText, setLocacionText] = useState('');
  const [aforo, setAforo] = useState('');
  const [fechaText, setFechaText] = useState('');
  const [costoText, setCostoText] = useState('');
  const [cantIniText, setCantIniText] = useState('');
  const [urlImagenS3 , setUrlImagenS3] = useState('');
  const [cantDisText, setCantDisText] = useState('');
  const [ordPriorizacionText, setOrdPriorizacionText] = useState('');
  const [files, setFiles] = React.useState([]);
  const updateFiles = (incommingFiles) => {
    setFiles(incommingFiles);
  };
  const previewImage = document.querySelector("#previewImage");
  const [startDate, setStartDate] = useState(dayjs());
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoCupones, setTipoCupones] = useState([]);
  const [selectedTipoCupon, setSelectedTipoCupon] = useState('');
  const [searchTermTipoCupones, setSearchTermTipoCupones] = useState('');
  const labelDisplayedRows = ({ from, to, count }) => `${from}-${to} de ${count}`;
  const navigate=useNavigate();

  useEffect(() => {
    // Suponiendo que tienes una función para cargar datos de un cupón por su id
    // eslint-disable-next-line no-shadow
    async function loadTiendaData(searchTerm,searchTermTipoCupones) {
      console.log("tiendaData")
      setLoading(true);
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        console.log(idParam)
        // Simulación de carga
        let response="";
        response = await fetch(`http://localhost:3000/api/tiendas/detalleTiendaCompleto`, {
          method: 'POST',
          body: JSON.stringify({ id:idParam }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
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


        const resultsTipo =  await getCategoriaTiendas(token,refreshToken,searchTermTipoCupones);
        console.log("viendo resultados categ tienda", resultsTipo)
        setCategorias(resultsTipo);

        const data = await response.json();
        console.log(data)


        console.log(esLimitadoText)
        setTiendaText(data.detalles.nombre)
        setSelectedCategoria(data.detalles.categoriaTienda.id)
        setLocacionText(data.detalles.locacion)
        setDescripcionText(data.detalles.descripcion)
        console.log("hora apretura")
        console.log(dayjs(data.detalles.horaApertura, 'HH:mm:ss'))
        console.log(dayjs(data.detalles.horaApertura, 'HH:mm:ss'))
        setHoraApertura(dayjs(data.detalles.horaApertura, 'HH:mm:ss'))
        setHoraCierre(dayjs(data.detalles.horaApertura, 'HH:mm:ss'))
        setAforo(data.detalles.aforo)
        console.log(idParam)
        // Simulación de carga

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch cupon data", err);

        setLoading(false);
      }
    }

    loadTiendaData();
  }, [esLimitadoText, idParam, page, pageSize, searchName]);



  const handleSearch = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    const { token, refreshToken } = userStringify;
    const results = await getCategoriaTiendas(token,refreshToken,searchTerm);
    console.log("viendo resultados categorias tiendas solo res", results)
    console.log("viendo resultados categorias tiendas", results.categorias)
    setCategorias(results.categorias);
  };
  const handleChangeImage = async (e) => {
    e.preventDefault();
    setEditableImg(true);
  };
  const changeTermSearch = async (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value)
  };

  const changeTermSearchTipoCupon = async (e) => {
    e.preventDefault();
    setSearchTermTipoCupones(e.target.value)
  };

  const handleLimitado = (event) => {
    setEsLimitadoDesp(event.target.value);
  };
  const fetchAndSetView = async (newView) => {
    try {
      // Simulando una llamada a la API
      const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
      const data = await response.json();

      // Procesa la data aquí si es necesario
      console.log('Datos recibidos de la API:', data);

      // Cambia la vista
      setView(newView);
    } catch (error) {
      console.error('Error al obtener datos de la API:', error);
    }
  };

  const [formDatos, setFormDatos] = useState({
    tipo: "tienda",  
    idReferencia: idParam,
  });
  
  const handleDescargarQR = async (event) => {
    event.preventDefault();
    try {
      const user = localStorage.getItem('user');
      const userStringify = JSON.parse(user);
      const { token, refreshToken } = userStringify;
      const formData = new FormData();
      console.log(idParam)
      formData.append("tipo", "tienda");
      formData.append("idReferencia", idParam)
      // Simulación de carga
      console.log(formDatos)
      let response="";
      response = await fetch(`http://localhost:3000/api/qr/generar`, {
        method: 'POST',
        body: JSON.stringify(formDatos),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },

      });
      const data = await response.json();
      console.log("Respuesta JSON: ", data.qrCode);
      descargarImagen(data.qrCode);
      if (response.status === 403 || response.status === 401) {
        localStorage.removeItem('user');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error fetching crear QR:', error);
      throw error;
    }
  }

  const descargarImagen = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qr_code.png'; // Puedes cambiar el nombre del archivo según sea necesario
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container sx={{  borderLeft: '1 !important', borderRight: '1 !important', maxWidth: 'unset !important' , padding: 0 }}>
      <Typography variant="h2">
        {editable ? "Visualizar Tienda" : "Visualizar Tienda"}
      </Typography>
      <hr style={{ borderColor: 'black', borderWidth: '1px 0 0 0', margin: 0 }} />
      <Grid container spacing={5}  >
        <Grid item xs={3}>
          <Box sx={{ borderRight: 1, borderColor: 'divider', height: '950px', paddingTop: 2 }}>

            <List component="nav" aria-label="opciones de navegación">
              <ListItemButton
                component="a"
                onClick={() => setView('datos')}
                sx={{
                  width: '100%',
                  bgcolor: view === 'datos' ? '#F9FAFB' : '#F1F1F1',
                  '&:hover': {
                    bgcolor: '#E4E4E4', // Color cuando el mouse está sobre el ítem
                  },
                  position: 'relative', // Necesario para el pseudoelemento
                  ...(view === 'datos' && {
                    '&::before': { // Estilo para el "bookmark"
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '5px',
                      bgcolor: '#00489C', // Color azul para el "bookmark"
                    }
                  }),
                }}
              >
                <ListItemText primary="Datos" />
              </ListItemButton>
              <ListItemButton
                component="a"
                onClick={() => fetchAndSetView('estadisticas')}
                sx={{
                  width: '100%',
                  bgcolor: view === 'estadisticas' ? '#F9FAFB' : '#F1F1F1',
                  '&:hover': {
                    bgcolor: '#E4E4E4', // Color cuando el mouse está sobre el ítem
                  },
                  position: 'relative', // Necesario para el pseudoelemento
                  ...(view === 'estadisticas' && {
                    '&::before': { // Estilo para el "bookmark"
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '5px',
                      bgcolor: '#00489C', // Color azul para el "bookmark"
                    }
                  }),
                }}
              >
                <ListItemText primary="Estadísticas" />
              </ListItemButton>
            </List>
          </Box>
        </Grid>
        <Grid item xs={9}>
          {view === 'datos' ? (
            <form encType="multipart/form-data">

              {loading ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    height: '25%',
                    marginTop: '15%', // Ajusta la distancia desde la parte superior
                    marginBottom: '15%',
                  }}
                >
                  <CircularProgress color="primary" />
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Cargando...
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ mt: 3, maxHeight: '60vh', pr: 2 ,  padding: '2%'}}>
                 
                  <Grid container spacing={2}>
                    <Grid item xs={12} >
                      <Box display="flex" justifyContent="center" alignItems="center">
                      {editableImg ? <Dropzone
                          onChange={updateFiles}
                          value={files}
                          label="Arrastra y suelta tus archivos"
                          maxFiles={1}
                          footer={false}
                          localization="ES-es"
                          accept="image/*"
                          disabled={!editable}
                        >
                          {files.map((file, index) => (
                            // Asegura que cada FileMosaic tiene una key única
                            <FileMosaic
                              {...file}
                              key={file.name + index}
                              preview
                              localization="ES-es"
                              style={{ width: '80%' }}
                            />
                          ))}
                        </Dropzone> : <Box
                          position="relative"
                          width="100%"
                          maxWidth="300px"
                          style={{ width: '100%', height: 'auto' }}
                        >

                          <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            bgcolor="rgba(0, 0, 0, 0.2)"
                          >
                            {editable && (
                              <IconButton onClick={handleChangeImage} disabled style={{ color: 'white', fontSize: 16 }}>
                                <Iconify icon="ic:baseline-edit" style={{ color: 'white', fontSize: '2rem' }} />
                                Cambiar Imagen
                              </IconButton>
                            )}
                          </Box>
                        </Box>}
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField fullWidth label="Nombre" defaultValue={tiendaText} disabled />
                    </Grid>

                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel id="search-select-label" disabled >Categoria Tienda</InputLabel>
                        <Select
                          // Disables auto focus on MenuItems and allows TextField to be in focus
                          MenuProps={{ autoFocus: false }}

                          labelId="search-select-label"
                          id="search-select"
                          disabled={!editable}
                          value={selectedCategoria}
                          label="Elegir Tienda"
                          onChange={(e) => setSelectedCategoria(e.target.value)}
                          // This prevents rendering empty string in Select's value
                          // if search text would exclude currently selected option.

                        >
                          <ListSubheader>
                            <TextField
                              size="small"
                              autoFocus
                              placeholder="Busca una categoria por nombre..."
                              fullWidth
                              value={searchTerm}
                              onChange={changeTermSearch}
                              onKeyDown={(e) => e.stopPropagation()} // Detener la propagación del evento
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon onClick={handleSearch} />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </ListSubheader>
                          {categorias.map((option, i) => (
                            <MenuItem key={i} value={option.id}>
                              {option.nombre}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                      <TextField fullWidth label="Locacion" name="locacion" defaultValue={locacionText}
                                 disabled />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Descripción" name="descripcion" multiline rows={4}
                                 defaultValue={descripcionText} disabled />
                    </Grid>
                    <Grid item xs={4}>
                      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                        <TimePicker disabled
                          label="Hora Apertura"
                          value={horaApertura}
                          sx={{ width: '100%', marginBottom: 0, paddingBottom: 0 }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={4}>
                      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                        <TimePicker disabled
                          label="Hora Cierre"
                          value={horaCierre}
                          sx={{ width: '100%', marginBottom: 0, paddingBottom: 0 }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField fullWidth label="Aforo" name="aforo" defaultValue={aforo}
                                 disabled />
                    </Grid>
                    <Grid item xs={4}>
                      <Button variant="contained" color="info" 
                      sx={{backgroundColor: '#003B91', color:"#FFFFFF" , fontSize: '1rem',
                      marginTop: '16px', marginBottom: '0px'}} type='submit' onClick={handleDescargarQR}>
                      Descargar QR</Button>
                    </Grid>
                  </Grid>

                </Box>
              )}
            </form>

          ) : (
            <Box sx={{paddingTop:10}}>
            {loading ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    height: '25%',
                    marginTop: '15%', // Ajusta la distancia desde la parte superior
                    marginBottom: '15%',
                  }}
                >
                  <CircularProgress color="primary" />
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Cargando...
                  </Typography>
                </Box>
              ):(
              <Grid container spacing={2}  >
              <Grid xs={12} >

                  <FictionBooksSalesChart/>

              </Grid>

              </Grid>
              )}
              </Box >
          )}
        </Grid>
      </Grid>
    </Container>


  );
}
/**
 * 
 *  <TableBody>
                          {dataClients
                            .map((row) => (
                              <ClientCuponTableRow
                                key={row.id}
                                id={row.id}
                                nombre={row.cliente.nombre}
                                apellido={row.cliente.apellidoPaterno}
                                email={row.cliente.email}
                                telefono={row.cliente.telefono}
                                fechaCompra={row.fechaCompra}
                                selected={selected.indexOf(row.id) !== -1}
                                handleClick={(event) => handleClick(event, row.id)}
                              />
                            ))}
                        </TableBody>








                        <ClientCuponTableHead
                          order={order}
                          orderBy={orderBy}
                          rowCount={dataClients.length}
                          numSelected={selected.length}
                          onRequestSort={handleSort}
                          onSelectAllClick={handleSelectAllClick}
                          headLabel={[
                            { id: 'nombre', label: 'Nombre' },
                            { id: 'correo', label: 'Correo' },
                            { id: 'telefono', label: 'Telefono' },
                            { id: 'fechaCompra', label: 'Fecha de Compra'}

                          ]}
                        />
 */