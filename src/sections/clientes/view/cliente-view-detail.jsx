import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import ListSubheader from '@mui/material/ListSubheader';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import {
  Grid, Chip, MenuItem, Select, FormControl, InputLabel, 
  Table, TextField, TableBody, TableContainer,
} from '@mui/material';  // Extiende dayjs con el plugin UTC
import { toast } from 'react-toastify';  // Importa el plugin UTC para manejar correctamente las fechas UTC
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Tabs, Tab , ThemeProvider, createTheme } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import BasicBreadcrumbs from '../../../routes/BasicBreadcrumbs'; 
import { getTiendas, getTipoCupones, getCategoriaTiendas } from '../../../funciones/api';
import ClientCuponTableRow from '../../cupones/client-cupon-table-row';
import ClientCuponTableHead from '../../cupones/cupon-client.table.head';
import DashboardCuponesCategoria from '../../overview/DashboardCuponesCategoria';
import DashboardCuponesMesCliente from '../../overview/DashboardCuponesMesCliente';
import DashboardEventosCategorCliente from '../../overview/DashboardEventosCategorCliente';
import CuponxClienteTableRow from '../cupon-cliente-table-row';

dayjs.locale('es-mx');

export default function ClienteViewDetail() {
  const [view, setView] = useState('datos');
  const { id: idParam } = useParams();
  const [editable, setEditable] = useState(false);
  const [editableImg, setEditableImg] = useState(false);
  const [order, setOrder] = useState('asc');
  const [searchName, setSearchName] = useState("all");
  const [dataCupones, setDataCupones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDashCuponCateg, setLoadingDashCuponCateg] = useState(true);
  const [loadingDashEventoCateg, setLoadingDashEventoCateg] = useState(true);
  const [loadingtableCupon, setLoadingTableCupon] = useState(true);
  const [habilitarCupones, setHabilitarCupones] = useState(true);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [orderBy, setOrderBy] = useState('id');
  const [backgroundBtnHabilitar, setBackgroundBtnHabilitar] = useState("#CCCCCC");
  const [backgroundBtnDeshabilitar, setBackgroundBtnDeshabilitar] = useState("#CCCCCC");
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);
  const [fileUrl, setFileUrl] = useState('');
  const filterName= useState("")
  const [dataDash, setDataDash] = useState({ fechas: [], cantidades: [] });
  const [dataDashCategoria, setDataDashCategoria] = useState({  name:"",categoria: [], data: []  });
  const [dataDashCategoriaEventos, setDataDashCategoriaEventos] = useState({  name:"",categoria: [], data: []  });
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
  const [startDateStatCupon, setStartDateStatCupon] = useState(dayjs().subtract(5, 'month').startOf('month'));
  const [endDateStatCupon, setEndDateStatCupon] = useState(dayjs().endOf('month'));
  const [startDateStatEvento, setStartDateStatEvento] = useState(dayjs().subtract(5, 'month').startOf('month'));
  const [endDateStatEvento, setEndDateStatEvento] = useState(dayjs().endOf('month'));
  const [startDateStatBarra, setStartDateStatBarra] = useState(dayjs().subtract(5, 'month').startOf('month'));
  const [endDateStatBarra, setEndDateStatBarra] = useState(dayjs().endOf('month'));
  const [startDateStatTable, setStartDateStatTable] = useState(dayjs().subtract(5, 'month').startOf('month'));
  const [endDateStatTable, setEndDateStatTable] = useState(dayjs().endOf('month'));
  const [startDateStatExp, setStartDateStatExp] = useState(dayjs().subtract(5, 'month').startOf('month'));
  const [endDateStatExp, setEndDateStatExp] = useState(dayjs().endOf('month'));
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
  const [nombre,setNombre]=useState('')
  const [apellido,setApellido]=useState('')
  const [email,setEmail]=useState('')
  const [telefono,setTelefono]=useState(0)
  const [genero,setGenero]=useState('')
  const [nacimiento,setNacimiento]=useState(dayjs())
  const [puntos,setPuntos]=useState(0)
  const [activo,setActivo]=useState(false)
  const [categorias, setCategorias] = useState([]);
  const [startDate, setStartDate] = useState(dayjs());
  const [tiendas, setTiendas] = useState([]);
  const [selectedTienda, setSelectedTienda] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoCupones, setTipoCupones] = useState([]);
  const [selectedTipoCupon, setSelectedTipoCupon] = useState('');
  const [searchTienda, setSearchTienda] = useState('');
  const [searchTermTipoCupones, setSearchTermTipoCupones] = useState('');
  const [dateRange, setDateRange] = React.useState([null, null]);
  const labelDisplayedRows = ({ from, to, count }) => `${from}-${to} de ${count}`;
  const navigate=useNavigate();

  useEffect(() => {
    // Suponiendo que tienes una función para cargar datos de un cupón por su id
    // eslint-disable-next-line no-shadow
    async function loadCuponData(searchTerm,searchTermTipoCupones,searchTienda) {
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
        setNombre(data.clientes[0].nombre)
        const fullMName = `${data.clientes[0].apellidoPaterno } ${data.clientes[0].apellidoMaterno}`
        setApellido(fullMName)
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

        const endDateParam=`${endDateStat.date()}/${endDateStat.month()+1}/${endDateStat.year()}`;
        const startDateParam=`${startDateStat.date()}/${startDateStat.month()+1}/${startDateStat.year()}`;
        // Simulación de carga


        console.log("endDateStat")
        console.log("startDateStat")
        console.log(dayjs().subtract(6, 'month').startOf('month'));
        console.log(dayjs().endOf('month'));
        console.log(`${startDateStat.date()}/${startDateStat.month()+1}/${startDateStat.year()}`);
        const endDateParamBarra=`${endDateStatBarra.date()}/${endDateStatBarra.month()+1}/${endDateStatBarra.year()}`;
        const startDateParamBarra=`${startDateStatBarra.date()}/${startDateStatBarra.month()+1}/${startDateStatBarra.year()}`;
        response = await fetch(`http://localhost:3000/api/client/listarCuponesXClientes?idParam=${idParam}&endDate=${endDateParamBarra}&startDate=${startDateParamBarra}`, {
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

        const resultsTipo =  await getCategoriaTiendas(token,refreshToken,searchTerm);
        console.log("viendo resultados categ tienda", resultsTipo)
        setCategorias(resultsTipo.cattiendas);

        const resultsTiend =  await getTiendas(token,refreshToken,searchTienda);
        console.log("viendo resultados", resultsTiend.tiendas)
        setTiendas(resultsTiend.tiendas);


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

          const fechasPorCategoria = data3.cupones.map(item =>
            (
              {
                fechas: item.fechaMesAnio,
                cantidades:item.cantidad
              }
            )
          );

          console.log("Fechas por categoría:");
          console.log(JSON.stringify(fechasPorCategoria));

          // Aquí podrías usar `fechasPorCategoria` para actualizar el estado de tu componente
          // Por ejemplo:
          setDataDash(fechasPorCategoria);
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

          const fechasDetPorCategoria = data5.cupones.map(categoria => ({
            variable: categoria.variable,
            fechas: categoria.data.map(item => item.fechaMesAnio),
            cantidades: categoria.data.map(item => item.cantidad)
          }));

          console.log("Fechas y canjeados y usados:");
          console.log(JSON.stringify(fechasDetPorCategoria));

          // Aquí podrías usar `fechasPorCategoria` para actualizar el estado de tu componente
          // Por ejemplo:
          setDataDashCanejados(fechasDetPorCategoria);

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

  }, [esLimitadoText, idParam,endDateStat,startDateStat,endDateStatBarra,startDateStatBarra]);

  useEffect(() => {
    // Suponiendo que tienes una función para cargar datos de un cupón por su id
    setLoadingDashEventoCateg(true);
    // eslint-disable-next-line no-shadow
    async function loadDashEventonCateg(searchTerm, searchTermTipoCupones) {
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        console.log(idParam)
      let responseEventoCateg="";
      const endDateParamEvento=`${endDateStatEvento.date()}/${endDateStatEvento.month()+1}/${endDateStatEvento.year()}`;
      const startDateParamEvento=`${startDateStatEvento.date()}/${startDateStatEvento.month()+1}/${startDateStatEvento.year()}`;
      responseEventoCateg = await fetch(`http://localhost:3000/api/client/listarEventosCategoria?idParam=${idParam}&endDate=${endDateParamEvento}&startDate=${startDateParamEvento}`, {
        method: 'GET',

        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Refresh-Token': `Bearer ${refreshToken}`
        },

      });
      if (responseEventoCateg.status === 403 || responseEventoCateg.status === 401) {
        localStorage.removeItem('user');
        window.location.reload();
      }

      if (!responseEventoCateg.ok) {
        throw new Error('Network response was not ok');
      }
      console.log("Evento detalle x cliente")
      const data6 = await responseEventoCateg.json();
      console.log(data6)
      if(data6.newToken){
        const storedUser = localStorage.getItem('user');
        const userX = JSON.parse(storedUser);
        userX.token = data6.newToken;
        localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
        console.log("He puesto un nuevo token");
      }
      if (data6) {
        console.log("Viendo data6");
        console.log(data6);

        const { eventos } = data6;

        const eventosagrupPorCategoria = {
          name: eventos.name,
          data: eventos.data,
          categoria: eventos.categoria
        };

        console.log("Eventos por categoría:");
        console.log(eventosagrupPorCategoria);

        // Aquí podrías usar `agrupPorCategoria` para actualizar el estado de tu componente
        // Por ejemplo:
        setDataDashCategoriaEventos([eventosagrupPorCategoria]);
      }
        setLoadingDashEventoCateg(false);
      } catch (err) {
          console.error("Failed to fetch cupon data", err);

          setLoadingDashEventoCateg(false);
        }
    }
      loadDashEventonCateg();
  }, [endDateStatEvento, idParam, startDateStatEvento]);

  const handleSearchTienda = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    const { token, refreshToken } = userStringify;
    const results = await getTiendas(token,refreshToken,searchTerm);
    console.log("viendo resultados", results.tiendas)
    setTiendas(results.tiendas);
  };

  const changeTiendaSearch = async (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value)
  };

  const handleSearchCategoria = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    const { token, refreshToken } = userStringify;
    const results = await getCategoriaTiendas(token,refreshToken,searchTerm);
    console.log("viendo resultados categorias tiendas solo res", results)
    console.log("viendo resultados categorias tiendas", results.categorias)
    setCategorias(results.categorias);
  };

  const changeCategoriaSearch = async (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value)
  };

  useEffect(() => {
    // Suponiendo que tienes una función para cargar datos de un cupón por su id
    setLoadingDashCuponCateg(true);
    // eslint-disable-next-line no-shadow
    async function loadDashCuponCateg(searchTerm, searchTermTipoCupones) {
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        console.log(idParam)
        let responseCuponCateg="";
        const endDateParam=`${endDateStatCupon.date()}/${endDateStatCupon.month()+1}/${endDateStatCupon.year()}`;
        const startDateParam=`${startDateStatCupon.date()}/${startDateStatCupon.month()+1}/${startDateStatCupon.year()}`;
        responseCuponCateg = await fetch(`http://localhost:3000/api/client/listarCuponesCategoriaRadar?idParam=${idParam}&endDate=${endDateParam}&startDate=${startDateParam}`, {
          method: 'GET',

          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Refresh-Token': `Bearer ${refreshToken}`
          },

        });
        if (responseCuponCateg.status === 403 || responseCuponCateg.status === 401) {
          localStorage.removeItem('user');
          window.location.reload();
        }

        if (!responseCuponCateg.ok) {
          throw new Error('Network response was not ok');
        }
        console.log("Cupon detalle x cliente")
        const data4 = await responseCuponCateg.json();
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

        setLoadingDashCuponCateg(false);
      } catch (err) {
        console.error("Failed to fetch cupon data", err);

        setLoadingDashCuponCateg(false);
      }
    }
    loadDashCuponCateg();
  }, [endDateStatCupon, idParam, startDateStatCupon]);

  useEffect(() => {
    // Suponiendo que tienes una función para cargar datos de un cupón por su id
    setLoadingTableCupon(true);
    // eslint-disable-next-line no-shadow
    async function loadTableData(searchTerm, searchTermTipoCupones) {
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        console.log(idParam)
        let responseTable="";
        const endDateParam=`${endDateStatTable.date()}/${endDateStatTable.month()+1}/${endDateStatTable.year()}`;
        const startDateParam=`${startDateStatTable.date()}/${startDateStatTable.month()+1}/${startDateStatTable.year()}`;

        if(searchName===""){
          responseTable = await fetch(`http://localhost:3000/api/client/listarcuponesxcliente?permission=Gestion%de%Cupones&query=all&idParam=${idParam}&page=${page}&pageSize=${pageSize}&endDate=${endDateParam}&startDate=${startDateParam}`, {
            method: 'GET',

            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Refresh-Token': `Bearer ${refreshToken}`
            },

          });
        }else{
          responseTable = await fetch(`http://localhost:3000/api/client/listarcuponesxcliente?permission=Gestion%de%Cupones&query=${searchName}&idParam=${idParam}&page=${page}&pageSize=${pageSize}&endDate=${endDateParam}&startDate=${startDateParam}`, {
            method: 'GET',

            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Refresh-Token': `Bearer ${refreshToken}`
            },

          });
        }

        if (responseTable.status === 403 || responseTable.status === 401) {
          localStorage.removeItem('user');
          window.location.reload();
        }

        if (!responseTable.ok) {
          throw new Error('Network response was not ok');
        }

        const data2 = await responseTable.json();
        console.log(data2)
        if(data2.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = data2.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
          console.log("He puesto un nuevo token");
        }
        if(data2.totalCupones){
          setTotalClientsCupon(data2.totalCupones);
        }
        console.log(data2.cuponesXCliente)
        setDataCupones(data2.cuponesXCliente);

        setLoadingTableCupon(false);
      } catch (err) {
        console.error("Failed to fetch cupon data", err);

        setLoadingTableCupon(false);
      }
    }
    loadTableData();
  }, [endDateStatTable, idParam, page, pageSize, searchName, startDateStatTable]);

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
      formData.append("permission","Gestion de Cupones");


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
      const newSelecteds = dataCupones.map((n) => n.id);
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

  const handleBack = () => {
    navigate('/clientes'); 
  }

  const handleSeleccionVisualizar = (event, newValue) => {
    if (newValue === 'datos') {
      setView('datos');
    } else if (newValue === 'estadisticas') {
      fetchAndSetView('estadisticas');
    }
  };

  const theme = createTheme({
    components: {
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: '#1976d2', // Color del indicador
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            minWidth: 72,
            fontWeight: 'bold',
            marginRight: 20,
            fontFamily: [
              '-apple-system',
              'BlinkMacSystemFont',
              '"Segoe UI"',
              'Roboto',
              '"Helvetica Neue"',
              'Arial',
              'sans-serif',
              '"Apple Color Emoji"',
              '"Segoe UI Emoji"',
              '"Segoe UI Symbol"',
            ].join(','),
            '&:hover': {
              color: '#40a9ff',
              opacity: 1,
            },
            '&.Mui-selected': {
              color: '#1890ff',
              fontWeight: 'bold',
            },
            '&:focus': {
              color: '#40a9ff',
            },
          },
        },
      },
    },
  });

  return (
    <Container sx={{  borderLeft: '1 !important', borderRight: '1 !important', maxWidth: 'unset !important' , padding: 0 }}>
      <BasicBreadcrumbs />
      <Stack direction="row" alignItems="center" spacing={1} sx={{ marginBottom: 2 }}>
          <ArrowBackIosIcon onClick={handleBack} style={{ cursor: 'pointer' }}/>
          <Typography variant="h2" >Visualizar Cliente</Typography>
      </Stack>
      <hr style={{ borderColor: 'black', borderWidth: '1px 0 0 0', margin: 0 }} />
      <Grid container spacing={5}  >
        <Grid item xs={3}>
          <ThemeProvider theme={theme}>
            <Tabs
                value={view}
                onChange={handleSeleccionVisualizar}
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
                aria-label="pestañas de navegación"
              >
                <Tab label="Datos" value="datos" />
                <Tab label="Estadísticas" value="estadisticas" />
            </Tabs>
          </ThemeProvider>
        </Grid>
        <Grid item xs={12}>
          {view === 'datos' ? (
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              
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
                <Box>
                  <Grid item xs={12} sx={{ paddingBottom: '2%', paddingTop:'0%', paddingRight: '0%'}}>
                    <Box display="flex" alignItems="center" sx={{ paddingLeft: '2%'}}>
                      <Typography variant="h3" component="div" sx={{ marginRight: 2 , marginBottom: 1}}>
                        {nombreCompleto}
                      </Typography>
                      <Chip
                        label={isActivo ? "Cliente Activo" : "Cliente Inactivo"}
                        color={isActivo ? "success" : "default"}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  </Grid>
                  <Box  sx={{ borderRadius: '8px',  padding: '2%' , paddingTop: '0%' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={3} >
                        <Box display="flex" justifyContent="center" alignItems="center" sx={{
                            border: '1px solid',
                            borderColor: '#A6B0BB',
                            borderRadius: '8px',
                            width: '100%', // Ancho fijo del contenedor
                            height: '200px', // Alto fijo del contenedor
                            overflow: 'hidden', // Oculta el contenido que se sale del contenedor
                          }}>
                          <Box
                            position="relative"
                            width="100%"
                            maxWidth="300px"
                            style={{ width: '100%', height: 'auto'}}
                          >
                            <img 
                              src="/assets/images/avatars/icon-grey-free-vector.jpg"  
                              alt="Avatar" 
                              style={{ width: '90%', height: '90%'}}
                            />
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={9} container spacing={2}>
                        <Grid item xs={2}>
                          <TextField fullWidth label="Código" name="codigo" disabled defaultValue={idParam} />
                        </Grid>  
                        <Grid item xs={5}>
                          <TextField fullWidth label="Nombres" name="nombres" disabled defaultValue={nombre} />
                        </Grid>  
                        <Grid item xs={5}>
                          <TextField fullWidth label="Apellidos" name="apellidos" disabled defaultValue={apellido} />
                        </Grid>   
                        <Grid item xs={6}>
                        <TextField fullWidth label="Teléfono" name="codigo" disabled defaultValue={telefono}/>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField fullWidth label="Correo" name="correo" disabled defaultValue={email}/>
                        </Grid>
                        <Grid item xs={6}>
                        <TextField fullWidth label="Género" name="genero" disabled defaultValue={genero}/>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField fullWidth label="Puntos" name="costoPuntos" disabled defaultValue={puntos}/>
                        </Grid>
                        
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )}
            </form>

          ) : (
            <Box>
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
                <Box>
                  <Grid item xs={12} sx={{ paddingBottom: '2%', paddingTop:'0%', paddingRight: '0%'}}>
                    <Box display="flex" alignItems="center" sx={{ paddingLeft: '2%'}}>
                      <Typography variant="h3" component="div" sx={{ marginRight: 2 , marginBottom: 1}}>
                        {nombreCompleto}
                      </Typography>
                      <Chip
                        label={isActivo ? "Cliente Activo" : "Cliente Inactivo"}
                        color={isActivo ? "success" : "default"}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  </Grid>
                  <Box  sx={{ borderRadius: '8px',  padding: '2%' , paddingTop: '0%' }}>
                    <Grid container spacing={2}  >

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
                      <Grid item xs={12} md={6} lg={6} sx={{marginTop:'0%'}}>
                        <Card
                          sx={{
                            px: 3,
                            py: 5,
                            mx:2,
                            my:4,
                            minHeight: '500px', // Ajusta la altura mínima según sea necesario
                            border: "1px solid #BFC0C1",
                            backgroundColor: '#F9FAFB',
                            marginTop:'0%',
                          }} >
                          <Grid container spacing={2} sx={{marginTop:'0%'}}>
                            <Grid item xs={12} sx={{marginTop:'0%'}}>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid container spacing={2} sx={{marginTop:'0%'}}>
                                  <Grid item xs={4}>
                                    <DatePicker
                                      label="Fecha inicial"
                                      value={startDateStatCupon}
                                      onChange={setStartDateStatCupon}
                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </Grid>
                                  <Grid item xs={4} >
                                    <DatePicker
                                      label="Fecha final"
                                      value={endDateStatCupon}
                                      onChange={setEndDateStatCupon}
                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </Grid>
                                </Grid>
                              </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sx={{marginTop:'0%'}}>
                              {loadingDashCuponCateg ? (
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
                                <DashboardCuponesCategoria dataDash={dataDashCategoria}/>
                              )}
                            </Grid>
                          </Grid>

                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6} sx={{marginTop:'0%'}}>
                        <Card
                          sx={{
                            px: 3,
                            py: 5,
                            mx:2,
                            my:4,
                            minHeight: '500px', // Ajusta la altura mínima según sea necesario
                            border: "1px solid #BFC0C1",
                            backgroundColor: '#F9FAFB',
                            marginTop:'0%',
                          }} >
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid container spacing={2}>
                                  <Grid item xs={3}>
                                    <DatePicker
                                      label="Fecha inicial"
                                      value={startDateStatEvento}
                                      onChange={setStartDateStatEvento}
                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </Grid>
                                  <Grid item xs={3}>
                                    <DatePicker
                                      label="Fecha final"
                                      value={endDateStatEvento}
                                      onChange={setEndDateStatEvento}
                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </Grid>
                                </Grid>
                              </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                              {loadingDashEventoCateg ? (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    height: '25%',
                                    marginTop: '1%', // Ajusta la distancia desde la parte superior
                                    marginBottom: '15%',
                                  }}
                                >
                                  <CircularProgress color="primary" />
                                  <Typography variant="h6" sx={{ mt: 1 }}>
                                    Cargando...
                                  </Typography>
                                </Box>
                              ) : (
                                <DashboardEventosCategorCliente dataDash={dataDashCategoriaEventos}/>
                              )}

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

                            minHeight: '500px', // Ajusta la altura mínima según sea necesario
                            border: "1px solid #BFC0C1",
                            backgroundColor: '#F9FAFB',
                          }} >
                          <DashboardCuponesMesCliente dataDash={dataDash}/>
                        </Card>
                      </Grid>
                      <Grid container spacing={2} sx={{padding: '2%'}}>
                            <Grid item xs={12} sx={{paddingTop: '2%', paddingBottom: '2%'}}>
                                <h4>Cupones Canjeados por cliente</h4>
                            </Grid>
                            <Grid container item xs={12}>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>                   
                                  <Grid item xs={2}>
                                    <DatePicker
                                      label="Fecha inicial"
                                      value={startDateStatTable}
                                      onChange={setStartDateStatTable}
                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </Grid>
                                  <Grid item xs={2}>
                                    <DatePicker
                                      label="Fecha final"
                                      value={endDateStatTable}
                                      onChange={setEndDateStatTable}
                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </Grid>
                              </LocalizationProvider>
                              <Grid item xs={2}>
                                <FormControl fullWidth>
                                <InputLabel id="search-select-categoria" >Categoria</InputLabel>
                                <Select
                                  // Disables auto focus on MenuItems and allows TextField to be in focus
                                  MenuProps={{ autoFocus: false }}

                                  labelId="search-select-categoria"
                                  id="search-categoria"
                                  value={selectedCategoria}
                                  label="Elegir Tienda"
                                  name=""
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
                                      onChange={changeCategoriaSearch}
                                      onKeyDown={(e) => e.stopPropagation()} // Detener la propagación del evento
                                      InputProps={{
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            <SearchIcon onClick={handleSearchCategoria} />
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
                              <Grid item xs={2}>
                                <FormControl fullWidth>
                                <InputLabel id="search-select-tienda">Tienda</InputLabel>
                                <Select
                                  // Disables auto focus on MenuItems and allows TextField to be in focus
                                  MenuProps={{ autoFocus: false }}

                                  labelId="search-select-tienda"
                                  id="search-tienda"
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
                              <LocalizationProvider dateAdapter={AdapterDayjs}>                   
                                  <Grid item xs={2}>
                                    <DatePicker
                                      label="Fecha inicial"
                                      value={startDateStatExp}
                                      onChange={setStartDateStatExp}
                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </Grid>
                                  <Grid item xs={2}>
                                    <DatePicker
                                      label="Fecha final"
                                      value={endDateStatExp}
                                      onChange={setEndDateStatExp}
                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </Grid>
                              </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>

                              <Grid item xs={12}>
                                {loadingtableCupon ? (
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
                                  <Card >
                                    <TableContainer sx={{ overflow: 'unset' }}>
                                      <Table sx={{ minWidth: 800 }}>
                                        <ClientCuponTableHead
                                          order={order}
                                          orderBy={orderBy}
                                          rowCount={dataCupones.length}
                                          numSelected={selected.length}
                                          onRequestSort={handleSort}
                                          headLabel={[
                                            { id: 'codigo', label: 'Código de Cupon' },
                                            { id: 'categoria', label: 'Categoria' },
                                            { id: 'tienda', label: 'Tienda' },
                                            { id: 'fechaCompra', label: 'Fecha de Canje' },
                                            { id: 'fechaExpiracion', label: 'Fecha de Expiracion' },
                                          ]}
                                        />
                                        <TableBody>
                                          {dataCupones
                                            .map((row) => (
                                              <CuponxClienteTableRow
                                                key={row.id}
                                                id={row.id}
                                                codigo={row.cupon.codigo}
                                                categoria={row.cupon.locatario.categoriaTienda.nombre}
                                                tienda={row.cupon.locatario.nombre}
                                                fechaCompra={row.fechaCompra}
                                                fechaExpiracion={row.cupon.fechaExpiracion}
                                                selected={selected.indexOf(row.id) !== -1}
                                                handleClick={(event) => handleClick(event, row.id)}
                                              />
                                            ))}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>


                                    <TablePagination
                                      page={page - 1}
                                      component="div"
                                      count={totalClientsCupon}
                                      rowsPerPage={pageSize}
                                      onPageChange={handleChangePage}
                                      labelRowsPerPage="Cupones por página"
                                      labelDisplayedRows={labelDisplayedRows}
                                      rowsPerPageOptions={[6, 12, 18]}
                                      onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                  </Card>
                                )}
                              </Grid>

                            </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
                )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>


);
}
