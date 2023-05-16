
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

function showTemperatures(container_element, temperature) {
	//erase the current content
	container_element.innerHTML="" 

	temperature.forEach((temperature) => {

		// create paragraphs
		const paragraph = document.createElement('p');

		// set text
		paragraph.textContent = temperature.toString();

		// set color
		// https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
		// define classes in the css file
		if(temperature <= 17) {
			paragraph.classList.add('cold');
		} else if (temperature >= 23) {
			paragraph.classList.add('warm');
		}

		// add to the container
		container_element.appendChild(paragraph);

	});


}


const TEST_TEMPERATURES = [13, 18, 21, 19, 26, 25, 16];


// Part 1 - DOM

whenDocumentLoaded(() => {
	// Part 1.1: Find the button + on click event
	const btn = document.getElementById('btn-part1');

	btn.addEventListener('click', () => {
		console.log('The button was clicked');
	});


	// Part 1.2: Write temperatures
	const output_div = document.getElementById('weather-part1');

	console.log('output_div created');

	btn.addEventListener('click', () => {
		showTemperatures(output_div, TEST_TEMPERATURES);
	});
});

// Part 2 - class

class Forecast {
	//create and initialize an object for this class
	constructor(container) {
		this.container = container;
		this.temperatures = [1,2,3,4,5,6,7];
	}

	toString() {
		return 'Forcast (temperature = ' +this.temperatures.toString() + ', container = ' + this.container.toString() + ').';
	}

	print() {
		console.log(this.toString()); // remember 'this'!
	}

	show() {
		this.container.innerHTML="";

	    this.temperatures.forEach((temperature) => {
			// create paragraphs
			const paragraph = document.createElement('p');

			// set text
			paragraph.textContent = temperature.toString();

			// set color
			// https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
			// define classes in the css file
			if(temperature <= 17) {
				paragraph.classList.add('cold');
			} else if (temperature >= 23) {
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

whenDocumentLoaded( () => {
	const btn = document.getElementById('btn-part1');

	// Part 2: JS class
	const div_out2 = document.getElementById('weather-part2');
	const forecast2 = new Forecast(div_out2); // create the object

	forecast2.print();

	btn.addEventListener('click', () => {
		forecast2.reload();
	});
});

// Part 3 - fetch

const QUERY_LAUSANNE = 'http://api.weatherbit.io/v2.0/forecast/daily?city=Lausanne&days=7&key=ed330abe3f5a4104afd9a6ef10b707ca';

function weatherbitToTemperatures(data) {
	return data['data'].map(datum => datum["temp"]);
}

// Extends
class ForecastOnline extends Forecast {
	reload() {
		//this.temperatures = [2,3,4,5,6,7,8];
		//this.show();

		fetch(QUERY_LAUSANNE)
			.then((response) => {
				// convert the JSON format into a JS object
				return response.json(); 
			})
			.then((data) => {
				console.log('data',data);
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

	// // Part 3: weather API
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





// Part 4 - interactive

