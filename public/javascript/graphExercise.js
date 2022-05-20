
function getData() {
  var dataa = document.forms["form"]["this"].value

  console.log(dataa)
  return dataa;
}


Highcharts.chart('container4', {
  
    title: {
      text: 'Exercise'
    },
    credits: {
        enabled: false
    },
    yAxis: {
      title: {
        text: 'Steps'
      }, 
      plotBands: [{
        from: 4000,
        to: 9000,
        color: '#F2F2F2',
        label: {
            text: 'Threshold',
            style: {
                color: '#707070'
            }
        }
    }]},
    xAxis: {
      type: 'category',
      title: {
        text: 'Date'
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },
      }
    },
    series: [{
      name: 'Exercise',
      color: '#55B48B',
      data: getDat,
        showInLegend: false
    }],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  });