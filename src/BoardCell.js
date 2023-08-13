import { LitElement, html } from 'lit';
import { BoardCellStyles } from './board-cell-style.js';

/**
 * `board-cell`
 * Boardcell
 *
 * @customElement board-cell
 * @litElement
 * @demo demo/index.html
 */

export class BoardCell extends LitElement {
  static get is() {
    return 'board-cell';
  }

  static get properties() {
    return {
      /**
       * Element identifier
       * @property
       * @type { String }
       */
      id: { type: String },
      /**
       * Number of columns
       * @property
       * @type { Number }
       */
      cols: { type: Number },
      /**
       * Number of rows
       * @property
       * @type { Number }
       */
      rows: { type: Number },
      /**
       * Cell Size in pixels
       * @property
       * @type { Number }
       */
      cellSize: { type: Number, attribute: 'cell-size' },
      /**
       * Font size in pixels
       * @property
       * @type { Number }
       * @attribute
       */
      fontSize: { type: Number, attribute: 'font-size' },
      /**
       * Board title
       * @property
       * @type { String }
       */
      title: { type: String },
      /**
       * Allow undo cell content with second click in the same cell with content
       * @property
       * @type { Boolean }
       */
      undo: { type: Boolean },
      /**
       * Restore content value used when undo is true
       * @property
       * @type { String }
       */
      restoreContent: { type: String },
      /**
       * Redraw cells when click in a cell
       * @property
       * @type { Boolean }
       */
      redrawCells: { type: Boolean, attribute: 'redraw-cells' },
      /**
       * Change appaerance cell when hovering
       * @property
       * @type { Boolean }
       */
      hoverCell: { type: Boolean, attribute: 'hover-cell' },
      /**
       * Hide Cell Lines
       * @property
       * @type { Boolean }
       */
      hideCellLines: { type: Boolean, attribute: 'hide-cell-lines' },
      /**
       * Cell text color
       * @property
       * @type { String }
       */
      cellTextColor: { type: String, attribute: 'cell-text-color' },
      /**
       * Grid color
       * @property
       * @type { String }
       */
      gridColor: { type: String, attribute: 'grid-color' },
      /**
       * Cell background color
       * @property
       * @type { String }
       */
      backgroundColor: { type: String, attribute: 'cell-bg-color' },
      /**
       * Callback function to be called when the board is clicked
       * @property
       * @type { String }
       */
      onclickCallback: { type: String, attribute: 'onclick' },
    };
  }

  static get styles() {
    return [BoardCellStyles];
  }

  constructor() {
    super();
    this._initializeVariables();
    this._bindMethods();
  }

  _initializeVariables() {
    this.cols = 5;
    this.rows = 5;
    this.cellSize = 50;
    this.fontSize = this.cellSize * 0.5;
    this.title = 'board-cell';
    this.id = `board-cell__${Math.random().toString(36).substring(2, 15)}`;
    this.hideCellLines = false;
    this.hoverCell = false;
    this.undo = false;
    this.redrawCells = false;
    this.mouseOverX = -1;
    this.mouseOverY = -1;
    this.cellsBgColor = [];
    this.cellsTextColor = [];
    this.cellsContent = [];
    this.cellsWithoutEvent = [];
    this.cellTextColor = '#000000';
    this.cellBgColor = '#FFFFFF';
    this.gridColor = '#CCCCCC';
    this.backgroundColor = '#FFFFFF';
    this.restoreContent = '';
  }

  _bindMethods() {
    this.boardClicked = this.boardClicked.bind(this);
    this.setCellData = this.setCellData.bind(this);
    this.setCellsData = this.setCellsData.bind(this);
    this.contentRefresh = this.contentRefresh.bind(this);
    this._clearColContentCallback = this._clearColContentCallback.bind(this);
    this._clearRowContentCallback = this._clearRowContentCallback.bind(this);
    this._clearCellContentCallback = this._clearCellContentCallback.bind(this);
    this._clearAllContentCallback = this._clearAllContentCallback.bind(this);
    this.changeCellContent = this.changeCellContent.bind(this);
    this.changeCellsContent = this.changeCellsContent.bind(this);
    this.mouseOverCell = this.mouseOverCell.bind(this);
    this.mouseOutCell = this.mouseOutCell.bind(this);
    this._disableBoardEvents = this._disableBoardEvents.bind(this);
    this._enableBoardEvents = this._enableBoardEvents.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._initializeCells();
    this.style.width = `${this.rows * this.cellSize}px`;
    this._enableBoardEvents();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._disableBoardEvents();
  }

