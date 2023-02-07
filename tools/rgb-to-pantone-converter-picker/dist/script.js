fetch(
  "https://raw.githubusercontent.com/ophello/RGB2Pantone/main/solid_coated.json"
)
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    var colorCount = 6;
    $(function () {
      updateColors(data, colorCount);

      const boxes = $("#colorMatches");
      $(".colorCount").on("input", function () {
        colorCount = Number(this.value);
        while (boxes.children().length < colorCount) {
          boxes.append(
            '<div class="colorSwatch"><span class="type"></span></div>'
          );
          updateColors(data, colorCount);
        }
        while (boxes.children().length > colorCount) {
          $(".colorSwatch:last-child").remove();
          colorCount = Number(this.value);
        }
      });

      $(".rgb-slider").on("input change", function () {
        $(this).siblings(".rgb").val($(this).val());
        updateColors(data, colorCount);
      });

      $(".rgb").on("input change", function () {
        $(this).siblings(".rgb-slider").val($(this).val());
        updateColors(data, colorCount);
      });

      $('input[type="checkbox"]').change(function () {
        updateColors(data, colorCount);
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });

function updateColors(data, colorCount) {
  $(".colorSwatch").each(function (i) {
    $(this).css(
      "background",
      "#" + rgb2hex(lab2rgb(colorDistCalc(rgbUpdate(), data, colorCount)[i][2]))
    );
  });
  $(".colorSwatch > span").each(function (i) {
    $(this).text(colorDistCalc(rgbUpdate(), data, colorCount)[i][1]);
  });
  $(".colorSwatch:first-child > span").append(
    " - closest match"
  );
  if (colorBrightness(rgbUpdate()) < 0.4) {
    $(".type").css({ color: "#fff" });
  } else {
    $(".type").css({ color: "#000" });
  }
}

var colorDistCalc = function (rgbVal, data, colorCount) {
  var chPastel = $("#pastels").is(":checked");
  var chNeon = $("#neons").is(":checked");
  var chSkin = $("#skin").is(":checked");
  var chXGC = $("#xgc").is(":checked");
  var distColorList = [];
  $.each(data, function (name, color) {
    var colorDist = deltaE(rgbVal, lab2rgb(color));
    var pastelStrFound = name.includes("PASTEL");
    var neonStrFound = name.includes("NEON");
    var skinStrFound = name.includes("SP");
    var xgcStrFound = name.includes("XGC");
    if (
      (!pastelStrFound && !neonStrFound && !skinStrFound && !xgcStrFound) ||
      (chPastel && pastelStrFound) ||
      (chNeon && neonStrFound) ||
      (chSkin && skinStrFound) ||
      (chXGC && xgcStrFound)
    ) {
      distColorList.push([colorDist, name, color]);
    }
  });
  var closestColors = distColorList
    .sort((a, b) => a[0] - b[0])
    .slice(0, colorCount);
  //console.log(closestColors);
  return closestColors;
};

var rgbUpdate = function () {
  var rgbVal = [];
  $(".rgb").each(function () {
    rgbVal.push($(this).val());
  });
  $("#hex").val(rgb2hex(rgbVal).toUpperCase());
  $("#colorPicker").css("background", "#" + rgb2hex(rgbVal));
  return rgbVal;
};

function rgb2hex(rgb) {
  return (
    ("0" + parseInt(rgb[0], 10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2)
  );
}

function colorBrightness(rgb) {
  let r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255;
  return Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
}

function hex2rgb(hex) {
  hex = hex.match(/../g);
  return [parseInt(hex[0], 16), parseInt(hex[1], 16), parseInt(hex[2], 16)];
}

function deltaE(rgbA, rgbB) {
  let labA = rgb2lab(rgbA);
  let labB = rgb2lab(rgbB);
  let deltaL = labA[0] - labB[0];
  let deltaA = labA[1] - labB[1];
  let deltaB = labA[2] - labB[2];
  let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
  let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
  let deltaC = c1 - c2;
  let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
  let sc = 1.0 + 0.045 * c1;
  let sh = 1.0 + 0.015 * c1;
  let deltaLKlsl = deltaL / 1.0;
  let deltaCkcsc = deltaC / sc;
  let deltaHkhsh = deltaH / sh;
  let i =
    deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
  return i < 0 ? 0 : Math.sqrt(i);
}

function rgb2lab(rgb) {
  let r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255,
    x,
    y,
    z;
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

function lab2rgb(lab) {
  var y = (lab[0] + 16) / 116,
    x = lab[1] / 500 + y,
    z = y - lab[2] / 200,
    r,
    g,
    b;

  x = 0.95047 * (x * x * x > 0.008856 ? x * x * x : (x - 16 / 116) / 7.787);
  y = 1.0 * (y * y * y > 0.008856 ? y * y * y : (y - 16 / 116) / 7.787);
  z = 1.08883 * (z * z * z > 0.008856 ? z * z * z : (z - 16 / 116) / 7.787);

  r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  b = x * 0.0557 + y * -0.204 + z * 1.057;

  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

  return [
    Math.max(0, Math.min(1, r)) * 255,
    Math.max(0, Math.min(1, g)) * 255,
    Math.max(0, Math.min(1, b)) * 255
  ];
}