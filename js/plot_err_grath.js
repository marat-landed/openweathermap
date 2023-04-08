// 02-05-2022 Версия для МК NodeMCU
// 20-07-2022 Загрузка архива прогнозов на страницу Архив
// 04-04-2023 Построение графиков распределения ошибок прогнозов

//var chartT, // 'chart-temperature'
//    chartClPr; // 'chart-clouds-precipitation'

var chartEr_err = [];

function plot_err_grath(jsonValue) {
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
	
  const yAxis_title = ['градусов', 'градусов', 'гПа', '%', 'м/с', 'градусов', '%', '%', 'мм', 'мм'];
  
  var keys = Object.keys(jsonValue);
  
  for (var key = 0; key < keys.length; key++){
	var param = jsonValue[keys[key]];
	//console.log(key,param); // key = 0..9; param = Array(7) [ "7 2 0 0 0 0 0 0 0 0 0", "4 3 0 0 0 0 0 0 0 0 0", "4 2 0 0 0 0 0 0 0 0 0", "4 0 1 0 0 0 0 0 0 0 0", "0 4 0 0 0 0 0 0 0 0 0", "2 0 0 1 0 0 0 0 0 0 0", "1 1 0 0 0 0 0 0 0 0 0" ]
	
	// Создаем подпись параметра
	let label_arr = keys[key].split("/");
	let lab = label_arr[2];
	if (label_arr.length >3)
	  lab += "-" + label_arr[3];
    // Первая буква - большая
    //var Chart_title = lab.charAt(0).toUpperCase() + lab.slice(1);
	const Chart_title = Chart_title_arr[key];
	
	// Создаем div для графика
	let div = document.createElement('div');
	let renderTo = keys[key] + "-err";
	div.setAttribute("id", renderTo);
	//div.classList.add("table_arch");
	document.getElementById('div_err_grath').appendChild(div);
	
	// Создаем графики распределения ошибок по дням прогноза
	let yAxis_title_text = yAxis_title[key];
	create_chart_error_mean(renderTo, Chart_title, yAxis_title_text);
		
	// Создаем данные для графика
	// Вычисляем средние значения ошибок
    var data_err = [];
	for (let j=0; j<7; j++) {
	  // Берем строку
	  let str1 = param[j];
	  // Превращаем её в числовой массив
      let myArray = str1.split(" ").map(Number);
	  // Находим сумму элементов и сумму ошибок
	  let sum_el = 0;
	  let sum_err = 0;
	  for (let k=0; k<myArray.length; k++) {
		sum_el += myArray[k];
       	sum_err	+= myArray[k]*k*param_scale[key];
	  }
	  let mean_error = sum_err/sum_el;
	  data_err.push(mean_error);
	}
	chartEr_err[key].series[0].setData(data_err);
  } // for (var key = 0; key < keys.length; key++){
}

function create_chart_error_mean(renderTo, Chart_title, yAxis_title_text) {
  let chart = new Highcharts.chart(renderTo,{
    chart: {
      type: 'line',
      width: 500,
      height: 300
    },	  
	title: {
	  text: Chart_title,
	  style: {
        fontWeight: 'bold'
      }
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
	series: [{
		name: '',
		//type: 'line',
		//color: Highcharts.getOptions().colors[8],//'#FF0000',//Highcharts.getOptions().colors[3], //'#FF0000',
		//marker: {
		//  symbol: 'circle',
		//  radius: 3,
		//  fillColor: '#FF0000'//'#FF0000',
		//},
		//dataLabels: {
        //  enabled: true,
        //  style: {
        //    color: '#FF0000',
        //    textOutline: 'none',
        //    fontWeight: 'normal'
        //  },
		//  formatter: function () {
		//	return Highcharts.numberFormat(this.y,1);
		//  }
		//},
		//tooltip: {
			//valueDecimals: 2,
		//	valueSuffix: ' °C'
			// pointFormat: 'Value: {point.y:.2f} mm' // Выводит 2 знака после запятой при наведении мыши: Value: 106.40 mm
		//}
	}],
	xAxis: {
		categories: ['1', '2', '3', '4', '5', '6', '7'],
        labels: {
            align: 'center' // выравнивание подписей под серединой столбцов
        },
		title: {
          text: 'Дней',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
	    gridLineWidth: 1,
    },
	yAxis: [
	  { 
	    title: {
          text: yAxis_title_text,
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
	  enabled: false,
	  itemStyle: {
	    fontWeight: 'normal'
	  }
    },
	tooltip: {
      //xDateFormat: '%d-%m-%Y',
      shared: true,
	  crosshairs: true,
	  shadow: true,
      borderWidth: 0,
      backgroundColor: 'rgba(255,255,255,0.8)'
    }
  });
  chartEr_err.push(chart);
}