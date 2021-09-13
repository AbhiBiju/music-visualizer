let song;
let fft;
let particles = [];
let bob;
let billy;
let ele;
const file = document.getElementById("file-input");

function preload() {
  // song = loadSound("./assets/audio/good4u.mp4");
  // song = loadSound("./assets/audio/kygo.mp3");
  // song = loadSound("./assets/audio/sarah.mp4");
  song = loadSound("./assets/audio/giveon.mp3");
  img = loadImage("./assets/img/spiral.jpeg");
  img2 = loadImage("./assets/img/vig1.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  imageMode(CENTER);
  fft = new p5.FFT(0.8, 1024);
  img.filter(BLUR, 2);
  file.onchange = function () {
    const files = this.files; // FileList containing File objects selected by the user (DOM File API)
    song = loadSound(files[0]);
  };

  noLoop();
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  stroke(random(150, 360), random(150, 360), random(150, 360));
  strokeWeight(3);
  fill(0, 10, 60, 50);

  translate(width / 2, height / 2);

  fft.analyze();
  amp = fft.getEnergy(20, 200);

  let wave = fft.waveform().splice(0, fft.waveform().length);

  push();
  if (amp > 200) {
    rotate(random(-0.5, 0.5));
  }

  image(img, 0, 0, width, height);
  image(img2, 0, 0, width, height);
  pop();

  for (let t = -1; t <= 1; t += 2) {
    beginShape();
    for (let i = 0; i <= 180; i += 0.05) {
      let index = floor(map(i, 0, 280, 0, wave.length - 1));

      let r = map(wave[index], -1, 1, 150, 250);

      let x = r * sin(i) * t;
      let y = r * cos(i);
      vertex(x, y);
    }
    endShape();
    beginShape();
    for (let i = 0; i <= 180; i += 0.05) {
      let index = floor(map(i, 0, 280, 0, wave.length - 1));

      let r = map(wave[index], -1, 1, 50, 100);

      let x = r * sin(i) * t;
      let y = r * cos(i);
      vertex(x, y);
    }
    endShape();
  }

  var p = new Particle();
  var p2 = new Particle();
  var p3 = new Particle();
  particles.push(p, p2, p3);

  for (let i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].edges()) {
      particles[i].update(amp > 170);
      particles[i].show();
    } else {
      particles.splice(i, 1);
    }
  }
}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
    noLoop();
  } else {
    song.play();
    loop();
  }
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(50); // average of last two nums in r variable
    this.vel = createVector(0, 0);
    this.acc = this.pos.copy().mult(random(0.0001, 0.0001));

    this.w = random(1, 8);
    this.color = `hsla(${floor(random(0, 360))}, ${floor(random(50, 100))}%, ${floor(random(50, 100))}%, ${random(
      0,
      1
    )})`;
  }

  update(cond) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if (cond) {
      this.acc = this.pos.copy().mult(random(0.001, 0.0001));
      this.pos.add(this.vel);
    }
  }

  edges() {
    if (this.pos.x < -width / 2 || this.pos.x > width / 2 || this.pos.y < -height || this.pos.y > height) {
      return true;
    } else {
      return false;
    }
  }

  show() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.w);
  }
}