  _enableBoardClick() {
    if (
      this.onclickCallback &&
      (this.parentElement[this.onclickCallback] || window[this.onclickCallback])
    ) {
      this.addEventListener('click', this.boardClicked);
    }
  }

  _initializeCells() {
    this.cellsBgColor = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill(null)
    );
    this.cellsTextColor = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill(null)
    );
    this.cellsContent = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill(null)
    );
    this.cellsWithoutEvent = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill(false)
    );
  }

  _enableBoardEvents() {
    if (this.hoverCell) {
      this.addEventListener('mousemove', this.mouseOverCell);
      this.addEventListener('mouseout', this.mouseOutCell);
    }
    document.addEventListener(
      'board-cell__content-refresh',
      this.contentRefresh
    );
    document.addEventListener('board-cell__change-cell-data', this.setCellData);
    document.addEventListener(
      'board-cell__change-all-cell-data',
      this.setCellsData
    );
    document.addEventListener(
      'board-cell__change-cell-content',
      this.changeCellContent
    );
    document.addEventListener(
      'board-cell__change-cells-content',
      this.changeCellsContent
    );
    document.addEventListener(
      'board-cell__clear-cell-content',
      this._clearCellContentCallback
    );
    document.addEventListener(
      'board-cell__clear-all-content',
      this._clearAllContentCallback
    );
    document.addEventListener(
      'board-cell__content-clear-row',
      this._clearRowContentCallback
    );
    document.addEventListener(
      'board-cell__content-clear-col',
      this._clearColContentCallback
    );
    document.addEventListener(
      'board-cell__enable-board-click',
      this._enableBoardClick
    );
    document.addEventListener(
      'board-cell__disable-board-click',
      this._disableBoardClick
    );
    this._enableBoardClick();
  }

  _disableBoardClick() {
    if (
      this.onclickCallback &&
      (this.parentElement[this.onclickCallback] || window[this.onclickCallback])
    ) {
      this.removeEventListener('click', this.boardClicked);
    }
  }

  _disableBoardEvents() {
    if (this.hoverCell) {
      this.removeEventListener('mousemove', this.mouseOverCell);
      this.removeEventListener('mouseout', this.mouseOutCell);
    }
    document.removeEventListener(
      'board-cell__content-refresh',
      this.contentRefresh
    );
    document.removeEventListener(
      'board-cell__change-cell-data',
      this.setCellData
    );
    document.removeEventListener(
      'board-cell__change-all-cell-data',
      this.setCellsData
    );
    document.removeEventListener(
      'board-cell__change-cell-content',
      this.changeCellContent
    );
    document.removeEventListener(
      'board-cell__change-cells-content',
      this.changeCellsContent
    );
    document.removeEventListener(
      'board-cell__clear-cell-content',
      this._clearCellContentCallback
    );
    document.removeEventListener(
      'board-cell__clear-all-content',
      this._clearAllContentCallback
    );
    document.removeEventListener(
      'board-cell__content-clear-row',
      this._clearRowContentCallback
    );
    document.removeEventListener(
      'board-cell__content-clear-col',
      this._clearColContentCallback
    );
    document.removeEventListener(
      'board-cell__enable-board-click',
      this._enableBoardClick
    );
    document.removeEventListener(
      'board-cell__disable-board-click',
      this._disableBoardClick
    );
    this._disableBoardClick();
  }

  contentRefresh(e) {
    if (e.detail.id === this.id) {
      this.drawBoard();
    }
  }

  _updateCellData(x, y, content, textColor, bgColor = 'transparent') {
    this.cellsContent[x][y] = content;
    this.cellsTextColor[x][y] = textColor;
    this.cellsBgColor[x][y] = bgColor;
  }

  mouseOverCell(ev) {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((ev.clientX - rect.left) / this.cellSize);
    const y = Math.floor((ev.clientY - rect.top) / this.cellSize);
    if (x <= this.cols - 1 && y <= this.rows - 1 && x >= 0 && y >= 0) {
      if (
        (x !== this.mouseOverX || y !== this.mouseOverY) &&
        this.mouseOverY >= 0 &&
        this.mouseOverX >= 0
      ) {
        this._drawCellContent(
          this.mouseOverX * this.cellSize,
          this.mouseOverY * this.cellSize,
          this.cellsContent[this.mouseOverX][this.mouseOverY]
        );
      }
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      this.ctx.fillRect(
        this.mouseOverX * this.cellSize,
        this.mouseOverY * this.cellSize,
        this.cellSize - 1,
        this.cellSize - 1
      );
      this.mouseOverX = x;
      this.mouseOverY = y;
    }
  }

  mouseOutCell() {
    this._drawCellContent(
      this.mouseOverX * this.cellSize,
      this.mouseOverY * this.cellSize,
      this.cellsContent[this.mouseOverX][this.mouseOverY]
    );
  }

  drawBoard() {
    const width = this.cols * this.cellSize;
    const height = this.rows * this.cellSize;
    this.canvas = this.shadowRoot.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    for (let w = 0; w <= width; w += this.cellSize) {
      for (let h = 0; h <= height; h += this.cellSize) {
        if (!this.hideCellLines) {
          this.ctx.moveTo(w, 0);
          this.ctx.lineTo(w, height);
          this.ctx.moveTo(0, h);
          this.ctx.lineTo(width, h);
        }
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(w, h, this.cellSize, this.cellSize);
        this.ctx.strokeStyle = this.gridColor;
        this.ctx.stroke();
      }
    }
  }

  drawCellsContent() {
    for (let row = 0; row < this.rows; row += 1) {
      for (let col = 0; col < this.cols; col += 1) {
        const dx = col * this.cellSize;
        const dy = row * this.cellSize;
        if (this.cellsContent[col][row]) {
          this._drawCellContent(dx, dy, this.cellsContent[col][row]);
        } else {
          this.ctx.fillStyle = this.gridColor;
          this.ctx.fillRect(dx, dy, this.cellSize, this.cellSize);
        }
      }
    }
  }

  fillBgColor(cellx, celly, bgColor) {
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(
      cellx * this.cellSize,
      celly * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }

  drawBorder(cellx, celly, color, borderWith = 1) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = borderWith;
    this.ctx.strokeRect(
      cellx * this.cellSize,
      celly * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }

  _drawCellContent(
    cellx,
    celly,
    content = '',
    color = this.cellTextColor,
    bgColor = this.cellBgColor
  ) {
    // console.log(this.cellsContent[dx/this.cellSize][dy/this.cellSize]);
    if (
      this.redrawCells ||
      !this.cellsContent[cellx / this.cellSize][celly / this.cellSize]
    ) {
      this.fillBgColor(cellx, celly, bgColor);
    }

    if (
      content.match(/^(http|https):\/\/[^ "]+$/i) ||
      content.match(/(png|jpg|jpeg|gif|webp)$/i)
    ) {
      const img = new Image();
      img.src = content;
      img.onload = () => {
        const dxNow =
          this.cellSize > img.width
            ? cellx + (this.cellSize - img.width) / 2
            : cellx;
        const dyNow =
          this.cellSize > img.height
            ? celly + (this.cellSize - img.height) / 2
            : celly;
        const imgSizeX = this.cellSize > img.width ? img.width : this.cellSize;
        const imgSizeY =
          this.cellSize > img.height ? img.height : this.cellSize;
        // console.log(`(x,y): (${dxNow}, ${dyNow}) Img Size: ${imgSizeX}x${imgSizeY}`);
        this.ctx.drawImage(img, dxNow, dyNow, imgSizeX, imgSizeY);
      };
    } else {
      this.ctx.font = `bold ${this.fontSize}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillStyle = color;
      this.ctx.fillText(
        content,
        cellx + this.cellSize / 2,
        celly + this.cellSize / 2
      );
    }

    if (
      content === '' ||
      !this.cellsContent[cellx / this.cellSize][celly / this.cellSize]
    ) {
      // Definir los bordes de la celda
      this.ctx.beginPath();
      this.ctx.rect(cellx, celly, this.cellSize, this.cellSize); // Delimitar el área de la celda
      this.ctx.strokeStyle = this.gridColor;
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }

  drawCell(x, y) {
    const dx = x * this.cellSize;
    const dy = y * this.cellSize;
    this._drawCellContent(dx, dy, this.cellsContent[x][y]);
  }

  clearEventCell(x, y) {
    this.cellsWithoutEvent[x - 1][y - 1] = true;
  }

  setEventCell(x, y) {
    this.cellsWithoutEvent[x - 1][y - 1] = false;
  }

  setCellContent(x, y, content) {
    this.cellsContent[x][y] = content;
  }

  getCellContent(x, y) {
    return this.cellsContent[x][y];
  }

  setCellData(e) {
    if (e.detail.id === this.id) {
      this.setCellContent(e.detail.x, e.detail.y, e.detail.content);
    }
  }

  setCellsContent(cells) {
    this.cellsContent = [...cells];
  }

  setCellsData(ev) {
    if (ev.detail.id === this.id) {
      this.setCellsContent(ev.detail.content);
    }
  }

  _checkContent(detail) {
    // console.log(this.cellsContent[detail.cellx][detail.celly], detail.content, this.undo);
    if (
      this.cellsContent[detail.cellx][detail.celly] === detail.content &&
      this.undo
    ) {
      return [this.restoreContent, detail.color, detail.bgColor];
    }
    return [detail.content, detail.color, detail.bgcolor];
  }

  changeCellContent(ev) {
    if (ev.detail.id === this.id) {
      const { detail } = ev;
      const dx = detail.cellx * this.cellSize;
      const dy = detail.celly * this.cellSize;
      const [
        content = '',
        textColor = this.textColor,
        bgColor = this.backgroundColor,
      ] = this._checkContent(detail);
      // console.log(color, content);
      this._drawCellContent(dx, dy, content, textColor, bgColor);
      this._updateCellData(
        detail.cellx,
        detail.celly,
        content,
        textColor,
        bgColor
      );
    }
  }

  changeCellsContent(ev) {
    if (ev.detail.id === this.id) {
      const { detail } = ev;
      const { content, color, bgcolor } = detail;
      this.cellsContent = [...content];
      this.cellsTextColor = [...color];
      this.cellsBgColor = [...bgcolor];
      this.drawCellsContent();
    }
  }

  boardClicked(ev) {
    if (ev.target.id === this.id) {
      const rect = this.canvas.getBoundingClientRect();
      const cellx = Math.floor((ev.clientX - rect.left) / this.cellSize);
      const celly = Math.floor((ev.clientY - rect.top) / this.cellSize);
      const newEvDetail = {
        detail: {
          mousex: ev.clientX - rect.left,
          mousey: ev.clientY - rect.top,
          cellx,
          celly,
          bgcolor: this.cellsBgColor[cellx][celly],
          color: this.cellsTextColor[cellx][celly],
          content: this.cellsContent[cellx][celly],
        },
      };

      if (!this.cellsWithoutEvent[cellx][celly]) {
        if (this.parentElement[this.onclickCallback]) {
          this.parentElement[this.onclickCallback](newEvDetail);
        } else if (window[this.onclickCallback]) {
          window[this.onclickCallback](newEvDetail);
        }
      }
    }
  }

  clearColContent(colToClear) {
    for (let i = 0; i < this.rows; i += 1) {
      for (let j = 0; j < this.cols; j += 1) {
        if (j === colToClear) {
          this.cellsBgColor[i][j] = null;
          this.cellsTextColor[i][j] = null;
          this.cellsContent[i][j] = null;
        }
      }
    }
  }

  _clearColContentCallback(ev) {
    if (ev.detail.id === this.id) {
      this.clearColContent(ev.detail.col);
    }
  }

  clearRowContent(rowToClear) {
    for (let i = 0; i < this.rows; i += 1) {
      for (let j = 0; j < this.cols; j += 1) {
        if (i === rowToClear) {
          this.cellsBgColor[i][j] = null;
          this.cellsTextColor[i][j] = null;
          this.cellsContent[i][j] = null;
        }
      }
    }
  }

  _clearRowContentCallback(ev) {
    if (ev.detail.id === this.id) {
      this.clearRowContent(ev.detail.row);
    }
  }

  clearCellContent(x, y) {
    this.cellBgColor[x - 1][y - 1] = null;
    this.cellsContent[x - 1][y - 1] = null;
  }

  _clearCellContentCallback(ev) {
    if (ev.detail.id === this.id) {
      this.clearCellContent(ev.detail.cellx, ev.detail.celly);
    }
  }

  clearAllContent() {
    for (let i = 0; i < this.rows; i += 1) {
      for (let j = 0; j < this.cols; j += 1) {
        this.cellsBgColor[i][j] = null;
        this.cellsTextColor[i][j] = null;
        this.cellsContent[i][j] = null;
      }
    }
    this.drawBoard();
  }

  _clearAllContentCallback(ev) {
    if (ev.detail.id === this.id) {
      this.clearAllContent();
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('cols') || changedProperties.has('rows')) {
      this.drawBoard();
    }
  }

  firstUpdated() {
    const wcReadyEvent = new CustomEvent('wc-ready', {
      detail: {
        id: this.id,
        componentName: this.tagName,
        component: this,
      },
    });
    this.drawBoard();
    document.dispatchEvent(wcReadyEvent);
  }

  render() {
    return html`
      <h1>${this.title}</h1>
      <canvas
        id="${this.id}_canvas"
        width="${this.cols * this.cellSize}"
        height="${this.rows * this.cellSize}"
        class="board"
        role="img"
        aria-label="canvas with board"
        alt="Board with ${this.cols}x${this.rows}"
      ></canvas>
    `;
  }
}
