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
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
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
import Stack from '@mui/material/Stack';
import TablePagination from '@mui/material/TablePagination';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Iconify from '../../../components/iconify';

import { getCategoriaTiendas } from '../../../funciones/api';

import DashboardCuponClient from '../../overview/dashboardCuponClient';
import UserTableToolbar from '../../user/user-table-toolbar';



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
  const [loading2,setLoading2]=useState(false);
  const [orderBy, setOrderBy] = useState('id');
  const [backgroundBtnHabilitar, setBackgroundBtnHabilitar] = useState("#CCCCCC");
  const [backgroundBtnDeshabilitar, setBackgroundBtnDeshabilitar] = useState("#CCCCCC");
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);
  const [fileUrl, setFileUrl] = useState('');
  const filterName= useState("")
  const [dataDash, setDataDash] = useState({ fechas: [], cantidades: [] });
  const [totalClientsCupon, setTotalClientsCupon] = useState(10);

  const [nombreText, setNombreText] = useState('');
  const [descripcionText, setDescripcionText] = useState('');
  const [locacionText, setLocacionText] = useState('');
  const [horaInicioText, setHoraInicioText] = useState('');
  const [horaFinText, setHoraFinText] = useState('');
  const [aforoText, setAforoText] = useState('');
  const [urlImagenS3 , setUrlImagenS3] = useState('');
  const [cantDisText, setCantDisText] = useState('');
  const [ordPriorizacionText, setOrdPriorizacionText] = useState('');
  const [files, setFiles] = React.useState([]);
  const updateFiles = (incommingFiles) => {
    setFiles(incommingFiles);
  };
  const previewImage = document.querySelector("#previewImage");
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());
  const [tiendas, setTiendas] = useState([]);
  const [selectedTienda, setSelectedTienda] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoCupones, setTipoCupones] = useState([]);
  const [selectedTipoCupon, setSelectedTipoCupon] = useState('');
  const [searchTermTipoCupones, setSearchTermTipoCupones] = useState('');
  const labelDisplayedRows = ({ from, to, count }) => `${from}-${to} de ${count}`;
  const navigate=useNavigate();

  /*
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
        response = await fetch(`http://localhost:3000/api/cupones/detalleTiendaCompleto`, {
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
        const results =  await getCategoriaTiendas(token,refreshToken,searchTerm);
        console.log("viendo resultados", results)
        setTiendas(results);




        const data = await response.json();
        console.log(data)
        setEsLimitadoText(data.detalles.esLimitado)
        
        console.log("Texto limitado")
        console.log(esLimitadoText)
        setNombreText(data.detalles.nombre)
        setLocacionText(data.detalles.locacion)
        setDescripcionText(data.detalles.descripcionCompleta)
        setHoraFinText(dayjs(data.detalles.fechaExpiracion).utc(true))
        setHoraInicioText(dayjs(data.detalles.fechaExpiracion).utc(true))
        setAforoText(data.detalles.aforo)
        setUrlImagenS3(data.image);

        setSelectedTienda(data.detalles.locatario.id)
        setSelectedTipoCupon(data.detalles.tipoCupon.id)

        console.log(idParam)
        // Simulación de carga

      
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
  }, [esLimitadoText, idParam, page, pageSize, searchName]);
*/

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
      formData.append("file", files[0].file)
      formData.append("nombre", event.target.nombre.value);
      formData.append("descripcion", event.target.descripcion.value);
      formData.append("locacion", event.target.locacion.value);
      const horaApertura = startTime.format("HH:mm:ss");
      const horaCierre = endTime.format("HH:mm:ss");
      formData.append("horaApertura", horaApertura);
      formData.append("horaCierre", horaCierre);
      formData.append("aforo", event.target.aforo.value);
      formData.append("fidCategoriaTienda", selectedTienda);
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      let response="";
      response = await fetch(`http://localhost:3000/api/tiendas/modificar`, {
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
    const results = await getCategoriaTiendas(token,refreshToken,searchTerm);
    console.log("viendo resultados", results)
    setTiendas(results);
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

  const handleBack = () => {
    navigate('/tienda'); 
  }

  const handleChangeRowsPerPage = (event) => {
    setPage(1);
    setPageSize(parseInt(event.target.value, 10));
  };
  return (
    <Container sx={{  borderLeft: '1 !important', borderRight: '1 !important', maxWidth: 'unset !important' , padding: 0 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
          <ArrowBackIcon onClick={handleBack} style={{ cursor: 'pointer' }}/>
          <Typography variant="h2" sx={{ marginBottom: 2 }}>Modificar Tienda</Typography>
      </Stack>
      <hr style={{ borderColor: 'black', borderWidth: '1px 0 0 0', margin: 0 }} />
      <Grid container   >
        
      <Grid item >
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
                      sx={{ marginTop: 5, marginRight:2, backgroundColor: "#198754" }}
                      startIcon={<Iconify icon="ic:baseline-save" /> }
                      disabled={loading2}
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

              
              <Box sx={{ mt: 3, overflowY: 'auto', maxHeight: '60vh', pr: 2 ,  padding: '2%'}}>
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
                              <IconButton onClick={handleChangeImage} disabled={!editable} style={{ color: 'white', fontSize: 16 }}>
                                <Iconify icon="ic:baseline-edit" style={{ color: 'white', fontSize: '2rem' }} />
                                Cambiar Imagen
                              </IconButton>
                            )}
                          </Box>
                        </Box>}
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField fullWidth label="Nombre" name="nombre" defaultValue={nombreText} disabled={!editable} />
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
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
                    <Grid item xs={4}>
                      <TextField fullWidth label="Locacion" name="locacion" defaultValue={locacionText}
                                 disabled={!editable} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Descripción Completa" name="descripcionCompleta" multiline rows={4}
                                 defaultValue={descripcionText} disabled={!editable} />
                    </Grid>     
                    <Grid item xs={4}>
                      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                        <TimePicker
                          label="Hora Apertura"
                          value={startTime}
                          onChange={setStartTime}
                          disabled={!editable}
                          sx={{ width: '100%' , marginBottom: 0, paddingBottom: 0}}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={4}>
                      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                        <TimePicker
                          label="Hora Cierre"
                          value={endTime}
                          onChange={setEndTime}
                          disabled={!editable}
                          sx={{ width: '100%' , marginBottom: 0, paddingBottom: 0}}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField fullWidth label="Aforo" name="aforo" defaultValue={aforoText}
                                 disabled={!editable} />
                    </Grid>
                  </Grid>

                </Box>
              
            </form>

          ) : (
            <Box >
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