function drawCircle(position, radius, color) {
  const circle = new PIXI.Graphics();
  circle
    .beginFill(color || 0x000000)
    .drawCircle(0, 0, radius || 7)
    .endFill();
  circle.interactive = true;
  circle.position.set(position.x, position.y);
  return circle;
}

class BezierCurve extends PIXI.Graphics {
  constructor(start, cp1, cp2, end, thikness, color) {
    super();
    this.points = { start, cp1, cp2, end };
    this.thikness = thikness || 5;
    this.color = color || 0x000000;
    this.draw();
  }

  updatePoint(name, value) {
    if (this.points.hasOwnProperty(name)) {
      this.points[name].x = value.x;
      this.points[name].y = value.y;
    }
    return this;
  }

  draw() {
    this.clear()
      .lineStyle(this.thikness, this.color)
      .moveTo(this.points.start.x, this.points.start.y)
      .bezierCurveTo(
        this.points.cp1.x,
        this.points.cp1.y,
        this.points.cp2.x,
        this.points.cp2.y,
        this.points.end.x,
        this.points.end.y
      );
  }
}

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xffffff,
  resolution: window.devicePixelRatio || 1
});
document.body.appendChild(app.view);

let isDragging = false;
let target = null;

let start = { x: 50, y: 50 };
let cp1 = { x: 100, y: 200 };
let cp2 = { x: 300, y: 200 };
let end = { x: 400, y: 50 };

const curve = new BezierCurve(start, cp1, cp2, end);

const startCircle = drawCircle(start, 7, 0xff0000);
const endCircle = drawCircle(end, 7, 0xff0000);
const cp1Circle = drawCircle(cp1, 7, 0x0000ff);
const cp2Circle = drawCircle(cp2, 7, 0x0000ff);

const mapCircle = new Map();
mapCircle.set(startCircle, "start");
mapCircle.set(cp1Circle, "cp1");
mapCircle.set(cp2Circle, "cp2");
mapCircle.set(endCircle, "end");

Array.from(mapCircle.keys()).forEach(circle => {
  circle.on("mousedown", () => {
    isDragging = true;
    target = circle;
  });

  circle.on("mouseup", () => {
    isDragging = false;
    target = null;
  });

  circle.on("mousemove", e => {
    if (isDragging && target) {
      target.position.set(e.data.global.x, e.data.global.y);
      curve.updatePoint(mapCircle.get(target), e.data.global).draw();
    }
  });
});

app.stage.addChild(curve, startCircle, cp1Circle, cp2Circle, endCircle);
