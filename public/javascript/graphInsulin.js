async function getDataInsulin() {

  const data = await fetch('https://dextrack.herokuapp.com/clinician/getInsulinData');
  return data.json();
}

async function loadGraphInsulin() {

  const test = await getDataInsulin();
  const dataArray = [];

  for (var i=test.length -1; i>=0; i--) {
    dataArray.push(test[i]);
  };

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
      name: 'Insulin Dose',
      color: '#FF9D47',
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
