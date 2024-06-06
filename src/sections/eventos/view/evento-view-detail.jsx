import dayjs from 'dayjs';
import * as React from 'react';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from 'react';
import { Dropzone, FileMosaic } from '@files-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import ListSubheader from '@mui/material/ListSubheader';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Chip,
  InputLabel,
  MenuItem,
  Select, Table, TableBody, TableContainer,
  TextField,
} from '@mui/material';  // Extiende dayjs con el plugin UTC
import { toast } from 'react-toastify';  // Importa el plugin UTC para manejar correctamente las fechas UTC
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import TablePagination from '@mui/material/TablePagination';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Iconify from '../../../components/iconify';

import { getTipoEventos,getLugarEvento,getTiendaEvento, } from '../../../funciones/api';
import DashboardEventosCategorCliente from '../../overview/DashboardEventosCategorCliente';
import DashboardEventosAsistentes from '../../overview/DashboardEventosAsistentes';
import DashboardAsistentes from '../../overview/DashboardAsistentes';
import DashboardGeneroEdad from '../../overview/DashboardGeneroEdad';

dayjs.extend(utc);

export default function EventoDetail() {
  const [view, setView] = useState('datos');
  const { id: idParam } = useParams();
  const [editable, setEditable] = useState(false);
  const [editableImg, setEditableImg] = useState(false);
  const [order, setOrder] = useState('asc');
  const [searchName, setSearchName] = useState("all");
  const [dataClients, setDataClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [habilitarEventos, setHabilitarEventos] = useState(true);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [activo,setActivo]=useState(false)
  const [orderBy, setOrderBy] = useState('id');
  const [urlImagenS3 , setUrlImagenS3] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const filterName= useState("")
  const [dataDash, setDataDash] = useState({ fechas: [], cantidades: [] });
  const [dataDashEventos, setDataDashEventos] = useState({ totalAsistencia: 1, totalInscritos: 1});
  const [dataDashEventosAgrupEdadAsist, setDataDashEventosAgrupEdadAsist] = useState([]);
  const [totalClientsEvento, setTotalClientsEvento] = useState(10);
  const [codigoText, setCodigoText] = useState('');
  const [nombreText, setNombreText] = useState('');
  const [descripcionText, setDescripcionText] = useState('');
  const [puntosOtorgadosText, setPuntosOtorgadosText] = useState('');
  const [selectedLugar, setSelectedLugar] = useState('');
  const [selectedEvento, setSelectedEvento] = useState('');

  const [files, setFiles] = React.useState([]);
  const updateFiles = (incommingFiles) => {
    setFiles(incommingFiles);
  };
  const previewImage = document.querySelector("#previewImage");
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState('');
  const [tiendas, setTiendas] = useState([]);
  const [selectedTienda, setSelectedTienda] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLugar, setSearchLugar] = useState('');
  const [searchTienda, setSearchTienda] = useState('');
  const [tipoEventos, setTipoEventos] = useState([]);
  const [selectedTipoEvento, setSelectedTipoEvento] = useState('');
  const [searchTermTipoEventos, setSearchTermTipoEventos] = useState('');
  const labelDisplayedRows = ({ from, to, count }) => `${from}-${to} de ${count}`;
  const navigate=useNavigate();

  const [eventos, setEventos] = useState([]);
  const [lugar, setLugar] = useState([]);
  const [tienda, setTienda] = useState([]);

  const handleBack = () => {
    navigate('/evento'); 
  }

  useEffect(() => {
    // Suponiendo que tienes una función para cargar datos de un cupón por su id
    // eslint-disable-next-line no-shadow
    async function loadEventoData(searchTerm) {
      console.log("EventoData")
      setLoading(true);
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        console.log(idParam)
        // Simulación de carga
        let response="";
        response = await fetch(`http://3.220.179.149/api/api/eventos/detalleEventoCompleto`, {
          method: 'POST',
          body: JSON.stringify({
            id:idParam,
            permission:"Gestion de Eventos"
          }),
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
        const resultsTipo =  await getTipoEventos(token,refreshToken,searchTerm);
        console.log("viendo eventos uwu", resultsTipo.tipoEventos)
        setEventos(resultsTipo.tipoEventos);

        const resultsTienda =  await getTiendaEvento(token,refreshToken,searchTerm);
        console.log("viendo tiendas uwu", resultsTienda.tiendas)
        setTienda(resultsTienda.tiendas);

        const resultsLugar =  await getLugarEvento(token,refreshToken,searchTerm);
        console.log("viendo luagres uwu", resultsLugar.lugares)
        setLugar(resultsLugar.lugares);

        const data = await response.json();
        console.log(data)

        if(data.detalles.activo===true){
          setActivo("Activo")
        }
        else{
          setActivo("Baneado")
        }
        console.log("Datos: ",data.detalles)

        setCodigoText(data.detalles.codigo)
        setNombreText(data.detalles.nombre)
        setUrlImagenS3(data.image)
        setDescripcionText(data.detalles.descripcion)
        setPuntosOtorgadosText(data.detalles.puntosOtorgados)
        setStartDate(dayjs(data.detalles.fechaInicio).utc(true))
        setEndDate(dayjs(data.detalles.fechaFin).utc(true))
        setUrlImagenS3(data.image);

        console.log("Datos de data:", data.detalles)
        setSelectedEvento(data.detalles.tipoEvento.id)
        setSelectedLugar(data.detalles.lugar.id)
        setSelectedTienda(data.detalles.locatario.id)

        console.log(idParam)

        let responseEventoAsist="";
        responseEventoAsist = await fetch(`http://localhost:3000/api/eventos/listarAsistencia?idParam=${idParam}`, {
          method: 'GET',

          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Refresh-Token': `Bearer ${refreshToken}`
          },

        });
        if (responseEventoAsist.status === 403 || responseEventoAsist.status === 401) {
          localStorage.removeItem('user');
          window.location.reload();
        }

        if (!responseEventoAsist.ok) {
          throw new Error('Network response was not ok');
        }
        console.log("Evento Asistnecia")
        const data6 = await responseEventoAsist.json();
        console.log(data6)
        if(data6.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = data6.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
          console.log("He puesto un nuevo token");
        }
        if (data6) {
          console.log("Viendo asistencia de evento");
          console.log(data6);

        }
        setDataDashEventos({ totalAsistencia: data6.totalAsistio, totalInscritos: data6.totalEventos})

        let responseEventoAsistAgrupEdad="";
        responseEventoAsistAgrupEdad = await fetch(`http://localhost:3000/api/eventos/asitenciaXGeneroAgrupEdad?idParam=${idParam}`, {
          method: 'GET',

          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Refresh-Token': `Bearer ${refreshToken}`
          },

        });
        if (responseEventoAsistAgrupEdad.status === 403 || responseEventoAsistAgrupEdad.status === 401) {
          localStorage.removeItem('user');
          window.location.reload();
        }

        if (!responseEventoAsistAgrupEdad.ok) {
          throw new Error('Network response was not ok');
        }
        console.log("Evento Asistnecia")
        const data10 = await responseEventoAsistAgrupEdad.json();
        console.log(data10)
        if(data10.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = data10.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
          console.log("He puesto un nuevo token");
        }
        if (data10) {
          console.log("Viendo asistencia de evento agrupada por edad y genero");
          console.log(data10);

        }
        setDataDashEventosAgrupEdadAsist(data10)
        setLoading(false);
      }catch (err) {
        console.error("Failed to fetch cupon data", err);
      }
    }
      loadEventoData();
  }, [idParam, page, pageSize, searchName]);


  const handleSubmit = async (event) => {
    console.log("funciona")
  };

  const handleChangeImage = async (e) => {
    e.preventDefault();
    setEditableImg(true);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    const { token, refreshToken } = userStringify;
    const results = await getTipoEventos(token,refreshToken,searchTerm);
    console.log("viendo resultados", results.tipoEventos)
    setEventos(results.tipoEventos);
  };

  const changeLugarSearch = async (e) => {
    e.preventDefault();
    setSearchLugar(e.target.value)
  };
  
  const handleLugarEvento = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    const { token, refreshToken } = userStringify;
    const results = await getLugarEvento(token,refreshToken,searchLugar);
    // console.log("viendo lugares", results.lugares)
    setLugar(results.lugar);
  };

  const changeTiendaSearch = async (e) => {
    e.preventDefault();
    setSearchTienda(e.target.value)
  };
  
  const handleTiendaEvento = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    const { token, refreshToken } = userStringify;
    const results = await getTiendaEvento(token,refreshToken,searchTienda);
    // console.log("viendo tiendas", results.tiendas)
    setTienda(results.locatario);
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
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    console.log("Este es el id que ordena")
    console.log(id)
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    console.log("newSelected");
    console.log(newSelected);
    console.log(typeof newSelected);
  };
  const handleSelectAllClick = (event) => {

    console.log(searchName)
    if (event.target.checked) {
      const newSelecteds = dataClients.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleChangePage = (event, newPage) => {
    console.log("new page", newPage+1)
    setPage(newPage+1);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(1);
    setPageSize(parseInt(event.target.value, 10));
  };

  console.log("Valor de activo:", activo);
  const isActivo = activo === "Activo";

  const changeTermSearch = async (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value)
  };

  return (
    <Container sx={{  borderLeft: '1 !important', borderRight: '1 !important', maxWidth: 'unset !important' , padding: 0 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
          <ArrowBackIcon onClick={handleBack} style={{ cursor: 'pointer' }}/>
          <Typography variant="h2" sx={{ marginBottom: 2 }}>Visualizar Evento</Typography>
      </Stack>
      <hr style={{ borderColor: 'black', borderWidth: '1px 0 0 0', margin: 0 }} />
      <Grid container spacing={5}  >
        <Grid item xs={3}>
          <Box sx={{ borderRight: 1, borderColor: 'divider', height: '650px', paddingTop: 2 }}>

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
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <Box display="flex" justifyContent="flex-end" alignItems="center" />


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
                  <Grid item xs={12}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="h2" component="div" sx={{ marginRight: 2 }}>
                          {nombreText}
                        </Typography>
                        <Chip
                          label={isActivo ? "Evento Activo" : "Evento Inactivo"}
                          color={isActivo ? "success" : "default"}
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={4} >
                      <Box display="flex" justifyContent="center" alignItems="center" sx={{
                          border: '1px solid',
                          borderColor: '#A6B0BB',
                          borderRadius: '8px',
                          width: '100%', // Ancho fijo del contenedor
                          height: '350px', // Alto fijo del contenedor
                          overflow: 'hidden', // Oculta el contenido que se sale del contenedor
                        }}>
                        <Box
                          position="relative"
                          width="100%"
                          maxWidth="300px"
                          style={{ width: '100%', height: 'auto'}}
                        >
                          <img
                            src={urlImagenS3}
                            alt="Imagen Predeterminada"
                            style={{ width: '100%', height: 'auto' }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={8} container spacing={2}>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Código" name="codigo" 
                        disabled defaultValue={codigoText}/>
                      </Grid>
                      <Grid item xs={6}>
                      <FormControl fullWidth>
                          <InputLabel id="search-select-label-tipo-evento">Tipo Evento</InputLabel>
                          <Select
                            // Disables auto focus on MenuItems and allows TextField to be in focus
                            MenuProps={{ autoFocus: false }}
                            labelId="search-select-label-tipo-evento"
                            id="search-select-tipo-evento"
                            value={selectedEvento}
                            disabled={!editable}
                            label="Tipo de Evento"
                            onChange={(e) => setSelectedEvento(e.target.value)}
                            // This prevents rendering empty string in Select's value
                            // if search text would exclude currently selected option.

                          >
                            <ListSubheader>
                              <TextField
                                size="small"
                                autoFocus
                                placeholder="Buscar tipo por nombre..."
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
                            {eventos.map((option, i) => (
                              <MenuItem key={i} value={option.id}>
                                {option.nombre}
                              </MenuItem>
                            ))}
                          </Select>
                  </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth  label="Descripción Completa" name="descripcion" 
                        multiline rows={3} disabled defaultValue={descripcionText}/>
                      </Grid>
                      <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel 
                        id="search-select-label-ubicacion" >Ubicación</InputLabel>
                        <Select
                          // Disables auto focus on MenuItems and allows TextField to be in focus
                          MenuProps={{ autoFocus: false }}
                          labelId="search-select-label-ubicacion"
                          id="search-select-ubicacion"
                          value={selectedLugar}
                          disabled={!editable}
                          label="Elegir Ubicacion"
                          onChange={(e) => setSelectedLugar(e.target.value)}
                          // This prevents rendering empty string in Select's value
                          // if search text would exclude currently selected option.

                        >
                          <ListSubheader>
                            <TextField
                              size="small"
                              autoFocus
                              placeholder="Buscar lugar por nombre..."
                              fullWidth
                              value={searchLugar}
                              onChange={changeLugarSearch}
                              onKeyDown={(e) => e.stopPropagation()} // Detener la propagación del evento
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon onClick={handleLugarEvento} />
                                  </InputAdornment>
                                )
                              }}
                            />
                          </ListSubheader>
                          {lugar.map((option, i) => (
                            <MenuItem key={i} value={option.id}>
                              {option.nombre}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <InputLabel 
                          id="search-select-label-tienda" >Tienda</InputLabel>
                          <Select
                            // Disables auto focus on MenuItems and allows TextField to be in focus
                            MenuProps={{ autoFocus: false }}
                            labelId="search-select-label-tienda"
                            id="search-select-tienda"
                            value={selectedTienda}
                            disabled={!editable}
                            label="Elegir Tienda"
                            onChange={(e) => setSelectedTienda(e.target.value)}
                            // This prevents rendering empty string in Select's value
                            // if search text would exclude currently selected option.

                          >
                            <ListSubheader>
                              <TextField
                                size="small"
                                autoFocus
                                placeholder="Buscar tienda por nombre..."
                                fullWidth
                                value={searchTienda}
                                onChange={changeTiendaSearch}
                                onKeyDown={(e) => e.stopPropagation()} // Detener la propagación del evento
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <SearchIcon onClick={handleTiendaEvento} />
                                    </InputAdornment>
                                  )
                                }}
                              />
                            </ListSubheader>
                            {tienda.map((option, i) => (
                              <MenuItem key={i} value={option.id}>
                                {option.nombre}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                      <LocalizationProvider  dateAdapter={AdapterDayjs} adapterLocale="de">
                      <DatePicker
                        label="Fecha inicio"
                        value={startDate}
                        disabled={!editable}
                        format="DD/MM/YYYY"
                        sx={{ width: '100%' , marginBottom: 0, paddingBottom: 0}}
                      />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                      <LocalizationProvider  dateAdapter={AdapterDayjs} adapterLocale="de">
                      <DatePicker
                        label="Fecha fin"
                        value={endDate}
                        disabled={!editable}
                        format="DD/MM/YYYY"
                        sx={{ width: '100%' , marginBottom: 0, paddingBottom: 0}}
                      />
                      </LocalizationProvider>
                    </Grid>
                    
                    </Grid>       
                    <Grid item xs={4}>
                      <TextField fullWidth label="Puntos Otorgados" name="puntosOtorgados" 
                        disabled defaultValue={puntosOtorgadosText}/>
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

                <Grid item xs={4} md={4} lg={4} container>

                  <Grid item xs={12} md={12} lg={12} >
                  <Card


                    sx={{
                      px: 3,
                      py: 5,
                      mx:2,
                      my:4,
                      border: "1px solid #BFC0C1",
                      backgroundColor: '#F9FAFB',
                      }} >
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <DashboardEventosAsistentes dataDash={dataDashEventos}/>
                        </Grid>
                      </Grid>
                  </Card>
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} >
                    <Card


                      sx={{
                        px: 3,
                        py: 5,
                        mx:2,
                        my:4,
                        border: "1px solid #BFC0C1",
                        backgroundColor: '#F9FAFB',
                      }} >
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <DashboardAsistentes dataDash={dataDashEventos}/>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>
                <Grid item xs={8} md={8} lg={8}>
                  <Card


                    sx={{
                      px: 3,
                      py: 5,
                      mx:2,
                      my:4,
                      border: "1px solid #BFC0C1",
                      backgroundColor: '#F9FAFB',
                    }} >
                    <Grid container spacing={2}>

                      <Grid item xs={12}>
                      <DashboardGeneroEdad dataDash={dataDashEventosAgrupEdadAsist}/>
                      </Grid>

                    </Grid>

                  </Card>
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
