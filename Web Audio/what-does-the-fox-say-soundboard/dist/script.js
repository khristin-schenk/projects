var t, audio = document.getElementsByTagName("audio")[0];

function playPortion(start){
  audio.currentTime=start;
  audio.play();
  clearInterval(t);
  t=setInterval(function(){
    audio.pause();
  },5600);
}
$('.btn1').click(function(){
  playPortion(42);
});
$('.btn2').click(function(){
  playPortion(49.311641);
});
$('.btn3').click(function(){
  playPortion(56.917427);
});
$('.btn4').click(function(){
  playPortion(64.302131);
});
$('.btn5').click(function(){
  playPortion(116.891206);
});
$('.btn6').click(function(){
  playPortion(125.177395);
});
$('.btn7').click(function(){
  playPortion(131.361057);
});
$('.btn8').click(function(){
  playPortion(138.667448);
});
$('.btn9').click(function(){
  playPortion(193);
});