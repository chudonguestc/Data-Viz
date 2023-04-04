
/*
# JavaScript basics

In this exercise we will practice programming with (JavaScript)[https://developer.mozilla.org/en-US/docs/Web/JavaScript],
which we will need to create interactive visualizations in the browser.
Today we will focus on processing data in JS, the functions used to plot the data are provided.


We would like to practice the functional style of programming, because it fits well with the d3.js library which we are going to use for the visualizations.
This means that instead of `for` or `while` loops to iterate over arrays, we would use
[`forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach),
[`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),
[`reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) and
[`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- if you haven't seen them before, please take a look at the linked documentation which contains intuitive examples.
*/

/*
## Functions and iteration

### isEven
Let's try a basic function `isEven` that will check if an integer is divisible by 2.

Then apply it over an array of integers to see the results:

* Apply `isEven` to each element of `[1, 2, 3, 4, 5]` using [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

* Choose even numbers from `1...5` by using [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).

*/

function isEven(value) {
	return value % 2 === 0;
}

console.log('isEven results:', [1, 2, 3, 4, 5].map(isEven));
console.log('isEven filtering:', [1, 2, 3, 4, 5].filter(isEven));


/*
### multiply
Now, imagine, you do not know how many numbers in your array. 
In JS, there is a way to create functions with arbitrary number of parameters. 
Let's implement a function `multiply` that computes a product of all numbers specified as parameters. 
For example, `multiply(1,2,3,4,5)` should return `120`. 
*/
function multiply(...numbers) {
  let product = 1;
  for (const number of numbers){
    product *= number;
  }
  return product;
};

//alternative implementation
function multiply2 (...numbers) {
  return numbers.reduce((a, b) => a * b, 1);
};


console.log(multiply(1,2,3,4,5))
console.log(multiply2(1,2,3,4,5))


/*
## Closures

In JS, functions are treated as objects.
When a function is created, it has access to all currently visible variables -
the newly created function and these variables form a closure.
The details are in the [documentation about closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures).
*/

/*
### divisibleBy
Let's generalize the above example, and create the function `divisibleBy` which:

* takes an argument `divisor`
* returns a function `f` such that `f(x)` returns `true` when `x` is divisible by `divisor`

The [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) syntax is a convenient way to construct functions.

Now we have an alternative solution to the previous task `const isEvenNew = divisibleBy(2)`.
Try filtering `[0, 1, 2, 3, 4, 5, 6]` by `divisibleBy(3)`.
*/

function divisibleBy(divisor) {
	return (divident) => divident % divisor === 0;
}

const div3 = divisibleBy(3);
console.log('divisibleBy3', [0, 1, 2, 3, 4, 5, 6].filter(div3));


/*
### increment
To implement:
*/
function increment(init = 0) {
	let idx = init;
	return (stepSize = 1) => {
		idx = idx + stepSize;
		return idx;
	}
}

inc = increment(init = 10);

console.log(inc(stepSize = 2));
console.log(inc(2));
console.log(increment(10)(1));

/*
### colorCycle

In plots, we often want to apply different colors, for example to distinguish between lines illustrating different quantities.
When making a general mechanism, we can't predict how many colored objects there are going to be, so we will
make the colors repeat in a cycle.

Create a function `colorCycle` such that

* it takes one argument: an array of colors,
* the default value of the the color array is `COLOR_CYCLE_DEFAULT`
* it returns a function which repeats the colors in the cycle, for example
	```
	cc = colorCycle(['red', 'green']);
	console.log([cc(), cc(), cc(), cc()]); // ['red', 'green', 'red', 'green']
	```

Now create a cycle `my_cc` with your chosen colors and run `showColorCycle(my_cc)` to apply the colors to a demo plot on the website [`index.html`](exercise/index.html).

*/

// Color cycle

const COLOR_CYCLE_DEFAULT = ['red', 'green', 'magenta', 'blue'];

function colorCycle(colors=COLOR_CYCLE_DEFAULT) {
	let idx = -1;
	return () => {
		idx = (idx + 1) % colors.length;
		return colors[idx];
	}
}

