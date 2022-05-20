Highcharts.chart('container1', {
    title: {
      text: 'Blood Glucose Level'
    },
    credits: {
        enabled: false
    },
    yAxis: {
      title: {
        text: 'nmol/L'
      }, 
      plotBands: [{
        from: 60,
        to: 70,
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
      color: '#E13D45',
      data: [
        [Date.UTC(2022, 04, 20), 60],
        [Date.UTC(2022, 04, 21), 70],
        [Date.UTC(2022, 04, 22), 75],
        [Date.UTC(2022, 04, 23), 55],
        [Date.UTC(2022, 04, 24), 80],
        [Date.UTC(2022, 04, 25), 56], 
        [Date.UTC(2022, 04, 26), 64]],
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