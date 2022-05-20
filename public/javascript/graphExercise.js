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
      name: 'Exercise',
      color: '#55B48B',
      data: [
        [Date.UTC(2022, 04, 20), 4890],
        [Date.UTC(2022, 04, 21), 5506],
        [Date.UTC(2022, 04, 22), 7234],
        [Date.UTC(2022, 04, 23), 8329],
        [Date.UTC(2022, 04, 24), 1237],
        [Date.UTC(2022, 04, 25), 4553], 
        [Date.UTC(2022, 04, 26), 3423]],
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