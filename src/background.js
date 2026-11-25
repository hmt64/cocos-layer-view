"use strict";
(() => {
  function c(e) {
    let t = { tabId: e, allFrames: !0 };
    chrome.scripting
      .executeScript({ target: t, world: "MAIN", files: ["src/anatomy.js"] })
      .then(function () {
        return chrome.scripting.executeScript({
          target: t,
          world: "MAIN",
          func: function () {
            let n = window;
            return (
              window.dispatchEvent(new CustomEvent("cocos-anatomy:toggle")),
              !!(n.cc && n.cc.director && n.cc.director.getScene && n.cc.director.getScene())
            );
          },
        });
      })
      .then(function (n) {
        n.some(function (o) {
          return o.result;
        }) ||
          (chrome.action.setBadgeText({ tabId: e, text: "N/A" }),
          setTimeout(function () {
            chrome.action.setBadgeText({ tabId: e, text: "" });
          }, 1500));
      })
      .catch(function () {});
  }
  chrome.action.onClicked.addListener(function (e) {
    e.id != null && c(e.id);
  });
  chrome.commands.onCommand.addListener(function (e, t) {
    e === "toggle-layer-view" && t && t.id != null && c(t.id);
  });
  function r() {
    chrome.commands.getAll(function (e) {
      let t = e.find(function (o) {
          return o.name === "toggle-layer-view";
        }),
        n = t && t.shortcut ? " (" + t.shortcut + ")" : "";
      chrome.action.setTitle({ title: "Cocos Anatomy (Custom): toggle layer view" + n });
    });
  }
  chrome.runtime.onInstalled.addListener(function (e) {
    r(), e.reason === "install" && chrome.tabs.create({ url: chrome.runtime.getURL("welcome.html") });
  });
  chrome.runtime.onStartup.addListener(r);
})();
