import { css } from 'lit-element';

export const BoardCellStyles = css`
  :host {
    display: block;
    margin: 1rem;
    --default-main-color: #000;
    border: var(--cell-border, 1px solid #ddd);
    display:flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`;