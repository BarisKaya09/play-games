export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;

const BOARD_X_COUNT = 15;
const BOARD_Y_COUNT = 8;
const BOARD_SQUARE_WIDTH = CANVAS_WIDTH / BOARD_X_COUNT;
const BOARD_SQUARE_HEIGHT = CANVAS_HEIGHT / BOARD_Y_COUNT;

const SNAKE_COLOR = "#fe9a00";
const SNAKE_SIZE = { width: BOARD_SQUARE_WIDTH, height: BOARD_SQUARE_HEIGHT };
let SNAKE_SPEED = 300; // 500 => 500ms | 400 => 400ms | 300 => 300ms | 200 => 200ms | ...
export const MAX_SNAKE_HP = 4;

const APPLE_SIZE = { width: BOARD_SQUARE_WIDTH * 0.8, height: BOARD_SQUARE_HEIGHT * 0.8 };
let MAX_APPLE_COUNT = 3;

const WALL_SIZE = { width: BOARD_SQUARE_WIDTH, height: BOARD_SQUARE_HEIGHT };
let MAX_WALL_COUNT = 10;
let WALL_SET_COUNT_PER_MINUTE = 3;

const HEART_SIZE = { width: BOARD_SQUARE_WIDTH * 0.8, height: BOARD_SQUARE_HEIGHT * 0.8 };

//TODO: Bunun BOARD_X_COUNT'a göre dinamik bir hale gelmesi lazım.
// TODO: çünkü BOARD_X_COUNT 29 dan büyük olursa hata olur
const BOARD_X_LOCATIONS: Array<string> = [
  "A",
  "B",
  "C",
  "Ç",
  "D",
  "E",
  "F",
  "G",
  "Ğ",
  "H",
  "I",
  "İ",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "Ö",
  "P",
  "R",
  "S",
  "Ş",
  "T",
  "U",
  "Ü",
  "V",
  "Y",
  "Z",
];

const findNextDirections = (currentLocation: string, direction: Direction = "down", grids: Array<GridT>): Array<GridT> => {
  if (direction == "left") {
    const currentXLocationIndex = BOARD_X_LOCATIONS.findIndex((x) => x == currentLocation[0]);
    const leftLocations = BOARD_X_LOCATIONS.filter((_, i) => i < currentXLocationIndex);

    let filteredGrids: Array<GridT> = [];
    for (const grid of grids) {
      for (const location of leftLocations) {
        if (grid.location[0] == location)
          filteredGrids.push(grids.find((grid) => grid.location == [location, currentLocation[2]].join("-")) as GridT);
      }
    }

    return filteredGrids;
  } else if (direction == "right") {
    const currentXLocationIndex = BOARD_X_LOCATIONS.findIndex((x) => x == currentLocation[0]);
    const rightLocations = BOARD_X_LOCATIONS.filter((_, i) => i > currentXLocationIndex);

    let filteredGrids: Array<GridT> = [];
    for (const grid of grids) {
      for (const location of rightLocations) {
        if (grid.location[0] == location)
          filteredGrids.push(grids.find((grid) => grid.location == [location, currentLocation[2]].join("-")) as GridT);
      }
    }

    return filteredGrids;
  } else if (direction == "up") {
    const rightLocations = BOARD_Y_LOCATIONS.filter((y) => y < parseInt(currentLocation[2]));

    let filteredGrids: Array<GridT> = [];
    for (const grid of grids) {
      for (const location of rightLocations) {
        if (parseInt(grid.location[2]) == location)
          filteredGrids.push(grids.find((grid) => grid.location == [currentLocation[0], location].join("-")) as GridT);
      }
    }

    return filteredGrids;
  } else if (direction == "down") {
    const rightLocations = BOARD_Y_LOCATIONS.filter((y) => y > parseInt(currentLocation[2]));

    let filteredGrids: Array<GridT> = [];
    for (const grid of grids) {
      for (const location of rightLocations) {
        if (parseInt(grid.location[2]) == location)
          filteredGrids.push(grids.find((grid) => grid.location == [currentLocation[0], location].join("-")) as GridT);
      }
    }

    return filteredGrids;
  }

  return [];
};

