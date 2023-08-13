import { html, fixture, expect } from '@open-wc/testing';

describe('BoardCell', () => {
  // Tests that the board is rendered correctly with the default values
  it('should render the board with the default values', async () => {
    const boardCell = await fixture(
      html`<board-cell id="testwc"></board-cell>`
    );

    function wcReady(ev) {
      const { id, componentName } = ev.detail;
      if (componentName === 'BOARD-CELL' && id === 'testwc') {
        // Act
        const actualCols = boardCell.cols;
        const actualRows = boardCell.rows;
        const actualCellSize = boardCell.cellSize;
        const actualFontSize = boardCell.fontSize;
        const actualTitle = boardCell.title;
        const actualHideCellLines = boardCell.hideCellLines;
        const actualHoverCell = boardCell.hoverCell;
        const actualUndo = boardCell.undo;
        const actualRedrawCells = boardCell.redrawCells;
        const actualMouseOverX = boardCell.mouseOverX;
        const actualMouseOverY = boardCell.mouseOverY;
        const actualCellsBgColor = boardCell.cellsBgColor;
        const actualCellsTextColor = boardCell.cellsTextColor;
        const actualCellsContent = boardCell.cellsContent;
        const actualCellTextColor = boardCell.cellTextColor;
        const actualCellBgColor = boardCell.cellBgColor;
        const actualGridColor = boardCell.gridColor;
        const actualBackgroundColor = boardCell.backgroundColor;

        // Expected values
        const expectedCols = 5;
        const expectedRows = 5;
        const expectedCellSize = 50;
        const expectedFontSize = expectedCellSize * 0.5;
        const expectedTitle = 'board-cell';
        const expectedHideCellLines = false;
        const expectedHoverCell = false;
        const expectedUndo = false;
        const expectedRedrawCells = false;
        const expectedMouseOverX = -1;
        const expectedMouseOverY = -1;
        const expectedCellsBgColor = [];
        const expectedCellsTextColor = [];
        const expectedCellsContent = [];
        const expectedCellTextColor = '#000000';
        const expectedCellBgColor = '#FFFFFF';
        const expectedGridColor = '#CCCCCC';
        const expectedBackgroundColor = '#FFFFFF';

        // Assert
        expect(actualCols).to.equal(expectedCols);
        expect(actualRows).to.equal(expectedRows);
        expect(actualCellSize).to.equal(expectedCellSize);
        expect(actualFontSize).to.equal(expectedFontSize);
        expect(actualTitle).to.equal(expectedTitle);
        expect(actualHideCellLines).to.equal(expectedHideCellLines);
        expect(actualHoverCell).to.equal(expectedHoverCell);
        expect(actualUndo).to.equal(expectedUndo);
        expect(actualRedrawCells).to.equal(expectedRedrawCells);
        expect(actualMouseOverX).to.equal(expectedMouseOverX);
        expect(actualMouseOverY).to.equal(expectedMouseOverY);
        expect(actualCellsBgColor).to.deep.equal(expectedCellsBgColor);
        expect(actualCellsTextColor).to.deep.equal(expectedCellsTextColor);
        expect(actualCellsContent).to.deep.equal(expectedCellsContent);
        expect(actualCellTextColor).to.equal(expectedCellTextColor);
        expect(actualCellBgColor).to.equal(expectedCellBgColor);
        expect(actualGridColor).to.equal(expectedGridColor);
        expect(actualBackgroundColor).to.equal(expectedBackgroundColor);
      }
    }

    document.addEventListener('wc-ready', wcReady);
  });

  // Tests that the board is rendered correctly with the minimum number of rows and columns
  it('should render the board with the minimum number of rows and columns', async () => {
    // Arrange
    const boardCell = await fixture(
      html`<board-cell id=testwc"" cols="1" rows="1"></board-cell>`
    );

    function wcReady(ev) {
      const { id, componentName } = ev.detail;
      if (componentName === 'BOARD-CELL' && id === 'testwc') {
        const expectedCols = 1;
        const expectedRows = 1;
        const expectedCellSize = 50;
        const expectedFontSize = expectedCellSize * 0.5;

        // Act
        boardCell.cols = 1;
        boardCell.rows = 1;
        const actualCols = boardCell.cols;
        const actualRows = boardCell.rows;
        const actualCellSize = boardCell.cellSize;
        const actualFontSize = boardCell.fontSize;

        // Assert
        expect(actualCols).to.equal(expectedCols);
        expect(actualRows).to.equal(expectedRows);
        expect(actualCellSize).to.equal(expectedCellSize);
        expect(actualFontSize).to.equal(expectedFontSize);
      }
    }

    document.addEventListener('wc-ready', wcReady);
  });

  // Tests that the board is rendered correctly with the maximum number of rows and columns
  it('should render the board with the maximum number of rows and columns', async () => {
    // Arrange
    const boardCell = await fixture(
      html`<board-cell
        id="testwc"
        cols="100"
        rows="100"
        cell-size="5"
      ></board-cell>`
    );

    function wcReady(ev) {
      const { id, componentName } = ev.detail;
      if (componentName === 'BOARD-CELL' && id === 'testwc') {
        // Arrange
        const expectedCols = 100;
        const expectedRows = 100;
        const expectedCellSize = 5;
        const expectedFontSize = expectedCellSize * 0.5;

        // Act
        boardCell.cols = 100;
        boardCell.rows = 100;
        const actualCols = boardCell.cols;
        const actualRows = boardCell.rows;
        const actualCellSize = boardCell.cellSize;
        const actualFontSize = boardCell.fontSize;

        // Assert
        expect(actualCols).to.equal(expectedCols);
        expect(actualRows).to.equal(expectedRows);
        expect(actualCellSize).to.equal(expectedCellSize);
        expect(actualFontSize).to.equal(expectedFontSize);
      }
    }

    document.addEventListener('wc-ready', wcReady);
  });

  // Tests that the cell content is updated correctly
  it('should update the cell content correctly', async () => {
    // Arrange
    const boardCell = await fixture(
      html`<board-cell
        id="testwc"
        cols="100"
        rows="100"
        cell-size="5"
      ></board-cell>`
    );

    function wcReady(ev) {
      const { id, componentName } = ev.detail;
      if (componentName === 'BOARD-CELL' && id === 'testwc') {
        const expectedContent = 'New Content';

        // Act
        boardCell.setCellContent(0, 0, expectedContent);
        const actualContent = boardCell.getCellContent(0, 0);

        // Assert
        expect(actualContent).to.equal(expectedContent);
      }
    }

    document.addEventListener('wc-ready', wcReady);
  });

  // Tests that the cell content is cleared correctly
  it('should clear the cell content correctly', async () => {
    // Arrange
    const boardCell = await fixture(html`<board-cell></board-cell>`);

    function wcReady(ev) {
      const { id, componentName } = ev.detail;
      if (componentName === 'BOARD-CELL' && id === 'testwc') {
        const initialContent = 'Initial Content';
        const expectedContent = null;

        // Act
        boardCell.setCellContent(0, 0, initialContent);
        boardCell.clearCellContent(0, 0);
        const actualContent = boardCell.getCellContent(0, 0);

        // Assert
        expect(actualContent).to.equal(expectedContent);
      }
    }

    document.addEventListener('wc-ready', wcReady);
  });

  // Tests that all cell content is cleared correctly
  it('should clear all cell content correctly', async () => {
    // Arrange
    const boardCell = await fixture(html`<board-cell></board-cell>`);

    function wcReady(ev) {
      const { id, componentName } = ev.detail;
      if (componentName === 'BOARD-CELL' && id === 'testwc') {
        const initialContent = 'Initial Content';
        const expectedContent = null;

        // Act
        boardCell.setCellContent(0, 0, initialContent);
        boardCell.clearAllContent();
        const actualContent = boardCell.getCellContent(0, 0);

        // Assert
        expect(actualContent).to.equal(expectedContent);
      }
    }

    document.addEventListener('wc-ready', wcReady);
  });

  // Tests that the board is redrawn correctly when the content is refreshed
  it('should redraw the board correctly when the content is refreshed', async () => {
    // Arrange
    const boardCell = await fixture(html`<board-cell></board-cell>`);

    function wcReady(ev) {
      const { id, componentName } = ev.detail;
      if (componentName === 'BOARD-CELL' && id === 'testwc') {
        const expectedCols = 5;
        const expectedRows = 5;
        const expectedCellSize = 50;
        const expectedFontSize = expectedCellSize * 0.5;
        const expectedTitle = 'board-cell';
        const expectedHideCellLines = false;
        const expectedHoverCell = false;
        const expectedUndo = false;
        const expectedRedrawCells = false;
        const expectedMouseOverX = -1;
        const expectedMouseOverY = -1;
        const expectedCellsBgColor = [];
        const expectedCellsTextColor = [];
        const expectedCellsContent = [];
        const expectedCellTextColor = '#000000';
        const expectedCellBgColor = '#FFFFFF';
        const expectedGridColor = '#CCCCCC';
        const expectedBackgroundColor = '#FFFFFF';

        // Act
        boardCell.dispatchEvent(
          new CustomEvent('board-cell__content-refresh', {
            detail: {
              id: boardCell.id,
            },
          })
        );
        const actualCols = boardCell.cols;
        const actualRows = boardCell.rows;
        const actualCellSize = boardCell.cellSize;
        const actualFontSize = boardCell.fontSize;
        const actualTitle = boardCell.title;
        const actualHideCellLines = boardCell.hideCellLines;
        const actualHoverCell = boardCell.hoverCell;
        const actualUndo = boardCell.undo;
        const actualRedrawCells = boardCell.redrawCells;
        const actualMouseOverX = boardCell.mouseOverX;
        const actualMouseOverY = boardCell.mouseOverY;
        const actualCellsBgColor = boardCell.cellsBgColor;
        const actualCellsTextColor = boardCell.cellsTextColor;
        const actualCellsContent = boardCell.cellsContent;
        const actualCellTextColor = boardCell.cellTextColor;
        const actualCellBgColor = boardCell.cellBgColor;
        const actualGridColor = boardCell.gridColor;
        const actualBackgroundColor = boardCell.backgroundColor;

        // Assert
        expect(actualCols).to.equal(expectedCols);
        expect(actualRows).to.equal(expectedRows);
        expect(actualCellSize).to.equal(expectedCellSize);
        expect(actualFontSize).to.equal(expectedFontSize);
        expect(actualTitle).to.equal(expectedTitle);
        expect(actualHideCellLines).to.equal(expectedHideCellLines);
        expect(actualHoverCell).to.equal(expectedHoverCell);
        expect(actualUndo).to.equal(expectedUndo);
        expect(actualRedrawCells).to.equal(expectedRedrawCells);
        expect(actualMouseOverX).to.equal(expectedMouseOverX);
        expect(actualMouseOverY).to.equal(expectedMouseOverY);
        expect(actualCellsBgColor).to.deep.equal(expectedCellsBgColor);
        expect(actualCellsTextColor).to.deep.equal(expectedCellsTextColor);
        expect(actualCellsContent).to.deep.equal(expectedCellsContent);
        expect(actualCellTextColor).to.equal(expectedCellTextColor);
        expect(actualCellBgColor).to.equal(expectedCellBgColor);
        expect(actualGridColor).to.equal(expectedGridColor);
        expect(actualBackgroundColor).to.equal(expectedBackgroundColor);
      }
    }

    document.addEventListener('wc-ready', wcReady);
  });

  // Tests that the cell content is changed correctly when the corresponding event is triggered
  it('should change the cell content correctly when the corresponding event is triggered', async () => {
    // Arrange
    const boardCell = await fixture(html`<board-cell></board-cell>`);

    function wcReady(ev) {
      const { id, componentName } = ev.detail;
      if (componentName === 'BOARD-CELL' && id === 'testwc') {
        const expectedContent = 'New Content';

        // Act
        boardCell.dispatchEvent(
          new CustomEvent('board-cell__change-cell-content', {
            detail: {
              id: boardCell.id,
              cellx: 0,
              celly: 0,
              content: expectedContent,
            },
          })
        );
        const actualContent = boardCell.getCellContent(0, 0);

        // Assert
        expect(actualContent).to.equal(expectedContent);
      }
    }

    document.addEventListener('wc-ready', wcReady);
  });

  // Tests that the column content is cleared correctly when the corresponding event is triggered
  it('should clear the column content correctly when the corresponding event is triggered', async () => {
    // Arrange
    const boardCell = await fixture(html`<board-cell></board-cell>`);

    function wcReady(ev) {
      const { id, componentName } = ev.detail;
      if (componentName === 'BOARD-CELL' && id === 'testwc') {
        const initialContent = 'Initial Content';
        const expectedContent = null;

        // Act
        boardCell.setCellContent(0, 0, initialContent);
        boardCell.dispatchEvent(
          new CustomEvent('board-cell__content-clear-col', {
            detail: {
              id: boardCell.id,
              col: 0,
            },
          })
        );
        const actualContent = boardCell.getCellContent(0, 0);

        // Assert
        expect(actualContent).to.equal(expectedContent);
      }
    }

    document.addEventListener('wc-ready', wcReady);
  });

  // Tests that the row content is cleared correctly when the corresponding event is triggered
  it('should clear the row content correctly when the corresponding event is triggered', async () => {
    // Arrange
    const boardCell = await fixture(html`<board-cell></board-cell>`);

    function wcReady(ev) {
      const { id, componentName } = ev.detail;
      if (componentName === 'BOARD-CELL' && id === 'testwc') {
        const initialContent = 'Initial Content';
        const expectedContent = null;

        // Act
        boardCell.setCellContent(0, 0, initialContent);
        boardCell.dispatchEvent(
          new CustomEvent('board-cell__content-clear-row', {
            detail: {
              id: boardCell.id,
              row: 0,
            },
          })
        );
        const actualContent = boardCell.getCellContent(0, 0);

        // Assert
        expect(actualContent).to.equal(expectedContent);
      }
    }

    document.addEventListener('wc-ready', wcReady);
  });

  // Tests that the cell is clicked and the corresponding event is triggered
  it('should trigger the click event when the cell is clicked', async () => {
    // Arrange
    const boardCell = await fixture(html`<board-cell></board-cell>`);

    function wcReady(ev) {
      const { id, componentName } = ev.detail;
      if (componentName === 'BOARD-CELL' && id === 'testwc') {
        const expectedEvent = new CustomEvent('board-cell__click', {
          detail: {
            id: boardCell.id,
            mousex: 0,
            mousey: 0,
            cellx: 0,
            celly: 0,
            bgcolor: null,
            color: null,
            content: null,
          },
        });
        let actualEvent;
        boardCell.addEventListener('board-cell__click', e => {
          actualEvent = e;
        });

        // Act
        boardCell.boardClicked({
          target: {
            id: boardCell.id,
          },
          clientX: 0,
          clientY: 0,
        });

        // Assert
        expect(actualEvent).to.deep.equal(expectedEvent);
      }
    }

    document.addEventListener('wc-ready', wcReady);
  });

  // Tests that the board click is disabled correctly when the corresponding event is triggered
  it('should disable the board click correctly when the corresponding event is triggered', async () => {
    // Arrange
    const boardCell = await fixture(html`<board-cell></board-cell>`);

    function wcReady(ev) {
      const { id, componentName } = ev.detail;
      if (componentName === 'BOARD-CELL' && id === 'testwc') {
        const expectedEvent = new CustomEvent(
          'board-cell__disable-board-click',
          {
            detail: {
              id: boardCell.id,
            },
          }
        );
        let actualEvent;
        boardCell.addEventListener('board-cell__disable-board-click', e => {
          actualEvent = e;
        });

        // Act
        boardCell.dispatchEvent(
          new CustomEvent('board-cell__disable-board-click', {
            detail: {
              id: boardCell.id,
            },
          })
        );

        // Assert
        expect(actualEvent).to.deep.equal(expectedEvent);
      }
    }

    document.addEventListener('wc-ready', wcReady);
  });
});
