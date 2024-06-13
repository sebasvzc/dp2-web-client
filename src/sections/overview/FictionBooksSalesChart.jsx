import ApexCharts from 'apexcharts';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import DashboardEventosCategorCliente from './DashboardEventosCategorCliente';

const FictionBooksSalesChart = ({ dataDash }) => {
  
  useEffect(() => {
    console.log("-----------------------------------------------------------------");
    console.log("dataDashCategoriaAgrupEvento");
    console.log(dataDash);
    const options = {
      series: [
        {
          name: "Visitas",
          data: dataDash.cantidades,
        }
      ],
      chart: {
        type: 'bar',
        height: 450
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: 'end',
          horizontal: true,
          dataLabels: {
            position: 'top' // Pone las etiquetas fuera de la barra
          }
        }
      },

      colors:"#005CAE",
      dataLabels: {
        enabled: true,
        offsetX: 30, // Ajusta la posición horizontal
        style: {
          colors: ['#000'] // Color de las etiquetas
        }
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      xaxis: {
        categories: dataDash.nombreTiendas,
      },
    };

    const chart = new ApexCharts(document.querySelector('#fiction-books-sales-chart'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dataDash]);

  return <div id="fiction-books-sales-chart" />;
};
FictionBooksSalesChart.propTypes = {
  dataDash: PropTypes.arrayOf(PropTypes.shape({
    nombreTienda: PropTypes.arrayOf(PropTypes.string).isRequired,
    cantidades: PropTypes.arrayOf(PropTypes.number).isRequired,
  })).isRequired,
};

export default FictionBooksSalesChart;