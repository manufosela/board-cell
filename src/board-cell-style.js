import { css } from 'lit';

export const BoardCellStyles = css`
  :host {
    --default-main-color: #000;
    --cell-background-color: #fff;
    --cell-border-color: #ddd;
    --cell-color: var(--default-main-color);
    margin: 1rem;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width:100%;
    height:100%;
  }

  .board {
    margin:0;
    padding:0;
    border: var(--cell-border, 1px solid #ddd);
    background-color: var(--cell-background-color, #fff);
  }

  .cell {
    color: var(--cell-color, #000);
  }
`;