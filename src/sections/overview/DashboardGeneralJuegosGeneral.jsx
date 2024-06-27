import PropTypes from 'prop-types';
import ApexCharts from 'apexcharts';
import React, { useEffect } from 'react';

import Typography from '@mui/material/Typography';

const DashboardGeneralJuegosGeneral = ({ dataDash }) => {
  useEffect(() => {
    console.log("-----------------------------------------------------------------");
    console.log("dataDashEdadAgrupGral");
    console.log(dataDash);

    const options = {
      series: [{
        name: 'Asistentes',
        data: dataDash.data
      }],
      chart: {
        height: 350,
        type: 'bar',
      },
      colors:["#005CAE"],
      plotOptions: {
        bar: {

          dataLabels: {
            position: 'top', // top, center, bottom
          },
        }
      },
      dataLabels: {
        enabled: true,
        formatter (val) {
          return `${val  }`;
        },
        offsetY: -30,
        style: {
          fontSize: '18px',
          colors: ["#304758"]
        }
      },
      xaxis: {
        categories: dataDash.categoria,
        position: 'bottom',
        axisBorder: {
          show: false
        },
        labels: {
          style: {
            fontSize: '16px', // Cambia el tamaño de la fuente aquí
          }
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: true,
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter (val) {
            return `${val  }`;
          }
        }

      },



    };

    const chart = new ApexCharts(document.querySelector('#dashboard-juego-tipos'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dataDash]);

  return (
    <div>
      <Typography variant="h4" sx={{ mt: 1 }}>
        Personas que han interactuado con juegos RA
      </Typography>
      <div id="dashboard-juego-tipos" />
    </div>
  );
};

DashboardGeneralJuegosGeneral.propTypes = {
  dataDash: PropTypes.shape({
    categoria: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};

export default DashboardGeneralJuegosGeneral;
