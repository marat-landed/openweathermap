// 02-05-2022 Версия для МК NodeMCU
// 20-07-2022 Загрузка архива прогнозов на страницу Архив
// 04-04-2023 Построение графиков распределения ошибок прогнозов

//var chartT, // 'chart-temperature'
//    chartClPr; // 'chart-clouds-precipitation'
function plot_dist_grath(all_dist) {
  //var statistics = last_statistics[0]; // Массив last_statistics имеет один единственный элемент
  //plotChart(statistics);
  plotDistribution(all_dist);
}

var chartEr_mean, // 'chart-mean-error'
    chartEr_distr = []; // 'chart-distribution-errors'
var error_statistics_mem = [];

function plotDistribution(jsonValue) {
  // jsonValue - объект.
  // Key: distribution/temp/min, distribution/temp/max,..., distribution/snow
  // Каждый элемент объекта - массив из 7 значений - по дням прогноза.
  // Каждое значение - строка вида "6 1 0 2 0 0 0 0 0 0 0".
  // Каждое элемент в строке - количество ошибок, находящихся в соответствующем интервале.
  
  const param_scale = [ 
    1, // temp, min
	1, // temp, max
	1, // pressure
	5, // humidity
	0.5, // wind_speed
	5, // wind_deg
	5, // clouds
	5, // pop
	1, // rain
	1 ]; // snow
  
  var keys = Object.keys(jsonValue);
  // Сколько дней ведется наблюдение
  let param1 = jsonValue[keys[0]];
  let str1 = param1[0];
  let arr = str1.split(" ").map(Number);
  let sum = 0;
  for(let i = 0; i < arr.length; i++){
    sum += arr[i];
  }
  document.getElementById("stat_day").textContent = sum;
  document.getElementById("stat_day_err").textContent = sum;
  
  for (var key = 0; key < keys.length; key++){
	var param = jsonValue[keys[key]];
	//console.log(key,param); // key = 0..9; param = Array(7) [ "7 2 0 0 0 0 0 0 0 0 0", "4 3 0 0 0 0 0 0 0 0 0", "4 2 0 0 0 0 0 0 0 0 0", "4 0 1 0 0 0 0 0 0 0 0", "0 4 0 0 0 0 0 0 0 0 0", "2 0 0 1 0 0 0 0 0 0 0", "1 1 0 0 0 0 0 0 0 0 0" ]
	
	// Создаем подпись для одного параметра
	var parag = document.createElement('p');
	parag.style.cssText += 'font-size: 14px; padding: 10px; font-weight: bold;';
	let label_arr = keys[key].split("/");
	let lab = label_arr[2];
	if (label_arr.length >3)
	  lab += "-" + label_arr[3];
    var strUpper = lab.charAt(0).toUpperCase() + lab.slice(1);
	parag.innerText = strUpper;
	document.getElementById('div_dist_grath').appendChild(parag);
	
	// Создаем div для графика
	let div = document.createElement('div');
	div.setAttribute("id", keys[key]);
	//div.classList.add("table_arch");
	document.getElementById('div_dist_grath').appendChild(div);
	
	// Создаем графики распределения ошибок по дням прогноза
	create_chart_error_distr(keys[key]);
	for (let j=0; j<7; j++) {
	  let series_name = (j+1).toString();
	  chartEr_distr[key].addSeries({
        name: series_name
      });
	  let series = chartEr_distr[key].series[j];
	  series.setVisible(j==0);
	  series.name = (j+1).toString(); // Пример: distribution/temp/min-6
	}
	
	// Категории оси x
	var xAxis = chartEr_distr[key].xAxis[0];
    var newCategories = [];
	for (let i=0; i<10; i++) {
	  let str = (param_scale[key]*i).toString() + "-" + (param_scale[key]*(i+1)).toString();
	  newCategories.push(str);
	}
	let str = "более " + (param_scale[key]*10).toString();
	newCategories.push(str);
	xAxis.setCategories(newCategories);

	// Создаем данные для графика
	for (let j=0; j<7; j++) {
	  let myString = param[j];
      let myArray = myString.split(" ").map(Number);
	  chartEr_distr[key].series[j].setData(myArray);
	}	
  }
}

