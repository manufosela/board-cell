const colors = ['red', 'green'];
const fichas = ['oRed', 'oGreen'];
const sizes = ['Big', 'Mid', 'Small'];

let board;
const boardSize = 3;
const cellSize = 150;
const fontSize = 12;
const idGame = '3en3enraya';
const titleGame = '3 en 3 en raya';

let highlights = [];
let concentricos = false;
let fichasTotal = 0;
let turno = 0;
let size = 0;
let content = `imagenes/${fichas[turno]}${sizes[size]}.png`;
let ganador = false;
const numFichasByTablero = [0, 0, 0];
const tableros = [
  [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
  [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
  [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
];
const mensajeTurnos = ['Jugador 1 - O red', 'Jugador 2 - O green'];

function drawLineThroughCells(start, end) {
  const startX = start[0];
  const startY = start[1];
  const endX = end[0];
  const endY = end[1];
  const { ctx } = board;
  const startXPos = startX * cellSize + cellSize / 2;
  const startYPos = startY * cellSize + cellSize / 2;
  const endXPos = endX * cellSize + cellSize / 2;
  const endYPos = endY * cellSize + cellSize / 2;
  ctx.beginPath();
  ctx.moveTo(startYPos, startXPos);
  ctx.lineTo(endYPos, endXPos);
  ctx.strokeStyle = colors[ganador];
  ctx.lineWidth = 5;
  ctx.stroke();
}

function fillCell(cellInfo) {
  board.drawBorder(cellInfo.cellx, cellInfo.celly, colors[ganador], 10);
}

function drawTurnCircles() {
  size = 0;
  const ficha = fichas[turno];
  const fichasLayer = document.getElementById('fichas');
  fichasLayer.innerHTML = /* html */ `
    <img src="imagenes/${ficha}${sizes[0]}.png" alt="" data-size="0" class="selected">
    <img src="imagenes/${ficha}${sizes[1]}.png" alt="" data-size="1">
    <img src="imagenes/${ficha}${sizes[2]}.png" alt="" data-size="2">`;
}

function ganadorConcentricos(cellInfo) {
  // Compronar si en al misma celda de cada tablero hay una ficha del mismo jugador
  const tablero0 = tableros[0];
  const tablero1 = tableros[1];
  const tablero2 = tableros[2];
  const x = cellInfo.cellx;
  const y = cellInfo.celly;
  const ficha = tablero0[y][x];
  ganador = false;
  if (
    tablero0[y][x] === ficha &&
    tablero1[y][x] === ficha &&
    tablero2[y][x] === ficha
  ) {
    ganador = turno;
    highlights = [[x, y]];
    concentricos = true;
  }
  return ganador;
}

function comprobarGanador(_size, cellInfo) {
  const tablero = tableros[_size];
  const x = cellInfo.cellx;
  const y = cellInfo.celly;
  const ficha = tablero[y][x];
  // console.table(tablero);
  ganador = false;
  if (
    tablero[0][0] === ficha &&
    tablero[0][1] === ficha &&
    tablero[0][2] === ficha
  ) {
    ganador = turno;
    highlights = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
  } else if (
    tablero[1][0] === ficha &&
    tablero[1][1] === ficha &&
    tablero[1][2] === ficha
  ) {
    ganador = turno;
    highlights = [
      [1, 0],
      [1, 1],
      [1, 2],
    ];
  } else if (
    tablero[2][0] === ficha &&
    tablero[2][1] === ficha &&
    tablero[2][2] === ficha
  ) {
    ganador = turno;
    highlights = [
      [2, 0],
      [2, 1],
      [2, 2],
    ];
  } else if (
    tablero[0][0] === ficha &&
    tablero[1][0] === ficha &&
    tablero[2][0] === ficha
  ) {
    ganador = turno;
    highlights = [
      [0, 0],
      [1, 0],
      [2, 0],
    ];
  } else if (
    tablero[0][1] === ficha &&
    tablero[1][1] === ficha &&
    tablero[2][1] === ficha
  ) {
    ganador = turno;
    highlights = [
      [0, 1],
      [1, 1],
      [2, 1],
    ];
  } else if (
    tablero[0][2] === ficha &&
    tablero[1][2] === ficha &&
    tablero[2][2] === ficha
  ) {
    ganador = turno;
    highlights = [
      [0, 2],
      [1, 2],
      [2, 2],
    ];
  } else if (
    tablero[0][0] === ficha &&
    tablero[1][1] === ficha &&
    tablero[2][2] === ficha
  ) {
    ganador = turno;
    highlights = [
      [0, 0],
      [1, 1],
      [2, 2],
    ];
  } else if (
    tablero[0][2] === ficha &&
    tablero[1][1] === ficha &&
    tablero[2][0] === ficha
  ) {
    ganador = turno;
    highlights = [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
  } else {
    ganador = ganadorConcentricos(cellInfo);
  }
  return ganador;
}

function changeCellContent(cellInfo, _content, _color) {
  const drawCellEvent = new CustomEvent('board-cell__change-cell-content', {
    detail: {
      id: idGame,
      cellx: cellInfo.cellx,
      celly: cellInfo.celly,
      color: _color,
      content: _content,
    },
  });
  document.dispatchEvent(drawCellEvent);
}

function putFichaIntoCell(cellInfo) {
  content = `imagenes/${fichas[turno]}${sizes[size]}.png`;
  changeCellContent(cellInfo, content, '#FFFFFF');
}

function updateGameData(cellInfo) {
  tableros[size][cellInfo.celly][cellInfo.cellx] = turno;
  numFichasByTablero[size] += 1;
  fichasTotal += 1;
}

function putFicha(ev) {
  const ficha = ev.target;
  if (ficha.tagName === 'IMG') {
    document.querySelector('.selected').classList.remove('selected');
    ficha.classList.add('selected');
    content = ficha.src;
    size = parseInt(ficha.dataset.size, 10);
  }
  console.log(turno, size);
}

function winerActions(cellInfo) {
  document.getElementById('fichas').removeEventListener('click', putFicha);
  document.querySelector('aside').classList.add('invisible');
  if (concentricos) {
    fillCell(cellInfo);
  } else {
    drawLineThroughCells(highlights[0], highlights[highlights.length - 1]);
  }
}

function checkMovement(cellInfo) {
  if (numFichasByTablero[size] >= 4 || fichasTotal > 4) {
    ganador = comprobarGanador(size, cellInfo);
    console.log(ganador);
    if (ganador === 0 || ganador === 1) {
      document.getElementById(
        'ganador'
      ).innerHTML = `Ganador: ${mensajeTurnos[ganador]}`;
      winerActions(cellInfo);
      return false;
    }
  }
  return true;
}

function nextTurn() {
  turno = (turno + 1) % 2;
  document.querySelector('#turno').innerHTML = mensajeTurnos[turno];
}

// eslint-disable-next-line no-unused-vars
function cellClick(ev) {
  if (ganador !== false) {
    return;
  }
  const cellInfo = ev.detail;
  const cellContent = tableros[size][cellInfo.celly][cellInfo.cellx];
  if (cellContent !== null) {
    return;
  }
  putFichaIntoCell(cellInfo);
  updateGameData(cellInfo);
  if (checkMovement(cellInfo)) {
    nextTurn();
    drawTurnCircles();
  }
}

function wcReady(ev) {
  const { id, componentName } = ev.detail;
  if (componentName === 'BOARD-CELL' && id === idGame) {
    drawTurnCircles();
  }
}

document.getElementById('fichas').addEventListener('click', putFicha);

function createBoard(parentNode) {
  const boardCell = document.createElement('board-cell');
  boardCell.setAttribute('id', idGame);
  boardCell.setAttribute('cols', boardSize);
  boardCell.setAttribute('rows', boardSize);
  boardCell.setAttribute('undo', 'true');
  boardCell.setAttribute('cell-size', cellSize);
  boardCell.setAttribute('font-size', fontSize);
  boardCell.setAttribute('title', titleGame);
  boardCell.setAttribute('onclick', 'cellClick');
  parentNode.appendChild(boardCell);

  return boardCell;
}

function init() {
  document.addEventListener('wc-ready', wcReady);
  board = createBoard(document.getElementById('game'));
}

window.onload = init();
