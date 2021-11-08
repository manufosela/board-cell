# \<board-cell>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation

```bash
npm i board-cell
```

## Usage

```html
<script type="module">
  import 'board-cell/board-cell.js';
</script>

<board-cell></board-cell>
```

## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

## Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode run:

```bash
npm run test:watch
```

## Demoing with Storybook

To run a local instance of Storybook for your component, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run storybook:build
```

## Tooling configs

For most of the tools, the configuration is in the `package.json` to minimize the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`

# USE

## Global Events

The webcomponent listens the next global events:

- board-cell-refresh: to show the data from the board
- board-cell-change-data: to change the data of the board, but not refresh the board drawing
- board-cell-change-all-cell-data: to change the data of all the cells, but not refresh the board drawing
- board-cell-change-cell-content: to change the content of a cell and show it in the board
- board-cell-clear-cell-content: to clear the content of a cell
- board-cell-clear-all-content: to clear the content of all cells
- board-cell-content-clear-row: to clear the content of all cells in a row
- board-cell-content-clear-col: to clear the content of all cells in a column

All events fired must have the following structure the **id** of the web-component.

## Local events

The webcomponent listen the nex local events:

- click: When a cell is clicked execute the `onClick` callback, passed by attribute.
- mouseover and mouseout: if the **hover-cell** attribute is true.

## Events disptach

- wc-ready: dispatch this event when firstUpdate is done
