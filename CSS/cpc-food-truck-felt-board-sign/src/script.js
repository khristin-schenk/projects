import Splitting from "https://cdn.skypack.dev/splitting";

Splitting().forEach((s) => {
	// For every character in our sentences
	s.chars.forEach((char) => {
		// Assign a random number to an attached CSS variable
		char.style.setProperty("--random", Math.random());
	});
});