const BOARD_Y_LOCATIONS = Array<string>(BOARD_Y_COUNT)
  .fill("", 0, BOARD_Y_COUNT)
  .map((_, i) => i);

const getBoardLocation = (xIndex: number, yIndex: number): string => {
  return [BOARD_X_LOCATIONS[xIndex], BOARD_Y_LOCATIONS[yIndex]].join("-");
};

export type Listener = (self: SnakeGame) => void;
export class SnakeGame {
  private ctx: CanvasRenderingContext2D;
  public snake: Snake;
  public state: State;
  private lastTime: number = 0;
  private listeners: Array<Listener> = [];

  constructor() {
    const canvas: HTMLCanvasElement = document.getElementById("snake-game-canvas") as HTMLCanvasElement;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    this.state = new State();
    this.snake = new Snake();
  }

  public start() {
    this.update();
  }

  private update = async () => {
    this.notify();
    if (this.state.isDied()) return;
    if (this.state.getIsStarted()) {
      this.drawGrids();
      this.drawApples();
      this.drawWalls();
      this.drawHeart();
      this.collisionSnakeWall();

      this.snake.eatApple(this.state, this.state.getApples());
      this.snake.eatHeart(this.state);

      if (Date.now() - this.lastTime > SNAKE_SPEED) {
        this.snake.movement(this.ctx, this.state.getGrids());
        this.state.setSnakePos(this.snake.getPos());
        this.lastTime = Date.now();
      }

      this.state.setPlayTime();
    }

    requestAnimationFrame(this.update);
  };

  public subscribe(listener: Listener) {
    this.listeners.push(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l(this));
  }

  private drawGrids() {
    this.ctx.strokeStyle = "gray";
    let lastFillYPos = 0;
    for (let i = 0; i < BOARD_Y_COUNT; i++) {
      let lastFillXPos = 0;
      for (let j = 0; j < BOARD_X_COUNT; j++) {
        this.ctx.strokeRect(lastFillXPos, lastFillYPos, BOARD_SQUARE_WIDTH, BOARD_SQUARE_HEIGHT);
        lastFillXPos += BOARD_SQUARE_WIDTH;
      }
      lastFillYPos += BOARD_SQUARE_HEIGHT;
    }
  }

  private drawApples() {
    for (const apple of this.state.getApples()) {
      //* elma gridin 80% i kadar yüksekliğe ve genişliğe eşit olduğunda "+ 9" çalışıyor ama 80% dışında ortalı olmuyor. bunun "+ 9" değil dinamik olması gerekiyor.
      const image = new Image();
      image.onload = () => {
        this.ctx.drawImage(image, apple.x + 9, apple.y + 9, APPLE_SIZE.width, APPLE_SIZE.height);
      };
      image.src = "/src/assets/apple.png";
    }
  }

  private drawHeart() {
    if (this.state.getHearts().length == 0) return;
    for (const heart of this.state.getHearts()) {
      const image = new Image();
      image.onload = () => {
        this.ctx.drawImage(image, heart.x + 9, heart.y + 9, HEART_SIZE.width, HEART_SIZE.height);
      };
      image.src = "/src/assets/heart.png";
    }
  }

  private drawWalls() {
    this.ctx.fillStyle = "#ffedd4";
    for (const wall of this.state.getWalls()) {
      this.ctx.fillRect(wall.x, wall.y, WALL_SIZE.width, WALL_SIZE.height);
    }
  }

