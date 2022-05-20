async function getDataExercise() {

  const data = await fetch('http://localhost:3000/clinician/getStepsData');
  return data.json();
}
async function loadGraphExercise() {

  const test = await getDataExercise();
  const dataArray = [];

  for (var i=test.length -1; i>=0; i--) {
    dataArray.push(test[i]);
  };
  
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
        }},
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
        data:  dataArray,
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

}