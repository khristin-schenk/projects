function rgbToHsl(r, g, b){
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var l = (max + min) / 2;
  var d = max - min;

  s = (d == 0) ? 0 : d / (1 - Math.abs(2*l-1));

  if(d == 0) { 
    h = 0;
  }
  else {
    switch(max){
      case r: h = 60 * (((g-b)/d)%6); break;
      case g: h = 60 * (((b-r)/d) + 2); break;
      case b: h = 60 * ((r-g)/d + 4); break;
    }
  }

  h = h;
  s = s * 100;
  l = l * 100;

  return [h, s, l];
}

function hexToRgb(hex) {
  hex = stripHash(hex);
  var r = parseInt(hex.substr(0, 2), 16);
  var g = parseInt(hex.substr(2, 2), 16);
  var b = parseInt(hex.substr(4, 2), 16);
  return [r, g, b];
}

function hexToHSL(hex) {
  var rgb = hexToRgb(hex); 
  return rgbToHsl(rgb[0], rgb[1], rgb[2]);
}

function stripHash(code) {
  return code.charAt(0)=='#' ? code.substring(1) : code;
}

var vue = new Vue({
  el: '#app',
  data: {
    baseColor: '87C540',
    targetColor: 'FFC248',
    hue: '',
    saturation: '',
    brightness: ''
  },
  computed: {
    active: function() {
      if(this.baseColor.match(/^\#?([0-9a-fA-F]{6})$/g) && this.targetColor.match(/^\#?([0-9a-fA-F]{6})$/g)) {
        return true;
      } 
      return false;
    },
    computedBaseColor: function() {
      return stripHash(this.baseColor);
    },
    computedTargetColor: function() {
      return stripHash(this.targetColor);
    }
  },
  methods: {
    generate: function() {
      var baseHSL   = hexToHSL(this.baseColor);
      var targetHSL = hexToHSL(this.targetColor);
      this.hue = Math.round((targetHSL[0] - baseHSL[0]) * 100) / 100;
      this.saturation = 100 + Math.round((targetHSL[1] - baseHSL[1]) * 100) / 100;
      this.brightness = 100 + Math.round((targetHSL[2] - baseHSL[2]) * 100) / 100;
    }
  }
});