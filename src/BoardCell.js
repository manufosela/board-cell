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
       * Board title
       * @property
       * @type { String }
       */
      title: { type: String },
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
    this.cols = 5;
    this.rows = 5;
    this.cellSize = 50;
    this.title = 'board-cell';
    this.id = `board-cell__${Math.random().toString(36).substring(2, 15)}`;
    this.hideCellLines = false;
    this.hoverCell = false;
    this.mouseOverX = -1;
    this.mouseOverY = -1;
    this.cellsBgColor = [];
    this.cellsContent = [];
    this.cellsWithoutEvent = [];
    this.cellTextColor = '#000000';
    this.gridColor = '#CCCCCC';
    this.backgroundColor = '#FFFFFF';

    this.boardClicked = this.boardClicked.bind(this);
    this.setCellData = this.setCellData.bind(this);
    this.setCellsData = this.setCellsData.bind(this);
    this.contentRefresh = this.contentRefresh.bind(this);
    this._clearColContentCallback = this._clearColContentCallback.bind(this);
    this._clearRowContentCallback = this._clearRowContentCallback.bind(this);
    this._clearCellContentCallback = this._clearCellContentCallback.bind(this);
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
    for (let i = 0; i < this.rows; i += 1) {
      this.cellsBgColor.push([]);
      this.cellsContent.push([]);
      this.cellsWithoutEvent.push([]);
      for (let j = 0; j < this.cols; j += 1) {
        this.cellsBgColor[i].push(null);
        this.cellsContent[i].push(null);
        this.cellsWithoutEvent[i].push(false);
      }
    }
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

  _drawCellContent(dx, dy, content, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(dx, dy, this.cellSize, this.cellSize);

    if (
      content.match(/^(http|https):\/\/[^ "]+$/i) ||
      content.match(/(png|jpg|jpeg|gif|svg)$/i)
    ) {
      const img = new Image();
      img.src = content;
      img.onload = () => {
        this.ctx.drawImage(img, dx, dy, this.cellSize - 1, this.cellSize - 1);
      };
    } else {
      this.ctx.font = `bold ${this.cellSize / 2}px Arial`;
      this.ctx.fillStyle = this.cellTextColor;
      this.ctx.fillText(
        content,
        dx + this.cellSize / 2 - 8,
        dy + this.cellSize / 2 + 8
      );
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

  changeCellContent(ev) {
    if (ev.detail.id === this.id) {
      const { detail } = ev;
      const { content, color } = detail;
      const dx = detail.cellx * this.cellSize;
      const dy = detail.celly * this.cellSize;
      this.cellsBgColor[detail.cellx][detail.celly] = color;
      this.cellsContent[detail.cellx][detail.celly] = content;
      this._drawCellContent(
        dx,
        dy,
        this.cellsContent[detail.cellx][detail.celly],
        this.cellsBgColor[detail.cellx][detail.celly]
      );
      this.boardClicked(ev);
    }
  }

  changeCellsContent(ev) {
    if (ev.detail.id === this.id) {
      const { detail } = ev;
      const { content, color } = detail;
      this.cellsContent = [...content];
      this.cellsBgColor = [...color];
      this.drawCellsContent();
      this.boardClicked(ev);
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
          color: this.cellsBgColor[cellx][celly],
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
        this.cellsContent[i][j] = null;
      }
    }
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
        alt="Mineswipper board with ${this.cols}x${this.rows}"
      ></canvas>
    `;
  }
}
