import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import PropTypes from 'prop-types';

const DashboardGeneralGeneroEvento = ({ dataDash }) => {
  useEffect(() => {

    console.log("-----------------------------------------------------------------");
    console.log("dataDashCategoriaAgrup");
    console.log(dataDash);


    const options = {
      series: dataDash.data,
      chart: {

        type: 'pie',
        height: 350
      },
      labels: dataDash.categoria,
      legend: {
        position: 'top',
        fontSize: '15px',
      },
      dataLabels: {
        style: {
          fontSize: '20px',
          fontWeight: 'normal',
          color: '#333',
          fontFamily: 'Roboto, sans-serif',
        },
      },
      colors: ['#FF69B4', '#FFD700', '#87CEEB'],
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

    const chart = new ApexCharts(document.querySelector('#dashboard-pie-chart'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dataDash]);

  return (
    <div>
      <h4 style={{ textAlign: 'center' }}>Asistentes a eventos por género</h4>

          <div id="dashboard-pie-chart" />

    </div>
  );
};

DashboardGeneralGeneroEvento.propTypes = {
  dataDash: PropTypes.shape({
    categoria: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};
export default DashboardGeneralGeneroEvento;