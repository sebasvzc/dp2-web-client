import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

const DashboardCuponClient = () => {
  useEffect(() => {
    const options = {
      series: [
        {
          name: "Cupones",
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        }
      ],
      chart: {
        id: "basic-bar",
        type: 'line',
        height: 350
      },
      xaxis: {
        categories: ["Ene 2024", "Feb 2024", "Mar 2024", "Abr 2024", "May 2024", "Jun 2024", "Jul 2024", "Ago 2024"]
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
          formatter: (val) => `${val.toFixed(0)} unidades`
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
  }, []);

  return <div id="basic-line-chart" />;
};

export default DashboardCuponClient;