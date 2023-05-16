


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

const TEST_TEMPERATURES = [13, 18, 21, 19, 26, 25, 16];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

//const MARGIN = { top: 10, right: 10, bottom: 10, left: 10 };


class ScatterPlot {
	constructor(svg_element_id, data) {
		this.data = data;
		this.svg = d3.select('#' + svg_element_id);

		console.log(this.svg);

		this.plot_area = this.svg.append('g')
			.attr('x', 10)
			.attr('y', 10);

		this.plot_area.append('rect')
			.classed('plot-background', true)
			.attr('width', 200)
			.attr('height', 100);

		const x_value_range = [d3.min(data, d => d.x), d3.max(data, d => d.x)];

		const y_value_range = [0, d3.max(data, d => d.y)];

		const pointX_to_svgX = d3.scaleLinear()
			.domain(x_value_range)
			.range([0, 200]);

		const pointY_to_svgY = d3.scaleLinear()
			.domain(y_value_range)
			.range([100, 0]);

		this.plot_area.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
				.attr("r", 1.5) // radius
				.attr("cx", d => pointX_to_svgX(d.x)) // position, rescaled
				.attr("cy", d => pointY_to_svgY(d.y))
				.classed('cold', d => d.y <= 17) // color classes
				.classed('warm', d => d.y >= 23);

		// Create a label for each point
		this.svg.append('g')
			.selectAll('text')
			.data(data)
			.enter()
				.append('text')
				.text( d => d.name )
				.attr('x', d => pointX_to_svgX(d.x))
				.attr('y', 105);

		// Create Y labels
		const label_ys = Array.from(Array(6), (elem, index) => 20 * index); // 0 20 40 ... 180
		this.svg.append('g')
			.selectAll('text')
			.data(label_ys)
			.enter()
				.append('text')
				.text( svg_y => pointY_to_svgY.invert(svg_y).toFixed(1) )
				.attr('x', -5)
				.attr('y', svg_y => svg_y + 1);
	}
}

whenDocumentLoaded(() => {

	let data = TEST_TEMPERATURES.map((value, index) => {
		return {'x': index, 'y': value, 'name': DAYS[index]};
	});

	console.log(data);

	let plot = new ScatterPlot('plot', data);
});

