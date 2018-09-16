import utils from "../utils";
import { DownloadItem } from "electron";
import { doesNotThrow } from "assert";

describe("Launch", function() {
  this.timeout(10000);

  beforeEach(utils.beforeEach);
  afterEach(utils.afterEach);

  it("shows the proper application title", () => {
    return this.app.client.getTitle().then(title => {
      expect(title).to.equal("aspida");
    });
  });
});
