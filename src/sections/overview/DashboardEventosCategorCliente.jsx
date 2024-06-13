
import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import PropTypes from 'prop-types';

const DashboardEventosCategorCliente = ({ dataDash }) => {
  useEffect(() => {

    console.log("-----------------------------------------------------------------");
    console.log("dataDashCategoriaAgrupEvento");
    console.log(dataDash);


    const options = {
      series: dataDash[0].data,
      chart: {

        type: 'pie',
      },
      labels: dataDash[0].categoria,
      legend: {
        position: 'top', // Establece la posición de la leyenda a la izquierda
        fontSize: '15px',
      },
      dataLabels: {
        style: {
          fontSize: '20px',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 'normal',
          color: '#333',
        },
      },
      colors: ['#1E90FF', '#6495ED', '#87CEEB', '#4682B4', '#4169E1', '#00BFFF', '#6A5ACD', '#483D8B', '#4169E1', '#8A2BE2'], // Paleta de colores bonitos de azules
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'top'
          }
        }
      }]
    };

    const chart = new ApexCharts(document.querySelector('#dashboard-pie-chart-evento-cliente'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dataDash]);

  return (
    <div > {/* Ajusta el padding superior y centra el texto */}
      <h4 style={{ textAlign: 'center' }}>Eventos por Categorías</h4>
      <div id="dashboard-pie-chart-evento-cliente"  />
      {/* Aplica el borde */}
    </div>
  );
};

DashboardEventosCategorCliente.propTypes = {
  dataDash: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    categoria: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.number).isRequired,
  })).isRequired,
};

export default DashboardEventosCategorCliente;

