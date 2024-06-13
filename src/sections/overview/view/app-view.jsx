import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import React, { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker,LocalizationProvider  } from '@mui/x-date-pickers';

import AppCurrentVisits from '../app-current-visits';
import AppWidgetSummary from '../app-widget-summary';
import FictionBooksSalesChart from '../FictionBooksSalesChart';

// Importar localización española

dayjs.locale('es-mx');
// ----------------------------------------------------------------------

export default function AppView() {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  return (
    <Container maxWidth="xl">


      <Grid container spacing={3}>
        <Grid xs={12} sm={12} md={12}>
          <Card>
            <CardHeader title="Rango de fechas" />
            <CardContent>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <DatePicker
                      label="Fecha inicial"
                      value={startDate}
                      onChange={setStartDate}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <DatePicker
                      label="Fecha final"
                      value={endDate}
                      onChange={setEndDate}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Número de personas que han asisitdo a un evento"
            total={14200}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_clientes.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Número de usuarios que han interactuado con la aplicación RA"
            total={11700}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_RAMobile.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Cantidad de dinero ahorrado por cupones"
            total={31700}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_SavedMoney.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Número puntos generados por escaneo y asistencia a eventos"
            total={60234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_Points.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Número puntos generados por escaneo y asistencia a tiendas"
            total={60234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_Points.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Visitas de clientes a un evento por escaneos de QRs"
            total={2034}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_frecuenciavisitas.png" />}
          />
        </Grid>
        <Grid xs={12} md={6} lg={8}>
          <Card


            sx={{
              px: 3,
              py: 5,
              borderRadius: 2,
            }} >
          <FictionBooksSalesChart />
          </Card>
        </Grid>

        <Grid xs={12} md={6} lg={4}>
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
    </Container>
  );
}
