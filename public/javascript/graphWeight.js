Highcharts.chart('container2', {
    title: {
      text: 'Weight'
    },
    credits: {
        enabled: false
    },
    yAxis: {
      title: {
        text: 'Kg'
      }, 
      plotBands: [{
        from: 45,
        to: 55,
        color: '#F2F2F2',
        label: {
            text: 'Threshold',
            style: {
                color: '#707070'
            }
        }
    }]},
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        month: '%e. %b',
        year: '%b'
      },
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
      name: 'Weight',
      color: '#6F62D0',
      data: [
        [Date.UTC(2022, 04, 20), 50],
        [Date.UTC(2022, 04, 21), 51],
        [Date.UTC(2022, 04, 22), 52],
        [Date.UTC(2022, 04, 23), 52],
        [Date.UTC(2022, 04, 24), 51],
        [Date.UTC(2022, 04, 25), 50], 
        [Date.UTC(2022, 04, 26), 50]],
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