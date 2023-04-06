// 17-03-2023

// <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js"></script>

var firebaseConfig = {
		apiKey: "AIzaSyDZCBYYnoI8O9rWW_V9PhksdRppDWfSG4o", 
		databaseURL: "https://probe-23-02-2023-default-rtdb.europe-west1.firebasedatabase.app"
      };

var timeoutID = window.setInterval(setTime, 5000);

firebase.initializeApp(firebaseConfig);

function firebase_call () {
  alert("Hi!");
}

function setTime() {
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + ' ' + time;
  document.getElementById('curr-time').innerHTML = dateTime;
}

// Initialize Firebase
      firebase.initializeApp(firebaseConfig);
	  
	  // Получение оследнего прогноза одного параметра по заданному пути path
	  async function get_last_forecast_param (path) {
	    const dbRef = firebase.database().ref(path);
	    var forecast = await dbRef.once('value').then((snapshot) => {
		  if (snapshot.exists()) {
		    return snapshot.val();
		  } else ;
	    });
		return forecast;
	  }
	  
	  const path_name = ["temp/min", "temp/max", "pressure", "humidity", "wind_speed",
	    "wind_deg", "clouds", "pop", "rain", "snow", "weather/icon"];
	  const all_last_forecasts = new Object();
	  const all_forecasts = new Object();
	  
	  async function get_last_forecasts() {
	    for (var part_name_no=0; part_name_no < path_name.length; part_name_no++) {
	      var path = "forecast/" + path_name[part_name_no];
		  await get_last_forecast_param (path).then ((value) => {
		    //console.log(path, value[value.length-1]);
			// Здесь вызывать функцию построения графика параметра
			all_forecasts[path] = value; // value.length-1
			all_last_forecasts[path] = value[0]; // value.length-1
			//console.log(path, all_last_forecasts[path]);
		  })
	    }
	  }
	  
	  async function prepare_last_forecasts() {
	    await get_last_forecasts().then (() => {
		  //console.log(all_last_forecasts);
		  console.log("Передаем для построения графиков");
		  plot_last_forecast(all_last_forecasts); // Выводим последний прогноз
		  plot_all_forecasts(all_forecasts); // Строим таблицы всех прогнозов
		})
	  }
	
	  prepare_last_forecasts();