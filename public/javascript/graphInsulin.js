Highcharts.chart('container3', {
    title: {
      text: 'Dose of Insulin'
    },
    credits: {
        enabled: false
    },
    yAxis: {
      title: {
        text: 'Dose'
      }, 
      plotBands: [{
        from: 3,
        to: 1,
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
      name: 'Blood Glucose Level',
      color: '#FF9D47',
      data: [
        [Date.UTC(2022, 04, 20), 1],
        [Date.UTC(2022, 04, 21), 0],
        [Date.UTC(2022, 04, 22), 2],
        [Date.UTC(2022, 04, 23), 2],
        [Date.UTC(2022, 04, 24), 1],
        [Date.UTC(2022, 04, 25), 2], 
        [Date.UTC(2022, 04, 26), 1]],
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