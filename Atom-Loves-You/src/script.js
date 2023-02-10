// blotter.js
var text = new Blotter.Text("A.tom L.oves Y.ou", {
  family: "'Hobeaux Demo', 'GT America', 'Druk Wide', 'Untitled Sans', 'Helvetica', sans-serif",
  size: 50,
  weight: 800,
  fill: "#FFD1D7",
  paddingTop: 40,
  paddingBottom: 340,
  paddingLeft: 0,
  paddingRight: 0
  
});

var material = new Blotter.LiquidDistortMaterial();
    material.uniforms.uSpeed.value = 0.2;
    material.uniforms.uSeed.value = -140;
    material.uniforms.uVolatility.value = .75;

var blotter = new Blotter(material, {
  texts: text,
});

var elem = document.getElementById("scanned-text");

var scope = blotter.forText(text);
scope.appendTo(elem);