import { LitElement, html } from "lit";
import { BoardCellStyles } from "./board-cell-style.js";

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
    return "board-cell";
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
       * Callback function to be called when the board is clicked
       * @property
       * @type { String }
       */
      onclickCallback: {type: String, attribute: 'onclick' },
    }
  }

  static get styles() {
    return [BoardCellStyles];
  }

  constructor() {
    super();
    this.hideCellLines = false;
    this.hoverCell = false;
    this.mouseOverX = -1;
    this.mouseOverY = -1;
    this.cellsContent = [];
    this.cellsWithoutEvent = [];
    this.cellTextColor = '#000000';
    this.gridColor = '#CCCCCC';

    this.boardClicked = this.boardClicked.bind(this);
    this._clearColContentCallback = this._clearColContentCallback.bind(this);
    this._clearRowContentCallback = this._clearRowContentCallback.bind(this);
    this._clearCellContentCallback = this._clearCellContentCallback.bind(this);
    this.changeCellContent = this.changeCellContent.bind(this);
    this.mouseOverCell = this.mouseOverCell.bind(this);
    this.mouseOutCell = this.mouseOutCell.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.onclickCallback && (this.parentElement[this.onclickCallback] || window[this.onclickCallback])) {
      this.addEventListener('click', this.boardClicked);
    }
    for(let i=0; i<this.rows; i++) {
      this.cellsContent.push([]);
      this.cellsWithoutEvent.push([]);
      for(let j=0; j<this.cols; j++) {
        this.cellsContent[i].push(null);
        this.cellsWithoutEvent[i].push(false);
      }
    }
    this.style.width = `${this.rows * this.cellSize  }px`;
    if (this.hoverCell) {
      this.addEventListener('mousemove', this.mouseOverCell);
      this.addEventListener('mouseout', this.mouseOutCell);
    }
    document.addEventListener('board-change-cell-content', this.changeCellContent);
    document.addEventListener('board-clear-cell-content', this._clearCellContentCallback);
    document.addEventListener('board-clear-all-content', this._clearAllContentCallback);
    document.addEventListener('board-cell-content-clear-row', this._clearRowContentCallback)
    document.addEventListener('board-cell-content-clear-col', this._clearColContentCallback);
    // this.addEventListener('DOMSubtreeModified', this.cellContentChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.onclickCallback && (this.parentElement[this.onclickCallback] || window[this.onclickCallback])) {
      this.removeEventListener('click', this.boardClicked);
    }
    if (this.hoverCell) {
      this.removeEventListener('mousemove', this.mouseOverCell);
      this.removeEventListener('mouseout', this.mouseOutCell);
    }
    document.removeEventListener('board-change-cell-content', this.changeCellContent);
    document.removeEventListener('board-clear-cell-content', this._clearCellContentCallback);
    document.removeEventListener('board-clear-all-content', this._clearAllContentCallback);
    document.removeEventListener('board-cell-content-clear-row', this._clearRowContentCallback)
    document.removeEventListener('board-cell-content-clear-col', this._clearColContentCallback);
  }

  firstUpdated() {
    const wcReadyEvent = new CustomEvent('wc-ready', {
      detail: {
        id: this.id,
        wcTag: this.is,
      }
    });
    this.drawBoard();
    document.dispatchEvent(wcReadyEvent);
  }

  mouseOverCell(ev) {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((ev.clientX - rect.left) / this.cellSize);
    const y = Math.floor((ev.clientY - rect.top) / this.cellSize);
    if ((x <= this.cols-1 && y <= this.rows-1) && (x >= 0 && y >=0)) {
      if ((x !== this.mouseOverX || y !== this.mouseOverY) && (this.mouseOverY >= 0 && this.mouseOverX >=0)) {
        this._drawCellContent(this.mouseOverX * this.cellSize, this.mouseOverY * this.cellSize, this.cellsContent[this.mouseOverX][this.mouseOverY]);
      }
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      this.ctx.fillRect(this.mouseOverX * this.cellSize, this.mouseOverY * this.cellSize, this.cellSize-1, this.cellSize-1);
      this.mouseOverX = x;
      this.mouseOverY = y;
    }
  }

  mouseOutCell(ev) {
    this._drawCellContent(this.mouseOverX * this.cellSize, this.mouseOverY * this.cellSize, this.cellsContent[this.mouseOverX][this.mouseOverY]);
 }

  drawBoard() {
    const width = this.rows * this.cellSize;
    const height = this.cols * this.cellSize;
    this.canvas = this.shadowRoot.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    for (let i = 0; i <= width; i+=this.cellSize) {
      for (let j = 0; j <= height; j+=this.cellSize) {
        if (!this.hideCellLines) {
          this.ctx.moveTo(i, 0);
          this.ctx.lineTo(i, height);
          this.ctx.moveTo(0, j);
          this.ctx.lineTo(width, j);
        }
        this.ctx.strokeStyle = this.gridColor;
        this.ctx.stroke();
      }
    }
  }

  drawCellsContent() {
    for(let row=0; row<this.rows; row++) {
      for(let col=0; col<this.cols; col++) {
        const dx = col * this.cellSize;
        const dy = row * this.cellSize;
        if(this.cellsContent[col][row]) {
          this._drawCellContent(dx, dy, this.cellsContent[col][row]);
        } else {
          this.ctx.fillStyle = this.gridColor;
          this.ctx.fillRect(dx, dy, this.cellSize, this.cellSize);
        }
      }
    }
    this.requestUpdate();
  }

  _drawCellContent(dx, dy, content) {
    if (content.toLowerCase().match(/^#[0-9a-f]{6}$/i)) {
      this.ctx.fillStyle = content;
      this.ctx.fillRect(dx, dy, this.cellSize, this.cellSize);
      this.requestUpdate();
    } else if (content.match(/^(http|https):\/\/[^ "]+$/i) || content.match(/(png|jpg|jpeg|gif|svg)$/i)) {
      const img = new Image();
      img.src = content;
      img.onload = () => {
        this.ctx.drawImage(img, dx, dy, this.cellSize-1, this.cellSize-1);
        this.requestUpdate();
      }
    } else {
      this.ctx.font = `bold ${this.cellSize/2}px Arial`;
      this.ctx.fillStyle = this.cellTextColor;
      this.ctx.fillText(content, dx + this.cellSize/2 - 8, dy + this.cellSize/2 + 8);
      this.requestUpdate();
    }
    
  }

  drawCell(x, y) {
    const dx = x * this.cellSize;
    const dy = y * this.cellSize;
    this._drawCellContent(dx, dy, this.cellsContent[x][y]);
  }

  clearEventCell(x, y) {
    this.cellsWithoutEvent[x-1][y-1] = true;
  }

  setEventCell(x, y) {
    this.cellsWithoutEvent[x-1][y-1] = false;
  }

  setCellContent(x, y, content) {
    this.cellsContent[x][y] = content;
  }

  setCellsContent(cells) {
    this.cellsContent = [...cells];
  }

  changeCellContent(ev) {
    if (ev.detail.id == this.id) {
      const {detail} = ev;
      const {content} = detail;
      const dx = (detail.cellx - 1) * this.cellSize;
      const dy = (detail.celly - 1) * this.cellSize;
      this.cellsContent[detail.cellx - 1][detail.celly - 1] = content;
      this._drawCellContent(dx, dy, this.cellsContent[detail.cellx - 1][detail.celly - 1]);
    }
  }

  boardClicked(ev) {
    if (ev.target.id == this.id) {
      const rect = this.canvas.getBoundingClientRect();
      const cellx = Math.floor((ev.clientX - rect.left) / this.cellSize);
      const celly = Math.floor((ev.clientY - rect.top) / this.cellSize);
      const newEvDetail = { detail:
        {
          mousex: ev.clientX - rect.left,
          mousey: ev.clientY - rect.top,
          cellx: cellx + 1,
          celly: celly + 1,
          content: this.cellsContent[cellx][celly]
        }
      };    

      if (!this.cellsWithoutEvent[cellx][celly]) {
        if (this.parentElement[this.onclickCallback]) {
          this.parentElement[this.onclickCallback](newEvDetail);
        } else if(window[this.onclickCallback]) {
          window[this.onclickCallback](newEvDetail);
        }
      }
    }
  }

  clearColContent(colToClear) {
    for(let i=0; i<this.rows; i++) {
      for(let j=0; j<this.cols; j++) {
        if(j == colToClear) {
          this.cellsContent[i][j] = null;
        }
      }
    }
  }

  _clearColContentCallback(ev) {
    if (ev.detail.id == this.id) {
      this.clearColContent(ev.detail.col);
    }
  }

  clearRowContent(rowToClear) {
    for(let i=0; i<this.rows; i++) {
      for(let j=0; j<this.cols; j++) {
        if(i == rowToClear) {
          this.cellsContent[i][j] = null;
        }
      }
    }
  }

  _clearRowContentCallback(ev) {
    if (ev.detail.id == this.id) {
      this.clearRowContent(ev.detail.row);
    }
  }

  clearCellContent(x, y) {
    this.cellsContent[x-1][y-1] = null;
  }

  _clearCellContentCallback(ev) {
    if (ev.detail.id == this.id) {  
      this.clearCellContent(ev.detail.cellx, ev.detail.celly);
    }
  }

  clearAllContent() {
    for(let i=0; i<this.rows; i++) {
      for(let j=0; j<this.cols; j++) {
        this.cellsContent[i][j] = null;
      }
    }
  }

  _clearAllContentCallback(ev) {
    if (ev.detail.id == this.id) {
      this.clearAllContent();
    }
  }

  render() {
    return html`
      <h1>${this.title}</h1>
      <canvas id="${this.id}_canvas" width="${this.cols * this.cellSize}" height="${this.rows * this.cellSize}" class="board"></canvas>
    `;
  }

}