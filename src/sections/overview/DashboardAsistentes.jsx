
import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import PropTypes from 'prop-types';

const DashboardAsistentes = ({ dataDash }) => {
  useEffect(() => {

    console.log("-----------------------------------------------------------------");
    console.log("indicadors");
    console.log(dataDash);
    const porc= (dataDash.totalAsistencia/dataDash.totalInscritos)*100;
    const porcRounded = porc.toFixed(2);
    const options = {
      series: [{
        data: [dataDash.totalAsistencia]
      }],
      chart: {
        type: 'bar',
        height: 100
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: 'end',
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        padding: {
          top: -10
        }
      },
      colors: ['#00489D'], // Cambia el color a azul (puedes usar otros valores de color válidos)
      xaxis: {
        categories: ['Asistentes'],
        max: dataDash.totalInscritos
      }
    };

    const chart = new ApexCharts(document.querySelector('#dashboard-bar-asist'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dataDash]);

  return (
    <div > {/* Ajusta el padding superior y centra el texto */}
      <h4 style={{ textAlign: 'center' }}>Número de asistentes</h4>
      <div id="dashboard-bar-asist"  />
      {/* Aplica el borde */}
    </div>
  );
};

DashboardAsistentes.propTypes = {
  dataDash: PropTypes.shape({
    totalAsistencia: PropTypes.number.isRequired,
    totalInscritos: PropTypes.number.isRequired,
  }).isRequired,
};

export default DashboardAsistentes;

