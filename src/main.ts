import './style.css'

const canvas: HTMLCanvasElement = document.getElementById("game-canvas") as HTMLCanvasElement;

if (canvas === null)
  throw new Error("Could not get canvas.");

const ctx = canvas.getContext("2d");

if (ctx === null)
  throw new Error("Could not get context.");

let currentCorner : "a" | "b" | "c" | "d" = "a";

canvas.onpointerdown = (evt) => {
  let x = evt.offsetX;
  let y = evt.offsetY;
  console.log("x: ", x, " y: ", y, " color: ", colorAt(x, y, board), " boardSize: ", boardSize);

  updateCorner(x, y);

  updateBoard(colorAt(x, y, board), currentCorner, board);
}

type Color = number;
type Board = Color[][];


const size = Math.min(document.documentElement.clientWidth * 0.8,
                      document.documentElement.clientHeight * 0.8); 

canvas.width = size;
canvas.height = size;

const numColors = 10;
const boardSize = 10;
let cellSize = size / boardSize;
const palette = genPalette(numColors);
let board = genRandomBoard(boardSize, numColors);

draw();

function updateCorner(x: number, y: number) {
  let [i, j] = posAt(x, y);

  if (i === 0 && j === 0) {
    currentCorner = "a";
    return;
  }
  
  if (i === 0  && j === boardSize - 1) {
    currentCorner = "b";
    return;
  }

  if (i === boardSize - 1 && j === boardSize - 1) {
    currentCorner = "c";
    return;
  }

  if (i === boardSize - 1 && j === 0) {
    currentCorner = "d";
    return;
  }
}

function genPalette(k: number): string[] {
  let palette: string[] = [];

  for (let i = 0; i < k; i++) {
    palette.push(`hsl(${i/k}turn 70% 50%)`);
  }

  return palette;
}

function genRandomBoard(n: number, k: number): Board {
  let board: Board = [];

  for (let y = 0; y < n; y++) {
    board[y] = [];
    for (let x = 0; x < n; x++) {
      let col = Math.floor(Math.random() * k)
      board[y][x] = col;
    }
  }

  return board;
}

function draw() {
  drawBoard(board);
}

function drawBoard(board: Board) {
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      ctx!.fillStyle = palette[board[y][x]];
      ctx!.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  let currentMarkerX: number;
  let currentMarkerY: number;

  if (currentCorner === "a") {
    currentMarkerX = 0;
    currentMarkerY = 0;
  } else if (currentCorner === "b") {
    currentMarkerX = boardSize - 1;
    currentMarkerY = 0;
  } else if (currentCorner === "c") {
    currentMarkerX = boardSize - 1;
    currentMarkerY = boardSize - 1;
  } else {
    currentMarkerX = 0;
    currentMarkerY = boardSize - 1;
  }

  console.log(currentCorner);

  ctx!.fillStyle = "hsl(0 0% 0%)";
  ctx!.beginPath();
  ctx!.ellipse(cellSize * currentMarkerX + cellSize / 2,
               cellSize * currentMarkerY + cellSize / 2,
               cellSize * 0.2 / 2, cellSize * 0.2 / 2,
               0,
               0, Math.PI * 2);
  ctx!.fill();
}

function colorAt(x: number, y: number, board: Board): number {
  let [i, j] = posAt(x, y);

  return board[i][j];
}

function posAt(x: number, y: number): [number, number] {
  let i = Math.ceil(y / cellSize) - 1;
  let j = Math.ceil(x / cellSize) - 1;

  return [i, j];
}

function updateBoard(newColor: Color, corner: "a" | "b" | "c" | "d", board: Board) {
  let start: [number, number];
  let visited: boolean[][] = [];

  for (let i = 0; i < boardSize; i++) {
    visited.push([]);
    for (let j = 0; j < boardSize; j++) {
      visited[i].push(false);
    }
  }
  
  switch (corner) {
    case "a":
      start = [0, 0];
      break;
    case "b":
      start = [0, boardSize - 1];
      break;
    case "c":
      start = [boardSize - 1, boardSize - 1];
      break;
    case "d":
      start = [boardSize - 1, 0];
      break;
  }

  let oldColor: Color = board[start[0]][start[1]];

  let stack: [number, number][] = [start];

  let checkAndUpdate = ([y, x] : [number, number]) => {
    if (x >= 0 && x < boardSize &&
        y >= 0 && y < boardSize &&
        !visited[y][x] &&
        board[y][x] === oldColor)

      stack.push([y, x]);
  }

  while (stack.length > 0) {
    let [y, x] = stack.pop()!; // stack.length is > 0 so there must be at least 1 element.

    board[y][x] = newColor;
    visited[y][x] = true;

    checkAndUpdate([y - 1, x]);
    checkAndUpdate([y, x - 1]);
    checkAndUpdate([y + 1, x]);
    checkAndUpdate([y, x + 1]);
  }

  draw();
}

