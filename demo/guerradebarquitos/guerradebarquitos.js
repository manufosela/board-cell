const boardSize = 10; // cells
const cellSize = 40; // px
let boardMe;
let boardEnemy;
let modalOverlay;

let statusGame = 'define';
let shipSelected = null;

let shipsBoardMe;
let shipsBoardEnemy;
let shipsInPosition = 0;
let shipsHumanTouched = 0;
let shipsEnemyTouched = 0;

let turno = 0;

let lastShootTocado = null;
let nextShootDir = 1;
let botShots = null;
let humanShipInkling = null;

let boards;

const ships = [
  ['imagenes/1.png'],
  ['imagenes/2_0.png', 'imagenes/2_1.png'],
  ['imagenes/3_0.png', 'imagenes/3_1.png', 'imagenes/3_2.png'],
  [
    'imagenes/4_0.png',
    'imagenes/4_1.png',
    'imagenes/4_2.png',
    'imagenes/4_3.png',
  ],
];

function _closeModal() {
  const closeModalBtn = document.querySelector('#closeModalBtn');
  closeModalBtn.removeEventListener('click', _closeModal);
  modalOverlay.style.display = 'none';
}

function showModal(message) {
  modalOverlay = document.querySelector('.modal-overlay');
  document.getElementById('modalMessage').innerHTML = message;
  const closeModalBtn = document.getElementById('closeModalBtn');
  closeModalBtn.addEventListener('click', _closeModal);
  modalOverlay.style.display = 'flex';
}

function generateRandomMatrix(rows, cols) {
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(null));

  const placeGroup = (value, size, row, col) => {
    for (let i = 0; i < size; i += 1) {
      if (matrix[row][col + i] !== null) {
        return false; // Group overlaps, return false
      }
    }
    for (let i = 0; i < size; i += 1) {
      matrix[row][col + i] = `${value}_${i}`;
    }
    return true; // Group placed successfully
  };

  const placeValue = (value, row, col) => {
    if (matrix[row][col] !== null) {
      return false; // Value overlaps, return false
    }
    matrix[row][col] = `${value}`;
    return true; // Value placed successfully
  };

  const randomIndex = max => Math.floor(Math.random() * max);

  let row;
  let col;
  // Place 1s
  for (let i = 0; i < 4; i += 1) {
    do {
      row = randomIndex(rows);
      col = randomIndex(cols);
    } while (!placeValue(1, row, col));
  }

  // Place 2s
  for (let i = 0; i < 3; i += 1) {
    do {
      row = randomIndex(rows);
      col = randomIndex(cols - 1);
    } while (!placeGroup(2, 2, row, col));
  }

  // Place 3s
  for (let i = 0; i < 2; i += 1) {
    do {
      row = randomIndex(rows);
      col = randomIndex(cols - 2);
    } while (!placeGroup(3, 3, row, col));
  }

  // Place 4s
  do {
    row = randomIndex(rows);
    col = randomIndex(cols - 3);
  } while (!placeGroup(4, 4, row, col));

  return matrix;
}

function nextTurn() {
  boards[turno].classList.toggle('disabled');
  turno = (turno + 1) % 2;
  boards[turno].classList.toggle('disabled');
}

function changeCellContent(boardId, cellx, celly, content) {
  const changeCellContentEvent = new CustomEvent(
    'board-cell__change-cell-content',
    {
      detail: {
        id: boardId,
        cellx,
        celly,
        content,
      },
    }
  );
  document.dispatchEvent(changeCellContentEvent);
}

function getArrayCells(rows, cols, content) {
  const cells = [];
  for (let row = 0; row < rows; row += 1) {
    cells.push([]);
    for (let col = 0; col < cols; col += 1) {
      cells[row].push(content);
    }
  }
  return cells;
}

function clearBoardContent(boardId) {
  const clearBoardContentEvent = new CustomEvent(
    'board-cell__clear-all-content',
    {
      detail: {
        id: boardId,
      },
    }
  );
  document.dispatchEvent(clearBoardContentEvent);
}

function putMyShipsInRandomPosition() {
  shipsInPosition = 0;
  document.getElementById('shipsImages').classList.add('invisible');
  clearBoardContent('boardMe');
  shipsBoardMe = generateRandomMatrix(10, 10);
  shipsBoardMe.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell !== null) {
        changeCellContent('boardMe', x, y, `imagenes/${cell}.png`);
        shipsInPosition += 1;
      }
    });
  });
}

