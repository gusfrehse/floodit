import './style.css'

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.onpointerdown = (evt) => {
  //console.log("pointer down on canvas");
  let x = evt.offsetX;
  let y = evt.offsetY;
  console.log("x: ", x, " y: ", y, " color: ", colorAt(x, y, board));

  updateBoard(colorAt(x, y, board), "a", board);
  //console.log(y);
}

document.onresize;
type Color = number;
type Board = Color[][];

const numColors = 10;
const boardSize = 10;
let cellSize = canvas.width / boardSize;
const palette = genPalette(numColors);
let board = genRandomBoard(boardSize, numColors);

draw();

function genPalette(k: number): string {
  let palette: string[] = [];

  for (let i = 0; i < k; i++) {
    palette.push(`hsl(${i/k}turn 70% 50%)`);
  }

  return palette;
}

function genRandomBoard(n: number, k: number): Board {
  let board: Board = Array;

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
      ctx.fillStyle = palette[board[y][x]];
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

function colorAt(x: number, y: number, board: Board): number {
  let i = Math.ceil(y / cellSize) - 1;
  let j = Math.ceil(x / cellSize) - 1;

  return board[i][j];
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

  let checkBounds = (y, x) => {
    if (x < 0 || y < 0 ||
        x >= boardSize ||
        y >= boardSize)
      return null;

    return [y, x]
  }

  let checkAndUpdate = ([y, x]) => {
    if (x >= 0 && x < boardSize &&
        y >= 0 && y < boardSize &&
        !visited[y][x] &&
        board[y][x] === oldColor)
      stack.push([y, x]);
  }

  while (stack.length > 0) {
    let [y, x] = stack.pop();
    board[y][x] = newColor;
    visited[y][x] = true;

    checkAndUpdate([y - 1, x]);
    checkAndUpdate([y, x - 1]);
    checkAndUpdate([y + 1, x]);
    checkAndUpdate([y, x + 1]);
  }

  draw();
}

