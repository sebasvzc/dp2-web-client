import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import PropTypes from 'prop-types';

const DashboardCuponesMesCliente = ({ dataDash }) => {
  useEffect(() => {
    console.log("-----------------------------------------------------------------");
    console.log(dataDash);
    const series = dataDash.map(item => ({
      name: item.categoria,
      data: item.cantidades,
    }));

    const categories = dataDash.length > 0 ? dataDash[0].fechas : [];
    console.log("series");
    console.log(series);
    console.log("categorias");
    console.log(categories);
    const options = {
      series,
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      colors:  [ '#003B91','#EE8700', '#983490', '#007881', '#F2B53D','#73B359','#736256','#5993B3','#5E7356','#9D875C'],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth'
      },
      markers: {
        size: 0.5, // Tamaño del marcador
        strokeWidth: 0, // Ancho del borde del marcador (puedes ajustar esto si es necesario)
        hover: {
          size: 5 // Tamaño del marcador al pasar el ratón por encima (opcional)
        }
      },
      xaxis: {
        title: {
          text: 'Fecha de compra',
        },
        categories,
      },

      yaxis: {
        title: {
          text: 'Cupones canjeados'
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
      }

  };

    const chart = new ApexCharts(document.querySelector('#dashboard-cupones-mes-clientes'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dataDash]);

  return <div id="dashboard-cupones-mes-clientes" />;
};
DashboardCuponesMesCliente.propTypes = {
  dataDash: PropTypes.arrayOf(PropTypes.shape({
    categoria: PropTypes.string.isRequired,
    fechas: PropTypes.arrayOf(PropTypes.string).isRequired,
    cantidades: PropTypes.arrayOf(PropTypes.number).isRequired,
  })).isRequired,
};
export default DashboardCuponesMesCliente;

