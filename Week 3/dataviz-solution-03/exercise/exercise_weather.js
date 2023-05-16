
/*
	Run the action when we are sure the DOM has been loaded
	https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
	Example:
	whenDocumentLoaded(() => {
		console.log('loaded!');
		document.getElementById('some-element');
	});
*/
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

const TEST_TEMPERATURES = [13, 18, 21, 19, 26, 25,16];

function showTemperatures(container_element, temperatures){

	// Erase the current content
	container_element.innerHTML = "";

	// For each temperature
	temperatures.forEach( (temp) => {
		const paragraph = document.createElement('p');
		paragraph.textContent = temp.toString();

		// set color
		// https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
		if(temp <= 17) {
			paragraph.classList.add('cold');
		} else if (temp >= 23) {
			paragraph.classList.add('warm');
		}


		container_element.appendChild(paragraph)

	});

}


// Part 1 - DOM


whenDocumentLoaded(() => {
	// Part 1.1: Find the button + on click event
	const btn = document.getElementById('btn-part1');

	btn.addEventListener('click', () => {
		console.log('The button was clicked');
	});

	// Part 1.2: Write temperatures
	const div_output = document.getElementById('weather-part1');

	btn.addEventListener('click', () => {
		showTemperatures(div_output, TEST_TEMPERATURES);
	});
});


// Part 2 - class

class Forecast {
	constructor(container) {
		this.container = container;
		this.temperatures = [1,2,3,4,5,6,7];
	}

	toString() {
		return 'Forecast(temp=' + this.temperatures.toString() + ', container=' + this.container.toString() + ')';
	}

	print() {
		console.log(this.toString());
	}

	show() {
		this.container.innerHTML = "";

		// Create a paragraph for each temperature value
		this.temperatures.forEach((temp_value) => {
			// create
			const paragraph = document.createElement('p');

			// set text
			paragraph.textContent = temp_value.toString();

			// set color
			// https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
			if(temp_value <= 17) {
				paragraph.classList.add('cold');
			} else if (temp_value >= 23) {
				paragraph.classList.add('warm');
			}

			// add to the container
			this.container.appendChild(paragraph);
		});
	}

	reload() {
		this.temperatures = TEST_TEMPERATURES;
		this.show();
	}
}

whenDocumentLoaded(() => {
	const btn = document.getElementById('btn-part1');

	// Part 2: class
	const div_out2 = document.getElementById('weather-part2');
	const forecast2 = new Forecast(div_out2);

	forecast2.print();

	btn.addEventListener('click', () => {
		forecast2.reload();
	});
});

// Part 3 - fetch


function weatherbitToTemperatures(data) {
	return  data['data'].map(datum => datum["temp"]); // reduce information to only temperature?
}

const QUERY_LAUSANNE = 'http://api.weatherbit.io/v2.0/forecast/daily?city=Lausanne&days=7&key=b3402dc5180241b4ba018caaab3a90c1';

class ForecastOnline extends Forecast {
	reload() {
		// this.temperatures = [2,3,4,5,6,7,8];
		// this.show()

		fetch(QUERY_LAUSANNE)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				console.log('data', data);
				this.temperatures = weatherbitToTemperatures(data);
			})
			.then(() => {
				this.show();
			});
	}
}

whenDocumentLoaded(() => {
	const btn = document.getElementById('btn-part1');

	// Part 2: inheritance
	const forecast3 = new ForecastOnline(document.getElementById('weather-part3'));

	btn.addEventListener('click', () => {
		forecast3.reload();
	});

	// Part 3: weather API
	// const QUERY='http://query.yahooapis.com/v1/public/yql?format=json&q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="Lausanne") and u="c"';

	// fetch(QUERY)
	// 	.then((response) => {
	// 		return response.json();
	// 	})
	// 	.then((data) => {
	// 		data_global = data;
	// 		console.log(data);
	// 		console.log(yahooToTemperatures(data));
	// 	});
});


function yahooToTemperatures(data) {
}

// Part 4 - interactive

class ForecastOnlineCity extends ForecastOnline {
	setCity(city) {
		this.city = city; // write the name of the city
	}

	reload() {
		const query = ('http://api.weatherbit.io/v2.0/forecast/daily?city='+ this.city + '&days=7&key=b3402dc5180241b4ba018caaab3a90c1');
		
		fetch(query)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				console.log(data);
				this.temperatures = weatherbitToTemperatures(data);
				this.city = data['city_name']
			})
			.then(() => {
				this.show();
			});
	}

	show() {
		super.show(); // inherite from show()?

		const elem_city_name = document.createElement('h4');
		elem_city_name.textContent = this.city;
		// insertBefore(newNode, referenceNode)
		this.container.insertBefore(elem_city_name, this.container.children[0]);
	}
}


whenDocumentLoaded(() => {
	const city_query_input = document.getElementById('query-city'); // the container input value
	const btn_query = document.getElementById('btn-city');

	// Part 2: inheritance
	const forecast_city = new ForecastOnlineCity(document.getElementById('weather-city'));

	btn_query.addEventListener('click', () => {
		const new_city_name = city_query_input.value; // the value of the element
		console.log('Query =', new_city_name);

		forecast_city.setCity(new_city_name);
		forecast_city.reload();
	})
});