function showGameRules() {
  const gameRules = /* html */ `
  <div class="tabs">
    <div class="tab">
      <input type="radio" name="tabgroup" id="tab-1" checked>
      <label for="tab-1">English</label>
      <div class="content">
        <h3>The game is about sinking the enemy's ships before they sink yours.</h3>
        <ol style="text-align:left">
          <li>Place your ships on the left board (My ships)</li>
          <li>You can place them manually or randomly by clicking the <strong>"Random position"</strong> button</li>
          <li>Once you've placed your ships, click the <strong>"Start game"</strong> button</li>
          <li>On the right board (Enemy ships), click on a cell to shoot</li>
          <li>If you hit a cell with an enemy ship, a hit ship image will be displayed (<img src="images/hit.png" width="20">)</li>
          <li>If you miss a cell with no enemy ship, a water image will be displayed (<img src="images/water.png" width="20">)</li>
          <li>If you hit, you continue to have your turn to shoot</li>
          <li>If you miss, the turn passes to the enemy</li>
          <li>The enemy, if they hit, continues to have their turn to shoot</li>
          <li>When the enemy misses, the turn passes back to you</li>
          <li>The first player to sink all enemy ships wins</li>
        </ol>
      </div>
    </div>
    <div class="tab">
      <input type="radio" name="tabgroup" id="tab-2">
      <label for="tab-2">Label Two</label>
      <div class="content">
        <h3>El juego consiste en hundir los barcos del enemigo antes de que él hunda los tuyos.</h3>
        <ol style="text-align:left">
          <li>Coloca tus barcos en el tablero de la izquierda (My ships)</li>
          <li>Puedes colocarlos de manera manual o aleatoriamente pulsando el botón <strong>"Random position"</strong></li>
          <li>Cuando hayas colocado tus barcos pulsa el botón <strong>"Start game"</strong></li>
          <li>En el tablero de la derecha (Enemy ships) pulsa sobre una casilla para disparar</li>
          <li>Si aciertas en una casilla donde hay un barco enemigo, se mostrará una imagen de barco tocado (<img src="imagenes/tocado.png" width="20">)</li>
          <li>Si no aciertas en una casilla donde no hay un barco enemigo, se mostrará una imagen de agua (<img src="imagenes/agua.png" width="20">)</li>
          <li>Si aciertas, sigues teniendo turno para disparar</li>
          <li>Si fallas, el turno pasa al enemigo</li>
          <li>El enemigo, si acierta, sigue teniendo turno para disparar</li>
          <li>Cuando el enemigo, si falla, el turno pasa a ti</li>
          <li>Gana el primero que hunda todos los barcos enemigos</li>
        </ol>
      </div>
    </div>
  </div>
  `;
  showModal(gameRules);
}

function clearships() {
  clearBoardContent('boardMe');
  shipsBoardMe = getArrayCells(boardSize, boardSize, null);
  shipsInPosition = 0;
  document.getElementById('shipsImages').classList.remove('invisible');
  document
    .querySelectorAll('.ships LI IMG.selected')
    .classList.remove('selected');
}

function startGame() {
  if (shipsInPosition === 20) {
    shipsHumanTouched = 0;
    shipsEnemyTouched = 0;
    document.querySelector('.buttons').classList.add('invisible');
    statusGame = 'playing';
    boardEnemy.classList.toggle('disabled');
    boardMe.classList.toggle('disabled');
    shipsBoardEnemy = generateRandomMatrix(10, 10);
  }
}

function selectShip(ev) {
  shipSelected = ev.target;
  const shipNow = document.querySelector('.ships LI IMG.selected');
  shipSelected.classList.toggle('selected');
  if (shipNow) {
    shipNow.classList.toggle('selected');
  }
}

function initBoardEvent(ev) {
  shipsBoardMe = getArrayCells(boardSize, boardSize, null);
  botShots = getArrayCells(boardSize, boardSize, null);
  if (ev.detail.id === 'boardMe') {
    document
      .getElementById('randomposition')
      .addEventListener('click', putMyShipsInRandomPosition);
    document.getElementById('clearall').addEventListener('click', clearships);
    document.getElementById('startgame').addEventListener('click', startGame);
    document
      .getElementById('gamerules')
      .addEventListener('click', showGameRules);
    boardEnemy.classList.add('disabled');
    document
      .querySelector('#shipsImages')
      .addEventListener('click', selectShip);
  }
}

// eslint-disable-next-line no-unused-vars
function cellClickMe(ev) {
  if (statusGame === 'define') {
    if (shipSelected) {
      // ad to board-cell the ship selected
      const shipToDraw = ships[shipSelected.dataset.ship];
      shipToDraw.forEach(ship => {
        const cellx = ev.detail.cellx + shipToDraw.indexOf(ship);
        changeCellContent('boardMe', cellx, ev.detail.celly, ship);
        shipsBoardMe[ev.detail.celly][cellx] =
          parseInt(shipSelected.dataset.ship, 10) + 1;
      });
      shipSelected.classList.toggle('selected');
      shipSelected.remove();
      shipsInPosition += 1;
    }
  }
}

