const BPM = 120

// DRUM LOOP
const steps = document.querySelectorAll('.step')
const levelWrapper = document.querySelector('.levelWrapper')
const levels = document.querySelectorAll('.level')
const audioElements = document.querySelectorAll('audio')

let time = 0
let id
function start() {
  id = setInterval(function() {
    handleTick()
    time < 15 ? time++ : time = 0
  }, 60000 / BPM / 4)  
}

function pause() {
  clearInterval(id)
}

function handleTick() {
  const last = time > 0 ? time - 1 : 15
  steps[last].classList.remove('active')
  steps[time].classList.add('active')
  
  Array.from(steps[time].children)
    .filter(e => e.classList.contains('on'))
    .map(e => e.dataset.instrument)
    .forEach(play)
}

function play(instrument) { 
  const media = document.querySelector(
      `audio[data-instrument="${instrument}"]`
    )
  media.currentTime = 0
  media.play()
  
  const level = levelWrapper.querySelector('.' + instrument)
  level.classList.remove('active')
  setTimeout(function() {
    level.classList.add('active')
  },20)
}

levels.forEach(level => {
  level.addEventListener('transitionend', function() {
    this.classList.remove('active')
  })
})

function loadPattern(state) {
  if (!state) {
    return
  }
  steps.forEach((step, i) => {
    Array.from(step.children).forEach((pad, j) => {
      state[i][j] === 1
      ? pad.classList.add('on')
      : pad.classList.remove('on')
    })
  })
}

// CONTROLS
const drumPads = document.querySelectorAll('.drum-pads .pad')
const muteBtn = document.getElementById('mute')
const playPauseBtn = document.getElementById('playpause')
const saveBtn = document.getElementById('save')
const loadBtn = document.getElementById('load')
const resetBtn = document.getElementById('reset')

drumPads.forEach(pad => pad.addEventListener('click', function() {
    this.classList.toggle('on')
  })
)

muteBtn.addEventListener('click', function() {
  if (this.firstChild.classList.contains('fa-volume-up')) {
    this.classList.remove('pulse')
    this.firstChild.classList.replace('fa-volume-up', 'fa-volume-off')
    audioElements.forEach(audio => audio.muted = false)
  } else {
    this.classList.add('pulse')
    this.firstChild.classList.replace('fa-volume-off', 'fa-volume-up')
    audioElements.forEach(audio => audio.muted = true)
  }
})

playPauseBtn.addEventListener('click', function() {
  if (this.firstChild.classList.contains('fa-play')) {
    this.firstChild.classList.replace('fa-play', 'fa-pause')
    start()
  } else {
    this.firstChild.classList.replace('fa-pause', 'fa-play')
    pause()
  }
})

saveBtn.addEventListener('click', function() {
  const state = Array.from(steps).map(step => (
    Array.from(step.children).map(pad => (
      pad.classList.contains('on') ? 1 : 0
    ))
  ))
  localStorage.setItem('thepeted-drums', JSON.stringify(state))
})

loadBtn.addEventListener('click', function() {
  loadPattern(JSON.parse(localStorage.getItem('thepeted-drums')))
})

reset.addEventListener('click', function() {
  steps.forEach(step => {
    Array.from(step.children).forEach(pad => pad.classList.remove('on'))  
  })
})

const demo = [[0,0,1,0,0,1,0,0],[0,0,0,0,1,0,0,0],[0,0,0,1,0,0,0,0],[0,0,1,0,0,0,0,0],[0,1,0,0,0,1,1,0],[0,0,0,0,1,0,0,0],[0,0,0,1,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,1,0,1],[0,0,0,0,1,0,0,1],[0,0,0,1,0,0,0,0],[0,1,0,0,0,1,0,1],[0,0,1,0,0,1,1,0],[0,0,0,0,1,0,0,0],[1,0,0,1,0,1,0,1],[0,1,0,0,0,0,0,0]]

loadPattern(JSON.parse(localStorage.getItem('thepeted-drums')) || demo)
start()