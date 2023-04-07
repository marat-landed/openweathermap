// 01-04-23 Вызов программы получения прогнозов с Openweathemap
// Для использования в GitHub посредством Cron.
// Последняя редакция 01-04-23.
//import colors from 'colors';
import { MainForec } from './forecast_funct.js';
import { today_forecast_recorded } from './forecast_funct.js';

let global_path = "forec_gh"; // forec_gh forec_probe
let allow_output = false;

async function get_forecast_openweathermap() {
  // Если даты совпадают, прогноз уже записан, today_forecast_recorded возвращает true
  let already_recorded = await today_forecast_recorded(global_path);
  if (!already_recorded) { 
    // Записываем прогноз
    await MainForec(global_path, allow_output); // allow_output
    console.log("Завершено!");
  } else {
	// Прогноз уже записан, записывать больше не нужно.
	console.log("Прогноз за сегодня уже записан!");  
  }
}

get_forecast_openweathermap();