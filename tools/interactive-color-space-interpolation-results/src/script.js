import Color from 'https://colorjs.io/dist/color.js'

const state = {
  quantize: quantize.value,
  showInterpolations: showInterpolations.checked,
  color: [color1.value, color2.value]
}

function updateUI() {
  const color1 = new Color(state.color[0])
  const color2 = new Color(state.color[1])
  
//   todo: linear gradients between steps?
  
  const spaces = ['srgb', 'srgb-linear', 'rec2020', 'p3', 'a98rgb', 'prophoto', 'xyz', 'lab', 'oklab', 'hsl', 'hwb', 'lch', 'oklch']
  const cylindrical = ['hsl', 'hwb', 'lch', 'oklch']
  const interpolations = ['shorter', 'longer', 'increasing', 'decreasing']
  
  let mix = null
  let rows = ''

  for (let space of spaces) {
    rows += `
        <section ${cylindrical.includes(space) && state.showInterpolations && `class="cylindrical"`}>
          <h3>${space}</h3>`
          
    if (cylindrical.includes(space) && state.showInterpolations) {
      for (let hue of interpolations) {
        mix = color1.steps(color2, {
          hue,
          space,
          steps: state.quantize,
          outputSpace: 'srgb',
        })

        rows += `
          <p>${hue}</p>
          <div class="ramp">
            ${mix.reduce((acc, item) => {
              return acc += `<div class="swatch" style="background: ${item}"></div>`
            }, '')}
          </div>
        `
      }
    }
    else {
      mix = color1.steps(color2, {
        space,
        steps: state.quantize,
        outputSpace: 'srgb',
      })
      
      rows += `
        <div class="ramp">
          ${mix.reduce((acc, item) => {
            return acc += `<div class="swatch" style="background: ${item}"></div>`
          }, '')}
        </div>
      `
    }
    
    rows += `</section>`
  }
  app.innerHTML = rows
}

color1.oninput = e => {
  state.color[0] = e.target.value
  updateUI()
}

color2.oninput = e => {
  state.color[1] = e.target.value
  updateUI()
}

quantize.oninput = e => {
  state.quantize = parseInt(e.target.value)
  updateUI()
}

showInterpolations.onchange = e => {
  state.showInterpolations = e.target.checked
  updateUI()
}

updateUI()