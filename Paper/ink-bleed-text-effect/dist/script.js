let currentAppText = '';
let outputContainer = document.getElementById("textout");
let textWrite = new TimelineMax();

let fetchAppText = () => {
  currentAppText = document.getElementById("apptext").value;
};

let handleButtonClick = () => {
  fetchAppText();
  drawText();
};

let getRandomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

let drawText = () => {
  let chars = currentAppText.split('');
  outputContainer.innerHTML = '';
  textWrite.kill();
  chars.forEach((letter, idx) => {
    outputContainer.innerHTML += `<span id='letter-${idx}' class='letter'>${letter}</span>`;
  });
  chars.forEach((letter, idx) => {
    console.log(getRandomNumber(5, 20));
    textWrite.to(document.getElementById("letter-" + idx), 0.1, { opacity: 1 }).delay(getRandomNumber(0.1, 0.5));
    TweenMax.to(document.getElementById("letter-" + idx), 1, {
      color: "#536983",
      textShadow: `0px 0px 4px black, 0px 0px ${getRandomNumber(10, 30)}px #6885A5, 0px 0px ${getRandomNumber(5, 20)}px #6885A5` }).
    delay(0.2 * idx + 0.75);
  });
};

// kick the app off
fetchAppText();
drawText();