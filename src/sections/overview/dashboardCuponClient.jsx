import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ApexCharts from 'apexcharts';

const DashboardCuponClient = ({ dataDash }) => {
  console.log("dataDash");
  console.log(dataDash);
  useEffect(() => {
    const options = {
      series: [
        {
          name: "Cupones",
          data: dataDash.cantidad
        }
      ],
      chart: {
        id: "basic-bar",
        type: 'line',
        height: 350
      },
      xaxis: {
        categories: dataDash.fechas
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val.toFixed(0)}`,
        style: {
          fontSize: '12px',
          colors: ['#00489C']
        }
      },
      stroke: {
        width: 2,  // Puedes ajustar el ancho de la línea aquí
        colors: ['#00489C'],  // Color azul
        curve: 'smooth'  // Si quieres curvas suaves en lugar de líneas rectas
      },
      title: {
        text: 'Cupones canjeados por mes',
        style: {
          fontSize: '24px', // Tamaño para h3
          fontWeight: 'bold', // Negrita para que se vea como un h3
          paddingLeft: '5px', // Padding izquierda
          textAlign: 'center', // Alineación centrada
      },
      align: 'center', 
      },
      yaxis: {
        title: {
          text: 'Cantidad de cupones',
        },
        labels: {
          formatter: (val) => val.toFixed(0)
        }
      },
      tooltip: {
        y: {
          formatter: (val) => `${val.toFixed(0)}`
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

    const chart = new ApexCharts(document.querySelector('#basic-line-chart'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dataDash]);

  return <div id="basic-line-chart" />;
};
DashboardCuponClient.propTypes = {
  dataDash: PropTypes.shape({
    fechas: PropTypes.arrayOf(PropTypes.string).isRequired,
    cantidad: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};
export default DashboardCuponClient;