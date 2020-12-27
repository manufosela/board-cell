/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
import { html, fixture, expect } from "@open-wc/testing";
import "../board-cell";

describe("BoardCell", () => {
  it("should have the basic template", async () => {
    const el = await fixture(
      html`
        <board-cell></board-cell>
      `
    );
    const base = el.shadowRoot.querySelector(".board-cell");

    expect(base).not.to.be.null;
    expect(el).dom.to.equalSnapshot();
  });
});