  public collisionSnakeWall() {
    for (const wall of this.state.getWalls()) {
      if (wall.location == this.snake.getPos()) {
        this.snake.setHP(this.snake.getHP() - 1);
        const emptyGirds = this.state.getEmptyGrids();
        this.snake.setPos(emptyGirds[Math.floor(Math.random() * emptyGirds.length)].location);
        if (this.snake.getHP() == 0) {
          this.state.setDied(true);
        }
      }
    }
  }
}

type Direction = "left" | "right" | "up" | "down";
class Snake {
  private direction: Direction = "left";
  private pos: string = getBoardLocation(Math.floor(BOARD_X_COUNT / 2), Math.floor(BOARD_Y_COUNT / 2)); // middle
  private hp: number = MAX_SNAKE_HP;

  constructor() {}

  public setDirection(direction: Direction) {
    this.direction = direction;
  }

  public movement(ctx: CanvasRenderingContext2D, grids: Array<GridT>) {
    switch (this.direction) {
      case "left":
        const snakeLocation_a = grids.find((grid) => grid.location == this.pos) as GridT;
        ctx.clearRect(snakeLocation_a.x, snakeLocation_a.y, SNAKE_SIZE.width, SNAKE_SIZE.height);
        ctx.strokeRect(snakeLocation_a.x, snakeLocation_a.y, BOARD_SQUARE_WIDTH, BOARD_SQUARE_HEIGHT);

        if (this.pos[0] == BOARD_X_LOCATIONS[0]) {
          this.pos = BOARD_X_LOCATIONS[BOARD_X_LOCATIONS.length - 1] + "-" + this.pos[2];
        }

        const nextDirections_a = findNextDirections(this.pos, "left", grids);
        this.pos = nextDirections_a[nextDirections_a.length - 1].location;
        break;
      case "right":
        const snakeLocation_r = grids.find((grid) => grid.location == this.pos) as GridT;
        ctx.clearRect(snakeLocation_r.x, snakeLocation_r.y, SNAKE_SIZE.width, SNAKE_SIZE.height);
        ctx.strokeRect(snakeLocation_r.x, snakeLocation_r.y, BOARD_SQUARE_WIDTH, BOARD_SQUARE_HEIGHT);

        if (this.pos[0] == BOARD_X_LOCATIONS[BOARD_X_COUNT - 1]) {
          const nextDirections_r = findNextDirections(this.pos, "right", grids);
          const firstGrid: GridT = grids.find((grid) => grid.location == [BOARD_X_LOCATIONS[0], this.pos[2]].join("-")) || ({} as GridT);
          this.pos = [firstGrid].concat(nextDirections_r)[0].location;
          break;
        }

        const nextDirections_r = findNextDirections(this.pos, "right", grids);
        this.pos = nextDirections_r[0].location;
        break;
      case "up":
        const snakeLocation_w = grids.find((grid) => grid.location == this.pos) as GridT;
        ctx.clearRect(snakeLocation_w.x, snakeLocation_w.y, SNAKE_SIZE.width, SNAKE_SIZE.height);
        ctx.strokeRect(snakeLocation_w.x, snakeLocation_w.y, BOARD_SQUARE_WIDTH, BOARD_SQUARE_HEIGHT);

        if (parseInt(this.pos[2]) == BOARD_Y_LOCATIONS[0]) {
          const nextDirections_w = findNextDirections(this.pos, "up", grids);
          const firstGrid: GridT =
            grids.find((grid) => grid.location == [this.pos[0], BOARD_Y_LOCATIONS[BOARD_Y_COUNT - 1]].join("-")) || ({} as GridT);
          this.pos = [firstGrid].concat(nextDirections_w)[0].location;
          break;
        }

        const nextDirections_w = findNextDirections(this.pos, "up", grids);
        this.pos = nextDirections_w[nextDirections_w.length - 1].location;
        break;
      case "down":
        const snakeLocation_d = grids.find((grid) => grid.location == this.pos) as GridT;
        ctx.clearRect(snakeLocation_d.x, snakeLocation_d.y, SNAKE_SIZE.width, SNAKE_SIZE.height);
        ctx.strokeRect(snakeLocation_d.x, snakeLocation_d.y, BOARD_SQUARE_WIDTH, BOARD_SQUARE_HEIGHT);

        if (parseInt(this.pos[2]) == BOARD_Y_LOCATIONS[BOARD_Y_LOCATIONS.length - 1]) {
          const nextDirections_d = findNextDirections(this.pos, "down", grids);
          const firstGrid: GridT = grids.find((grid) => grid.location == [this.pos[0], BOARD_Y_LOCATIONS[0]].join("-")) || ({} as GridT);
          this.pos = [firstGrid].concat(nextDirections_d)[0].location;
          break;
        }

        const nextDirections_d = findNextDirections(this.pos, "down", grids);
        this.pos = nextDirections_d[0].location;
        break;
    }
    this.drawSneake(ctx, grids);
  }

