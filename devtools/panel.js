"use strict";
(() => {
  const API = "window.__cocosAnatomy";
  const $ = (id) => document.getElementById(id);
  let state = null;
  let treeSig = "";
  let xfSig = "";
  let busy = false;

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) {
      e.className = cls;
    }
    if (text !== undefined) {
      e.textContent = text;
    }
    return e;
  }

  function ev(expr) {
    return new Promise((resolve) => {
      chrome.devtools.inspectedWindow.eval(expr, (result, err) => {
        if (err) {
          resolve({ err });
        } else {
          resolve({ r: result });
        }
      });
    });
  }

  function cmd(name, a, b) {
    const args = [name, a, b].map((v) => JSON.stringify(v === undefined ? null : v)).join(",");
    return ev(API + " && " + API + ".cmd ? " + API + ".cmd(" + args + ") : null").then((res) => {
      poll();
      return res.r;
    });
  }

  function copyText(text, btn) {
    const ta = el("textarea");
    ta.value = text || "";
    ta.style.cssText = "position:fixed;left:-9999px;top:0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
    ta.remove();
    const old = btn.textContent;
    btn.textContent = ok ? "Copied ✓" : "Copy failed";
    setTimeout(() => {
      btn.textContent = old;
      render();
    }, 1200);
  }

  function inject() {
    $("bInject").disabled = true;
    fetch(chrome.runtime.getURL("src/anatomy.js"))
      .then((r) => r.text())
      .then((src) => ev(src))
      .then(() => {
        $("bInject").disabled = false;
        poll();
      });
  }

  function poll() {
    if (busy) {
      return;
    }
    busy = true;
    ev(API + " && " + API + ".panelState ? " + API + ".panelState() : null").then((res) => {
      busy = false;
      state = res.err ? null : res.r;
      if (!document.hidden) {
        render();
      }
    });
  }

  function renderBar() {
    const s = state;
    const live = !!(s && s.ready);
    $("bView").classList.toggle("on", !!(s && s.on));
    $("bView").textContent = s && s.on ? "Exit layer view" : "Layer view";
    $("bView").disabled = !live;
    $("bBack").disabled = !(s && s.back);
    $("bIa").disabled = !(s && (s.on || s.ia));
    $("bIa").classList.toggle("on", !!(s && s.ia));
    $("bIa").textContent = s && s.ia ? "▣ Back to layers" : "☝ Interact";
    $("bH3").disabled = !(s && (s.h3 || s.h3n));
    $("bH3").classList.toggle("on", !!(s && s.h3));
    $("bH3").textContent = s && s.h3 ? "Show 3D" : "Hide 3D";
    $("bPause").disabled = !live;
    $("bPause").classList.toggle("on", !!(s && s.paused));
    $("bPause").textContent = s && s.paused ? "▶ Resume" : "⏸ Pause";
    $("bStep").disabled = !live;
    $("oGap").textContent = (s ? s.gap : 1) + "×";
    ["bGapMinus", "bGapPlus", "bGapReset"].forEach((id) => {
      $(id).disabled = !(s && s.on);
    });
    if (!s) {
      $("status").textContent = "";
    } else if (!s.ready) {
      $("status").textContent = "waiting for the Cocos scene…";
    } else {
      $("status").textContent = (s.paused ? "PAUSED · " : "") + (s.on ? "layer view" : "scene tree") + " · " + s.v;
    }
  }

  function renderTree() {
    const s = state;
    $("treeHead").textContent = s.on ? s.title : "Scene (layer view off)";
    const sig = JSON.stringify(s.rows);
    if (sig === treeSig) {
      return;
    }
    treeSig = sig;
    const tree = $("tree");
    const keep = tree.scrollTop;
    tree.innerHTML = "";
    s.rows.forEach((r) => {
      const ghost = r.kind === "ghost";
      const row = el("div", "row" + (r.sel ? " sel" : "") + (r.off ? " off" : "") + (ghost ? " ghost" : ""));
      row.style.paddingLeft = 6 + r.depth * 14 + "px";
      const tw = el("span", "tw", r.kids ? (r.open ? "▾" : "▸") : "");
      if (r.kids) {
        tw.title = r.open ? "Collapse" : !ghost && r.can ? "Split into child layers" : "Show children";
        tw.onclick = (e) => {
          e.stopPropagation();
          cmd("row", r.id);
        };
      }
      row.appendChild(tw);
      row.appendChild(el("span", "idx", r.idx));
      row.appendChild(el("span", "nm", r.name));
      if (r.tag) {
        row.appendChild(el("span", "tag", r.tag));
      }
      row.title = r.kind === "layer" ? "Click: select · ▸ / double-click: split into child layers" : "Click: select · ▸ / double-click: show children";
      row.onclick = () => {
        cmd("select", r.id);
      };
      row.ondblclick = () => {
        if (r.kids) {
          cmd("row", r.id);
        }
      };
      if (r.kind === "layer") {
        row.onmouseenter = () => {
          cmd("hover", r.id);
        };
        row.onmouseleave = () => {
          cmd("hover", null);
        };
      }
      tree.appendChild(row);
    });
    tree.scrollTop = keep;
  }

  function stepOf(key) {
    return key[0] === "s" ? 0.01 : 1;
  }

  function modMul(e) {
    if (e.shiftKey) {
      return 10;
    }
    if (e.altKey) {
      return 0.1;
    }
    return 1;
  }

  function round(v) {
    return +(+v).toFixed(3);
  }

  function nudge(input, key, delta) {
    const v = round((+input.value || 0) + delta);
    input.value = String(v);
    cmd("xf", key, v);
  }

  function buildXf(sel) {
    const box = $("xf");
    box.innerHTML = "";
    const groups = [
      ["Position", "p", ["px", "py"].concat(sel.hasPz ? ["pz"] : [])],
      ["Rotation", "r", sel.rot3 ? ["rx", "ry", "rz"] : ["rz"]],
      ["Scale", "s", ["sx", "sy"].concat(sel.hasSz ? ["sz"] : [])],
    ];
    groups.forEach(([label, group, keys]) => {
      const row = el("div", "xrow");
      const b = el("b", undefined, label);
      b.dataset.keys = keys.join(",");
      row.appendChild(b);
      keys.forEach((key) => {
        const axis = el("span", "axis", key[1].toUpperCase());
        const input = el("input");
        input.type = "number";
        input.dataset.key = key;
        input.step = String(stepOf(key));
        axis.title = "Drag left / right to change (Shift ×10, Alt ×0.1)";
        axis.onpointerdown = (e) => {
          e.preventDefault();
          axis.setPointerCapture(e.pointerId);
          axis.onpointermove = (m) => {
            if (m.movementX) {
              nudge(input, key, m.movementX * stepOf(key) * modMul(m));
            }
          };
          axis.onpointerup = () => {
            axis.onpointermove = null;
            axis.onpointerup = null;
          };
        };
        input.onkeydown = (e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            nudge(input, key, (e.key === "ArrowUp" ? 1 : -1) * stepOf(key) * modMul(e));
          } else if (e.key === "Enter" || e.key === "Escape") {
            input.blur();
          }
        };
        input.onwheel = (e) => {
          if (document.activeElement !== input) {
            return;
          }
          e.preventDefault();
          nudge(input, key, (e.deltaY < 0 ? 1 : -1) * stepOf(key) * modMul(e));
        };
        input.onchange = () => {
          if (input.value !== "" && isFinite(+input.value)) {
            cmd("xf", key, +input.value);
          }
        };
        row.appendChild(axis);
        row.appendChild(input);
      });
      const r = el("button", undefined, "↺");
      r.title = "Reset " + label;
      r.onclick = () => {
        cmd("reset", group);
      };
      row.appendChild(r);
      box.appendChild(row);
    });
  }

  function renderSel() {
    const sel = state.sel;
    $("noSel").style.display = sel ? "none" : "block";
    $("selBox").style.display = sel ? "block" : "none";
    if (!sel) {
      xfSig = "";
      return;
    }
    $("path").textContent = sel.path;
    const cb = $("cActive");
    if (document.activeElement !== cb) {
      cb.checked = sel.active;
    }
    $("activeHint").textContent = sel.active && !sel.inH ? "(a parent is inactive)" : "";
    const sig = sel.id + "|" + sel.hasPz + sel.rot3 + sel.hasSz;
    if (sig !== xfSig) {
      xfSig = sig;
      buildXf(sel);
    }
    $("xf")
      .querySelectorAll("input")
      .forEach((input) => {
        const key = input.dataset.key;
        if (document.activeElement !== input) {
          input.value = String(sel.xf[key]);
        }
        input.classList.toggle("chg", !!sel.changed[key]);
      });
    $("xf")
      .querySelectorAll("b")
      .forEach((b) => {
        b.classList.toggle("chg", b.dataset.keys.split(",").some((k) => sel.changed[k]));
      });
    if (!$("bEdits").textContent.startsWith("Copied") && !$("bEdits").textContent.startsWith("Copy failed")) {
      $("bEdits").textContent = "All edits (" + sel.edits + ")";
    }
    $("bEdits").disabled = !sel.edits;
  }

  function render() {
    renderBar();
    const ok = !!(state && state.ready);
    $("empty").style.display = state ? (ok ? "none" : "block") : "block";
    $("main").style.display = ok ? "flex" : "none";
    if (!state) {
      $("emptyMsg").textContent = "Anatomy is not running on this page.";
      $("bInject").style.display = "";
      treeSig = "";
      return;
    }
    if (!ok) {
      $("emptyMsg").textContent = "Anatomy is loaded, waiting for a Cocos Creator scene…";
      $("bInject").style.display = "none";
      return;
    }
    renderTree();
    renderSel();
  }

  $("bInject").onclick = inject;
  $("bView").onclick = () => cmd("view");
  $("bBack").onclick = () => cmd("back");
  $("bIa").onclick = () => cmd("interact");
  $("bH3").onclick = () => cmd("h3");
  $("bPause").onclick = () => cmd("pause");
  $("bStep").onclick = () => cmd("step");
  $("bGapMinus").onclick = () => cmd("gap", 0.8);
  $("bGapPlus").onclick = () => cmd("gap", 1.25);
  $("bGapReset").onclick = () => cmd("gap", "reset");
  $("cActive").onchange = (e) => cmd("active", e.target.checked);
  $("bReset").onclick = () => cmd("reset");
  $("bCopy").onclick = (e) => {
    const btn = e.currentTarget;
    cmd("copy").then((text) => copyText(text, btn));
  };
  $("bEdits").onclick = (e) => {
    const btn = e.currentTarget;
    cmd("edits").then((text) => copyText(text, btn));
  };
  document.addEventListener("keydown", (e) => {
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) {
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }
    if (e.key === "p" || e.key === "P") {
      e.preventDefault();
      cmd("pause");
    } else if (e.key === ".") {
      e.preventDefault();
      cmd("step");
    } else if (e.key === "Escape") {
      e.preventDefault();
      cmd("back");
    }
  });
  chrome.devtools.network.onNavigated.addListener(() => {
    treeSig = "";
    xfSig = "";
  });
  setInterval(poll, 250);
  poll();
})();
