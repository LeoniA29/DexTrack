async function getDataWeight() {

  const data = await fetch('https://dextrack.herokuapp.com/clinician/getWeightData');
  return data.json();
}

async function loadGraphWeight() {
  
  const test = await getDataWeight();
  const dataArray = [];

  for (var i=test.length -1; i>=0; i--) {
    dataArray.push(test[i]);
  };

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
    },
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
      name: 'Weight',
      color: '#6F62D0',
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