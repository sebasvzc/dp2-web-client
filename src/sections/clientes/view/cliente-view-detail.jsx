import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Dropzone, FileMosaic } from '@files-ui/react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Grid,
  Button, TextField,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';  // Extiende dayjs con el plugin UTC
import { toast } from 'react-toastify';  // Importa el plugin UTC para manejar correctamente las fechas UTC
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Card from '@mui/material/Card';
import Iconify from '../../../components/iconify';
import { getTiendas, getTipoCupones } from '../../../funciones/api';
import DashboardCuponesCategoria from '../../overview/DashboardCuponesCategoria';
import DashboardCuponesBarCuponesUsadosCanjeados from '../../overview/DashboardCuponesBarCuponesUsadosCanjeados';
import DashboardCuponesMesCliente from '../../overview/DashboardCuponesMesCliente';
import FictionBooksSalesChart from '../../overview/FictionBooksSalesChart';
import AppCurrentVisits from '../../overview/app-current-visits';

dayjs.locale('es-mx');

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
  const filterName= useState("")
  const [dataDash, setDataDash] = useState({ fechas: [], cantidades: [] });
  const [dataDashCategoria, setDataDashCategoria] = useState({  name:"",categoria: [], data: []  });
  const [dataDashCanjeados, setDataDashCanejados] = useState({  fechas: [], cantidades: [] });
  const [totalClientsCupon, setTotalClientsCupon] = useState(10);
  const [cuponText, setCuponText] = useState('');
  const [esLimitadoText, setEsLimitadoText] = useState(false);
  const [esLimitadoDesp, setEsLimitadoDesp] = useState(false);
  const [sumillaText, setSumillaText] = useState('');
  const [descripcionText, setDescripcionText] = useState('');
  const [terminosText, setTerminosText] = useState('');
  const [fechaText, setFechaText] = useState('');
  const [startDateStat, setStartDateStat] = useState(dayjs().subtract(5, 'month').startOf('month'));
  const [endDateStat, setEndDateStat] = useState(dayjs().endOf('month'));
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
  const [nombreCompleto,setNombreCompleto]=useState('')
  const [email,setEmail]=useState('')
  const [telefono,setTelefono]=useState(0)
  const [genero,setGenero]=useState('')
  const [nacimiento,setNacimiento]=useState(dayjs())
  const [puntos,setPuntos]=useState(0)
  const [activo,setActivo]=useState(false)
  
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
        response = await fetch(`http://localhost:3000/api/client/listarClientesActivos?page=1&pageSize=10`, {
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
      
        const data = await response.json();
        console.log('ESTA ES LA DATA DE CLIENTE')
        console.log(data.clientes[0])
        
        setLoading(false)
        
        const fullName = `${data.clientes[0].nombre } ${data.clientes[0].apellidoPaterno } ${data.clientes[0].apellidoMaterno}`
        setNombreCompleto(fullName)
        setEmail(data.clientes[0].email)
        setTelefono(data.clientes[0].telefono)
        setGenero(data.clientes[0].genero)
        // setNacimiento(dayjs(data.clientes[0].fechaNacimiento).utc(true))
        setPuntos(data.clientes[0].puntos)
        if(data.clientes[0].activo===true){
          setActivo("Activo")
        }

        else{
          setActivo("Baneado")
        }
        

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
        console.log("endDateStat")
        console.log("startDateStat")
        console.log(dayjs().subtract(6, 'month').startOf('month'));
        console.log(dayjs().endOf('month'));
        console.log(`${startDateStat.date()}/${startDateStat.month()+1}/${startDateStat.year()}`);
        const endDateParam=`${endDateStat.date()}/${endDateStat.month()+1}/${endDateStat.year()}`;
        const startDateParam=`${startDateStat.date()}/${startDateStat.month()+1}/${startDateStat.year()}`;
        response = await fetch(`http://localhost:3000/api/client/listarCuponesXClientes?idParam=${idParam}&endDate=${endDateParam}&startDate=${startDateParam}`, {
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
        console.log("Cupon detalle x cliente")
        const data3 = await response.json();
        console.log(data3)
        if(data3.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = data3.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
          console.log("He puesto un nuevo token");
        }
        if (data3) {
          console.log("Viendo data3");
          console.log(data3);

          const fechasPorCategoria = data3.cupones.map(categoria => ({
              categoria: categoria.Categoria,
              fechas: categoria.data.map(item => item.fechaMesAnio),
              cantidades: categoria.data.map(item => item.cantidad)
            }));

          console.log("Fechas por categoría:");
          console.log(fechasPorCategoria);

          // Aquí podrías usar `fechasPorCategoria` para actualizar el estado de tu componente
          // Por ejemplo:
          setDataDash(fechasPorCategoria);
        }
         response = await fetch(`http://localhost:3000/api/client/listarCuponesCategoriaRadar?idParam=${idParam}&endDate=${endDateParam}&startDate=${startDateParam}`, {
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
        console.log("Cupon detalle x cliente")
        const data4 = await response.json();
        console.log(data4)
        if(data4.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = data4.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
          console.log("He puesto un nuevo token");
        }
        if (data4) {
          console.log("Viendo data4");
          console.log(data4);

          const { cupones } = data4;

          const agrupPorCategoria = {
            name: cupones.name,
            data: cupones.data,
            categoria: cupones.categoria
          };

          console.log("Cupones por categoría:");
          console.log(agrupPorCategoria);

          // Aquí podrías usar `agrupPorCategoria` para actualizar el estado de tu componente
          // Por ejemplo:
          setDataDashCategoria([agrupPorCategoria]);
        }
        response = await fetch(`http://localhost:3000/api/client/listarCuponesCanjeadosUsados?idParam=${idParam}&endDate=${endDateParam}&startDate=${startDateParam}`, {
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
        console.log("Cupon detalle x cliente")
        const data5 = await response.json();
        console.log(data5)
        if(data5.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = data5.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
          console.log("He puesto un nuevo token");
        }
        if (data5) {
          console.log("Viendo data5");
          console.log(data5);

          const fechasPorCategoria = data5.cupones.map(categoria => ({
            variable: categoria.variable,
            fechas: categoria.data.map(item => item.fechaMesAnio),
            cantidades: categoria.data.map(item => item.cantidad)
          }));

          console.log("Fechas y canjeados y usados:");
          console.log(fechasPorCategoria);

          // Aquí podrías usar `fechasPorCategoria` para actualizar el estado de tu componente
          // Por ejemplo:
          setDataDashCanejados(fechasPorCategoria);

        }
        setTimeout(() => {
          setLoading(false);
        }, 1000); // Espera 1 segundo antes de poner setLoading(false)

      } catch (err) {
        console.error("Failed to fetch cupon data", err);

        setLoading(false);
      }
    }

    loadCuponData();

  }, [esLimitadoText, idParam, page, pageSize, searchName,endDateStat,startDateStat]);


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
        {editable ? "Visualizar Cliente" : "Visualizar Cliente"}
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

                {editable && ( // Renderiza estos botones solo si 'editable' es true
                  <>
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      sx={{ marginTop: 5, marginRight:2, backgroundColor: "#198754" }}
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
                    <Grid item xs={3}>
                      <TextField fullWidth label="Código" name="codigo" defaultValue={idParam} disabled={!editable} />
                    </Grid>
                    <Grid item xs={6}>
                    <TextField fullWidth label="Nombre Completo" name="codigo" defaultValue={nombreCompleto} disabled={!editable} />

                    </Grid>
                    
                    <Grid item xs={3}>
                    <TextField fullWidth label="Teléfono" name="codigo" defaultValue={telefono} disabled={!editable} />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField fullWidth label="Correo" name="sumilla" defaultValue={email}
                                 disabled={!editable} />
                    </Grid>
                    <Grid item xs={6}>
                    <TextField fullWidth label="Género" name="sumilla" defaultValue={genero}
                                 disabled={!editable} />
                    </Grid>



                    <Grid item xs={3}>
                      <TextField fullWidth label="Puntos" name="costoPuntos" defaultValue={puntos}
                                 disabled={!editable} />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField fullWidth label="Estado" name="cantidadInicial" defaultValue={activo}
                                 disabled={!editable} />
                    </Grid>
                    
                  </Grid>

                </Box>
              )}
            </form>

          ) : (
            <Box sx={{ paddingTop: 10 }}>
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

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <DatePicker
                            label="Fecha inicial"
                            value={startDateStat}
                            onChange={setStartDateStat}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <DatePicker
                            label="Fecha final"
                            value={endDateStat}
                            onChange={setEndDateStat}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </Grid>
                      </Grid>
                    </LocalizationProvider>
                  </Grid>
                  { /*
                  <Grid  item xs={4} sm={4} lg={4} sx={{ paddingTop: 5 }}>
                    <Card
                      sx={{
                        px: 3,
                        py: 5,
                        borderRadius: 2,
                      }} >
                    <DashboardCuponesMesCliente dataDash={dataDash} />
                    </Card>
                  </Grid>

                  <Grid item xs={4} sm={4} lg={4} sx={{ paddingTop: 5 }}>
                    <Card
                      sx={{
                        px: 3,
                        py: 5,
                        borderRadius: 2,
                      }} >
                    <DashboardCuponesCategoria dataDash={dataDash} />
                    </Card>
                  </Grid>
                  */ }
                  <Grid xs={12} md={6} lg={6}>
                    <Card


                      sx={{
                        px: 3,
                        py: 5,
                        mx:2,
                        my:4
                      }} >
                      <DashboardCuponesCategoria dataDash={dataDashCategoria}/>
                    </Card>
                  </Grid>

                  <Grid xs={12} md={6} lg={6}>
                    <Card


                      sx={{
                        px: 3,
                        py: 5,
                        mx:2,
                        my:4
                      }} >
                      <DashboardCuponesMesCliente dataDash={dataDash}/>
                    </Card>
                  </Grid>
                  <Grid xs={12} md={6} lg={6}>
                    <Card


                      sx={{
                        px: 3,
                        py: 5,
                        mx:2,
                        my:4
                      }} >
                      <DashboardCuponesBarCuponesUsadosCanjeados dataDash={dataDashCanjeados}/>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>


  );
}