const cc_r_g = colorCycle(['red', 'green']);
// This is a way to run 10 times, see the task about `range` below.
console.log('cycle red/green', Array.from(Array(10), cc_r_g));

const cc1 = colorCycle();
const cc2 = colorCycle();
console.log('cycle default', [cc1(), cc1(), cc2(), cc2(), cc1()]);

const my_cc = colorCycle(['purple', 'rgb(20, 230, 220)', 'rgb(10, 230, 20)', 'rgb(230, 20, 10)']);
showColorCycle(my_cc);

/*
## Range

In the above task, we were writing the sequences `[1, 2, ..., N]` explicitly, now let's automate it.

* Create a function `range(N)` which constructs a range of integers [0, 1, ..., N-1].

	For an additional challenge, you can try using a functional approach, that is without a `for` or `while` loop.

	We could try creating an empty array of size `N`: `Array(N)`. However, the elements of the array are not created and `forEach` or `map` does nothing.
	Try it yourself: `Array(10).forEach(console.log)`

	[Array.from](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) allows us to create an array from another sequence -
	for example convert a string to an array like we did with letter counting.
	`Array.from(Array(10))` actually creates the elements and we could iterate over them (the elements are `undefined`).

	Additionally, we can pass a function as the second argument - this function will be applied on every element of the newly created array.
	`Array.from(seq, f)` is equivalent to `Array.from(seq).map(f)` but more efficient because it does not create the intermediate array.
	Remember that the mapping function receives as arguments both the current element and the current index.

* Let's find the integers from 0 to 100 which are divisible by 13.
	Create a range `[0, ..., 99]` and filter it by divisibility by 13

*/

function range(count) {
	return Array.from(Array(count), (elem, index) => index);
}

console.log('range(10)', range(10));
// Expeceted result:
// [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

console.log('range(100) -> divisibleBy 13', range(100).filter(divisibleBy(13)));


/*

* Implement a function `randomInRange(min_val=0, max_val=100)` which returns a random float value between `min_val` and `max_val`.

* Implement a function `randomArray(N, min_val=0, max_val=100)` which generates an array of `N` random values between `min_val` and `max_val`.

*/

function randomInRange(min_val=0, max_val=100) {
	return Math.random() * (max_val - min_val) + min_val;
}

function randomArray(count, min_val=0, max_val=100) {
	return Array.from(Array(count), () => randomInRange(min_val, max_val));
}

console.log('randomArray', randomArray(5, 0, 10));

/*
## Counting

* Create a function `countOccurrences(string)` which counts the number of occurrences of each letter in a string.
	For example `countOccurrences("hello")` yields `{'h': 1, 'e': 1, 'l': 2, 'o': 1 }`.
	A string is not an array and it does not have the `forEach` or `map` methods, so to use them, convert a string to an array with [Array.from](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from), for example `let a = Array.from('a string!');`.

	To store the counts, use an [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
	which is key-value container with strings as keys (in our case, the key will be the letter).

	To perform functional-style iteration over Objects, use
	[`Object.keys`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys),
	[`Object.values`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values) and
	[`Object.entries`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries).
	Please remember that they have to be called `Object.entries(obj)` instead of `obj.entries()`.
*/

function countOccurrences(sequence) {
	counts = {};
	Array.from(sequence).forEach((elem) => {
		counts[elem] = (counts[elem] || 0) + 1;
	});
	return counts;
}

console.log(countOccurrences('hello'));
// Expected result:
// countOccurrences("hello") ---> {'h': 1, 'e': 1, 'l': 2, 'o': 1 }

/*
* Create the function `normalizeCounts` which takes the character counts outputted by `countOccurrences`,
	and calculates normalized counts - that is divided by the total sum.
	Please calculate the sum using [`reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce).
	For example:
	`normalizeCounts({'h': 1, 'e': 1, 'l': 2, 'o': 1})` yields `{'h': 0.2, 'e': 0.2, 'l': 0.4, 'o': 0.2}`

* Create `countOccurrencesNormalized` - a function which given a string, first applies `countOccurrences` and then normalizes the counts using `normalizeCounts`.

* Visualize the results by calling `setCharacterCountingFunction(countOccurrencesNormalized);` - look at `index.html`, now you should be able to count the distribution
of characters in any text you input. You can pass a `colorCycle` with your colors as the second argument to color the bars.
*/
function normalizeCounts(counts) {
	// Calculate the sum of all entries
	const count_sum = Object.values(counts).reduce((sum, c) => sum + c);

	// Divide all entries by the sum
	let counts_normalized = {};
	Object.entries(counts).forEach((key_and_value) => {
		counts_normalized[key_and_value[0]] = key_and_value[1] / count_sum;
	});
	return counts_normalized;
}

