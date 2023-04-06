// 02-05-2022 Версия для МК NodeMCU
// 20-07-2022 Загрузка архива прогнозов на страницу Архив
// 15-02-2023 Усовершенствование создания таблиц

function plot_dist_tab(jsonValue) {
// "forecast/clouds": Array(8) [ "1678352400 64.00 100.00 100.00 100.00 9.00 79.00 100.00 99.00",
// "1678352400 68.00 100.00 100.00 100.00 7.00 75.00 18.00 95.00", "1678352400 67.00 100.00 100.00 100.00 7.00 75.00 18.00 95.00", … ]
// "forecast/wind_speed": Array(8) [ "1678352400 6.85 7.24 8.12 7.38 4.09 5.14 4.51 2.59",
// "1678352400 6.46 6.44 8.14 8.43 6.37 6.93 4.95 2.99", "1678352400 6.46 6.44 8.14 8.43 6.37 6.93 4.95 2.99", … ]
  //console.log(jsonValue);
  
  var keys = Object.keys(jsonValue);
  for (var key = 0; key < keys.length; key++){
	var param = jsonValue[keys[key]];
	
    // Создаем подпись параметра
	var parag = document.createElement('p');
	parag.style.cssText += 'font-size: 14px; padding: 10px; font-weight: bold;';
	let label_arr = keys[key].split("/");
	let lab = label_arr[2];
	if (label_arr.length >3)
	  lab += "-" + label_arr[3];
    // Первая буква - большая
    var strUpper = lab.charAt(0).toUpperCase() + lab.slice(1);
	parag.innerText = strUpper;
	document.getElementById('div_dist_tab').appendChild(parag);
	
	let table = document.createElement('table');
	let thead = document.createElement('thead');
	let tbody = document.createElement('tbody');
	table.classList.add("table_arch");
	table.appendChild(thead);
	table.appendChild(tbody);
	document.getElementById('div_dist_tab').appendChild(table);
	// Цикл по дням для одного параметра
	//param.slice().reverse().forEach((element, index) => {	
	param.forEach((element, index) => {	
	  //console.log(element);
	  // Строку превращаем в массив: один прогноз по одному параметру (дата и 8 значений)
	  const myArray = element.split(" ");
	  //console.log(myArray);
	  let row = document.createElement('tr');
	  tbody.appendChild(row);
	  let td = document.createElement('td');
	  td.innerHTML = (index + 1).toString() + " д.";
	  row.appendChild(td);
	  myArray.forEach((element2, index2) => {
		let td = document.createElement('td');
		td.innerHTML = element2;
		row.appendChild(td);
	  })
	})
  }
}