
import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import PropTypes from 'prop-types';

const DashboardCuponesCategoria = ({ dataDash }) => {
  useEffect(() => {

    console.log("-----------------------------------------------------------------");
    console.log("dataDashCategoriaAgrup");
    console.log(dataDash);


    const options = {
      series: [{
        name: dataDash[0].name,
        data: dataDash[0].data,
      }],
      chart: {
        height: 350,
        type: 'radar',
      },
      title: {
        text: 'Radar de Categorías Preferidas en Cupones',
      },
      yaxis: {
        stepSize: 20,
      },
      xaxis: {
        categories: dataDash[0].categoria,
      }
    };

    const chart = new ApexCharts(document.querySelector('#dashboard-cupones-categorias-clientes'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dataDash]);

  return <div id="dashboard-cupones-categorias-clientes" />;
};

DashboardCuponesCategoria.propTypes = {
  dataDash: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    categoria: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.number).isRequired,
  })).isRequired,
};

export default DashboardCuponesCategoria;

