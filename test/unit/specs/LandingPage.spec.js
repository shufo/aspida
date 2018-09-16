import LandingPage from "@/components/LandingPage";
import Vue from "vue";

describe("LandingPage.vue", () => {
  it("should render correct contents", () => {
    const vm = new Vue({
      el: document.createElement("div"),
      render: h => h(LandingPage)
    }).$mount();

    expect(vm.$el.querySelector(".legend").textContent).to.contain("Bring");
  });
});
