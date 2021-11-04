import { LitElement, html } from "lit-element";
import { BoardCellStyles } from "./board-cell-style";

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
       * Show Cell Lines
       * @property
       * @type { Boolean }
       */
      showCellLines: { type: Boolean, attribute: 'show-cell-lines' },
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
    this.showCellLines = false;
    this.boardClicked = this.boardClicked.bind(this);
    this._clearColContent = this._clearColContent.bind(this);
    this._clearRowContent = this._clearRowContent.bind(this);
    this._clearCellContent = this._clearCellContent.bind(this);
    this.changeCellContent = this.changeCellContent.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.onclickCallback && (this.parentElement[this.onclickCallback] || window[this.onclickCallback])) {
      this.addEventListener('click', this.boardClicked);
    }
    this.cellsContent = [];
    this.cellsWithoutEvent = [];
    for(let i=0; i<this.rows; i++) {
      this.cellsContent.push([]);
      this.cellsWithoutEvent.push([]);
      for(let j=0; j<this.cols; j++) {
        this.cellsContent[i].push(null);
        this.cellsWithoutEvent[i].push(false);
      }
    }
    this.showCellLines = (this.showCellLines === "true");
    document.addEventListener('board-change-cell-content', this.changeCellContent);
    document.addEventListener('board-clear-cell-content', this._clearCellContent);
    document.addEventListener('board-clear-all-content', this._clearAllContent);
    document.addEventListener('board-cell-content-clear-row', this._clearRowContent)
    document.addEventListener('board-cell-content-clear-col', this._clearColContent);
    // this.addEventListener('DOMSubtreeModified', this.cellContentChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.onclickCallback && (this.parentElement[this.onclickCallback] || window[this.onclickCallback])) {
      this.removeEventListener('click', this.boardClicked);
    }
    document.removeEventListener('board-change-cell-content', this.changeCellContent);
    document.removeEventListener('board-clear-cell-content', this._clearCellContent);
    document.removeEventListener('board-clear-all-content', this._clearAllContent);
    document.removeEventListener('board-cell-content-clear-row', this._clearRowContent)
    document.removeEventListener('board-cell-content-clear-col', this._clearColContent);
  }

  firstUpdated() {
    this.drawBoard();
  }

  drawBoard(board) {
    const width = this.rows * this.cellSize;
    const height = this.cols * this.cellSize;
    this.canvas = this.shadowRoot.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    for (let i = 0; i < width; i+=this.cellSize) {
      for (let j = 0; j < height; j+=this.cellSize) {
        if (this.showCellLines) {
          this.ctx.moveTo(i, 0);
          this.ctx.lineTo(i, width);
          this.ctx.moveTo(0, j);
          this.ctx.lineTo(height, j);
        }
        this.ctx.strokeStyle = '#ccc';
        this.ctx.stroke();
      }
    }
  }

  _drawCellsContent() {
    for(let i=0; i<this.rows; i++) {
      for(let j=0; j<this.cols; j++) {
        if(this.cellsContent[i][j]) {
          const dx = (j - 1) * this.cellSize;
          const dy = (i - 1) * this.cellSize;
          ctx.drawImage(this.cellsContent[i][j], dx, dy);
        }
      }
    }
  }

  _drawCellContent(x, y, dx, dy) {
    const content = this.cellsContent[x][y];
    if (content.match(/^#[0-9A-F]{6}$/i)) {
      this.ctx.fillStyle = content;
      this.ctx.fillRect(dx, dy, this.cellSize, this.cellSize);
    } else if (content.match(/^(http|https):\/\/[^ "]+$/i)) {
      const img = new Image();
      img.src = content;
      img.onload = () => {
        this.ctx.drawImage(img, dx, dy, this.cellSize, this.cellSize);
      }
    }
  }

  clearEventCell(x, y) {
    this.cellsWithoutEvent[x-1][y-1] = true;
  }

  setEventCell(x, y) {
    this.cellsWithoutEvent[x-1][y-1] = false;
  }

  setCellContent(x, y, content) {
    this.cellsContent[x][y] = content;
    this.requestUpdate();
  }

  changeCellContent(ev) {
    if (ev.detail.id == this.id) {
      const detail = ev.detail;
      const content = detail.content;
      const dx = (detail.cellx - 1) * this.cellSize;
      const dy = (detail.celly - 1) * this.cellSize;
      this.cellsContent[detail.cellx - 1][detail.celly - 1] = content;
      this._drawCellContent(detail.cellx - 1, detail.celly - 1, dx, dy);
    }
  }

  boardClicked(ev) {
    if (ev.target.id == this.id) {
      var rect = this.canvas.getBoundingClientRect();
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

  _clearColContent(ev) {
    if (ev.detail.id == this.id) {
      for(let i=0; i<this.rows; i++) {
        for(let j=0; j<this.cols; j++) {
          if(j == ev.detail.col) {
            this.cellsContent[i][j] = null;
          }
        }
      }
    }
  }

  _clearRowContent(ev) {
    if (ev.detail.id == this.id) {
      for(let i=0; i<this.rows; i++) {
        for(let j=0; j<this.cols; j++) {
          if(i == ev.detail.row) {
            this.cellsContent[i][j] = null;
          }
        }
      }
    }
  }

  _clearCellContent(ev) {
    if (ev.detail.id == this.id) {  
      this.cellsContent[ev.detail.cellx-1][ev.detail.celly-1] = null;
    }
  }

  _clearAllContent(ev) {
    if (ev.detail.id == this.id) {
      for(let i=0; i<this.rows; i++) {
        for(let j=0; j<this.cols; j++) {
          this.cellsContent[i][j] = null;
        }
      }
    }
  }

  render() {
    return html`
      <h1>${this.title}</h1>
      <canvas id="${this.id}_canvas" width="${this.cols * this.cellSize}" height="${this.rows * this.cellSize}" class="board"></canvas>
    `;
  }

}