function chart() {
    
  if (reports.length = 0) {

      $('#x').append(`<h1> Please select coins in HomePage. </h1>`);


  } else {

    const repotString = reports.join();
    const apiLink = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${repotString}&tsyms=USD`;
    let dataChart = [];
      
      $.getJSON(apiLink, function (data) {

          for (let prop in data) {
            let ob = {
              type: "line",
              legendText: prop,
              showInLegend: true,
            };
            ob.dataPoints = [];
    
            for (let x = 60; x >= 0; x -= 5) {
              var d = new Date();
              d.setMinutes(d.getMinutes() - x);
              ob.dataPoints.push({ x: d, y: data[prop].USD });
            }
            dataChart.push(ob);
          }
    
          chart = new CanvasJS.Chart("chartContainer", {
            title: {
              text: `${repotString} to USD`
            },
            axisX: {
              valueFormatString: "HH:mm",
              labelAngle: -50
            },
            data: dataChart
          });
          chart.render();
          updateChart();
        });

      
        function updateChart() {

          const repotString = reports.join();
          const apiLink = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${repotString}&tsyms=USD`;
          let dataChart = [];
    
          $.getJSON(apiLink, function (data) {
    
            for (let prop in data) {
              let ob = {
                type: "line",
                legendText: prop,
                showInLegend: true,
              };
              ob.dataPoints = [];
    
              for (let x = 60; x >= 0; x -= 5) {
                var d = new Date();
                d.setMinutes(d.getMinutes() - x);
                ob.dataPoints.push({ x: d, y: data[prop].USD });
              }
              dataChart.push(ob);
            }
    
            chart = new CanvasJS.Chart("chartContainer", {
              title: {
                text: `${repotString} to USD`
              },
              axisX: {
                valueFormatString: "HH:mm",
                labelAngle: -50
              },
              data: dataChart
            });
            chart.render();
            renderReportsTimer = setTimeout(function () { updateChart() }, 2000);
          });
        }
    

  }

}