console.log(normalizeCounts(countOccurrences('hello')));
// Expected result:
// normalizeCounts({'h': 1, 'e': 1, 'l': 2, 'o': 1 }) ---> {'h': 0.2, 'e': 0.2, 'l': 0.4, 'o': 0.2 }

const countOccurrencesNormalized = (seq) => normalizeCounts(countOccurrences(seq));

setCharacterCountingFunction(
	countOccurrencesNormalized,
	colorCycle(['rgb(240, 50, 10)', 'rgb(240, 150, 40)']),
);


/*
## Throwing balls

We will simulate a ball thrown at angle $b$ with velocity $v_0$. The initial velocity $(v_x, v_y)$ is:

$$v_x = v_0 cos(b)$$
$$v_y = v_0 sin(b)$$

The position of the ball at time $t$ is given by:

$$x(t) = v_x * t$$
$$y(t) = v_y * t + (a * t^2 * 0.5)$$

where $a$ is the acceleration caused by gravity, usually -9.81 $m/s^2$.

Implement a function `simulateBall(v0, angle, num_steps, dt, g)` such that:

* `v0` is the magnitude of the initial velocity

* 'angle' is the inclination angle in degrees, multiply by `DEG_TO_RAD = Math.PI / 180.` to get radians for the trigonometric functions,

* `num_steps` is the number of steps of the simulation, the default value should be 256,

* `dt` is the time that advances between steps, default value 0.05,

* `g` is the acceleration, default value -9.81,

* it returns an array of ball positions at each time step,

* each position is given as a array `[x, y]`,

Use the `range` function to create the array of time points, then `map` them to the `[x, y]` values given by the equations above.

* We want to finish the plot when the ball hits the ground (y=0), so please filter the point array to remove points with y below 0.

* Visualize the ball trajectories using `plotBall` (the 2nd optional argument is the line color):

```
const ball_cc = colorCycle(['hsl(160, 100%, 64%)', 'hsl(200, 100%, 64%)', 'hsl(240, 100%, 64%)', 'hsl(120, 100%, 64%)', 'hsl(80, 100%, 64%)']);
plotBall(simulateBall(40, 60), ball_cc());
plotBall(simulateBall(40, 30), ball_cc());
plotBall(simulateBall(40, 45), ball_cc());
```

* Use `randomArray` to create 20 random angles between 0 deg and 90 deg, then plot the ball trajectories for each angle.

*/

const DEG_TO_RAD = Math.PI / 180.;

function simulateBall(v0, angle, num_steps=256, dt=0.05, g=-9.81) {
	const angle_rad = DEG_TO_RAD * angle;
	const vx = v0 * Math.cos(angle_rad);
	const vy = v0 * Math.sin(angle_rad);

	const trajectory = range(num_steps).map((idx) => {
		const t = idx * dt;
		return [
			vx * t,
			vy * t + g * t * t * 0.5
		];
	});

	return trajectory.filter((xy) => xy[1] >= 0);
}

console.log('simBall', simulateBall(10, 60));

const ball_cc = colorCycle(['hsl(160, 100%, 64%)', 'hsl(200, 100%, 64%)', 'hsl(240, 100%, 64%)', 'hsl(120, 100%, 64%)', 'hsl(80, 100%, 64%)']);
plotBall(simulateBall(40, 60), ball_cc());
plotBall(simulateBall(40, 30), ball_cc());
plotBall(simulateBall(40, 45), ball_cc());

randomArray(20, 0, 90).forEach((angle) => {
	plotBall(simulateBall(40, angle), ball_cc());
});
