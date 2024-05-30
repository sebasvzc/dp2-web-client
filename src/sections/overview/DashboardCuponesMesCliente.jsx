import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import PropTypes from 'prop-types';

const DashboardCuponesMesCliente = ({ dataDash }) => {
  useEffect(() => {
    console.log("dataDash");
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
        type: 'bar',
        height: 350,
        stacked: true
      },
      plotOptions: {
        bar: {
          horizontal: false, // Set horizontal to false to make bars vertical
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      title: {
        text: 'Cantidad de cupones usado agrupados por mes',
      },
      xaxis: {
        title: {
          text: 'Fecha de compra',
        },
        categories,
      },
      yaxis: {
        title: {
          text: 'Número de cupones',
        },
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
DashboardCuponesMesCliente.propTypes = {
  dataDash: PropTypes.arrayOf(PropTypes.shape({
    categoria: PropTypes.string.isRequired,
    fechas: PropTypes.arrayOf(PropTypes.string).isRequired,
    cantidades: PropTypes.arrayOf(PropTypes.number).isRequired,
  })).isRequired,
};
export default DashboardCuponesMesCliente;

