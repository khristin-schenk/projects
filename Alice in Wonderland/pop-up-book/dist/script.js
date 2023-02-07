const main = document.querySelector("main");
const handler = (event) => {
  if (event.target !== event.currentTarget) return;
  if (!event.pressure) return;
  const {offsetX, offsetY} = event;
  main.style.setProperty("--char-x", `${offsetX}px`);
  main.style.setProperty("--char-y", `${offsetY}px`);
}
main.onpointermove = handler;
main.onpointerdown = handler;