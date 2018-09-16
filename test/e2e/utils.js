import { Application } from "spectron";
import electron from "electron";

export default {
  afterEach() {
    this.timeout(10000);

    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  },
  beforeEach() {
    this.timeout(20000);

    this.app = new Application({
      path: electron,
      args: ["dist/electron/main.js"],
      startTimeout: 20000,
      waitTimeout: 20000
    });

    return this.app.start();
  }
};
