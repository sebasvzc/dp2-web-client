import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Select } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker,LocalizationProvider  } from '@mui/x-date-pickers';

import AppCurrentVisits from '../app-current-visits';
import AppWidgetSummary from '../app-widget-summary';
import FictionBooksSalesChart from '../FictionBooksSalesChart';
import { getCategoriaTiendas } from '../../../funciones/api';
import {
  getPersonasAsistente,
  getPuntosEventosAsitencia,
  getPuntosTiendasAsitencia, getUsersPlayRA,
} from '../../../funciones/apiDashboard';

// Importar localización española

dayjs.locale('es-mx');
// ----------------------------------------------------------------------

export default function AppView() {
  const [selectedOption, setSelectedOption] = useState('top10mayor');
  const [loading, setLoading] = useState(true);
  const [numPersonasEventos, setNumPersonasEventos] = useState(0);
  const [usuariosRa, setUsuariosRa] = useState(0);
  const [puntosEventosAsist, setPuntosEventosAsist] = useState(0);
  const [puntosTiendasAsist, setPuntosTiendasAsist] = useState(0);
  const [loadingVisitasTiendas, setLoadingVisitasTiendas] = useState(true);
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const [startDate, setStartDate] = useState(dayjs().startOf('year'));
  const [endDate, setEndDate] = useState(dayjs());
  const [dataDash, setDataDash] = useState({  nombreTienda: [], cantidades: [] });
  useEffect(() => {
    // Suponiendo que tienes una función para cargar datos de un cupón por su id
    // eslint-disable-next-line no-shadow
    async function loadInitialData() {
      console.log("CuponData")
      setLoading(true);
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        const endDateParam=`${endDate.date()}/${endDate.month()+1}/${endDate.year()}`;
        const startDateParam=`${startDate.date()}/${startDate.month()+1}/${startDate.year()}`;
        // Simulación de carga
        let response="";
        response = await fetch(`http://localhost:3000/api/tiendas/getTopTiendasAsist?endDate=${endDateParam}&startDate=${startDateParam}`, {
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

        const data = await response.json();
        if(data.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = data.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
          console.log("He puesto un nuevo token");
        }
        if (data) {
          console.log("Viendo data5");
          console.log(data);
          console.log("Fechas y canjeados y usados:");
          const nombreTiendasArray = data.resultadoTopTiendas.map(item => item.NombreTienda);
          const cantidadesArray = data.resultadoTopTiendas.map(item => item.cantidad);


          console.log(JSON.stringify(nombreTiendasArray));

          setDataDash({ nombreTiendas: nombreTiendasArray, cantidades: cantidadesArray });

        }

        const resultsPersonasAsistentes =  await getPersonasAsistente(token,refreshToken,endDateParam,startDateParam);
        setNumPersonasEventos(resultsPersonasAsistentes.cantidad);

        const resultsPuntosEventosAsitencia=  await getPuntosEventosAsitencia(token,refreshToken,endDateParam,startDateParam);
        setPuntosEventosAsist(resultsPuntosEventosAsitencia.totalPuntosOtorgadosEvento);

        const resultsTiendasAsitencia =  await getPuntosTiendasAsitencia(token,refreshToken,endDateParam,startDateParam);
        setPuntosTiendasAsist(resultsTiendasAsitencia.totalPuntosOtorgadosTienda);

        const resultsUsersPlayRA =  await getUsersPlayRA(token,refreshToken,endDateParam,startDateParam);
        setUsuariosRa(resultsUsersPlayRA.cantidad);
        setTimeout(() => {
          setLoading(false);
        }, 1000); // Espera 1 segundo antes de poner setLoading(false)

      } catch (err) {
        console.error("Failed to fetch cupon data", err);

        setLoading(false);
      }
    }

    loadInitialData();

  }, [endDate,startDate]);

  useEffect(() => {
    // Suponiendo que tienes una función para cargar datos de un cupón por su id
    // eslint-disable-next-line no-shadow
    async function loadChangeVistiaData() {

      setLoadingVisitasTiendas(true);
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        const endDateParam=`${endDate.date()}/${endDate.month()+1}/${endDate.year()}`;
        const startDateParam=`${startDate.date()}/${startDate.month()+1}/${startDate.year()}`;
        // Simulación de carga
        let response="";
        console.log("selectedOption")
        console.log(selectedOption)
        if(selectedOption==="top10mayor"){
          response = await fetch(`http://localhost:3000/api/tiendas/getTopTiendasAsist?endDate=${endDateParam}&startDate=${startDateParam}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Refresh-Token': `Bearer ${refreshToken}`
            },

          });
        }else{
          response = await fetch(`http://localhost:3000/api/tiendas/getBottomTiendasAsist?endDate=${endDateParam}&startDate=${startDateParam}`, {
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

        const data = await response.json();
        if(data.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = data.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
          console.log("He puesto un nuevo token");
        }
        if (data) {
          console.log("Viendo data5");
          console.log(data);
          console.log("Fechas y canjeados y usados:");
          const nombreTiendasArray = data.resultadoTopTiendas.map(item => item.NombreTienda);
          const cantidadesArray = data.resultadoTopTiendas.map(item => item.cantidad);


          console.log(JSON.stringify(nombreTiendasArray));

          setDataDash({ nombreTiendas: nombreTiendasArray, cantidades: cantidadesArray });

        }


        setTimeout(() => {
          setLoadingVisitasTiendas(false);
        }, 1000); // Espera 1 segundo antes de poner setLoading(false)

      } catch (err) {
        console.error("Failed to fetch cupon data", err);

        setLoadingVisitasTiendas(false);
      }
    }

    loadChangeVistiaData();

  }, [endDate,startDate,selectedOption]);
  return (
    <Container maxWidth="xl">
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
        <Box  sx={{ mt: 1 , borderRadius: '8px',  padding: '2%'  }}>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <Card>
              <CardHeader title="Rango de fechas" />
              <CardContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Fecha inicial"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                        views={['year', 'month']}
                        openTo="month"
                        maxDate={endDate || undefined} // Deshabilitar fechas después de la fecha final
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Fecha final"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                        views={['year', 'month']}
                        openTo="month"
                        minDate={startDate || undefined} // Deshabilitar fechas antes de la fecha inicial
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>
              </CardContent>
            </Card>
          </Grid>

        <Grid xs={12} sm={6} md={6} container >
        <Grid item xs={12} sm={6} md={6}>
          <AppWidgetSummary
            title="Número de personas que han asisitdo a un evento"
            total={numPersonasEventos}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_clientes.png" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <AppWidgetSummary
            title="Número de usuarios que han interactuado con la aplicación RA"
            total={usuariosRa}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_RAMobile.png" />}
          />
        </Grid>
          <Grid xs={12} sm={6} md={6}>
            <AppWidgetSummary
              title="Número puntos generados por escaneo y asistencia a eventos"
              total={puntosEventosAsist}
              color="error"
              icon={<img alt="icon" src="/assets/icons/glass/ic_Points.png" />}
            />
          </Grid>
          <Grid xs={12} sm={6} md={6}>
            <AppWidgetSummary
              title="Número puntos generados por escaneo y asistencia a tiendas"
              total={puntosTiendasAsist}
              color="error"
              icon={<img alt="icon" src="/assets/icons/glass/ic_Points.png" />}
            />
          </Grid>
      </Grid>
          <Grid xs={12} sm={6} md={6} container >
            <Grid xs={12} sm={12} md={12} item >
            <AppCurrentVisits
              title="Eventos Asistidos"
              chart={{
                series: [
                  { label: 'Adidas', value: 4344 },
                  { label: 'Coolbox', value: 5435 },
                  { label: 'Phantom', value: 1443 },
                  { label: 'Crisol', value: 4443 },
                ],
              }}
            />
            </Grid>
          </Grid>


        <Grid xs={12} md={6} lg={6} container>
          <Grid item xs={12} md={12} lg={12}>
          <Card
            sx={{
              px: 3,
              py: 5,
              borderRadius: 2,
            }} >
            <Grid item xs={12} sm={12} md={12} >
              <Typography variant="h6" sx={{ mt: 1 }}>
                Visitas a Tiendas
              </Typography>
            </Grid>
          <Grid  item xs={4}>
            <Select
              defaultValue="top10mayor"
              value={selectedOption}  // Establece aquí el valor seleccionado por defecto
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="top10mayor">Top 10</MenuItem>
              <MenuItem value="top10menor">Bottom 10</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={12} md={12} >
            {loadingVisitasTiendas ? (
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
              <FictionBooksSalesChart dataDash={dataDash}/>
            )}



          </Grid>
          </Card>
          </Grid>
        </Grid>



      </Grid>
        </Box>
        )}
    </Container>
  );
}
