import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

const FictionBooksSalesChart = () => {
  useEffect(() => {
    const options = {
      series: [
        {
          name: 'Deporte',
          data: [440, 550, 410, 370, 220, 430, 210],
        },
        {
          name: 'Comida',
          data: [530, 320, 330, 520, 130, 430, 320],
        },
        {
          name: 'Tecnología',
          data: [120, 170, 1150, 900, 150, 110, 200],
        },
        {
          name: 'Joyería',
          data: [900, 700, 500, 800, 600, 900, 400],
        },
        {
          name: 'Videojuegos',
          data: [250, 102, 190, 320, 250, 240, 100],
        },
      ],
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
      dataLabels: {
        enabled: true,
        formatter: (val) => val > 270 ? val.toFixed(0) : '',
        style: {
          fontSize: '12px',
          colors: ['#FFFFFF']
        }
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      title: {
        text: 'Visitas a Tiendas agrupadas por Categorías Principales',
      },
      xaxis: {
        categories: ["Ene 2024", "Feb 2024", "Mar 2024", "Abr 2024", "May 2024", "Jun 2024", "Jul 2024"],
      },
      yaxis: {
        title: {
          text: 'Número de Visitas',
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
            return `${val.toFixed(0)  } visitas`;
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

    const chart = new ApexCharts(document.querySelector('#fiction-books-sales-chart'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, []);

  return <div id="fiction-books-sales-chart" />;
};

export default FictionBooksSalesChart;