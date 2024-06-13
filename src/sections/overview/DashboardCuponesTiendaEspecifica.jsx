import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import PropTypes from 'prop-types';

const DashboardCuponesTiendaEspecifica = ({ dataDash }) => {
  useEffect(() => {
    console.log("dataDashCuponesTiendaEspecifica");
    console.log(dataDash);

    const series = dataDash.map(item => ({
      name: item.variable,
      data: item.cantidades,
    }));

    const categories = dataDash.length > 0 ? dataDash[0].fechas : [];
    const options = {
      series,
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      title: {
        text: 'Cantidad de cupones usado agrupados por mes',
        style: {
          fontFamily: 'Roboto, sans-serif',
          fontSize: '24px', // Tamaño para h3
          textAlign: 'center', // Alineación centrada
      },
      align: 'center', 
      },
      xaxis: {
        title: {
          text: 'Fecha de compra',
        },
        categories
      },
      yaxis: {
        title: {
          text: 'Número de cupones',
        }
      },
      tooltip: {
        y: {
          formatter (val) {
            return `${val.toFixed(0)  } cupones`;
          }
        }
      },
      fill: {
        opacity: 1
      }
    };

    const chart = new ApexCharts(document.querySelector('#dashboard-cupones-tienda-especifica'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dataDash]);

  return <div id="dashboard-cupones-tienda-especifica" />;
};
DashboardCuponesTiendaEspecifica.propTypes = {
  dataDash: PropTypes.arrayOf(PropTypes.shape({
    variable: PropTypes.string.isRequired,
    fechas: PropTypes.arrayOf(PropTypes.string).isRequired,
    cantidades: PropTypes.arrayOf(PropTypes.number).isRequired,
  })).isRequired,
};
export default DashboardCuponesTiendaEspecifica;