  public eatApple(state: State, apples: Array<GridT>) {
    const apple = apples.find((apple) => apple.location == this.pos);
    if (apple) {
      state.removeApple(apple.location);
      state.setAppleCount();

      const emptyGrids = state.getEmptyGrids();
      state.addApple(emptyGrids[Math.floor(Math.random() * emptyGrids.length)]);
    }
  }

  public eatHeart(state: State) {
    const heart = state.getHearts().find((heart) => heart.location == this.getPos());
    if (heart) {
      this.setHP(this.getHP() + 1);
      state.removeHeart();
    }
  }

  private drawSneake(ctx: CanvasRenderingContext2D, grids: Array<GridT>) {
    ctx.fillStyle = SNAKE_COLOR;
    const snakeLocation = grids.find((grid) => grid.location == this.pos);
    if (snakeLocation) {
      ctx.fillRect(snakeLocation.x, snakeLocation.y, SNAKE_SIZE.width, SNAKE_SIZE.height);
    }
  }

  public getPos(): string {
    return this.pos;
  }

  public setPos(pos: string) {
    this.pos = pos;
  }

  public setHP(hp: number) {
    this.hp = hp;
  }

  public getHP(): number {
    return this.hp;
  }
}

type GridT = { location: string; x: number; y: number };
const Grid = (location: string, x: number, y: number): GridT => ({ location, x, y } as GridT);

class State {
  private died: boolean = false;
  private grids: Array<GridT> = [];

  private isStarted: boolean = false;

  private playTimeSecond: number = 0;
  private playTime: number = 0;
  private lastTime: number = 0;
  private lastHour: number = 0;

  private appleCount: number = 0;
  private apples: Array<GridT> = [];
  private snakePos: string = "";

  private walls: Array<GridT> = [];

  private hearts: Array<GridT> = [];

  constructor() {
    let lastFillYPos = 0;
    for (let i = 0; i < BOARD_Y_COUNT; i++) {
      let lastFillXPos = 0;
      for (let j = 0; j < BOARD_X_COUNT; j++) {
        const location = getBoardLocation(j, i);

        this.grids.push(Grid(location, lastFillXPos, lastFillYPos));
        lastFillXPos += BOARD_SQUARE_WIDTH;
      }
      lastFillYPos += BOARD_SQUARE_HEIGHT;
    }

    for (let i = 0; i < MAX_APPLE_COUNT; i++) {
      const emptyGrids = this.getEmptyGrids();
      this.apples.push(emptyGrids[Math.floor(Math.random() * emptyGrids.length)]);
    }

    for (let i = 0; i < MAX_WALL_COUNT; i++) {
      const emptyGrids = this.getEmptyGrids();
      this.walls.push(emptyGrids[Math.floor(Math.random() * emptyGrids.length)]);
    }
  }

