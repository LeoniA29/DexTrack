async function getDataGlucose() {

  const data = await fetch('http://localhost:3000/clinician/getGlucoseData');
  return data.json();
}

async function loadGraphGlucose() {

  const test = await getDataGlucose();

  const dataArray = [];
  for (var i=test.length -1; i>=0; i--) {
    dataArray.push(test[i]);
  };

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
      name: 'Blood Glucose Level',
      color: '#E13D45',
      data: dataArray,
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


