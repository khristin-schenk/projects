const FLAKE_BOX = document.querySelector('#flake_box'),
      SVG = FLAKE_BOX.querySelector('svg'),
      FLAKE = document.querySelector('.flake'),
      POINT_SIZE = 10

var points = [],
    random = false,
    x,
    y

function addPoint(e) {
  if(random) {
    x = Math.floor(Math.random()*16) * 10 + 140
    y = Math.floor(Math.random()*15) * 20
  } else {
    x = e.clientX
    y = e.clientY
  }  

  points.push(x+','+y)

  //add new point
  var p = document.createElement('div')
  p.className = 'point'
  if(points.length == 1) {
    p.className = 'point start'
    p.onclick = function() {
      // set path to polygon
      var ps = points.join(' ')
      SVG.innerHTML += `<polygon points="${ps}" stroke="transparent" fill="var(--bg-color)" stroke-width="0" />`

      // remove points and path
      setTimeout(function(){
        var old_points = document.querySelectorAll('.point'),
            path = document.querySelector('path')
        old_points.forEach(function(elm){ elm.remove() })
        points = []
        path.remove()

        // createSnowflake()
      },100)        
    }
    SVG.innerHTML += `<path d="M0 0" fill="none" stroke="#aaa" stroke-width="2"/>`
  }
  p.style.left = x - (POINT_SIZE * .5) + 'px'
  p.style.top = y - (POINT_SIZE * .5) + 'px'
  FLAKE_BOX.appendChild(p)

  // ADD TO PATH
  if(points.length > 1) {
    var ps = points.join(' '),
        path = document.querySelector('path')
    // console.log(ps)
    path.setAttribute('d', `M${ps}`)
  }
}
FLAKE_BOX.addEventListener('click', addPoint)

function createSnowflake() {
  FLAKE.classList.add('newFlake')
  FLAKE.onanimationend = function() {
    FLAKE.classList.remove('newFlake')
  }
  setTimeout(function(){
    FLAKE.innerHTML = ''
    for(var i=0;i<12;i++) {
      var pattern = document.querySelector('#flake_box'),
          copy = pattern.cloneNode(true)
      copy.id = ''
      copy.className = 'sixth'

      FLAKE.appendChild(copy)
    }  
  },1000)  
}

function resetSnowflake() {
  var polys = document.querySelectorAll('#flake_box polygon'),
      copy = FLAKE.cloneNode(true)
  
  gallery.prepend(copy)
  
  polys.forEach(function(elm){
    elm.remove()
  })
  
  FLAKE.innerHTML = 
    `<div class='sixth'></div>
  <div class='sixth'></div>
  <div class='sixth'></div>
  <div class='sixth'></div>
  <div class='sixth'></div>
  <div class='sixth'></div>
  <div class='sixth'></div>
  <div class='sixth'></div>
  <div class='sixth'></div>
  <div class='sixth'></div>
  <div class='sixth'></div>
  <div class='sixth'></div>`
}

function randomSnowflake() {
  random = true
  for(var i=0;i<10;i++) {
    setTimeout(addPoint, i * 100)
  }    
  setTimeout(function(){    
    document.querySelector('.start').click()
    createSnowflake() 
    random = false
  }, 100 * 10)
}

function showGallery() {
  if(gallery.style.opacity == 1) {
    gallery.style.opacity = 0
    gallery.style.pointerEvents = 'none'
  } else {
    gallery.style.opacity = 1
    gallery.style.pointerEvents = 'all'
  }
}

gallery.addEventListener('click', showGallery)