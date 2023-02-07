class Sketch {
  constructor() {
    this.setupCanvas();
    this.setupEvents();

    this.initialize();
  }

  setupCanvas() {
    this.canvas = document.createElement("canvas");
    document.getElementsByTagName("body")[0].appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.canvas.style.display = "block";
    this.canvas.style.height = "100%";
    this.canvas.style.width = "100%";
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.zIndex = "-1";
    this.canvas.style.background = "#FFF";
  }

  setupEvents() {
    window.addEventListener("resize", this.onResize.bind(this));
    document.body.addEventListener("click", this.onClick.bind(this));
    document.body.addEventListener("mousemove", this.onMousemove.bind(this));
    document.body.addEventListener("touchmove", this.onTouchmove.bind(this));
  }

  onResize() {
    this.initialize();
  }

  onClick() {
    if (this.display) {
      this.display = false;
    } else {
      this.display = true;
    }
  }

  onMousemove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  onTouchmove(e) {
    const touches = e.touches[0];

    this.mouseX = touches.clientX;
    this.mouseY = touches.clientY;
  }

  initialize() {
    if (this.id) {
      cancelAnimationFrame(this.id);
    }

    this.display = true;

    this.width = this.canvas.width = Math.floor(window.innerWidth);
    this.height = this.canvas.height = Math.floor(window.innerHeight);

    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;

    this.shapes = [];
    this.step = 5;

    for (let x = -this.width; x <= this.width; x += this.step) {
      const tmp = {
        x: x,
        y: 0,
        r: (2.0 - Math.abs(x) / this.width) * 0.8
      };

      this.shapes.push(tmp);
    }

    this.draw(0);
  }

  draw(t) {
    t *= 0.1;

    this.ctx.save();
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.translate(this.width / 2, 0);

    if (this.display) {
      for (let i = 0; i < this.shapes.length; i++) {
        const s = this.shapes[i];
        this.ctx.beginPath();
        this.ctx.moveTo(s.x * s.r, s.y);
        this.ctx.lineTo(s.x * s.r - this.step * 10, this.height);
        this.ctx.stroke();
      }
    }

    this.ctx.restore();

    this.ctx.save();
    this.ctx.translate(this.mouseX, this.mouseY);
    this.ctx.lineWidth = this.step;
    for (let i = -this.width / 4; i <= this.width / 4; i += this.step + 1) {
      this.ctx.beginPath();
      this.ctx.moveTo(i, -this.height / 4);
      this.ctx.lineTo(i, this.height / 4);
      this.ctx.stroke();
    }
    this.ctx.restore();

    this.id = requestAnimationFrame(this.draw.bind(this));
  }
}

(function () {
  window.addEventListener("DOMContentLoaded", () => {
    console.clear();

    new Sketch();
  });
})();