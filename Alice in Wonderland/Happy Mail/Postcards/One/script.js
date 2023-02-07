var buttonOpen = document.getElementById("button-open");
buttonOpen.addEventListener("click", function() {
  document.body.classList.toggle("opened");
})

document.getElementById("flip-card").addEventListener("click", function() {
  this.classList.toggle("flipped");
})

const wrapper = document.getElementById("wrapper");
const postcard = document.getElementById("postcard");
const buttonFlip = document.getElementById("button-flip");
buttonFlip.onclick = function() {
  wrapper.classList.toggle('flipping');
}
postcard.addEventListener("transitionend", () => {
  wrapper.classList.toggle('flipped');
});