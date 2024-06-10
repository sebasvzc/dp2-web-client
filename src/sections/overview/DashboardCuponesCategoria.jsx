
import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import PropTypes from 'prop-types';

const DashboardCuponesCategoria = ({ dataDash }) => {
  useEffect(() => {

    console.log("-----------------------------------------------------------------");
    console.log("dataDashCategoriaAgrup");
    console.log(dataDash);


    const options = {
      series: dataDash[0].data,
      chart: {

        type: 'pie',
      },
      labels: dataDash[0].categoria,
      legend: {
        position: 'top', // Establece la posición de la leyenda a la izquierda
      },
      colors: [ '#003B91','#EE8700', '#983490', '#007881', '#F2B53D','#73B359','#736256','#5993B3','#5E7356','#9D875C'], // Paleta de colores personalizada
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
    <div > {/* Ajusta el padding superior y centra el texto */}
      <h4 style={{ textAlign: 'center' }}>Cupones Canjeados por Categorías Principales</h4>
      <div id="dashboard-pie-chart"  />
      {/* Aplica el borde */}
    </div>
  );
};

DashboardCuponesCategoria.propTypes = {
  dataDash: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    categoria: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.number).isRequired,
  })).isRequired,
};

export default DashboardCuponesCategoria;

