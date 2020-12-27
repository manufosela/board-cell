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
       * 
       * @property
       * @type { Number }
       */
      col: { type: Number, attribute: 'data-col' },
      /**
       * 
       * @property
       * @type { Number }
       */
      row: { type: Number, attribute: 'data-row' },
      /**
       * 
       * @property
       * @type { String }
       */
      onclickCallback: {type: String, attribute: 'onclick' }
    }
  }

  static get styles() {
    return [BoardCellStyles];
  }

  constructor() {
    super();
    this._cellContent = [];
    this._oldCellContent = [];
    this._cellContentHTML = '';

    this.cellClicked = this.cellClicked.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._cellContent = [...this.querySelectorAll('*')];
    const div = document.createElement('div');
    this._cellContent.forEach((HTMLNode) => {
      const HTMLnodeCloned = HTMLNode.cloneNode(true);
      div.appendChild(HTMLnodeCloned);
    })
    this._cellContentHTML = div;
    if (this.onclickCallback && (this.parentElement[this.onclickCallback] || window[this.onclickCallback])) {
      this.addEventListener('click', this.cellClicked);
    }
    this.addEventListener('DOMSubtreeModified', this.cellContentChange);
  }

  cellClicked(ev) {
    console.log('cell clicked');

    if (this.parentElement[this.onclickCallback]) {
      this.parentElement[this.onclickCallback](ev);
    } else if(window[this.onclickCallback]) {
      window[this.onclickCallback](ev);
    }
  }

  cellContentChange(ev) {
    const newValue = ev.srcElement.innerHTML;
    if (this.innerHTML !== '') {
      console.log(`cell ${this.id} content change with "${newValue}"`);
      this._oldCellContent = this._cellContent;
      const div = document.createElement('div');
      this._cellContent = [...ev.srcElement.childNodes];
      this._cellContent.forEach((HTMLNode) => {
        const HTMLnodeCloned = HTMLNode.cloneNode(true);
        div.appendChild(HTMLnodeCloned);
      })
      this._cellContentHTML = div;
      this.requestUpdate();

      const boardCell__changeContentEvent = new CustomEvent('board-cell__change-content', {detail: {id: this.id, oldContent: this._oldCellContent, newContent: this._cellContent}});
      document.dispatchEvent(boardCell__changeContentEvent);
    }
  }

  render() {
    return html`${this._cellContentHTML}`;
  }

}