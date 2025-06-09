import HomePage from "@/app/page";

import "@/tests/util/match-media.mock";

import { render } from "@/tests/util/test-utils";

describe("Page", () => {
  it("renders home page", () => {
    render(<HomePage />);
  });
});