function winner() {
  const winnerMessage = ['Congratulations! You won!"', "Oh! I'm sorry! I won!"];
  statusGame = 'end';
  showModal(winnerMessage[turno]);
}

function getShoot() {
  let cellx;
  let celly;
  if (lastShootTocado === null) {
    do {
      cellx = Math.floor(Math.random() * 10);
      celly = Math.floor(Math.random() * 10);
    } while (botShots[cellx][celly] !== null);
  } else {
    celly = lastShootTocado.celly;
    cellx = lastShootTocado.cellx + nextShootDir;
    if (cellx > boardSize - 1) {
      nextShootDir = -1;
      cellx = lastShootTocado.cellx + nextShootDir;
    }
    if (cellx < 0) {
      nextShootDir = 1;
      cellx = lastShootTocado.cellx + nextShootDir;
    }
    if (botShots[cellx][celly] !== null) {
      do {
        cellx = Math.floor(Math.random() * 10);
        celly = Math.floor(Math.random() * 10);
      } while (botShots[cellx][celly] !== null);
    }
  }
  return { cellx, celly };
}

async function playBot() {
  // Dame una posicion aleatoria que el bot no haya ya disparado
  const { cellx, celly } = getShoot();
  try {
    // comprueba si en la posicion clicada hay un barco enemigo
    if (shipsBoardMe[celly][cellx] !== null) {
      botShots[cellx][celly] = 'tocado';
      changeCellContent('boardMe', cellx, celly, 'imagenes/tocado.png');
      if (humanShipInkling === null && lastShootTocado === null) {
        humanShipInkling = cellx;
      }
      lastShootTocado = { cellx, celly };
      shipsHumanTouched += 1;
      setTimeout(playBot, 1000);
    } else {
      botShots[cellx][celly] = 'agua';
      changeCellContent('boardMe', cellx, celly, 'imagenes/agua.png');
      if (humanShipInkling !== null && lastShootTocado !== null) {
        console.log(humanShipInkling, cellx, lastShootTocado.cellx);
        nextShootDir = -nextShootDir;
        lastShootTocado = { cellx: humanShipInkling, celly };
        humanShipInkling = null;
      } else {
        lastShootTocado = null;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      nextTurn();
    }
    if (shipsHumanTouched === 20) {
      winner(turno);
    }
  } catch (e) {
    console.log(e);
    console.log(cellx, celly);
  }
}

// eslint-disable-next-line no-unused-vars
async function cellClickEnemy(ev) {
  if (statusGame === 'playing' && turno === 0) {
    // comprueba si en la posicion clicada hay un barco enemigo
    if (shipsBoardEnemy[ev.detail.celly][ev.detail.cellx] !== null) {
      changeCellContent(
        'boardEnemy',
        ev.detail.cellx,
        ev.detail.celly,
        'imagenes/tocado.png'
      );
      shipsEnemyTouched += 1;
      if (shipsEnemyTouched === 20) {
        winner(turno);
      }
    } else {
      changeCellContent(
        'boardEnemy',
        ev.detail.cellx,
        ev.detail.celly,
        'imagenes/agua.png'
      );
      await new Promise(resolve => setTimeout(resolve, 1000));
      nextTurn();
    }
    if (turno === 1) {
      setTimeout(playBot, 1000);
    }
  }
}

// CHAT_ ~/ws_node/Real-Time-Chat-App

function createBoard(parentNode, idBoard, titleBoard, callback) {
  const boardCell = document.createElement('board-cell');
  boardCell.setAttribute('id', idBoard);
  boardCell.setAttribute('cols', boardSize);
  boardCell.setAttribute('rows', boardSize);
  boardCell.setAttribute('cell-size', cellSize);
  boardCell.setAttribute('cell-text-color', '#ffffff');
  boardCell.setAttribute('grid-color', '#228F99');
  boardCell.setAttribute('cell-bg-color', '#2299FF');
  boardCell.setAttribute('title', titleBoard);
  boardCell.setAttribute('onclick', callback);
  boardCell.setAttribute('class', idBoard);
  parentNode.appendChild(boardCell);
  return boardCell;
}

function init() {
  const boardsLayer = document.getElementById('boards');
  boardMe = createBoard(boardsLayer, 'boardMe', 'My ships', 'cellClickMe');
  boardEnemy = createBoard(
    boardsLayer,
    'boardEnemy',
    'Enemy ships',
    'cellClickEnemy'
  );
  boards = [boardMe, boardEnemy];
  document.addEventListener('wc-ready', initBoardEvent);
}

window.onload = init();
