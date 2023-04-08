const Chart_title_arr = ['Temp min', 'Temp max', 'Pressure', 'Humidity', 'Wind speed', 'Wind dir', 'Clouds', 'POP', 'Rain', 'Snow'];
const yAxis_title_arr = ['градусов', 'градусов', 'гПа', '%', 'м/с', 'градусов', '%', '%', 'мм', 'мм'];
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