import dayjs from 'dayjs';
import * as React from 'react';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from 'react';
import { Dropzone, FileMosaic } from '@files-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
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
import Iconify from '../../../components/iconify';

import { getTiendas, getTipoCupones } from '../../../funciones/api';

import DashboardCuponClient from '../../overview/dashboardCuponClient';
import UserTableToolbar from '../../user/user-table-toolbar';
import ClientCuponTableHead from '../cupon-client.table.head';
import ClientCuponTableRow from '../client-cupon-table-row';


dayjs.extend(utc);

export default function CuponDetail() {
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
  const filterName= useState('')
  const [dataDash, setDataDash] = useState({ fechas: [], cantidades: [] });
  const [totalClientsCupon, setTotalClientsCupon] = useState(10);
  const [cuponText, setCuponText] = useState('');
  const [esLimitadoText, setEsLimitadoText] = useState(false);
  const [sumillaText, setSumillaText] = useState('');
  const [descripcionText, setDescripcionText] = useState('');
  const [terminosText, setTerminosText] = useState('');
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
  const [tiendas, setTiendas] = useState([]);
  const [selectedTienda, setSelectedTienda] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoCupones, setTipoCupones] = useState([]);
  const [selectedTipoCupon, setSelectedTipoCupon] = useState('');
  const [searchTermTipoCupones, setSearchTermTipoCupones] = useState('');
  const labelDisplayedRows = ({ from, to, count }) => `${from}-${to} de ${count}`;
  const navigate=useNavigate();
  useEffect(() => {
    // Suponiendo que tienes una función para cargar datos de un cupón por su id
    // eslint-disable-next-line no-shadow
    async function loadCuponData(searchTerm,searchTermTipoCupones) {
      console.log("CuponData")
      setLoading(true);
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        console.log(idParam)
        // Simulación de carga
        let response="";
        response = await fetch(`http://localhost:3000/api/cupones/detalleCuponCompleto`, {
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
        const results =  await getTiendas(token,refreshToken,searchTerm);
        console.log("viendo resultados", results.tiendas)
        setTiendas(results.tiendas);


        const resultsTipo =  await getTipoCupones(token,refreshToken,searchTermTipoCupones);
        console.log("viendo resultados", resultsTipo.tipoCupones)
        setTipoCupones(resultsTipo.tipoCupones);

        const data = await response.json();
        console.log(data)
        setEsLimitadoText(data.detalles.esLimitado)
        setCuponText(data.detalles.codigo)
        setSumillaText(data.detalles.sumilla)
        setDescripcionText(data.detalles.descripcionCompleta)
        setTerminosText(data.detalles.terminosCondiciones)
        setFechaText(dayjs(data.detalles.fechaExpiracion).utc(true))
        setCostoText(data.detalles.costoPuntos)
        setCantIniText(data.detalles.cantidadInicial)
        setCantDisText(data.detalles.cantidadDisponible)
        setOrdPriorizacionText(data.detalles.ordenPriorizacion)
        setUrlImagenS3(data.image);

        setSelectedTienda(data.detalles.locatario.id)
        setSelectedTipoCupon(data.detalles.tipoCupon.id)

        console.log(idParam)
        // Simulación de carga

        if(searchName===""){
          response = await fetch(`http://localhost:3000/api/cupones/listarclientesxcupon?query=all&idParam=${idParam}&page=${page}&pageSize=${pageSize}`, {
            method: 'GET',

            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Refresh-Token': `Bearer ${refreshToken}`
            },

          });
        }else{
          response = await fetch(`http://localhost:3000/api/cupones/listarclientesxcupon?query=${searchName}&idParam=${idParam}&page=${page}&pageSize=${pageSize}`, {
            method: 'GET',

            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Refresh-Token': `Bearer ${refreshToken}`
            },

          });
        }

        if (response.status === 403 || response.status === 401) {
          localStorage.removeItem('user');
          window.location.reload();
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data2 = await response.json();
        console.log(data2)
        if(data2.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = data2.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
          console.log("He puesto un nuevo token");
        }
        if(data2.totalClientes){
          setTotalClientsCupon(data2.totalClientes);
        }

        setDataClients(data2.clientesxCupon);

        response = await fetch(`http://localhost:3000/api/cupones/listarcuponesxdiacanjeado?idParam=${idParam}`, {
          method: 'GET',

          headers: {
            'Accept': 'application/json',
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

        const data3 = await response.json();
        console.log(data3)
        if(data3.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = data3.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
          console.log("He puesto un nuevo token");
        }
        if(data3){
          console.log("Viendo data3");
          console.log(data3);
          const fechas = data3.usoDeCupones.map(item => item.fecha);
          const cantidad = data3.usoDeCupones.map(item => item.cantidad);
          setDataDash({ fechas, cantidad });

        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch cupon data", err);

        setLoading(false);
      }
    }

    loadCuponData();
  }, [idParam, page, pageSize, searchName]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("funciona")
    try {
      const user = localStorage.getItem('user');
      const userStringify = JSON.parse(user);
      const { token, refreshToken } = userStringify;
      const formData = new FormData();
      if (files && files.length > 0) {
        formData.append("file", files[0].file);
      } else {
        console.log("No se ha enviado ningún archivo");
        // Manejar el caso donde no se ha enviado ningún archivo si es necesario
      }
      formData.append("id", idParam);
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
      formData.append("fidTipoCupon", selectedTipoCupon);
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      let response="";
      response = await fetch(`http://localhost:3000/api/cupones/modificar`, {
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
      toast.success('Cupon modificado exitosamente', {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
      });
      setEditable(false);
      return data;
    } catch (error) {
      console.error('Error fetching crear cupones:', error);
      throw error;
    }
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    const { token, refreshToken } = userStringify;
    const results = await getTiendas(token,refreshToken,searchTerm);
    console.log("viendo resultados", results.tiendas)
    setTiendas(results.tiendas);
  };
  const handleChangeImage = async (e) => {
    e.preventDefault();
    setEditableImg(true);
  };
  const changeTermSearch = async (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value)
  };
  const handleSearchTipoCupon = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    const { token, refreshToken } = userStringify;
    const results = await getTipoCupones(token,refreshToken,searchTermTipoCupones);
    console.log("viendo resultados", results.tipoCupones)
    setTipoCupones(results.tipoCupones);
  };
  const changeTermSearchTipoCupon = async (e) => {
    e.preventDefault();
    setSearchTermTipoCupones(e.target.value)
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
  return (
    <Container sx={{  borderLeft: '1 !important', borderRight: '1 !important', maxWidth: 'unset !important' , padding: 0 }}>
      <Typography variant="h2">
        {editable ? "Modificar Cupon" : "Visualizar Cupon"}
      </Typography>
      <hr style={{ borderColor: 'black', borderWidth: '1px 0 0 0', margin: 0 }} />
      <Grid container spacing={5}  >
        <Grid item xs={3}>
          <Box sx={{ borderRight: 1, borderColor: 'divider', height: '680px', paddingTop: 2 }}>

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
              <Box display="flex" justifyContent="flex-end" alignItems="center">


                {!editable && (
                  <Button
                    variant="contained"

                    sx={{
                      marginTop: 5,
                      marginRight: 2,
                      backgroundColor: "#003B91"
                    }} // Añade un margen derecho para separar botones si es necesario
                    startIcon={<Iconify icon="ic:baseline-edit" />}
                    onClick={() => setEditable(true)}
                  >
                    Editar
                  </Button>
                )}

                {editable && ( // Renderiza estos botones solo si 'editable' es true
                  <>
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      sx={{ marginTop: 5, marginRight:5, backgroundColor: "#198754" }}
                      startIcon={<Iconify icon="ic:baseline-save" />}
                    >
                      Guardar
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Iconify icon="ic:baseline-cancel" />}
                      sx={{ marginTop: 5, backgroundColor: "#DC3545" }}
                      onClick={() => {
                        setEditable(false);
                        setEditableImg(false); // Cambia 'editableImg' a false para "cancelar" adicionalmente
                      }} // Opcional: Cambia 'editable' a false para "cancelar"
                    >
                      Cancelar
                    </Button>
                  </>
                )}
              </Box>

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
                <Box sx={{ mt: 3, overflowY: 'auto', maxHeight: '60vh', pr: 2 }}>

                  <Grid container spacing={2}>
                    <Grid item xs={2}>
                      <FormControlLabel control={
                        <Checkbox name="esLimitado"
                                  checked={esLimitadoText}
                                  disabled={!editable}
                        />
                      } label="Es Limitado" />
                    </Grid>
                    <Grid item xs={10} >
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
                          <img
                            src={urlImagenS3}
                            alt="Imagen Predeterminada"
                            style={{ width: '100%', height: 'auto' }}
                          />
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
                              <IconButton onClick={handleChangeImage} disabled={!editable} style={{ color: 'white', fontSize: 16 }}>
                                <Iconify icon="ic:baseline-edit" style={{ color: 'white', fontSize: '2rem' }} />
                                Cambiar Imagen
                              </IconButton>
                            )}
                          </Box>
                        </Box>}
                        </Box>
                    </Grid>
                    <Grid item xs={2}>
                      <TextField fullWidth label="Código" name="codigo" defaultValue={cuponText} disabled={!editable} />
                    </Grid>
                    <Grid item xs={5}>
                      <FormControl fullWidth>
                        <InputLabel id="search-select-label" disabled={!editable}>Tienda</InputLabel>
                        <Select
                          // Disables auto focus on MenuItems and allows TextField to be in focus
                          MenuProps={{ autoFocus: false }}

                          labelId="search-select-label"
                          id="search-select"
                          disabled={!editable}
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
                                ),
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
                    <Grid item xs={5}>
                      <FormControl fullWidth>
                        <InputLabel id="search-tipo-select-label" disabled={!editable}>Tipo de Cupon</InputLabel>
                        <Select
                          // Disables auto focus on MenuItems and allows TextField to be in focus
                          MenuProps={{ autoFocus: false }}
                          labelId="search-tipo-cupon-select-label"
                          id="search-tipo-cupon-select"
                          value={selectedTipoCupon}
                          disabled={!editable}
                          label="Elegir tipo de cupon"
                          onChange={(e) => setSelectedTipoCupon(e.target.value)}

                        >
                          <ListSubheader>
                            <TextField
                              size="small"
                              autoFocus
                              placeholder="Busca un tipo de cupon por nombre..."
                              fullWidth
                              value={searchTermTipoCupones}
                              onChange={changeTermSearchTipoCupon}
                              onKeyDown={(e) => e.stopPropagation()} // Detener la propagación del evento
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon onClick={handleSearchTipoCupon} />
                                  </InputAdornment>
                                ),
                              }}

                            />
                          </ListSubheader>
                          {tipoCupones.map((option, i) => (
                            <MenuItem key={i} value={option.id}>
                              {option.nombre}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                        <DatePicker
                          label="Fecha expiracion"
                          value={fechaText}
                          format="DD/MM/YYYY"
                          onChange={setStartDate}
                          disabled={!editable}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField fullWidth label="Costo en Puntos" name="costoPuntos" defaultValue={costoText}
                                 disabled={!editable} />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField fullWidth label="Cantidad Inicial" name="cantidadInicial" defaultValue={cantIniText}
                                 disabled={!editable} />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField fullWidth label="Orden de Priorización" name="ordenPriorizacion"
                                 defaultValue={ordPriorizacionText} disabled={!editable} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Sumilla" name="sumilla" defaultValue={sumillaText}
                                 disabled={!editable} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Descripción Completa" name="descripcionCompleta" multiline rows={4}
                                 defaultValue={descripcionText} disabled={!editable} />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField fullWidth label="Términos y Condiciones" name="terminosCondiciones" multiline rows={4}
                                 defaultValue={terminosText} disabled={!editable} />
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

                  <DashboardCuponClient dataDash={dataDash}/>

              </Grid>
              <Grid xs={12}>
                <Card>
                  <UserTableToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleSearch}
                  />

                    <TableContainer sx={{ overflow: 'unset' }}>
                      <Table sx={{ minWidth: 800 }}>
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
                        <TableBody>
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
                      </Table>
                    </TableContainer>


                  <TablePagination
                    page={page-1}
                    component="div"
                    count={totalClientsCupon}
                    rowsPerPage={pageSize}
                    onPageChange={handleChangePage}
                    labelRowsPerPage="Clientes por página"
                    labelDisplayedRows={labelDisplayedRows}
                    rowsPerPageOptions={[6, 12, 18]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
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