  public getEmptyGrids(): Array<GridT> {
    let filteredGrids = this.grids.filter((grid) => grid.location != this.snakePos);
    for (const grid of this.grids) {
      if (this.apples.find((apple) => apple.location == grid.location)) {
        filteredGrids = filteredGrids.filter((fGrid) => fGrid.location != grid.location);
      }

      if (this.walls.find((wall) => wall.location == grid.location)) {
        filteredGrids = filteredGrids.filter((fGrid) => fGrid.location != grid.location);
      }

      if (this.getHearts().length != 0 && this.getHearts().find((heart) => heart.location == grid.location)) {
        filteredGrids = filteredGrids.filter((fGrid) => fGrid.location != grid.location);
      }
    }
    return filteredGrids;
  }

  public setIsStarted(isStarted: boolean) {
    this.isStarted = isStarted;
  }

  public getIsStarted(): boolean {
    return this.isStarted;
  }

  public setAppleCount() {
    this.appleCount += 1;
  }

  public getAppleCount(): number {
    return this.appleCount;
  }

  public setPlayTime() {
    if (Date.now() - this.lastTime > 1000) {
      this.playTime += 1;
      this.playTimeSecond += 1;
      this.lastTime = Date.now();
    }

    if (this.playTimeSecond / 60 == 1) {
      SNAKE_SPEED = 250;

      const emptyGrids = this.getEmptyGrids();
      this.setHeart(emptyGrids[Math.floor(Math.random() * emptyGrids.length)]);
      this.setWalls(2);
      this.playTimeSecond += 1;
    } else if (this.playTimeSecond / 60 == 2) {
      SNAKE_SPEED = 220;

      const emptyGrids = this.getEmptyGrids();
      this.setHeart(emptyGrids[Math.floor(Math.random() * emptyGrids.length)]);
      this.setWalls(2);
      this.playTimeSecond += 1;
    } else if (this.playTimeSecond / 60 == 3) {
      SNAKE_SPEED = 180;

      const emptyGrids = this.getEmptyGrids();
      this.setHeart(emptyGrids[Math.floor(Math.random() * emptyGrids.length)]);
      this.setWalls();
      this.playTimeSecond += 1;
    } else if (this.playTimeSecond / 60 == 4) {
      SNAKE_SPEED = 150;

      const emptyGrids = this.getEmptyGrids();
      this.setHeart(emptyGrids[Math.floor(Math.random() * emptyGrids.length)]);
      this.setWalls(5);
      this.playTimeSecond += 1;
    }
  }

  public getPlayTime(): string {
    if (this.playTime < 60) {
      return (
        (this.lastHour < 10 ? "0" + this.lastHour : this.lastHour).toString() +
        ":" +
        (this.playTime < 10 ? "0" + this.playTime : this.playTime).toString()
      );
    } else {
      this.playTime = 0;
      this.lastHour += 1;
    }
    return "";
  }

  public getApples(): Array<GridT> {
    return this.apples;
  }

  public addApple(apple: GridT) {
    this.apples.push(apple);
  }

  public removeApple(location: string) {
    this.apples = this.apples.filter((apple) => apple.location != location);
  }

  public getWalls(): Array<GridT> {
    return this.walls;
  }

  public setWalls(count: number = WALL_SET_COUNT_PER_MINUTE) {
    for (let i = 0; i < count; i++) {
      const emptyGirds = this.getEmptyGrids();
      this.walls.push(emptyGirds[Math.floor(Math.random() * emptyGirds.length)]);
    }
  }

  public setHeart(heart: GridT) {
    if (this.getHearts().length == 0) {
      this.hearts.push(heart);
    }
  }

  public removeHeart() {
    this.hearts = [];
  }

  public getHearts(): Array<GridT> {
    return this.hearts;
  }

  public setSnakePos(pos: string) {
    this.snakePos = pos;
  }

  public setDied(died: boolean) {
    this.died = died;
  }

  public isDied(): boolean {
    return this.died;
  }

  public getGrids(): Array<GridT> {
    return this.grids;
  }
}