function myListener() {
  // this.name = 0-6, 3-2,...
  let myArray = this.name.split("-");
  let series = chartEr_distr[0].series[2];
  let series_name = series.name;
  
  series = chartEr_distr[myArray[0]].series[myArray[1]];
  series_name = series.name;
  
  if (this.checked) {
    //console.log('Checkbox отмечен');
	series.setVisible(true);
  } else {
    //console.log('Checkbox не отмечен');
	series.setVisible(false);
  }
}

function create_chart_error_distr(renderTo) {
  let chart = new Highcharts.chart(renderTo,{
    chart: {
      type: 'column',
      width: 500,
      height: 300
    },	  
	title: {
	  text: ''
	},
    plotOptions: {
      series: {
        //pointWidth: 5,
		pointPadding: 0,
        groupPadding: 0.1,
        borderWidth: 0,
        shadow: false
      }
    },
	xAxis: {
        categories: ['0-10', '10-20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90-100', 'Более 100'],
		labels: {
            align: 'center' // выравнивание подписей под серединой столбцов
        },
		title: {
          text: '',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
	    gridLineWidth: 1,
    },
	yAxis: [
	  { 
	    title: {
          text: 'Количество ошибок',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
        labels: {
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
		alignTicks: true,
      }
	 ],
	credits: {
	  enabled: false
	},
	legend: {
	  enabled: true,
	  itemStyle: {
	    fontWeight: 'normal'
	  }
    },
	tooltip: {
      xDateFormat: '%d-%m-%Y',
      shared: true,
	  crosshairs: true,
	  shadow: true,
      borderWidth: 0,
      backgroundColor: 'rgba(255,255,255,0.8)'
    }
  });
  chartEr_distr.push(chart);
}

function create_chart_error_mean(renderTo) {
  chartEr_mean = new Highcharts.chart(renderTo,{	
	title: {
	  text: 'Средняя ошибка прогноза температуры'
	},
	plotOptions: {
      series: {
            pointStart: 1
      }  
    },
	series: [
	  {
		name: 'Tmin',
		type: 'line',
		tooltip: {
          valueDecimals: 2,
        },
		color: Highcharts.getOptions().colors[0],
		marker: {
		  symbol: 'circle',
		  radius: 3,
		  fillColor: Highcharts.getOptions().colors[0]
		},
		dataLabels: {
          enabled: true,
		  format: '{point.y:.1f}',
          style: {
            color: 'black',
            textOutline: 'none',
            fontWeight: 'normal',
          },
		}
	  },
	  {
		name: 'Tmax',
		type: 'line',
		tooltip: {
          valueDecimals: 2,
        },
		color: Highcharts.getOptions().colors[3], //'#FF0000',
		marker: {
		  symbol: 'circle',
		  radius: 3,
		  fillColor: Highcharts.getOptions().colors[3]//'#FF0000',
		},
		dataLabels: {
          enabled: true,
		  format: '{point.y:.1f}',
          style: {
            color: 'black',
            textOutline: 'none',
            fontWeight: 'normal',
          },
		}
	  }
	],
	xAxis: {
	  title: {
		text: 'Глубина прогноза, дней'
	  },
	  gridLineWidth: 1,
	},
	yAxis: [
	  {
	    title: {
		  text: 'Средняя ошибка, °C'
	    },
	    alignTicks: false,
        tickInterval: 1,
	  }
	 ],
	credits: {
	  enabled: false
	},
	legend: {
	  itemStyle: {
	    fontWeight: 'normal'
	  }
    },
	tooltip: {
      xDateFormat: '%d-%m-%Y',
      shared: true,
	  crosshairs: true,
	  shadow: true,
      borderWidth: 0,
      backgroundColor: 'rgba(255,255,255,0.8)'
    }
  });
}

function day_forecastRadio(value) {
  var value_int = parseInt(value);
  //console.log(value_int);
  //console.log(error_statistics_mem);
  
  var error_statistics_row = copy_one_row(error_statistics_mem,value_int-1);
  //console.log(error_statistics_row);
  chartEr_distr.series[0].setData(error_statistics_row);
  
  error_statistics_row = copy_one_row(error_statistics_mem,value_int+6);
  //console.log(error_statistics_row);
  chartEr_distr.series[1].setData(error_statistics_row);
}

function copy_one_row(arr,row_num) {
  let row1 = [];
  arr[row_num].forEach(elem => {
    row1.push(elem)
  })
  return row1;
}