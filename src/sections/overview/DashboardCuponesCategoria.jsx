import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import PropTypes from 'prop-types';

const DashboardCuponesCategoria = ({ dataDash }) => {
  useEffect(() => {
    // console.log("dataDash");
    // console.log(dataDash);
    /* const series = dataDash.map(item => ({
      name: item.categoria,
      data: item.cantidades,
    })); */

    const categories = dataDash.length > 0 ? dataDash[0].fechas : [];
    // console.log("series");
    // console.log(series);
    // console.log("categorias");
    // console.log(categories);
    const options = {
      series: [{
        name: 'Series 1',
        data: [80, 50, 30, 40, 100, 20],
      }],
      chart: {
        type: 'radar',
        height: 350
      },

      title: {
        text: 'Radar de Categorías que más gustan',
      },
      xaxis: {
        categories: ['Deporte', 'Joyeria', 'Comida', 'Musica', 'May', 'June']
      },
      yaxis: {

        labels: {
          formatter (val) {
            return val.toFixed(0);
          }
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
      },
      legend: {

        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40
      },
    };

    const chart = new ApexCharts(document.querySelector('#dashboard-cupones-mes-clientes'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dataDash]);

  return <div id="dashboard-cupones-mes-clientes" />;
};
DashboardCuponesCategoria.propTypes = {
  dataDash: PropTypes.arrayOf(PropTypes.shape({
    categoria: PropTypes.string.isRequired,
    fechas: PropTypes.arrayOf(PropTypes.string).isRequired,
    cantidades: PropTypes.arrayOf(PropTypes.number).isRequired,
  })).isRequired,
};
export default DashboardCuponesCategoria;

