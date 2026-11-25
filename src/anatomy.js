"use strict";
(() => {
  var st = (T, A, k) => Math.min(k, Math.max(A, T));
  function Jt([T, A, k]) {
    (T /= 255), (A /= 255), (k /= 255);
    let w = Math.max(T, A, k),
      O = Math.min(T, A, k),
      D = (w + O) / 2,
      W = w - O;
    if (!W) return [0, 0, D];
    let U = W / (1 - Math.abs(2 * D - 1));
    return [
      (w === T ? (A - k) / W + (A < k ? 6 : 0) : w === A ? (k - T) / W + 2 : (T - A) / W + 4) * 60,
      U,
      D,
    ];
  }
  function je(T, A, k) {
    let w = (1 - Math.abs(2 * k - 1)) * A,
      O = w * (1 - Math.abs(((T / 60) % 2) - 1)),
      D = k - w / 2,
      [W, U, j] =
        T < 60
          ? [w, O, 0]
          : T < 120
            ? [O, w, 0]
            : T < 180
              ? [0, w, O]
              : T < 240
                ? [0, O, w]
                : T < 300
                  ? [O, 0, w]
                  : [w, 0, O];
    return [Math.round((W + D) * 255), Math.round((U + D) * 255), Math.round((j + D) * 255)];
  }
  var $t = ([T, A, k]) => "#" + [T, A, k].map((w) => w.toString(16).padStart(2, "0")).join(""),
    se = (T, A, k) => $t(je(T, A, k));
  function Qt([T, A, k]) {
    let w = (O) => ((O /= 255), O <= 0.03928 ? O / 12.92 : Math.pow((O + 0.055) / 1.055, 2.4));
    return 0.2126 * w(T) + 0.7152 * w(A) + 0.0722 * w(k);
  }
  function ct(T, A) {
    let k = Qt(T),
      w = Qt(A);
    return (Math.max(k, w) + 0.05) / (Math.min(k, w) + 0.05);
  }
  function en(T) {
    let A = new Float64Array(96),
      k = 0,
      w = 0;
    for (let { data: j, weight: ee } of T)
      for (let ce = 0; ce < j.length; ce += 4) {
        if (j[ce + 3] < 128) continue;
        let me = [j[ce], j[ce + 1], j[ce + 2]],
          [Ue, ke, Se] = Jt(me);
        if (((k += ee), Se < 0.12 || Se > 0.92 || ke < 0.2)) continue;
        let ge = ee * ke,
          ye = (Math.floor(Ue / (360 / 24)) % 24) * 4;
        (A[ye] += me[0] * ge),
          (A[ye + 1] += me[1] * ge),
          (A[ye + 2] += me[2] * ge),
          (A[ye + 3] += ge),
          (w += ee);
      }
    if (!k || w / k < 0.08) return null;
    let O = -1,
      D = 0;
    for (let j = 0; j < 24; j++) {
      let ee = A[j * 4 + 3] + 0.5 * (A[((j + 1) % 24) * 4 + 3] + A[((j + 24 - 1) % 24) * 4 + 3]);
      ee > D && ((D = ee), (O = j));
    }
    if (O < 0) return null;
    let W = O * 4,
      U = A[W + 3];
    return [Math.round(A[W] / U), Math.round(A[W + 1] / U), Math.round(A[W + 2] / U)];
  }
  function tn(T, A) {
    let k = {};
    if (T) {
      let [w, O] = Jt(T),
        D = st(O * 0.4, 0.08, 0.3),
        W = je(w, D, 0.11),
        U = 0.62,
        j = st(O, 0.55, 0.92);
      for (; U < 0.82 && ct(je(w, j, U), W) < 4.5; ) U += 0.03;
      let ee = je(w, j, U);
      (k["--ca-bg"] = se(w, D, 0.11) + "f5"),
        (k["--ca-line"] = se(w, D, 0.22)),
        (k["--ca-cell"] = se(w, D, 0.16)),
        (k["--ca-cell2"] = se(w, D, 0.13)),
        (k["--ca-deep"] = se(w, D, 0.08)),
        (k["--ca-text"] = se(w, 0.15, 0.91)),
        (k["--ca-muted"] = se(w, 0.1, 0.62)),
        (k["--ca-muted2"] = se(w, 0.12, 0.74)),
        (k["--ca-accent"] = $t(ee)),
        (k["--ca-accent2"] = se(w, j, st(U + 0.08, 0, 0.9))),
        (k["--ca-on"] = ct([0, 0, 0], ee) >= ct([255, 255, 255], ee) ? "#101114" : "#ffffff");
    }
    return A && (k["--ca-font"] = na(A)), k;
  }
  function na(T) {
    return '"' + T.replace(/["\;{}]/g, "") + '", system-ui, sans-serif';
  }
  function nn(T, A) {
    for (let k of Object.keys(A)) T.style.setProperty(k, A[k]);
  }
  (function () {
    let T = "0.3.0-custom",
      A = window.__cocosAnatomy;
    if (A) {
      if (A.version === T || !A.dispose) return;
      A.dispose();
    }
    let k = [],
      w = (e, t, n, o) => {
        e.addEventListener(t, n, o), k.push(() => e.removeEventListener(t, n, o));
      },
      O = !1,
      D = 32,
      W = 16,
      U = 45,
      j = 0.96,
      ee = 9,
      ce = 12,
      me = 160,
      Ue = 100 / 255,
      ke = 0.45,
      Se = 5,
      ge = 0.3,
      ye = 3,
      an = 40,
      on = 25,
      lt =
        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1.8 12S5.6 5.2 12 5.2 22.2 12 22.2 12 18.4 18.8 12 18.8 1.8 12 1.8 12z"/><circle cx="12" cy="12" r="3.1"/></svg>',
      rn = lt.replace("</svg>", '<path d="M4.2 4.2l15.6 15.6"/></svg>'),
      sn =
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12.8 2.5C10.8 4.7 10.8 7.7 12 10.4L13.2 19.6"/><path d="M12 10.4C8.9 9.6 6.6 11.7 7.3 14.2c.6 2.2 3.3 3.1 5.2 1.9 1.9-1.2 1.8-4-.1-5-1.6-.9-3.3 0-3.4 1.5"/><path d="M13.2 19.6a2 2 0 1 1-1.9-2"/></svg>',
      _ = "cocos-anatomy",
      z = () => window.cc,
      x = (e) => {
        try {
          return e();
        } catch (t) {
          console.warn("[cocos-anatomy]", t);
        }
      },
      Xe = () => {
        let e = z();
        return !!(e && e.director && e.game && e.Node && e.director.getScene && e.director.getScene());
      };
    function cn() {
      let e = String(z().ENGINE_VERSION || ""),
        t = /^(\d+)\.(\d+)/.exec(e);
      if (!t) return null;
      let n = +t[1],
        o = +t[2];
      return n >= 3 || (n === 2 && (o === 1 || o >= 4)) ? null : e;
    }
    function ln() {
      let e = z().Sprite && z().Sprite.__assembler__;
      if (!e || !e.getConstructor) return !0;
      try {
        return [0, 1].every((t) => !!e.getConstructor({ node: { is3DNode: !0 }, type: t }));
      } catch {
        return !1;
      }
    }
    let Ge = null,
      pe = () => (Ge === null ? (Ge = /^2\.1\./.test(String(z().ENGINE_VERSION || "")) || !ln()) : Ge),
      $ = [0, 0],
      G = () => !z().Node.prototype.convertToWorldSpaceAR,
      qe = () => {
        let e = z();
        return e.RenderComponent || Object.getPrototypeOf(e.Sprite);
      },
      N = {
        scene: () => z().director.getScene(),
        root() {
          let e = z();
          return this.scene().children.find((t) => t.getComponent(e.Canvas)) || null;
        },
        camera() {
          let e = z(),
            t = this.root();
          if (!t) return null;
          if (G()) {
            let n = t.getComponent(e.Canvas);
            return (n && n.cameraComponent) || t.getComponentInChildren(e.Camera);
          }
          return e.Camera.main || t.getComponentInChildren(e.Camera);
        },
        getZ: (e) => (G() ? e.position.z : pe() ? 0 : e.z),
        setZ(e, t) {
          if (G()) {
            let n = e.position;
            e.setPosition(n.x, n.y, t);
          } else pe() || (e.z = t);
        },
        worldZ(e) {
          if (G()) return e.worldPosition.z;
          if (pe()) {
            let n = 0;
            for (let o = e; o; o = o.parent) {
              let r = s.z.get(o);
              r && (n += r.cur);
            }
            return n;
          }
          let t = 0;
          for (let n = e; n; n = n.parent) t += n.z || 0;
          return t;
        },
        worldXY(e) {
          if (G()) {
            let n = e.worldPosition;
            return [n.x, n.y];
          }
          let t = e.convertToWorldSpaceAR(z().v2(0, 0));
          return [t.x, t.y];
        },
        bounds(e) {
          let t = qe(),
            n = G(),
            o = pe(),
            r = null;
          return (
            (function a(i) {
              if (i.activeInHierarchy) {
                if (i.getComponent(t)) {
                  let c = n ? i.getComponent("cc.UITransform") : i;
                  if (c) {
                    let l = c.getBoundingBoxToWorld(),
                      d = l.x,
                      u = l.y,
                      p = l.x + l.width,
                      f = l.y + l.height;
                    if (o) {
                      let h = Ze(i);
                      h !== 1 &&
                        ((d = $[0] + (d - $[0]) / h),
                        (p = $[0] + (p - $[0]) / h),
                        (u = $[1] + (u - $[1]) / h),
                        (f = $[1] + (f - $[1]) / h));
                    }
                    r = r
                      ? {
                          x0: Math.min(r.x0, d),
                          y0: Math.min(r.y0, u),
                          x1: Math.max(r.x1, p),
                          y1: Math.max(r.y1, f),
                        }
                      : { x0: d, y0: u, x1: p, y1: f };
                  }
                }
                i.children.forEach(a);
              }
            })(e),
            r
          );
        },
        orient(e) {
          let t = qe(),
            n = G(),
            o = z(),
            r = pe(),
            a;
          if (n) {
            let f = e.worldRotation;
            a = 2 * Math.atan2(f.z, f.w);
          } else {
            let f = e.convertToWorldSpaceAR(o.v2(0, 0)),
              h = e.convertToWorldSpaceAR(o.v2(1, 0));
            a = Math.atan2(h.y - f.y, h.x - f.x);
          }
          if (!isFinite(a) || Math.abs(Math.sin(2 * a)) < 0.001) return null;
          let i = Math.cos(a),
            c = Math.sin(a),
            l = 1 / 0,
            d = -1 / 0,
            u = 1 / 0,
            p = -1 / 0;
          return (
            (function f(h) {
              if (h.activeInHierarchy) {
                if (h.getComponent(t)) {
                  let b = n ? h.getComponent("cc.UITransform") : h;
                  if (b) {
                    let I = n ? b.contentSize.width : b.width,
                      v = n ? b.contentSize.height : b.height,
                      P = n ? b.anchorPoint.x : b.anchorX,
                      L = n ? b.anchorPoint.y : b.anchorY,
                      S = r ? Ze(h) : 1;
                    [
                      [0, 0],
                      [I, 0],
                      [I, v],
                      [0, v],
                    ].forEach((B) => {
                      let C = B[0] - P * I,
                        m = B[1] - L * v,
                        R = n
                          ? b.convertToWorldSpaceAR(new o.Vec3(C, m, 0))
                          : b.convertToWorldSpaceAR(o.v2(C, m)),
                        V = R.x,
                        Z = R.y;
                      S !== 1 && ((V = $[0] + (V - $[0]) / S), (Z = $[1] + (Z - $[1]) / S));
                      let H = V * i + Z * c,
                        X = -V * c + Z * i;
                      (l = Math.min(l, H)), (d = Math.max(d, H)), (u = Math.min(u, X)), (p = Math.max(p, X));
                    });
                  }
                }
                h.children.forEach(f);
              }
            })(e),
            l === 1 / 0
              ? null
              : [
                  [l, u],
                  [d, u],
                  [d, p],
                  [l, p],
                ].map((f) => [f[0] * i - f[1] * c, f[0] * c + f[1] * i])
          );
        },
        flag3(e) {
          G() ||
            pe() ||
            (function t(n) {
              s.flags.has(n) || (s.flags.set(n, n.is3DNode), (n.is3DNode = !0)), n.children.forEach(t);
            })(e);
        },
        fadeRec(e) {
          let t = { cur: 1, target: 1, f: 1, ft: 1, cols: null, node: e, hidden: !1, dirty: !1 };
          if (G()) {
            let n = e.getComponent("cc.UIOpacity"),
              o = !n;
            o && (n = e.addComponent("cc.UIOpacity")), (t.comp = n), (t.added = o), (t.orig = n.opacity);
          } else {
            let n = (t.items = []);
            (function o(r) {
              n.push([r, r.opacity]), r.children.forEach(o);
            })(e);
          }
          return t;
        },
        fadeValid: (e) => e.node.isValid && (!e.comp || e.comp.isValid),
        fadeSet(e, t) {
          e.comp
            ? (e.comp.opacity = Math.round(e.orig * t))
            : e.items.forEach((n) => {
                n[0].isValid && (n[0].opacity = Math.round(n[1] * t));
              });
        },
        fadeCols(e) {
          if (e.cols) return;
          let t = z(),
            n = qe(),
            o = G(),
            r = (e.cols = []);
          (function a(i) {
            o
              ? i.components.forEach((c) => {
                  !(c instanceof n) ||
                    (c instanceof t.Label && c.cacheMode === t.Label.CacheMode.CHAR) ||
                    c instanceof t.RichText ||
                    r.push([c, c.color.clone()]);
                })
              : i.getComponent(n) && r.push([i, i.color.clone()]),
              i.children.forEach(a);
          })(e.node);
        },
        fadeRestore(e) {
          if (
            ((e.cols || []).forEach((t) => {
              t[0].isValid && (t[0].color = t[1]);
            }),
            e.comp)
          ) {
            if (!e.comp.isValid || !e.node.isValid) return;
            e.added ? e.comp.destroy() : (e.comp.opacity = e.orig);
          } else
            e.items.forEach((t) => {
              t[0].isValid && (t[0].opacity = t[1]);
            });
        },
        saveCam(e) {
          let t = e.node,
            n = { cam: e, cn: t };
          return (
            G()
              ? Object.assign(n, {
                  projection: e.projection,
                  fov: e.fov,
                  near: e.near,
                  far: e.far,
                  pos: t.position.clone(),
                  rot: t.rotation.clone(),
                  ortho: e.orthoHeight,
                })
              : Object.assign(n, {
                  ortho: e.ortho,
                  fov: e.fov,
                  near: e.nearClip,
                  far: e.farClip,
                  x: t.x,
                  y: t.y,
                  z: t.z,
                  angle: t.angle,
                  quat: t.quat && t.quat.clone(),
                  flag: t.is3DNode,
                  zoom: e.zoomRatio || 1,
                  align: e.alignWithScreen,
                }),
            (n.wxy = this.worldXY(t)),
            n
          );
        },
        orthoHalf(e, t) {
          return G() ? e.ortho : t.height / 2 / e.zoom;
        },
        persp(e) {
          G()
            ? ((e.projection = z().Camera.ProjectionType.PERSPECTIVE),
              (e.fov = U),
              (e.near = 1),
              (e.far = 1e5))
            : (e.alignWithScreen !== void 0 && (e.alignWithScreen = !1),
              (e.node.is3DNode = !0),
              (e.ortho = !1),
              (e.fov = U),
              (e.nearClip = 1),
              (e.farClip = 1e5));
        },
        place(e, t, n, o, r, a, i) {
          let c = z(),
            l = e.cn;
          if (G()) l.setWorldPosition(t, n, o);
          else {
            let d = l.parent,
              u = d ? this.worldXY(d) : [0, 0],
              p = d ? this.worldZ(d) : 0;
            (l.x = t - u[0]), (l.y = n - u[1]), (l.z = o - p);
          }
          l.lookAt(c.v3(r, a, i));
        },
        restoreCam(e) {
          if (!e.cn.isValid) return;
          let t = e.cam,
            n = e.cn;
          G()
            ? ((t.projection = e.projection),
              (t.fov = e.fov),
              (t.near = e.near),
              (t.far = e.far),
              n.setPosition(e.pos),
              n.setRotation(e.rot))
            : ((t.ortho = e.ortho),
              (t.fov = e.fov),
              (t.nearClip = e.near),
              (t.farClip = e.far),
              e.align !== void 0 && (t.alignWithScreen = e.align),
              (n.is3DNode = e.flag),
              (n.x = e.x),
              (n.y = e.y),
              (n.z = e.z),
              e.quat && (n.quat = e.quat),
              (n.angle = e.angle));
        },
      };
    function dt() {
      return {
        on: !1,
        leaving: !1,
        saved: null,
        stack: [],
        z: new Map(),
        op: new Map(),
        flags: new Map(),
        layouts: [],
        hover: null,
        sel: null,
        press: null,
        drag: null,
        swallow: !1,
        backAt: 0,
        cam: null,
        camT: null,
        t: 0,
        dir: "ltr",
        yaw: -D,
        ry: 0,
        rp: 0,
        zoom: 1,
        fnodes: null,
        hintOff: !1,
        look: null,
        fo: new Map(),
        fs: new Map(),
      };
    }
    let s = dt(),
      We = (e) => e.children.filter((t) => t.activeInHierarchy && N.bounds(t));
    function ut(e) {
      let t = N.bounds(e);
      if (!t || !s.saved) return t;
      let n = Ee(),
        o = s.saved.design[0] / 2,
        r = s.saved.design[1] / 2,
        a = {
          x0: Math.max(t.x0, n[0] - o),
          y0: Math.max(t.y0, n[1] - r),
          x1: Math.min(t.x1, n[0] + o),
          y1: Math.min(t.y1, n[1] + r),
        };
      return a.x1 > a.x0 && a.y1 > a.y0 ? a : t;
    }
    function pt(e) {
      let t = null;
      return (
        e.forEach((n) => {
          let o = ut(n);
          o &&
            (t = t
              ? {
                  x0: Math.min(t.x0, o.x0),
                  y0: Math.min(t.y0, o.y0),
                  x1: Math.max(t.x1, o.x1),
                  y1: Math.max(t.y1, o.y1),
                }
              : o);
        }),
        t
      );
    }
    function Ye(e) {
      let t = s.z.get(e);
      if (!t) {
        let n = N.getZ(e);
        (t = { orig: n, cur: n, target: n }), s.z.set(e, t), N.flag3(e);
      }
      return t;
    }
    function ft(e) {
      let t = s.op.get(e);
      return t || ((t = N.fadeRec(e)), s.op.set(e, t)), t;
    }
    function ht(e) {
      let t = 0;
      for (let n = e; n && n !== N.scene(); n = n.parent) {
        let o = s.z.get(n);
        t += o ? o.target : N.getZ(n);
      }
      return t;
    }
    function Ze(e) {
      for (let t = e; t; t = t.parent) {
        let n = s.fs.get(t);
        if (n !== void 0) return n;
      }
      return 1;
    }
    function dn() {
      let e = s.cam;
      if (!e) return;
      let t = z(),
        { f: n } = Ae(e.yaw, e.pitch),
        o = [e.cx + e.d * n[0], e.cy + e.d * n[1], e.cz + e.d * n[2]];
      $ = [o[0], o[1]];
      let r = (i) => {
        let c = 0;
        for (let l = i.parent; l; l = l.parent) c++;
        return c;
      };
      Array.from(s.z.keys())
        .filter((i) => i.isValid && i.parent)
        .sort((i, c) => r(i) - r(c))
        .forEach((i) => {
          let c = i.parent,
            l = s.fo.get(i);
          l || ((l = { x: i.x, y: i.y, sx: i.scaleX, sy: i.scaleY }), s.fo.set(i, l));
          let d = o[2] / Math.max(1, o[2] - N.worldZ(i)),
            u = d / Ze(c),
            p = c.convertToWorldSpaceAR(t.v2(l.x, l.y)),
            f = c.convertToNodeSpaceAR(t.v2(o[0] + u * (p.x - o[0]), o[1] + u * (p.y - o[1])));
          i.setPosition(f.x, f.y), (i.scaleX = l.sx * u), (i.scaleY = l.sy * u), s.fs.set(i, d);
        });
    }
    // Custom: hệ số nhân khoảng cách giữa các layer (nút − / + trong panel Layers)
    let xfGapMul = 1;
    function mt(e) {
      let t = e.layers.length,
        n = pt(e.layers);
      if (!t || !n) return;
      let o = Math.max(n.x1 - n.x0, n.y1 - n.y0);
      (e.gap = t > 1 ? Math.max(ce, Math.min(me, (o * 0.9) / (t - 1))) * xfGapMul : 0), gt(e);
    }
    function gt(e) {
      e.layers.forEach((t, n) => {
        let o = Ye(t);
        o.target = o.orig + n * e.gap;
      });
    }
    function yt(e) {
      e.layers.forEach((t) => {
        let n = s.z.get(t);
        n && (n.target = n.orig);
      });
    }
    function un(e, t) {
      e.layers.forEach((n) => {
        if (n === t) {
          let r = s.op.get(n);
          r && ((r.target = 1), (r.ft = 1));
          return;
        }
        let o = ft(n);
        N.fadeCols(o), (o.target = Ue), (o.ft = ke);
      });
    }
    function pn(e) {
      e.layers.forEach((t) => {
        let n = s.op.get(t);
        n && ((n.target = 1), (n.ft = 1));
      });
    }
    let te = (e, t) => e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
    function Ae(e, t) {
      let n = (e * Math.PI) / 180,
        o = (t * Math.PI) / 180,
        r = [Math.sin(n) * Math.cos(o), Math.sin(o), Math.cos(n) * Math.cos(o)],
        a = Math.hypot(r[2], r[0]),
        i = [r[2] / a, 0, -r[0] / a],
        c = [r[1] * i[2] - r[2] * i[1], r[2] * i[0] - r[0] * i[2], r[0] * i[1] - r[1] * i[0]];
      return { f: r, r: i, u: c };
    }
    function fn(e) {
      let t = N.bounds(e),
        n = ht(e),
        o = s.saved.design;
      if (t && (t.x1 - t.x0) * (t.y1 - t.y0) <= 2 * o[0] * o[1])
        return [(t.x0 + t.x1) / 2, (t.y0 + t.y1) / 2, n];
      let r = N.worldXY(e);
      return [r[0], r[1], n];
    }
    function fe(e) {
      s.fnodes = e;
      let t = pt(e);
      if (!t) return;
      let n = [],
        o = nt(),
        r = s.yaw + s.ry,
        a = W + s.rp;
      e.forEach((L) => {
        let S = ut(L);
        if (!S) return;
        let B = ht(L);
        [
          [S.x0, S.y0],
          [S.x1, S.y0],
          [S.x1, S.y1],
          [S.x0, S.y1],
        ].forEach((C) => n.push([C[0], C[1], B]));
      });
      let i = n.map((L) => L[2]),
        c = Math.min.apply(null, i),
        l = Math.max.apply(null, i),
        d = [(t.x0 + t.x1) / 2, (t.y0 + t.y1) / 2, (c + l) / 2],
        { f: u, r: p, u: f } = Ae(r, a),
        h = Math.tan((U * Math.PI) / 360) * j,
        b = h * at(),
        I = 1;
      function v(L) {
        let S = 1;
        return (
          n.forEach((B) => {
            let C = [B[0] - L[0], B[1] - L[1], B[2] - L[2]],
              m = te(C, u);
            S = Math.max(S, m + Math.abs(te(C, p)) / b, m + Math.abs(te(C, f)) / h);
          }),
          S
        );
      }
      for (let L = 0; L < 6; L++) {
        I = v(d);
        let S = 1e9,
          B = -1e9,
          C = 1e9,
          m = -1e9;
        n.forEach((Z) => {
          let H = [Z[0] - d[0], Z[1] - d[1], Z[2] - d[2]],
            X = I - te(H, u),
            ie = te(H, p) / X,
            q = te(H, f) / X;
          (S = Math.min(S, ie)), (B = Math.max(B, ie)), (C = Math.min(C, q)), (m = Math.max(m, q));
        });
        let R = ((S + B) / 2) * I,
          V = ((C + m) / 2) * I;
        if (Math.abs(R) + Math.abs(V) < 0.5) break;
        d = [d[0] + p[0] * R + f[0] * V, d[1] + p[1] * R + f[1] * V, d[2] + p[2] * R + f[2] * V];
      }
      I = v(d);
      let P = s.look;
      if (P && P.node.isValid) {
        let L = fn(P.node),
          S = [L[0] - d[0], L[1] - d[1], L[2] - d[2]],
          B = I / s.zoom - te(S, u);
        if (B >= 1) {
          let C = Math.tan((U * Math.PI) / 360),
            m = C * at(),
            R = te(S, p) - (P.x / o.w - 0.5) * 2 * m * B,
            V = te(S, f) - (0.5 - P.y / o.h) * 2 * C * B;
          d = [d[0] + p[0] * R + f[0] * V, d[1] + p[1] * R + f[1] * V, d[2] + p[2] * R + f[2] * V];
        }
      }
      s.camT = { cx: d[0], cy: d[1], cz: d[2], d: I / s.zoom, yaw: r, pitch: a };
    }
    function bt(e) {
      let t = [];
      return (
        e.forEach((n) => {
          let o = n.getComponent("cc.Mask");
          o && o.enabled && !o.inverted && ((o.enabled = !1), t.push(o));
        }),
        t
      );
    }
    let be = () => s.stack[s.stack.length - 1];
    function hn(e) {
      let t = be();
      if (t.layers.indexOf(e) < 0) return;
      let n = We(e);
      if (!n.length) {
        _n(e);
        return;
      }
      ne(), (t.focus = e), un(t, e);
      let o = { parent: e, layers: n, focus: null, gap: 0, masks: [] };
      (o.masks = bt(o.layers)), mt(o), s.stack.push(o), fe(o.layers), (s.hover = null), ue();
    }
    function xt() {
      if (E) return ne(), !0;
      if (s.stack.length < 2) return !1;
      let e = s.stack.pop();
      yt(e),
        e.masks.forEach((n) => {
          n.isValid && (n.enabled = !0);
        });
      let t = be();
      return pn(t), (t.focus = null), fe(t.layers), (s.hover = null), ue(), !0;
    }
    let vt = (e) => {
      let t = s.op.get(e);
      return !!(t && t.hidden);
    };
    function mn(e, t) {
      let n = ft(e);
      (n.hidden = t), (n.dirty = !0);
    }
    let E = null;
    function Ct(e) {
      let t = z(),
        n = new Set(),
        o = [],
        r = (a, i, c) => {
          a &&
            t.Asset &&
            a instanceof t.Asset &&
            !n.has(a) &&
            (n.add(a), o.push({ asset: a, comp: i, key: c }));
        };
      return (
        (e.components || e._components || []).forEach((a) => {
          Object.keys(a).forEach((i) => {
            let c = a[i];
            Array.isArray(c) ? c.forEach((l) => r(l, a, i)) : r(c, a, i);
          });
        }),
        o
      );
    }
    let Y = (e, t) => {
        if (!e || typeof e != "object") return !1;
        let [n, ...o] = t.split("."),
          r = z(),
          a = window,
          i = o.reduce((c, l) => c && c[l], r[n] || a[n]);
        return (
          typeof i != "function" &&
            r.js &&
            r.js.getClassByName &&
            (i = r.js.getClassByName(t.indexOf(".") < 0 ? "cc." + t : t) || r.js.getClassByName("cc." + t)),
          typeof i == "function" && e instanceof i
            ? !0
            : e.__classname__ === t || e.__classname__ === "cc." + t
        );
      },
      gn = (e) =>
        Y(e, "SpriteFrame") || Y(e, "Texture2D") || Y(e, "ImageAsset")
          ? "image"
          : Y(e, "AudioClip")
            ? "audio"
            : Y(e, "sp.SkeletonData")
              ? "spine"
              : Y(e, "AnimationClip")
                ? "anim"
                : Y(e, "Material")
                  ? "material"
                  : Y(e, "BitmapFont")
                    ? "font"
                    : "other",
      Ne = (e) => String(e.__classname__ || (e.constructor && e.constructor.name) || "Asset"),
      xe = (e) =>
        String(e.name || e._name || "") ||
        String(e.nativeUrl || e.url || "")
          .split("/")
          .pop() ||
        Ne(e),
      yn = (e) =>
        !!e &&
        ((typeof HTMLImageElement < "u" && e instanceof HTMLImageElement) ||
          (typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement) ||
          (typeof ImageBitmap < "u" && e instanceof ImageBitmap)) &&
        (e.width || 0) > 0;
    function _e(e) {
      return e
        ? [
            e.getHtmlElementObj && e.getHtmlElementObj(),
            e._image,
            e.data,
            e._nativeAsset,
            e.image && (e.image.data || e.image._nativeAsset),
            e._mipmaps && e._mipmaps[0] && e._mipmaps[0].data,
          ].find(yn) || bn(e)
        : null;
    }
    let Ke = new WeakMap();
    function bn(e) {
      if (!e || typeof e != "object") return null;
      if (Ke.has(e)) return Ke.get(e);
      let t = null;
      return (
        x(() => {
          let n = z(),
            o = e.getGFXTexture && e.getGFXTexture(),
            r = n.director && n.director.root && n.director.root.device;
          if (!o || !r || !r.copyTextureToBuffers) return;
          let a = o.width,
            i = o.height,
            c = n.gfx && n.gfx.Format;
          if (!(a > 0 && i > 0) || (c && o.format !== c.RGBA8 && o.format !== c.BGRA8)) return;
          let l = new Uint8Array(a * i * 4),
            d = new ((n.gfx && n.gfx.BufferTextureCopy) || Object)();
          (d.texOffset = { x: 0, y: 0, z: 0 }),
            (d.texExtent = { width: a, height: i, depth: 1 }),
            (d.texSubres = { mipLevel: 0, baseArrayLayer: 0, layerCount: 1 }),
            r.copyTextureToBuffers(o, [l], [d]);
          let u = document.createElement("canvas"),
            p = u.getContext("2d");
          if (p) {
            if (((u.width = a), (u.height = i), c && o.format === c.BGRA8))
              for (let f = 0; f < l.length; f += 4) {
                let h = l[f];
                (l[f] = l[f + 2]), (l[f + 2] = h);
              }
            p.putImageData(new ImageData(new Uint8ClampedArray(l.buffer), a, i), 0, 0), (t = u);
          }
        }),
        Ke.set(e, t),
        t
      );
    }
    function wt(e) {
      let t = e && (e._original || e.original);
      return (t && (t._texture || t.texture)) || (e.getTexture ? e.getTexture() : e.texture);
    }
    function Te(e) {
      let t = Y(e, "SpriteFrame"),
        n = _e(t ? wt(e) : e);
      if (!n) return null;
      let o = 0,
        r = 0,
        a = n.width,
        i = n.height,
        c = !1;
      if (t) {
        let u = e.getRect ? e.getRect() : e.rect,
          p = e._original || e.original;
        u && ((o = u.x), (r = u.y), (a = u.width), (i = u.height)),
          p && (p._texture || p.texture) && ((o = p._x || 0), (r = p._y || 0)),
          (c = !!(e.isRotated ? e.isRotated() : e.rotated));
      }
      if (!(a > 0 && i > 0)) return null;
      let l = document.createElement("canvas"),
        d = l.getContext("2d");
      return d
        ? (c
            ? ((l.width = i), (l.height = a), d.translate(0, a), d.rotate(-Math.PI / 2))
            : ((l.width = a), (l.height = i)),
          d.drawImage(n, o, r, a, i, 0, 0, a, i),
          l)
        : null;
    }
    function xn(e) {
      let t = e.numberOfChannels,
        n = e.length,
        o = new DataView(new ArrayBuffer(44 + n * t * 2)),
        r = (i, c) => {
          for (let l = 0; l < c.length; l++) o.setUint8(i + l, c.charCodeAt(l));
        };
      r(0, "RIFF"),
        o.setUint32(4, 36 + n * t * 2, !0),
        r(8, "WAVEfmt "),
        o.setUint32(16, 16, !0),
        o.setUint16(20, 1, !0),
        o.setUint16(22, t, !0),
        o.setUint32(24, e.sampleRate, !0),
        o.setUint32(28, e.sampleRate * t * 2, !0),
        o.setUint16(32, t * 2, !0),
        o.setUint16(34, 16, !0),
        r(36, "data"),
        o.setUint32(40, n * t * 2, !0);
      let a = Array.from({ length: t }, (i, c) => e.getChannelData(c));
      for (let i = 0, c = 44; i < n; i++)
        for (let l = 0; l < t; l++, c += 2)
          o.setInt16(c, Math.round(Math.max(-1, Math.min(1, a[l][i])) * 32767), !0);
      return URL.createObjectURL(new Blob([o], { type: "audio/wav" }));
    }
    function Mt(e, t) {
      let n = e._nativeAsset || e._audio;
      if (n && typeof HTMLMediaElement < "u" && n instanceof HTMLMediaElement && n.src) return n.src;
      let o = e.nativeUrl || e.url || (typeof n == "string" ? n : "");
      if (o && typeof o == "string") return o;
      if (n && typeof AudioBuffer < "u" && n instanceof AudioBuffer) {
        let r = xn(n);
        return t.push(() => URL.revokeObjectURL(r)), r;
      }
      return null;
    }
    function vn(e) {
      let t = e.getRuntimeData && e.getRuntimeData();
      if (t && t.animations) return t.animations.map((o) => o.name);
      let n = e.getAnimsEnum && e.getAnimsEnum();
      return n ? Object.keys(n).filter((o) => isNaN(+o) && o !== "<None>") : [];
    }
    let g = (e, t, n) => {
      let o = document.createElement(e);
      return t && (o.className = t), n !== void 0 && (o.textContent = n), o;
    };
    function Cn(e) {
      let t = [],
        n = new Set(),
        o = (r, a) => {
          if (!(!r || typeof r != "object" || a > 8 || n.has(r) || Y(r, "Asset"))) {
            if ((n.add(r), Array.isArray(r))) {
              let i = [];
              if (
                (r.forEach((c) => {
                  c &&
                    typeof c == "object" &&
                    typeof c.frame == "number" &&
                    Y(c.value, "SpriteFrame") &&
                    i.push({ t: c.frame, sf: c.value });
                }),
                i.length)
              ) {
                t.push(i);
                return;
              }
              r.forEach((c) => o(c, a + 1));
              return;
            }
            if (Array.isArray(r._times) && Array.isArray(r._values)) {
              let i = r._times
                .map((c, l) => ({ t: c, sf: r._values[l] }))
                .filter((c) => Y(c.sf, "SpriteFrame"));
              if (i.length) {
                t.push(i);
                return;
              }
            }
            Object.keys(r).forEach((i) => o(r[i], a + 1));
          }
        };
      return (
        o(e.curveData || e._curveData, 0),
        o(e._tracks || e.tracks, 0),
        t.sort((r, a) => a.length - r.length),
        (t[0] || []).sort((r, a) => r.t - a.t)
      );
    }
    function wn(e, t, n) {
      let o = Cn(e),
        r = o.map((m) => x(() => Te(m.sf)) || null);
      if (!o.length || !r.some(Boolean)) {
        t.appendChild(g("span", "canat-none", "no sprite frames in this clip"));
        return;
      }
      let a = Math.max.apply(
          null,
          r.map((m) => (m ? m.width : 1)),
        ),
        i = Math.max.apply(
          null,
          r.map((m) => (m ? m.height : 1)),
        ),
        c = g("canvas"),
        l = c.getContext("2d");
      (c.width = a), (c.height = i), t.appendChild(c);
      let d = o[o.length - 1].t,
        u = Math.max(e.duration || 0, d > 0 ? d + d / Math.max(1, o.length - 1) : 0.1),
        p = e.speed || 1,
        f = g("div", "canat-bar"),
        h = g("button", "canat-play"),
        b = g("span", "canat-frame"),
        I = !0,
        v = performance.now(),
        P = 0,
        L = 0,
        S = -1,
        B = () => {
          (h.textContent = I ? "\u275A\u275A" : "\u25B6"), (h.title = I ? "Pause" : "Play");
        },
        C = (m) => {
          (L = requestAnimationFrame(C)), I && (P = (((m - v) / 1e3) * p) % u);
          let R = 0;
          if (
            (o.forEach((Z, H) => {
              Z.t <= P && (R = H);
            }),
            R === S)
          )
            return;
          S = R;
          let V = r[R];
          l.clearRect(0, 0, a, i),
            V && l.drawImage(V, (a - V.width) / 2, (i - V.height) / 2),
            (b.textContent = R + 1 + " / " + o.length);
        };
      (h.onclick = () => {
        (I = !I), I && (v = performance.now() - (P / p) * 1e3), B();
      }),
        B(),
        f.appendChild(h),
        f.appendChild(b),
        t.appendChild(f),
        (L = requestAnimationFrame(C)),
        n.push(() => cancelAnimationFrame(L));
    }
    let Qe = "cocos-anatomy:materials",
      Et = (e) =>
        location.origin +
        location.pathname +
        "|" +
        ((e.effectAsset && e.effectAsset.name) || "") +
        "|" +
        (e.name || "");
    function Mn(e) {
      try {
        let t = JSON.parse(localStorage.getItem(Qe) || "{}")[Et(e)];
        return t
          ? t.presets && typeof t.presets == "object"
            ? t.presets
            : Object.keys(t).length
              ? { Saved: t }
              : {}
          : {};
      } catch {
        return {};
      }
    }
    function kt(e, t) {
      try {
        let n = JSON.parse(localStorage.getItem(Qe) || "{}"),
          o = Et(e);
        Object.keys(t).length ? (n[o] = { presets: t }) : delete n[o],
          localStorage.setItem(Qe, JSON.stringify(n));
      } catch {}
    }
    let Je = (e) => ("0" + Math.max(0, Math.min(255, Math.round(e))).toString(16)).slice(-2);
    function En(e) {
      let t = z(),
        n = G(),
        o = e.effectAsset,
        r = [];
      if (!o || !o.techniques) return r;
      let a = o.techniques[e.technique || 0] || o.techniques[0],
        i = (a && a.passes) || [];
      return (
        i.forEach((c, l) => {
          let d = [],
            u = c.properties || (l === 0 ? o.properties : null) || {};
          Object.keys(u).forEach((h) => {
            let b = u[h],
              I =
                !!(b.editor && b.editor.type === "color") ||
                (/colou?r$/i.test(h) && Array.isArray(b.value) && b.value.length >= 3),
              v = x(() => e.getProperty(h, l));
            if (
              (v == null && (v = b.value),
              typeof v == "number" && (v = [v]),
              v && typeof v == "object" && !Array.isArray(v))
            )
              if ("r" in v) v = [v.r / 255, v.g / 255, v.b / 255, v.a / 255];
              else if ("x" in v) v = ["x", "y", "z", "w"].filter((P) => P in v).map((P) => v[P]);
              else {
                d.push({
                  label: h,
                  kind: "info",
                  val: String(v.name || v._name || (v.constructor && v.constructor.name) || "object"),
                  orig: null,
                });
                return;
              }
            if (!Array.isArray(v) || !v.length || v.some((P) => typeof P != "number")) {
              d.push({ label: h, kind: "info", val: String(b.value), orig: null });
              return;
            }
            if (I && v.length >= 3) {
              let P = [v[0], v[1], v[2], v.length > 3 ? v[3] : 1].map((L) => Math.round(L * 255));
              d.push({
                label: h,
                key: "u:" + l + ":" + h,
                kind: "color",
                val: P,
                orig: P.slice(),
                apply: (L) => x(() => e.setProperty(h, new t.Color(L[0], L[1], L[2], L[3]), l)),
              });
            } else {
              let P = v.length,
                L = (S) =>
                  P === 1
                    ? S[0]
                    : n
                      ? P === 2
                        ? t.v2(S[0], S[1])
                        : P === 3
                          ? t.v3(S[0], S[1], S[2])
                          : t.v4(S[0], S[1], S[2], S[3])
                      : S;
              d.push({
                label: h,
                key: "u:" + l + ":" + h,
                kind: P === 1 ? "num" : "vec",
                val: v.slice(),
                orig: v.slice(),
                apply: (S) => x(() => e.setProperty(h, L(S), l)),
              });
            }
          });
          let p = n
              ? e.passes && e.passes[l] && e.passes[l].defines
              : ((e.effect && (e.effect._passes || e.effect.passes || [])[l]) || {})._defines,
            f = n || (p && Object.keys(p).length) ? p : e._defines;
          f &&
            Object.keys(f)
              .filter((h) => !/^CC_/.test(h))
              .forEach((h) => {
                let b = f[h],
                  I = (v) =>
                    x(() => {
                      n ? e.recompileShaders({ [h]: v }, l) : e.define(h, v, l);
                    });
                if (n && !e.parent) {
                  d.push({
                    label: h,
                    kind: "info",
                    val: String(b) + "  (shared material: read-only)",
                    orig: null,
                  });
                  return;
                }
                typeof b == "boolean"
                  ? d.push({ label: h, key: "d:" + l + ":" + h, kind: "bool", val: b, orig: b, apply: I })
                  : typeof b == "number"
                    ? d.push({
                        label: h,
                        key: "d:" + l + ":" + h,
                        kind: "num",
                        val: [b],
                        orig: [b],
                        apply: (v) => I(v[0]),
                      })
                    : d.push({ label: h, kind: "info", val: String(b), orig: null });
              }),
            r.push({ title: i.length > 1 ? "Pass " + (l + 1) : "", fields: d });
        }),
        r
      );
    }
    function kn(e, t, n) {
      t.classList.add("canat-matview");
      let o = e.effectAsset,
        r = x(() => En(e)) || [],
        a = [];
      t.appendChild(
        g(
          "div",
          "canat-mathead",
          (o && o.name ? o.name : "no effect") + (r.length ? "" : "  \xB7  no parameters"),
        ),
      );
      let i = [],
        c = Mn(e),
        l = Object.keys(c)[0] || "",
        d = g("div", "canat-matbar"),
        u = g("select", "canat-matpreset"),
        p = g("button", "canat-matreset", "Apply"),
        f = g("button", "canat-matforget", "\xD7"),
        h = g("div", "canat-matbar canat-matsave"),
        b = g("input"),
        I = g("button", "canat-matreset", "Save");
      (b.type = "text"), (b.placeholder = "preset name"), (b.maxLength = 40);
      let v = () => a.filter((C) => C.apply && C.key),
        P = (C, m) => JSON.stringify(C) === JSON.stringify(m),
        L = () => {
          let C = Object.keys(c);
          c[l] || (l = C[0] || ""),
            (u.innerHTML = ""),
            C.forEach((m) => {
              let R = g("option", void 0, m + "  (" + Object.keys(c[m]).length + ")");
              (R.value = m), u.appendChild(R);
            }),
            (u.value = l),
            (d.style.display = C.length ? "flex" : "none");
        };
      (p.title = "Apply the selected preset to the game"),
        (f.title = "Delete the selected preset"),
        (u.onchange = () => {
          (l = u.value), (b.value = l);
        }),
        (p.onclick = () => {
          let C = c[l];
          C &&
            (v().forEach((m) => {
              C[m.key] !== void 0 && ((m.val = C[m.key]), m.apply(m.val));
            }),
            i.forEach((m) => m()),
            S());
        }),
        (f.onclick = () => {
          delete c[l], kt(e, c), L();
        }),
        (I.title = "Save the values you changed as a preset"),
        (I.onclick = () => {
          let C = b.value.trim() || "Preset " + (Object.keys(c).length + 1),
            m = {};
          if (
            (v().forEach((R) => {
              P(R.val, R.orig) || (m[R.key] = R.val);
            }),
            !Object.keys(m).length)
          ) {
            b.placeholder = "nothing changed yet";
            return;
          }
          (c[C] = m),
            (l = C),
            (b.value = ""),
            (b.placeholder = "preset name"),
            kt(e, c),
            L(),
            (h.style.display = "none");
        }),
        d.appendChild(u),
        d.appendChild(p),
        d.appendChild(f),
        h.appendChild(b),
        h.appendChild(I),
        t.appendChild(d),
        t.appendChild(h),
        (h.style.display = "none");
      let S = () => {
        h.style.display = v().some((C) => !P(C.val, C.orig)) ? "flex" : "none";
      };
      r.forEach((C) => {
        C.title && t.appendChild(g("div", "canat-matpass", C.title)),
          C.fields.forEach((m) => {
            a.push(m);
            let R = g("label", "canat-matrow");
            if (
              (R.appendChild(g("span", "canat-matname", m.label)), (R.title = m.label), m.kind === "info")
            ) {
              R.appendChild(g("span", "canat-matinfo", m.val)), t.appendChild(R);
              return;
            }
            let V = g("span", "canat-matval"),
              Z = () => {
                m.apply && m.apply(m.val), S();
              };
            if (m.kind === "bool") {
              let H = g("input");
              (H.type = "checkbox"),
                (H.checked = !!m.val),
                (H.onchange = () => {
                  (m.val = H.checked), Z();
                }),
                i.push(() => {
                  H.checked = !!m.val;
                }),
                V.appendChild(H);
            } else if (m.kind === "color") {
              let H = g("input");
              H.type = "color";
              let X = g("input");
              (X.type = "number"), (X.min = "0"), (X.max = "255"), (X.title = "alpha 0-255");
              let ie = () => {
                (H.value = "#" + Je(m.val[0]) + Je(m.val[1]) + Je(m.val[2])), (X.value = String(m.val[3]));
              };
              (H.oninput = () => {
                let q = H.value;
                (m.val = [
                  parseInt(q.slice(1, 3), 16),
                  parseInt(q.slice(3, 5), 16),
                  parseInt(q.slice(5, 7), 16),
                  m.val[3],
                ]),
                  Z();
              }),
                (X.oninput = () => {
                  let q = parseFloat(X.value);
                  isFinite(q) &&
                    ((m.val = [m.val[0], m.val[1], m.val[2], Math.max(0, Math.min(255, q))]), Z());
                }),
                ie(),
                i.push(ie),
                V.appendChild(H),
                V.appendChild(X);
            } else {
              let H = m.val.map((X, ie) => {
                let q = g("input");
                return (
                  (q.type = "number"),
                  (q.step = "any"),
                  (q.value = String(+X.toFixed(4))),
                  (q.oninput = () => {
                    let Kt = parseFloat(q.value);
                    isFinite(Kt) && ((m.val = m.val.slice()), (m.val[ie] = Kt), Z());
                  }),
                  V.appendChild(q),
                  q
                );
              });
              i.push(() =>
                H.forEach((X, ie) => {
                  X.value = String(+m.val[ie].toFixed(4));
                }),
              );
            }
            R.appendChild(V), t.appendChild(R);
          });
      });
      let B = () =>
        a.forEach((C) => {
          C.apply &&
            C.orig !== null &&
            ((C.val = Array.isArray(C.orig) ? C.orig.slice() : C.orig), C.apply(C.val));
        });
      if (a.some((C) => C.apply)) {
        let C = g("button", "canat-matreset", "Reset");
        (C.title = "Put every value back to what it was when the panel opened"),
          (C.onclick = () => {
            B(), i.forEach((R) => R()), S();
          });
        let m = g("div", "canat-matbar canat-matacts");
        m.appendChild(C), t.appendChild(m), n.push(B);
      }
      L();
    }
    function Sn(e) {
      let t = e._fntConfig || e.fntConfig,
        n = t && t.fontDefDictionary,
        o = [];
      n
        ? Object.keys(n).forEach((a) => {
            let i = n[a],
              c = i.rect || i;
            !c ||
              !(c.width > 0 && c.height > 0) ||
              o.push({
                code: +a,
                x: c.x,
                y: c.y,
                w: c.width,
                h: c.height,
                ox: i.xOffset || 0,
                oy: i.yOffset || 0,
                adv: i.xAdvance || c.width,
              });
          })
        : String(e.fntDataStr || e._fntDataStr || "")
            .split(
              `
`,
            )
            .forEach((i) => {
              if (!/^\s*char\s/.test(i)) return;
              let c = (u) => {
                  let p = new RegExp("\\b" + u + "=(-?\\d+)").exec(i);
                  return p ? +p[1] : 0;
                },
                l = c("width"),
                d = c("height");
              l > 0 &&
                d > 0 &&
                o.push({
                  code: c("id"),
                  x: c("x"),
                  y: c("y"),
                  w: l,
                  h: d,
                  ox: c("xoffset"),
                  oy: c("yoffset"),
                  adv: c("xadvance") || l,
                });
            });
      let r =
        (t && (t.commonHeight || t.fontSize)) ||
        e.fontSize ||
        Math.max.apply(null, o.map((a) => a.oy + a.h).concat([1]));
      return { list: o.sort((a, i) => a.code - i.code), lineH: r };
    }
    function An(e, t) {
      let n = e.spriteFrame,
        o = x(() => _e(n && wt(n)) || _e(e.texture)),
        { list: r, lineH: a } = Sn(e);
      if (!o || !r.length) {
        t.appendChild(g("span", "canat-none", r.length ? "no atlas image" : "no glyphs"));
        return;
      }
      let i = 560,
        c = 6,
        l = [[]],
        d = c;
      r.forEach((h) => {
        d + h.adv > i && l[l.length - 1].length && (l.push([]), (d = c)),
          l[l.length - 1].push(h),
          (d += h.adv + 2);
      });
      let u = g("canvas"),
        p = u.getContext("2d"),
        f = a + 6;
      (u.width = i),
        (u.height = l.length * f + c * 2),
        l.forEach((h, b) => {
          let I = c;
          h.forEach((v) => {
            p.drawImage(o, v.x, v.y, v.w, v.h, I + v.ox, c + b * f + v.oy, v.w, v.h), (I += v.adv + 2);
          });
        }),
        t.appendChild(u),
        t.appendChild(g("span", "canat-live", r.length + " glyphs"));
    }
    function Nn(e, t) {
      let n = e.asset,
        o = gn(n),
        r = g("div", "canat-cell"),
        a = g("div", "canat-view");
      if ((r.appendChild(a), o === "image")) {
        let i = x(() => Te(n));
        i ? a.appendChild(i) : a.appendChild(g("span", "canat-none", "no preview"));
      } else if (o === "anim") x(() => wn(n, a, t));
      else if (o === "material") x(() => kn(n, a, t));
      else if (o === "font") x(() => An(n, a));
      else if (o === "audio") {
        let i = x(() => Mt(n, t));
        if (i) {
          let c = new Audio();
          (c.preload = "metadata"),
            (c.src = i),
            a.appendChild(Rt(c, () => {}, x(() => Lt(n, _t())) || "sfx")),
            t.push(() => {
              c.pause(), c.removeAttribute("src"), c.load();
            });
        } else a.appendChild(g("span", "canat-none", "no playable source"));
      } else if (o === "spine") {
        let i = e.comp;
        if (x(() => _e(n.textures && n.textures[0]))) {
          let b = x(() => Te(n.textures[0]));
          b && ((b.className = "canat-atlas"), a.appendChild(b));
        }
        let l = g("div", "canat-bar"),
          d = g("button", "canat-play"),
          u = g("select", "canat-anim"),
          p = x(() => vn(n)) || [];
        p.forEach((b) => {
          let I = g("option", void 0, b);
          (I.value = b), u.appendChild(I);
        });
        let f = { paused: !!i.paused, anim: i.animation, loop: i.loop !== !1 };
        f.anim && (u.value = f.anim);
        let h = () => {
          (d.textContent = i.paused ? "\u25B6" : "\u275A\u275A"), (d.title = i.paused ? "Play" : "Pause");
        };
        (d.onclick = () =>
          x(() => {
            i.paused && !i.animation && u.value && i.setAnimation(0, u.value, !0),
              (i.paused = !i.paused),
              h();
          })),
          (u.onchange = () =>
            x(() => {
              i.setAnimation(0, u.value, !0), (i.paused = !1), h();
            })),
          h(),
          l.appendChild(d),
          p.length && l.appendChild(u),
          a.appendChild(l),
          a.appendChild(g("span", "canat-live", "plays on the node in the game")),
          t.push(() =>
            x(() => {
              i.isValid &&
                (f.anim && i.animation !== f.anim && i.setAnimation(0, f.anim, f.loop),
                (i.paused = f.paused));
            }),
          );
      } else a.appendChild(g("span", "canat-none", Ne(n)));
      return (
        r.appendChild(g("div", "canat-name", xe(n))),
        r.appendChild(
          g(
            "div",
            "canat-sub",
            (e.comp.__classname__ || "") + "." + e.key.replace(/^_(N\$)?/, "") + "  \xB7  " + Ne(n),
          ),
        ),
        r
      );
    }
    let oe = "auto";
    function Ce(e) {
      let t = le(),
        n = window.innerWidth,
        o = window.innerHeight,
        r = 8,
        a = e.style,
        i = oe;
      i === "auto" &&
        (i = n - t.right >= t.left && n - t.right >= 300 ? "right" : t.left >= 300 ? "left" : "bottom"),
        (a.left = a.right = a.top = a.bottom = a.width = a.height = "auto"),
        (a.maxHeight = ""),
        (e.dataset.side = i);
      let c = !!e.dataset.fit,
        l = e.querySelector(".canat-head")?.offsetHeight || 45;
      if (i === "bottom") {
        (a.left = a.right = a.bottom = r + "px"),
          (a.height = Math.min(o * 0.42, 460) + "px"),
          c &&
            e.style.setProperty(
              "--cellw",
              Math.max(150, Math.min(440, Math.floor((n - 2 * r - 24 - 24) / 3))) + "px",
            );
        return;
      }
      let d = i === "right" ? n - t.right - 2 * r : t.left - 2 * r,
        u = d >= 260,
        p = E && !E.node ? Math.min(u ? d : n * 0.5, 340) : u ? Math.min(d, 720) : Math.min(520, n * 0.5);
      if (((a.top = r + "px"), (a.width = p + "px"), c)) {
        let f = o - 2 * r;
        (a.maxHeight = f + "px"),
          e.style.setProperty(
            "--cellh",
            Math.max(170, Math.min(340, Math.floor((f - l - 2 - 48) / 3))) + "px",
          );
      } else a.bottom = r + "px";
      i === "right"
        ? (a.left = (u ? t.right + r : n - p - r) + "px")
        : (a.left = (u ? t.left - r - p : r) + "px");
    }
    function ve() {
      if (!E || !s.on || s.leaving) return;
      let e = le(),
        t = E.el.getBoundingClientRect(),
        n = 8,
        o = [
          [e.left, e.top, Math.min(e.right, t.left - n), e.bottom],
          [Math.max(e.left, t.right + n), e.top, e.right, e.bottom],
          [e.left, e.top, e.right, Math.min(e.bottom, t.top - n)],
          [e.left, Math.max(e.top, t.bottom + n), e.right, e.bottom],
        ].filter((p) => p[2] - p[0] > 40 && p[3] - p[1] > 40),
        a =
          t.left < e.right && t.right > e.left && t.top < e.bottom && t.bottom > e.top && o.length
            ? o.reduce((p, f) => ((f[2] - f[0]) * (f[3] - f[1]) > (p[2] - p[0]) * (p[3] - p[1]) ? f : p))
            : [e.left, e.top, e.right, e.bottom],
        i = (a[0] + a[2]) / 2 - e.left,
        c = (a[1] + a[3]) / 2 - e.top,
        l = M.hint;
      if (
        ((l.style.left = i + "px"),
        (l.style.bottom = Math.max(12, e.bottom - a[3] + 12) + "px"),
        (l.style.maxWidth = Math.max(160, a[2] - a[0] - 16) + "px"),
        !E.node)
      )
        return;
      let d = Math.max(0, Math.min(e.width, i + E.pan.x)),
        u = Math.max(0, Math.min(e.height, c + E.pan.y));
      (E.pan = { x: d - i, y: u - c }), (s.look = { node: E.node, x: d, y: u }), s.fnodes && fe(s.fnodes);
    }
    // --- Custom: Transform editor (Position / Rotation / Scale + Reset) ---
    // Giá trị hiển thị/sửa là transform THẬT của game, không phải giá trị layer view đang tạm đè:
    // Z thật nằm ở s.z.get(node).orig, còn X/Y/Scale ở engine 2.1 cũ nằm ở s.fo.get(node).
    let xfOrig = new WeakMap(),
      xfRot3 = () => G(),
      xfHasPz = () => G() || !pe(),
      xfHasSz = (e) => G() || (!pe() && typeof e.scaleZ == "number");
    function xfRead(e) {
      let t = s.fo.get(e),
        n = s.z.get(e),
        o = {};
      if (G()) {
        let r = e.position,
          a = e.scale,
          i = e.eulerAngles;
        Object.assign(o, { px: r.x, py: r.y, pz: n ? n.orig : r.z, sx: a.x, sy: a.y, sz: a.z });
        Object.assign(o, { rx: i.x, ry: i.y, rz: i.z });
      } else {
        Object.assign(o, {
          px: t ? t.x : e.x,
          py: t ? t.y : e.y,
          pz: n ? n.orig : N.getZ(e),
          sx: t ? t.sx : e.scaleX,
          sy: t ? t.sy : e.scaleY,
          sz: typeof e.scaleZ == "number" ? e.scaleZ : 1,
          rz: e.angle || 0,
        });
      }
      return o;
    }
    let xfEdited = new Set();
    function xfDiff(e, t) {
      let n = xfOrig.get(e),
        o = xfRead(e),
        r = (l) => +(+l).toFixed(3),
        a = (l) => n && Math.abs(o[l] - n[l]) > 1e-4,
        i = { path: tt(e) };
      [
        ["position", ["px", "py", "pz"]],
        ["rotation", xfRot3() ? ["rx", "ry", "rz"] : ["rz"]],
        ["scale", ["sx", "sy", "sz"]],
      ].forEach(([l, c]) => {
        c = c.filter((d) => o[d] !== void 0);
        (t || c.some(a)) && ((i[l] = c.map((d) => r(o[d]))), n && !t && (i[l + "Orig"] = c.map((d) => r(n[d]))));
      });
      return i;
    }
    function xfEdits() {
      return Array.from(xfEdited)
        .filter((e) => e.isValid)
        .map((e) => xfDiff(e, !1))
        .filter((e) => e.position || e.rotation || e.scale);
    }
    function xfCopy(e, t, n) {
      let o = typeof e == "string" ? e : JSON.stringify(e, null, 2),
        r = n.textContent,
        a = (c) => {
          (n.textContent = c), setTimeout(() => (n.textContent = r), 1200);
        },
        i = () => {
          let c = document.createElement("textarea");
          (c.value = o), (c.style.cssText = "position:fixed;left:-9999px;top:0"), document.body.appendChild(c), c.select();
          let l = !1;
          try {
            l = document.execCommand("copy");
          } catch (d) {}
          c.remove(), a(l ? "Copied ✓" : "Copy failed");
        };
      console.log("[cocos-anatomy] " + t, e);
      navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(o).then(() => a("Copied ✓"), i) : i();
    }
    function xfWrite(e, t) {
      if (!e.isValid) return;
      xfEdited.add(e);
      let n = s.fo.get(e),
        o = s.z.get(e),
        r = xfRead(e);
      Object.assign(r, t);
      if (t.pz !== void 0 && xfHasPz()) {
        if (o) {
          let a = r.pz - o.orig;
          (o.orig += a), (o.target += a), (o.cur += a), N.setZ(e, o.cur);
        } else N.setZ(e, r.pz);
      }
      if (G()) {
        let a = e.position;
        e.setPosition(r.px, r.py, a.z),
          e.setScale(r.sx, r.sy, r.sz),
          e.setRotationFromEuler(r.rx, r.ry, r.rz);
        return;
      }
      n
        ? ((n.x = r.px), (n.y = r.py), (n.sx = r.sx), (n.sy = r.sy), x(dn))
        : ((e.x = r.px), (e.y = r.py), (e.scaleX = r.sx), (e.scaleY = r.sy)),
        xfHasSz(e) && (e.scaleZ = r.sz),
        (e.angle = r.rz);
    }
    function xfPanel(e, t) {
      let n = g("div", "canat-xform"),
        o = xfRead(e);
      xfOrig.has(e) || xfOrig.set(e, o);
      let r = xfOrig.get(e),
        a = [],
        i = [
          ["Position", [["px", "X"], ["py", "Y"], ...(xfHasPz() ? [["pz", "Z"]] : [])], 1],
          [
            "Rotation",
            xfRot3()
              ? [
                  ["rx", "X"],
                  ["ry", "Y"],
                  ["rz", "Z"],
                ]
              : [["rz", "Z"]],
            1,
          ],
          ["Scale", [["sx", "X"], ["sy", "Y"], ...(xfHasSz(e) ? [["sz", "Z"]] : [])], 0.01],
        ],
        c = (h) => String(+(+h).toFixed(3)),
        l = (h, b) => Math.abs(h - b) > 1e-4,
        d = () => {
          let h = xfRead(e);
          a.forEach((b) => {
            document.activeElement !== b.inp && (b.inp.value = c(h[b.k])),
              b.row.classList.toggle("canat-xf-dirty", b.keys.some((I) => l(h[I], r[I])));
          }),
            (f.disabled = !a.some((b) => l(h[b.k], r[b.k])));
        };
      n.appendChild(g("div", "canat-xf-title", "Transform"));
      n.appendChild(
        g(
          "div",
          "canat-xf-help",
          "Drag X / Y / Z left-right to change \xB7 ↑↓ in a box (Shift \xD710, Alt \xD70.1) \xB7 mouse wheel on the focused box \xB7 type + Enter",
        ),
      );
      // Đổi giá trị 1 ô: ghi vào game + cập nhật ô
      let xfSet = (C, Z, V) => {
          isFinite(Z) && ((V.value = c(Z)), x(() => xfWrite(e, { [C]: Z })), d());
        },
        xfMul = (ev) => (ev.shiftKey ? 10 : ev.altKey ? 0.1 : 1);
      i.forEach(([h, b, I]) => {
        let v = g("div", "canat-matrow"),
          P = g("span", "canat-matname", h),
          L = g("span", "canat-matval"),
          S = g("button", "canat-xf-undo", "↺"),
          B = b.map((C) => C[0]);
        (S.title = "Reset " + h),
          (S.onclick = () => {
            let C = {};
            B.forEach((m) => (C[m] = r[m])), x(() => xfWrite(e, C)), d();
          }),
          v.appendChild(P),
          b.forEach(([C, m]) => {
            let R = g("label", "canat-xf-f"),
              V = g("input");
            (V.type = "number"),
              (V.step = String(I)),
              (V.value = c(o[C])),
              (V.title = h + " " + m),
              (V.oninput = () => {
                let Z = parseFloat(V.value);
                isFinite(Z) && (x(() => xfWrite(e, { [C]: Z })), d());
              }),
              (V.onblur = d),
              (V.onkeydown = (Z) => {
                let ie = { ArrowUp: 1, ArrowDown: -1 }[Z.key];
                ie
                  ? (Z.preventDefault(), xfSet(C, +(xfRead(e)[C] + ie * I * xfMul(Z)).toFixed(4), V))
                  : Z.key === "Enter" && V.blur();
              }),
              V.addEventListener(
                "wheel",
                (Z) => {
                  if (document.activeElement !== V) return;
                  Z.preventDefault();
                  let ie = Z.deltaY < 0 ? 1 : -1;
                  xfSet(C, +(xfRead(e)[C] + ie * I * xfMul(Z)).toFixed(4), V);
                },
                { passive: !1 },
              );
            // Kéo chữ X/Y/Z sang trái/phải: 1 px = 1 bước
            let H = g("i", "canat-xf-drag", m);
            (H.title = "Drag left/right to change " + h + " " + m + " (Shift \xD710, Alt \xD70.1)"),
              (H.onpointerdown = (Z) => {
                Z.preventDefault(), H.setPointerCapture(Z.pointerId);
                let ie = Z.clientX,
                  q = xfRead(e)[C];
                (H.onpointermove = (Kt) => {
                  xfSet(C, +(q + (Kt.clientX - ie) * I * xfMul(Kt)).toFixed(4), V);
                }),
                  (H.onpointerup = H.onpointercancel =
                    () => {
                      (H.onpointermove = H.onpointerup = H.onpointercancel = null), d();
                    });
              }),
              R.appendChild(H),
              R.appendChild(V),
              L.appendChild(R),
              a.push({ k: C, inp: V, row: v, keys: B });
          }),
          v.appendChild(L),
          v.appendChild(S),
          n.appendChild(v);
      });
      let u = g("div", "canat-matbar canat-matacts"),
        f = g("button", "canat-matreset", "Reset");
      (f.title = "Put Position / Rotation / Scale back to the values before you edited them"),
        (f.onclick = () => {
          x(() => xfWrite(e, Object.assign({}, r))), d();
        }),
        u.appendChild(f);
      let xfC = g("button", "canat-matreset canat-xf-2", "Copy"),
        xfA = g("button", "canat-matreset canat-xf-2", "All edits (0)"),
        xfN = () => {
          let h = xfEdits().length;
          (xfA.disabled = !h), xfA.textContent.indexOf("✓") < 0 && xfA.textContent.indexOf("fail") < 0 && (xfA.textContent = "All edits (" + h + ")");
        };
      (xfC.title = "Copy this node's path + Position / Rotation / Scale as JSON"),
        (xfA.title = "Copy every node you changed (path, new value, original value) as JSON, to apply in the prefab / scene"),
        (xfC.onclick = () => x(() => xfCopy(xfDiff(e, !0), "transform", xfC))),
        (xfA.onclick = () => x(() => xfCopy(xfEdits(), "edits", xfA))),
        u.appendChild(xfC),
        u.appendChild(xfA),
        n.appendChild(u),
        xfN();
      let p = setInterval(() => {
        e.isValid ? (d(), xfN()) : clearInterval(p);
      }, 200);
      return t.push(() => clearInterval(p)), d(), n;
    }
    // Cửa sổ Transform nổi: hiện khi click chọn 1 layer bất kỳ (zt), kéo được bằng thanh tiêu đề.
    let xfWin = null,
      xfCleanups = [];
    function xfHide() {
      xfCleanups.forEach((e) => x(e)), (xfCleanups = []), xfWin && (xfWin.remove(), (xfWin = null)), (xfActive = null);
    }
    function xfCss() {
      if (document.getElementById(_ + "-xfcss")) return;
      let e = "#" + _ + "-xf",
        t = g("style");
      (t.id = _ + "-xfcss"),
        (t.textContent = [
          "{position:fixed;left:276px;top:84px;width:310px;z-index:2147483647;font:12px system-ui,sans-serif;color:#e6e7ea;background:rgba(30,32,36,.96);border:1px solid #34373d;box-shadow:0 8px 30px rgba(0,0,0,.45);color-scheme:dark;user-select:none;-webkit-user-select:none}",
          " .canat-xfhead{display:flex;align-items:center;gap:8px;padding:6px 8px 6px 12px;border-bottom:1px solid #34373d;cursor:move}",
          " .canat-xfhead b{flex:1;min-width:0;font:600 12px ui-monospace,Menlo,monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
          " .canat-x{background:none;border:0;color:#b4b8c2;font-size:18px;line-height:1;cursor:pointer;padding:0 4px}",
          " .canat-xform{padding:8px 12px 10px}",
          " .canat-xf-title{font:600 11px system-ui,sans-serif;color:#9a9ea8;margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em}",
          " .canat-xf-help{font:10px system-ui,sans-serif;color:#9a9ea8;margin:0 0 6px;line-height:1.4}",
          " .canat-matrow{display:flex;align-items:center;gap:6px;margin:4px 0}",
          " .canat-matname{flex:0 0 58px;font:11px ui-monospace,Menlo,monospace;color:#c8cbd2}",
          " .canat-matval{flex:1;min-width:0;display:flex;gap:4px}",
          " .canat-xf-f{flex:1;min-width:0;display:flex;align-items:center;gap:2px}",
          " .canat-xf-drag{font:normal 10px ui-monospace,Menlo,monospace;color:#9a9ea8;cursor:ew-resize;padding:2px 3px;border-radius:2px;touch-action:none}",
          " .canat-xf-drag:hover{background:#34373d;color:#ffb347}",
          " input[type=number]{flex:1;min-width:0;width:100%;background:#16171a;color:#e6e7ea;border:1px solid #34373d;border-radius:1px;padding:2px 4px;font:11px ui-monospace,Menlo,monospace;user-select:text;-webkit-user-select:text}",
          " .canat-xf-dirty .canat-matname{color:#ffb347}",
          " .canat-xf-undo{flex:none;background:none;border:0;color:#b4b8c2;font-size:13px;line-height:1;cursor:pointer;padding:0 2px}",
          " .canat-matbar{display:flex;margin:8px 0 0}",
          " .canat-matreset{background:#ffb347;color:#16171a;border:0;border-radius:1px;padding:3px 10px;font:600 11px system-ui,sans-serif;cursor:pointer}",
          " .canat-matreset:disabled{opacity:.4;cursor:default}",
          " .canat-matacts{gap:6px;flex-wrap:wrap}",
          " .canat-xf-2{background:#34373d;color:#e6e7ea}",
          " .canat-xf-2:hover{background:#4a4e56}",
        ]
          .map((n) => e + n)
          .join("")),
        document.head.appendChild(t);
    }
    let xfActive = null;
    function xfActiveRow(e) {
      let row = g("label");
      let box = g("input");
      box.type = "checkbox";
      box.checked = !!e.active;
      box.style.cssText = "margin:0;accent-color:#ffb347;cursor:pointer";
      row.style.cssText = "display:flex;align-items:center;gap:6px;padding:6px 12px 0;font:600 11px system-ui,sans-serif;color:#c8cbd2;cursor:pointer";
      row.title = "node.active";
      box.onchange = () => {
        x(() => {
          e.active = box.checked;
        });
        lySig = "";
      };
      row.appendChild(box);
      row.appendChild(g("span", void 0, "Active"));
      let hint = g("small", void 0, "");
      hint.style.cssText = "color:#9a9ea8;font-weight:400";
      row.appendChild(hint);
      xfActive = { node: e, box, hint };
      xfActiveSync();
      return row;
    }
    function xfActiveSync() {
      if (!xfActive || !xfWin || !xfActive.node.isValid) {
        return;
      }
      let e = xfActive.node;
      if (document.activeElement !== xfActive.box) {
        xfActive.box.checked = !!e.active;
      }
      xfActive.hint.textContent = e.active && !e.activeInHierarchy ? "(a parent is inactive)" : "";
    }
    function xfShow(e) {
      if (!e || !e.isValid) {
        xfHide();
        return;
      }
      let t = xfWin && { l: xfWin.style.left, t: xfWin.style.top };
      xfHide(), xfCss();
      let n = g("div", "canat-xfwin"),
        o = g("div", "canat-xfhead"),
        r = g("button", "canat-x", "\xD7");
      (n.id = _ + "-xf"),
        (r.title = "Close (click another layer to reopen)"),
        (r.onclick = xfHide),
        o.appendChild(g("b", void 0, tt(e))),
        o.appendChild(r),
        (o.onpointerdown = (a) => {
          if (a.target === r) return;
          a.preventDefault(), o.setPointerCapture(a.pointerId);
          let i = n.getBoundingClientRect(),
            c = a.clientX - i.left,
            l = a.clientY - i.top;
          (o.onpointermove = (d) => {
            (n.style.left = Math.max(0, d.clientX - c) + "px"), (n.style.top = Math.max(0, d.clientY - l) + "px");
          }),
            (o.onpointerup = o.onpointercancel =
              () => {
                o.onpointermove = o.onpointerup = o.onpointercancel = null;
              });
        }),
        n.appendChild(o),
        n.appendChild(xfActiveRow(e)),
        n.appendChild(xfPanel(e, xfCleanups)),
        ["contextmenu", "dragstart"].forEach((a) => n.addEventListener(a, (i) => i.preventDefault())),
        t && ((n.style.left = t.l), (n.style.top = t.t)),
        document.body.appendChild(n),
        (xfWin = n);
    }
    // Panel Layers (trái): chỉnh khoảng cách layer + danh sách layer của cấp hiện tại.
    // Click = chọn (mở Transform), double-click = tách layer, rê chuột = highlight trên màn hình.
    let lyWin = null,
      lySig = "";
    function lyCss() {
      if (document.getElementById(_ + "-lycss")) return;
      let e = "#" + _ + "-ly",
        t = g("style");
      (t.id = _ + "-lycss"),
        (t.textContent = [
          "{position:fixed;left:8px;top:84px;width:260px;max-height:calc(100vh - 170px);display:flex;flex-direction:column;z-index:2147483647;font:12px system-ui,sans-serif;color:#e6e7ea;background:rgba(30,32,36,.96);border:1px solid #34373d;box-shadow:0 8px 30px rgba(0,0,0,.45);user-select:none;-webkit-user-select:none}",
          " .ly-head{display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid #34373d}",
          " .ly-head b{flex:1;min-width:0;font:600 11px ui-monospace,Menlo,monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
          " .ly-gap{display:flex;align-items:center;gap:4px;padding:6px 8px;border-bottom:1px solid #34373d}",
          " .ly-gap span{flex:1;color:#9a9ea8;font-size:11px}",
          " .ly-gap output{min-width:40px;text-align:center;font:11px ui-monospace,Menlo,monospace}",
          " button{background:#34373d;color:#e6e7ea;border:0;border-radius:2px;min-width:22px;height:20px;padding:0 6px;font:600 12px system-ui,sans-serif;cursor:pointer}",
          " button:hover{background:#4a4e56}",
          " button:disabled{opacity:.35;cursor:default}",
          " .ly-list{overflow-y:auto;padding:4px 0}",
          " .ly-row{display:flex;align-items:center;gap:5px;padding:3px 8px;cursor:pointer;white-space:nowrap}",
          " .ly-row:hover{background:#2a2d33}",
          " .ly-row.ly-sel{background:#5a4320;color:#ffd08a}",
          " .ly-row.ly-off{opacity:.45}",
          " .ly-row i{font:normal 10px ui-monospace,Menlo,monospace;color:#9a9ea8;min-width:18px;text-align:right}",
          " .ly-tw{flex:none;width:14px;text-align:center;color:#c8cbd2;font-size:11px;border-radius:2px}",
          " .ly-tw:hover{background:#4a4e56;color:#ffb347}",
          " .ly-row em{flex:1;min-width:0;font:normal 11px ui-monospace,Menlo,monospace;overflow:hidden;text-overflow:ellipsis}",
          " .ly-row small{color:#9a9ea8;font-size:10px}",
          " .ly-row.ly-ghost em{color:#8a8e98;font-style:italic}",
          " .ly-row.ly-ghost i{min-width:18px}",
          " .ly-wide{flex:1}",
          " .ly-on{background:#5a4320;color:#ffd08a}",
          " .ly-tip{padding:4px 8px 6px;color:#9a9ea8;font-size:10px;line-height:1.4;border-top:1px solid #34373d}",
        ]
          .map((n) => e + n)
          .join("")),
        document.head.appendChild(t);
    }
    function lyHide() {
      lyWin && (lyWin.remove(), (lyWin = null)), (lySig = "");
    }
    function lyBuild() {
      let e = be();
      if (!e) return;
      lyCss(), lyWin || ((lyWin = g("div")), (lyWin.id = _ + "-ly"), document.body.appendChild(lyWin));
      lyWin.innerHTML = "";
      let t = g("div", "ly-head"),
        n = g("button", void 0, "◂");
      (n.title = "Back to the parent level (Esc)"),
        (n.disabled = s.stack.length < 2),
        (n.onclick = () => x(xt)),
        t.appendChild(n),
        t.appendChild(g("b", void 0, (e.parent ? e.parent.name : "Scene") + "  (" + e.layers.length + ")")),
        lyWin.appendChild(t);
      let o = g("div", "ly-gap"),
        r = g("button", void 0, "−"),
        a = g("output", void 0, +xfGapMul.toFixed(2) + "\xD7"),
        i = g("button", void 0, "+"),
        c = g("button", void 0, "↺"),
        l = (d) => {
          (xfGapMul = Math.max(0.25, Math.min(8, d))), s.stack.forEach((u) => x(() => mt(u))), lyBuild();
        };
      (r.title = "Less space between layers"),
        (i.title = "More space between layers"),
        (c.title = "Default spacing"),
        (r.onclick = () => l(xfGapMul / 1.25)),
        (i.onclick = () => l(xfGapMul * 1.25)),
        (c.onclick = () => l(1)),
        o.appendChild(g("span", void 0, "Spacing")),
        o.appendChild(r),
        o.appendChild(a),
        o.appendChild(i),
        o.appendChild(c),
        lyWin.appendChild(o);
      let lyM = g("div", "ly-gap"),
        lyI = g("button", "ly-wide", "☝ Interact"),
        ly3 = g("button", "ly-wide" + (h3 ? " ly-on" : ""), h3 ? "Show 3D" : "Hide 3D"),
        ly3n = x(() => h3Cams().length) || 0;
      (lyI.title = "Flatten the layers and give mouse / keys back to the game (I). The Transform window stays open; press the shortcut or “Back to layers” to return"),
        (ly3.title = h3
          ? "Show the 3D world again"
          : ly3n
            ? "Hide the 3D world (" + ly3n + " camera) so only the 2D UI is shown"
            : "No 3D camera found in this scene"),
        (ly3.disabled = !h3 && !ly3n),
        (lyI.onclick = () => x(iaEnter)),
        (ly3.onclick = () => {
          x(() => h3Set(!h3)), lyBuild();
        }),
        lyM.appendChild(lyI),
        lyM.appendChild(ly3),
        lyWin.appendChild(lyM);
      let lyP = g("div", "ly-gap");
      pzButtons("ly-wide").forEach((b) => lyP.appendChild(b));
      lyWin.appendChild(lyP);
      let d = g("div", "ly-list");
      lyRows().forEach((r) => {
        let p = r.node;
        let ghost = r.kind === "ghost";
        let cls = "ly-row" + (p === s.sel ? " ly-sel" : "") + (!ghost && vt(p) ? " ly-off" : "") + (ghost ? " ly-ghost" : "");
        let I = g("div", cls);
        let v = g("span", "ly-tw", r.hasKids ? (r.open ? "\u25BE" : "\u25B8") : "");
        let toggle = () => {
          if (!ghost && r.can) {
            x(() => (r.split ? lyPopTo(r.level) : lyExpand(r.level, p)));
            return;
          }
          if (lyOpen.has(p)) {
            lyOpen.delete(p);
          } else {
            lyOpen.add(p);
          }
          lyBuild();
        };
        I.style.paddingLeft = 4 + r.depth * 14 + "px";
        I.title = tt(p) + (ghost ? "\nNot a layer (" + lyTag(p) + "): click to select + Transform" : "\nClick: select + Transform \xB7 \u25B8 / double-click: split into child layers");
        if (r.hasKids) {
          v.title = r.open ? "Collapse" : ghost || !r.can ? "Show children" : "Split into child layers";
          v.onclick = (P) => {
            P.stopPropagation();
            toggle();
          };
        }
        I.appendChild(v);
        I.appendChild(g("i", void 0, r.idx));
        I.appendChild(g("em", void 0, p.name || "(no name)"));
        if (ghost) {
          I.appendChild(g("small", void 0, lyTag(p)));
        }
        I.onclick = () => x(() => zt(p));
        I.ondblclick = () => {
          if (r.hasKids) {
            toggle();
          }
        };
        if (!ghost) {
          I.onmouseenter = () => {
            s.hover = p;
            x(re);
          };
          I.onmouseleave = () => {
            if (s.hover === p) {
              s.hover = null;
              x(re);
            }
          };
        }
        d.appendChild(I);
      });
      lyWin.appendChild(d);
      lyWin.appendChild(g("div", "ly-tip", "\u25B8 / double-click: split into child layers (dim rows: show children only) \xB7 \u25BE: collapse \xB7 click name: select + Transform"));
      lySig = lyKey();
    }
    let lyOpen = new Set();
    function lyTag(p) {
      if (!p.active) {
        return "inactive";
      }
      if (!p.activeInHierarchy) {
        return "hidden";
      }
      return "no render";
    }
    function lyRows() {
      let rows = [];
      let ghostTree = (node, depth) => {
        node.children
          .slice()
          .reverse()
          .forEach((c) => {
            if (!c.isValid) {
              return;
            }
            let open = lyOpen.has(c);
            rows.push({ node: c, depth, kind: "ghost", idx: "", open, hasKids: c.children.length > 0 });
            if (open) {
              ghostTree(c, depth + 1);
            }
          });
      };
      let level = (u) => {
        let st = s.stack[u];
        let kids = st.parent ? st.parent.children.slice() : st.layers.slice();
        kids.reverse().forEach((c) => {
          if (!c.isValid) {
            return;
          }
          let f = st.layers.indexOf(c);
          if (f < 0) {
            let open = lyOpen.has(c);
            rows.push({ node: c, depth: u, kind: "ghost", idx: "", open, hasKids: c.children.length > 0 });
            if (open) {
              ghostTree(c, u + 1);
            }
            return;
          }
          let split = !!(s.stack[u + 1] && s.stack[u + 1].parent === c);
          let can = split || !!x(() => We(c).length > 0);
          let open = split || (!can && lyOpen.has(c));
          rows.push({ node: c, depth: u, kind: "layer", level: u, idx: String(f), split, can, open, hasKids: can || c.children.length > 0 });
          if (split) {
            level(u + 1);
          } else if (open) {
            ghostTree(c, u + 1);
          }
        });
      };
      level(0);
      return rows;
    }
    // Lùi layer view về cấp u (stack còn u+1 phần tử) — layer view chỉ tách 1 nhánh một lúc
    function lyPopTo(e) {
      for (E && ne(); s.stack.length > e + 1 && xt(); );
    }
    // Tách node t ở cấp e: lùi về cấp e rồi gọi hn (double-click layer gốc)
    function lyExpand(e, t) {
      lyPopTo(e), be() && be().layers.indexOf(t) >= 0 && We(t).length && hn(t);
    }
    let lyKey = () => {
      let e = be();
      return e
        ? [
            xfGapMul,
            s.sel && s.sel.uuid,
            pzIs() ? "paused" : "",
            s.stack
              .map((t) => (t.parent ? t.parent.uuid : "") + ":" + t.layers.map((n) => (n.uuid || n.name) + (vt(n) ? "~" : "")).join(","))
              .join(";"),
            lyRows()
              .map((r) => (r.node.uuid || r.node.name) + r.kind[0] + (r.open ? 1 : 0) + (r.node.active ? 1 : 0) + (r.node.activeInHierarchy ? 1 : 0))
              .join(","),
          ].join("|")
        : "";
    };
    let h3 = null;
    function h3Cams() {
      let e = z();
      if (!G() || !e.Camera || !e.Canvas) return [];
      let t = N.scene(),
        n = N.camera(),
        o = t.getComponentsInChildren(e.Canvas).map((r) => r.cameraComponent);
      return t
        .getComponentsInChildren(e.Camera)
        .filter((r) => r !== n && o.indexOf(r) < 0 && r.enabled && r.node.activeInHierarchy);
    }
    function h3Set(e) {
      e && !h3
        ? ((h3 = h3Cams().map((t) => ({ c: t, v: t.visibility }))), h3.forEach((t) => (t.c.visibility = 0)))
        : !e && h3 && (h3.forEach((t) => t.c.isValid && (t.c.visibility = t.v)), (h3 = null));
    }
    let iaState = null,
      iaKeep = !1,
      iaBar = null;
    function iaBarHide() {
      iaBar && (iaBar.remove(), (iaBar = null));
    }
    function iaBarShow() {
      iaBarHide();
      if (docked()) {
        return;
      }
      let e = g("div"),
        t = g("button", void 0, "▣ Back to layers"),
        n = g("button", void 0, "\xD7");
      (e.id = _ + "-ia"),
        (e.style.cssText =
          "position:fixed;left:50%;top:8px;transform:translateX(-50%);z-index:2147483647;display:flex;align-items:center;gap:8px;padding:5px 6px 5px 12px;background:rgba(30,32,36,.94);border:1px solid #ffb347;border-radius:16px;font:12px system-ui,sans-serif;color:#ffd08a;box-shadow:0 4px 16px rgba(0,0,0,.4);user-select:none;-webkit-user-select:none"),
        [t, n].forEach((o) => {
          o.style.cssText =
            "background:#34373d;color:#e6e7ea;border:0;border-radius:12px;height:22px;padding:0 10px;font:600 12px system-ui,sans-serif;cursor:pointer";
        }),
        (t.title = "Explode the layers again, same branch + selection (shortcut works too)"),
        (n.title = "Leave: close the Transform window too"),
        (t.onclick = () => x(iaExit)),
        (n.onclick = () => {
          (iaState = null), iaBarHide(), xfHide();
        }),
        e.appendChild(g("span", void 0, "☝ Interacting with the game")),
        pzButtons("").forEach((o) => {
          o.style.cssText =
            "background:" + (o.classList.contains("ly-on") ? "#5a4320;color:#ffd08a" : "#34373d;color:#e6e7ea") + ";border:0;border-radius:12px;height:22px;padding:0 10px;font:600 12px system-ui,sans-serif;cursor:pointer";
          e.appendChild(o);
        }),
        e.appendChild(t),
        e.appendChild(n),
        document.body.appendChild(e),
        (iaBar = e);
    }
    function iaEnter() {
      !s.on ||
        s.leaving ||
        ((iaState = { path: s.stack.slice(1).map((e) => e.parent), sel: s.sel, dir: s.dir, h3: !!h3 }),
        (iaKeep = !0),
        ze(),
        iaBarShow());
    }
    function iaExit() {
      let e = iaState;
      if (!e) return;
      if (s.leaving) {
        setTimeout(() => x(iaExit), 80);
        return;
      }
      if (((iaState = null), iaBarHide(), s.on || (Pt(e.dir), !s.on))) return;
      e.path.forEach((t) => {
        let n = be();
        t && t.isValid && n && n.layers.indexOf(t) >= 0 && We(t).length && hn(t);
      }),
        e.h3 && h3Set(!0),
        e.sel && e.sel.isValid && zt(e.sel);
    }
    let pzOwn = !1;
    function pzDir() {
      let e = z();
      return e && e.director;
    }
    function pzIs() {
      let d = pzDir();
      return !!(d && d.isPaused && d.isPaused());
    }
    function pzRefresh() {
      lySig = "";
      if (iaBar) {
        iaBarShow();
      }
    }
    function pzSet(on) {
      let d = pzDir();
      if (!d) {
        return;
      }
      if (on && !pzIs()) {
        d.pause();
        pzOwn = !0;
      } else if (!on && pzIs()) {
        d.resume();
        pzOwn = !1;
      }
      pzRefresh();
    }
    function pzStep() {
      let d = pzDir();
      if (!d) {
        return;
      }
      if (!pzIs()) {
        pzSet(!0);
        return;
      }
      d.resume();
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          x(() => d.pause());
          pzRefresh();
        }),
      );
    }
    function pzButtons(cls) {
      let p = g("button", cls + (pzIs() ? " ly-on" : ""), pzIs() ? "\u25B6 Resume" : "\u23F8 Pause");
      let st = g("button", cls, "\u23ED Step");
      p.title = pzIs() ? "Resume the game logic (P)" : "Pause the game logic: tweens, spine, update() stop, rendering keeps going (P)";
      st.title = "Run one frame then pause again (.)";
      p.onclick = () => x(() => pzSet(!pzIs()));
      st.onclick = () => x(pzStep);
      return [p, st];
    }
    function lySync() {
      if (s.drag || E) {
        return;
      }
      let changed = !1;
      for (let u = 0; u < s.stack.length; u++) {
        let L = s.stack[u];
        if (!L.parent || !L.parent.isValid) {
          continue;
        }
        let now = x(() => We(L.parent)) || [];
        let same = now.length === L.layers.length && now.every((n, i) => n === L.layers[i]);
        if (same) {
          L.pendSig = "";
          continue;
        }
        let sig = now.map((n) => n.uuid || n.name).join(",");
        if (L.pendSig !== sig) {
          L.pendSig = sig;
          continue;
        }
        L.pendSig = "";
        let next = s.stack[u + 1];
        if (next && now.indexOf(next.parent) < 0) {
          lyPopTo(u);
        }
        let added = now.filter((n) => L.layers.indexOf(n) < 0);
        L.layers
          .filter((n) => now.indexOf(n) < 0)
          .forEach((n) => {
            let zs = s.z.get(n);
            if (zs) {
              zs.target = zs.orig;
            }
            let op = s.op.get(n);
            if (op) {
              op.target = 1;
              op.ft = 1;
            }
          });
        L.layers = now;
        L.masks = L.masks.concat(bt(added));
        mt(L);
        if (L.focus && now.indexOf(L.focus) >= 0) {
          un(L, L.focus);
        }
        changed = !0;
      }
      if (changed) {
        re();
        ue();
      }
    }
    let dockUntil = 0;
    function docked() {
      return Date.now() < dockUntil;
    }
    let apMap = new Map();
    function apId(n) {
      return String(n.uuid || n._id || n.name);
    }
    function apRowsOff() {
      let rows = [];
      let sc = N.scene();
      if (!sc) {
        return rows;
      }
      let walk = (node, depth) => {
        node.children.forEach((c) => {
          if (!c.isValid) {
            return;
          }
          let open = lyOpen.has(c);
          rows.push({ node: c, depth, kind: "node", idx: "", open, hasKids: c.children.length > 0 });
          if (open) {
            walk(c, depth + 1);
          }
        });
      };
      walk(sc, 0);
      return rows;
    }
    function apLive() {
      return s.on && !s.leaving && s.stack.length > 0;
    }
    function apRows() {
      return apLive() ? lyRows() : apRowsOff();
    }
    function apSelect(n) {
      if (!xfOrig.has(n)) {
        xfOrig.set(n, xfRead(n));
      }
      if (apLive()) {
        zt(n);
        return;
      }
      s.sel = n;
      window.__cocosAnatomy.selected = n;
    }
    function apRow(n) {
      let r = apRows().find((it) => it.node === n);
      if (!r) {
        return;
      }
      if (r.kind === "layer" && r.can) {
        if (r.split) {
          lyPopTo(r.level);
        } else {
          lyExpand(r.level, n);
        }
      } else if (lyOpen.has(n)) {
        lyOpen.delete(n);
      } else {
        lyOpen.add(n);
      }
      lySig = "";
    }
    let apGroups = { p: ["px", "py", "pz"], r: ["rx", "ry", "rz"], s: ["sx", "sy", "sz"] };
    function apState() {
      dockUntil = Date.now() + 2500;
      let out = { v: T, ready: !!x(Xe), on: !!s.on, ia: !!iaState, paused: !1, gap: +xfGapMul.toFixed(2), h3: !!h3, h3n: 0, back: !1, title: "Scene", rows: [], sel: null };
      x(() => {
        if (!out.ready) {
          return;
        }
        out.paused = pzIs();
        out.h3n = h3Cams().length;
        out.back = apLive() && s.stack.length > 1;
        if (apLive() && be()) {
          out.title = (be().parent ? be().parent.name : "Scene") + "  (" + be().layers.length + " layers)";
        }
        apMap = new Map();
        out.rows = apRows().map((r) => {
          let n = r.node;
          let id = apId(n);
          apMap.set(id, n);
          let tag = "";
          if (r.kind === "ghost") {
            tag = lyTag(n);
          } else if (r.kind === "node" && !n.activeInHierarchy) {
            tag = lyTag(n);
          }
          let off = r.kind === "layer" ? vt(n) : r.kind === "node" && !n.activeInHierarchy;
          return { id, name: n.name || "(no name)", depth: r.depth, kind: r.kind, idx: r.idx, open: !!r.open, kids: !!r.hasKids, can: !!r.can, tag, sel: n === s.sel, off };
        });
        let n = s.sel;
        if (n && n.isValid) {
          apMap.set(apId(n), n);
          if (!xfOrig.has(n)) {
            xfOrig.set(n, xfRead(n));
          }
          let cur = xfRead(n);
          let orig = xfOrig.get(n);
          let xf = {};
          let changed = {};
          Object.keys(cur).forEach((k) => {
            xf[k] = +(+cur[k]).toFixed(3);
            changed[k] = !!orig && Math.abs(cur[k] - orig[k]) > 1e-4;
          });
          out.sel = { id: apId(n), path: tt(n), active: !!n.active, inH: !!n.activeInHierarchy, xf, changed, hasPz: xfHasPz(), rot3: xfRot3(), hasSz: xfHasSz(n), edits: xfEdits().length };
        }
      });
      return out;
    }
    function apCmd(name, a, b) {
      let n = a !== void 0 && a !== null ? apMap.get(String(a)) : null;
      let sel = s.sel && s.sel.isValid ? s.sel : null;
      switch (name) {
        case "view":
          window.__cocosAnatomy.toggle();
          break;
        case "select":
          if (n) {
            apSelect(n);
          }
          break;
        case "row":
          if (n) {
            apRow(n);
          }
          break;
        case "hover":
          if (apLive()) {
            s.hover = n;
            re();
          }
          break;
        case "back":
          xt();
          break;
        case "gap":
          xfGapMul = a === "reset" ? 1 : Math.max(0.25, Math.min(8, xfGapMul * a));
          s.stack.forEach((u) => mt(u));
          lySig = "";
          break;
        case "interact":
          if (iaState) {
            iaExit();
          } else {
            iaEnter();
          }
          break;
        case "h3":
          h3Set(!h3);
          break;
        case "pause":
          pzSet(!pzIs());
          break;
        case "step":
          pzStep();
          break;
        case "xf":
          if (sel && isFinite(+b)) {
            let patch = {};
            patch[a] = +b;
            xfWrite(sel, patch);
          }
          break;
        case "reset":
          if (sel && xfOrig.has(sel)) {
            let o = xfOrig.get(sel);
            let keys = a && apGroups[a] ? apGroups[a] : Object.keys(o);
            let patch = {};
            keys.forEach((k) => {
              if (o[k] !== void 0) {
                patch[k] = o[k];
              }
            });
            xfWrite(sel, patch);
          }
          break;
        case "active":
          if (sel) {
            sel.active = !!a;
            lySig = "";
          }
          break;
        case "copy":
          return sel ? JSON.stringify(xfDiff(sel, !0), null, 2) : "";
        case "edits":
          return JSON.stringify(xfEdits(), null, 2);
      }
      return !0;
    }
    let lyTimer = setInterval(() => {
      x(() => {
        if (docked()) {
          if (lyWin) {
            lyHide();
          }
          if (xfWin) {
            xfHide();
          }
          if (iaBar) {
            iaBarHide();
          }
          ot();
          if (apLive()) {
            lySync();
          }
          return;
        }
        if (!s.on || s.leaving || !s.stack.length) {
          lyWin && lyHide();
          return;
        }
        lySync();
        (!lyWin || lyKey() !== lySig) && lyBuild();
        xfActiveSync();
      });
    }, 250);
    k.push(() => {
      clearInterval(lyTimer), lyHide(), xfHide(), iaBarHide(), (iaState = null), h3Set(!1);
      if (pzOwn && pzIs()) {
        x(() => pzDir().resume());
      }
      [_ + "-xfcss", _ + "-lycss"].forEach((e) => {
        let t = document.getElementById(e);
        t && t.remove();
      });
    });
    function _n(e) {
      ne(), M.build();
      let t = Ct(e),
        n = [],
        o = g("div", "canat-panel"),
        r = g("div", "canat-head"),
        a = g("div", "canat-grid"),
        i = g("button", "canat-x", "\xD7"),
        c = g("button", "canat-x", "\u21C4");
      (o.id = _ + "-pop"),
        $e(o),
        t.length && ((o.dataset.fit = "1"), t.length <= 3 && (o.dataset.few = "1")),
        r.appendChild(g("b", void 0, tt(e))),
        r.appendChild(
          g(
            "span",
            void 0,
            t.length
              ? t.length + " asset" + (t.length > 1 ? "s" : "") + " referenced by its components"
              : "no child layers, and no asset referenced by its components",
          ),
        ),
        (c.title = "Move the panel: right / left / bottom"),
        (c.onclick = () => {
          (oe = oe === "auto" || oe === "bottom" ? "right" : oe === "right" ? "left" : "bottom"),
            Ce(o),
            E && (E.pan = { x: 0, y: 0 }),
            ve();
        }),
        (i.onclick = ne),
        (i.title = "Close (Esc)"),
        r.appendChild(c),
        r.appendChild(i),
        t.forEach((l) => a.appendChild(Nn(l, n))),
        o.appendChild(r),
        o.appendChild(a),
        ["contextmenu", "selectstart", "dragstart"].forEach((l) =>
          o.addEventListener(l, (d) => d.preventDefault()),
        ),
        document.body.appendChild(o),
        (E = { el: o, cleanups: n, node: e, pan: { x: 0, y: 0 } }),
        M.ov.classList.add("canat-assets"),
        M.ov.classList.remove("canat-over"),
        (M.audio.disabled = !0),
        Ce(o),
        x(ve),
        (s.hover = null),
        (s.press = null),
        re(),
        ue();
    }
    let we = 24,
      Tn = 4,
      he = null;
    function St(e) {
      let t = document.createElement("canvas");
      t.width = t.height = we;
      let n = t.getContext("2d", { willReadFrequently: !0 });
      if (!n) return null;
      try {
        return n.drawImage(e, 0, 0, we, we), n.getImageData(0, 0, we, we).data;
      } catch {
        return null;
      }
    }
    function At(e) {
      (function t(n) {
        n.activeInHierarchy !== !1 && (e(n), n.children.forEach(t));
      })(N.scene());
    }
    function Ln() {
      let e = z(),
        t = G(),
        n = [];
      At((a) => {
        let i = a.getComponent(e.Sprite),
          c = i && i.enabled && i.spriteFrame;
        if (!c) return;
        let l = t ? a.getComponent("cc.UITransform") : a,
          d = l && (t ? l.contentSize : a.getContentSize()),
          u = t ? a.worldScale : { x: a.scaleX, y: a.scaleY };
        d && n.push({ area: Math.abs(d.width * d.height * u.x * u.y), sf: c });
      }),
        n.sort((a, i) => i.area - a.area);
      let o = n.slice(0, Tn),
        r = [];
      if (
        (o.forEach((a) => {
          let i = x(() => {
            let c = Te(a.sf);
            return c && St(c);
          });
          i && r.push({ data: i, weight: a.area / o[0].area });
        }),
        !r.length)
      ) {
        let a = x(() => St(Ht()));
        a && r.push({ data: a, weight: 1 });
      }
      return r;
    }
    let Rn = (e) => {
      let t = !1;
      return (
        document.fonts.forEach((n) => {
          n.status === "loaded" && n.family.replace(/["']/g, "") === e && (t = !0);
        }),
        t
      );
    };
    function zn(e) {
      let t = e.font;
      if (t && !e.useSystemFont)
        return Y(t, "BitmapFont")
          ? null
          : [
              t._fontFamily,
              t.fontFamily,
              typeof t._nativeAsset == "string" ? t._nativeAsset : "",
              xe(t).replace(/\.[a-z0-9]+$/i, ""),
            ].find((r) => typeof r == "string" && r && Rn(r)) || null;
      let n = String(e.fontFamily || "")
        .split(",")[0]
        .replace(/["']/g, "")
        .trim();
      return n && !/^arial$/i.test(n) ? n : null;
    }
    function In() {
      let e = z(),
        t = new Map();
      At((r) => {
        let a = r.getComponent(e.Label);
        if (!a || !a.enabled) return;
        let i = x(() => zn(a));
        i && t.set(i, (t.get(i) || 0) + Math.max(1, String(a.string || "").length) * (a.fontSize || 20));
      });
      let n = null,
        o = 0;
      return (
        t.forEach((r, a) => {
          r > o && ((o = r), (n = a));
        }),
        n
      );
    }
    function Pn() {
      let e = N.scene(),
        t = performance.now();
      if (he && he.scene === e && t - he.at < 5e3) return he.vars;
      let n = tn(en(Ln()), In());
      return (he = { scene: e, at: t, vars: n }), n;
    }
    function $e(e) {
      let t = x(Pn);
      t && nn(e, t);
    }
    function ne() {
      if (!E) return;
      let e = E;
      if (((E = null), e.cleanups.forEach((t) => x(t)), e.el.remove(), (s.look = null), M.ov)) {
        M.ov.classList.remove("canat-assets", "canat-panning"),
          M.audio.classList.remove("canat-active"),
          (M.audio.disabled = !1);
        let t = M.hint;
        (t.style.left = "50%"), (t.style.bottom = "12px"), (t.style.maxWidth = "calc(100% - 24px)");
      }
      (J = null), ue(), s.on && !s.leaving && s.fnodes && x(() => fe(s.fnodes));
    }
    let Nt = new Map();
    function On() {
      let e = z(),
        t = new Set(),
        n = [],
        o = (r) => {
          r && !t.has(r) && Y(r, "AudioClip") && (t.add(r), n.push(r));
        };
      return (
        e.assetManager &&
          e.assetManager.assets &&
          e.assetManager.assets.forEach &&
          e.assetManager.assets.forEach(o),
        e.loader &&
          e.loader._cache &&
          Object.keys(e.loader._cache).forEach((r) => {
            let a = e.loader._cache[r];
            o(a && (a.content || a));
          }),
        (function r(a) {
          Ct(a).forEach((i) => o(i.asset)), a.children.forEach(r);
        })(N.scene()),
        n.sort((r, a) => xe(r).localeCompare(xe(a)))
      );
    }
    function _t() {
      let e = new Set();
      return (
        (function t(n) {
          (n.components || n._components || []).forEach((o) => {
            (o.__classname__ || "") === "cc.AudioSource" &&
              o.loop &&
              (o.clip || o._clip) &&
              e.add(o.clip || o._clip);
          }),
            n.children.forEach(t);
        })(N.scene()),
        e
      );
    }
    let Vn = /bgm|music|theme|ambien|backgr|\bbg[_\- ]?m|loop/i,
      Hn = /sfx|\bse[_\- ]|\bfx|btn|button|click|coin|win|spin/i,
      et = !1,
      Tt = new Map(),
      Me = null;
    function Fn() {
      if (Me) return;
      let e = z(),
        t = [],
        n = (a, i, c, l = -1) => {
          if (!a || typeof a[i] != "function") return;
          let d = a[i],
            u = Object.prototype.hasOwnProperty.call(a, i);
          (a[i] = function (...p) {
            if (
              (x(() => {
                let [f, h] = c(this, p);
                f && h && Y(f, "AudioClip") && Tt.set(f, h);
              }),
              et && l >= 0)
            ) {
              for (; p.length < l; ) p.push(void 0);
              p[l] = 0;
            }
            return d.apply(this, p);
          }),
            t.push(() => {
              u ? (a[i] = d) : delete a[i];
            });
        },
        o = e.audioEngine,
        r = e.AudioSource && e.AudioSource.prototype;
      n(o, "playMusic", (a, i) => [i[0], "bgm"]),
        n(o, "playEffect", (a, i) => [i[0], "sfx"]),
        n(o, "playOneShot", (a, i) => [i[0], "sfx"], 1),
        n(o, "play", (a, i) => [i[0], i[1] ? "bgm" : null], 2),
        n(r, "playOneShot", (a, i) => [i[0], "sfx"], 1),
        n(r, "play", (a, i) => [a && (a.clip || a._clip), a && a.loop ? "bgm" : null]),
        (Me = () => {
          t.reverse().forEach((a) => x(a)), (Me = null);
        });
    }
    function Lt(e, t) {
      let n = Nt.get(e) || Tt.get(e);
      if (n) return n;
      let o = xe(e);
      return t.has(e) || Vn.test(o) ? "bgm" : Hn.test(o) ? "sfx" : (e.duration || 0) >= 20 ? "bgm" : "sfx";
    }
    let Le = (e) => (e > 0 ? Math.floor(e / 60) + ":" + ("0" + Math.floor(e % 60)).slice(-2) : ""),
      Re = { bgm: null, sfx: null };
    function Rt(e, t, n) {
      let o = g("div", "canat-player"),
        r = g("button", "canat-pp", "\u25B6"),
        a = g("input", "canat-seek"),
        i = g("span", "canat-time", "0:00");
      (a.type = "range"), (a.min = "0"), (a.max = "1000"), (a.value = "0");
      let c = () => {
        a.style.setProperty("--p", +a.value / 10 + "%");
      };
      return (
        e.addEventListener("loadedmetadata", () => {
          isFinite(e.duration) && e.duration > 0 && t();
        }),
        e.addEventListener("timeupdate", () => {
          e.duration > 0 && !a.matches(":active") && (a.value = String((e.currentTime / e.duration) * 1e3)),
            (i.textContent = Le(e.currentTime) || "0:00"),
            c();
        }),
        e.addEventListener("play", () => {
          r.textContent = "\u275A\u275A";
          let l = Re[n];
          l && l !== e && l.pause(), (Re[n] = e);
        }),
        e.addEventListener("pause", () => {
          (r.textContent = "\u25B6"), Re[n] === e && (Re[n] = null);
        }),
        e.addEventListener("ended", () => {
          (r.textContent = "\u25B6"), (a.value = "0"), c();
        }),
        (r.onclick = () => {
          e.paused ? e.play().catch(() => 0) : e.pause();
        }),
        (a.oninput = () => {
          e.duration > 0 && (e.currentTime = (+a.value / 1e3) * e.duration), c();
        }),
        o.appendChild(r),
        o.appendChild(a),
        o.appendChild(i),
        o
      );
    }
    function Bn(e, t, n, o) {
      let r = g("div", "canat-cell canat-acell"),
        a = g("div", "canat-ahead"),
        i = x(() => Mt(e, o)),
        c = g("button", "canat-kind canat-" + t, t === "bgm" ? "BGM" : "SFX");
      (c.title =
        "Guessed from loops, name and length: click to move it to " +
        (t === "bgm" ? "SFX" : "Background music")),
        (c.onclick = n);
      let l = String(e.nativeUrl || e.url || Ne(e))
          .split("/")
          .pop(),
        d = g("div", "canat-sub", (Le(e.duration) ? Le(e.duration) + "  \xB7  " : "") + l);
      if (
        (a.appendChild(c),
        a.appendChild(g("div", "canat-name", xe(e))),
        r.appendChild(a),
        r.appendChild(d),
        i)
      ) {
        let u = new Audio();
        (u.preload = "metadata"),
          (u.src = i),
          r.appendChild(
            Rt(
              u,
              () => {
                d.textContent = Le(u.duration) + "  \xB7  " + l;
              },
              t,
            ),
          ),
          o.push(() => {
            u.pause(), u.removeAttribute("src"), u.load();
          });
      } else r.appendChild(g("span", "canat-none", "no playable source"));
      return r;
    }
    function Dn() {
      let e = z(),
        t = [],
        n = e.audioEngine;
      if (
        ((et = !0),
        t.push(() => {
          et = !1;
        }),
        (function r(a) {
          (a.components || a._components || []).forEach((i) => {
            if ((i.__classname__ || "") === "cc.AudioSource" && typeof i.volume == "number") {
              let c = i.volume;
              (i.volume = 0),
                t.push(() => {
                  i.isValid !== !1 && (i.volume = c);
                });
            }
          }),
            a.children.forEach(r);
        })(N.scene()),
        n && n.getMusicVolume && n.setMusicVolume)
      ) {
        let r = n.getMusicVolume();
        n.setMusicVolume(0), t.push(() => n.setMusicVolume(r));
      }
      if (n && n.getEffectsVolume && n.setEffectsVolume) {
        let r = n.getEffectsVolume();
        n.setEffectsVolume(0), t.push(() => n.setEffectsVolume(r));
      }
      let o = e.sys && e.sys.__audioSupport && e.sys.__audioSupport.context;
      return (
        o &&
          o.state === "running" &&
          o.suspend &&
          (o.suspend(),
          t.push(() => {
            o.state === "suspended" && o.resume();
          })),
        document.querySelectorAll("audio,video").forEach((r) => {
          let a = r;
          if (E && E.el.contains(a)) return;
          let i = a.muted;
          (a.muted = !0),
            t.push(() => {
              a.muted = i;
            });
        }),
        () => t.forEach((r) => x(r))
      );
    }
    function jn() {
      ne(), M.build(), (oe = "left");
      let e = x(On) || [],
        t = g("div", "canat-panel canat-apanel"),
        n = g("div", "canat-head"),
        o = g("div", "canat-scroll"),
        r = g("button", "canat-x", "\xD7"),
        a = g("button", "canat-x", "\u21C4");
      (t.id = _ + "-pop"),
        $e(t),
        n.appendChild(g("b", void 0, "Audio in the game")),
        n.appendChild(
          g(
            "span",
            void 0,
            e.length
              ? e.length + " clip" + (e.length > 1 ? "s" : "") + " loaded so far"
              : "no audio clip loaded yet",
          ),
        ),
        (a.title = "Move the panel: right / left / bottom"),
        (a.onclick = () => {
          (oe = oe === "auto" || oe === "bottom" ? "right" : oe === "right" ? "left" : "bottom"), Ce(t), ve();
        }),
        (r.onclick = ne),
        (r.title = "Close (Esc)"),
        n.appendChild(a),
        n.appendChild(r),
        t.appendChild(n),
        t.appendChild(o),
        ["contextmenu", "selectstart", "dragstart"].forEach((d) =>
          t.addEventListener(d, (u) => u.preventDefault()),
        );
      let i = [],
        c = () => {
          i.forEach((u) => x(u)), (i = []), (o.innerHTML = "");
          let d = x(_t) || new Set();
          ["bgm", "sfx"].forEach((u) => {
            let p = e.filter((b) => Lt(b, d) === u),
              f = g("div", "canat-sec", (u === "bgm" ? "Background music" : "SFX") + "  \xB7  " + p.length),
              h = g("div", "canat-grid canat-agrid");
            o.appendChild(f),
              o.appendChild(h),
              p.length || h.appendChild(g("span", "canat-none", "none")),
              p.forEach((b) =>
                h.appendChild(
                  Bn(
                    b,
                    u,
                    () => {
                      Nt.set(b, u === "bgm" ? "sfx" : "bgm"), c();
                    },
                    i,
                  ),
                ),
              );
          });
        };
      c(), document.body.appendChild(t);
      let l = x(Dn);
      (E = {
        el: t,
        cleanups: [
          () => {
            i.forEach((d) => x(d)), (i = []);
          },
          () => {
            l && l();
          },
        ],
        node: null,
        pan: { x: 0, y: 0 },
      }),
        M.audio.classList.add("canat-active"),
        M.ov.classList.add("canat-assets"),
        M.ov.classList.remove("canat-over"),
        Ce(t),
        x(ve),
        (s.hover = null),
        (s.press = null),
        re(),
        ue();
    }
    let tt = (e) => {
      let t = [];
      for (let n = e; n && n !== N.scene(); n = n.parent) t.unshift(n.name);
      return t.join("/");
    };
    function zt(e) {
      s.sel = e;
      re();
      ue();
      window.__cocosAnatomy.selected = e;
      if (!docked()) {
        x(() => xfShow(e));
      }
      console.log("[cocos-anatomy] selected", tt(e), e);
      window.dispatchEvent(new CustomEvent("cocos-anatomy:select", { detail: { node: e } }));
    }
    function Un(e) {
      let t = be(),
        n = le(),
        o = Ee(),
        r = t.layers.indexOf(e.node),
        a = r < 0 ? null : Pe(o[0], o[1], N.worldZ(t.parent) + Ye(e.node).orig + r * t.gap);
      s.drag = {
        node: e.node,
        level: t,
        start: t.layers.slice(),
        ox: a ? a[0] - (e.x - n.left) : 0,
        oy: a ? a[1] - (e.y - n.top) : 0,
      };
      let i = t.parent.getComponent("cc.Layout");
      i && i.enabled && s.layouts.indexOf(i) < 0 && ((i.enabled = !1), s.layouts.push(i)),
        zt(e.node),
        M.ov.classList.add("canat-dragging");
    }
    function Xn(e) {
      let t = s.drag,
        n = t.level,
        o = le(),
        r = e.clientX - o.left + t.ox,
        a = e.clientY - o.top + t.oy,
        i = -1,
        c = 1e9,
        l = N.worldZ(n.parent),
        d = Ee();
      n.layers.forEach((p, f) => {
        let h = Pe(d[0], d[1], l + Ye(p).orig + f * n.gap);
        if (!h) return;
        let b = Math.hypot(h[0] - r, h[1] - a);
        b < c && ((c = b), (i = f));
      });
      let u = n.layers.indexOf(t.node);
      i < 0 || i === u || (n.layers.splice(u, 1), n.layers.splice(i, 0, t.node), gt(n));
    }
    function It() {
      let e = s.drag;
      (s.drag = null), M.ov.classList.remove("canat-dragging");
      let t = e.level,
        n = t.parent;
      if (!t.layers.some((r, a) => r !== e.start[a])) {
        re();
        return;
      }
      let o = e.start.map((r) => r.getSiblingIndex()).sort((r, a) => r - a);
      t.layers.forEach((r, a) => r.setSiblingIndex(o[a])),
        Fe(
          e.node.name +
            ": layer " +
            (t.layers.indexOf(e.node) + 1) +
            " of " +
            t.layers.length +
            " under " +
            n.name,
        ),
        re();
    }
    function Pt(e) {
      if (!Xe() || s.on || s.leaving) return;
      let t = cn();
      if (t) {
        Fe("Cocos Creator " + t + " is not supported (needs 2.1, 2.4+ or 3.x)");
        return;
      }
      let n = z(),
        o = N.camera(),
        r = N.root();
      if (!o || !r) {
        Fe("No Canvas / camera in this scene");
        return;
      }
      (s.dir = e === "rtl" ? "rtl" : "ltr"), (s.yaw = s.dir === "rtl" ? D : -D);
      let a = n.view.getDesignResolutionSize(),
        i = (s.saved = N.saveCam(o));
      Object.assign(i, { policy: n.view.getResolutionPolicy(), design: [a.width, a.height], widgets: [] }),
        (function l(d) {
          (d.components || d._components).forEach((u) => {
            (u.__classname__ || "") === "cc.Widget" && u.enabled && (i.widgets.push(u), (u.enabled = !1));
          }),
            d.children.forEach(l);
        })(N.scene()),
        n.view.setDesignResolutionSize(a.width, a.height, n.ResolutionPolicy.EXACT_FIT),
        N.persp(o);
      let c = { parent: r, layers: We(r), focus: null, gap: 0, masks: [] };
      if (
        ((c.masks = bt([r].concat(c.layers))),
        mt(c),
        (s.stack = [c]),
        fe(c.layers),
        !c.layers.length || !s.camT)
      ) {
        Ie(!1), Fe("Nothing to show in this scene");
        return;
      }
      (s.cam = Object.assign({}, s.camT, { yaw: 0, pitch: 0 })),
        M.show(!0),
        Ot(),
        (s.on = !0),
        (s.t = performance.now()),
        ue(),
        x(Fn);
    }
    function ze() {
      if (!s.on || s.leaving) return;
      ne(),
        (s.leaving = !0),
        (s.hover = null),
        (s.drag = null),
        (s.press = null),
        s.stack.forEach(yt),
        s.op.forEach((n) => {
          (n.target = 1), (n.ft = 1), (n.hidden = !1), (n.dirty = !0);
        });
      let e = s.saved,
        t = z().view.getDesignResolutionSize();
      (s.camT = {
        cx: e.wxy[0],
        cy: e.wxy[1],
        cz: N.worldZ(N.root()),
        d: N.orthoHalf(e, t) / Math.tan((U * Math.PI) / 360),
        yaw: 0,
        pitch: 0,
      }),
        M.el.classList.remove("canat-on");
    }
    function Ie(e) {
      iaKeep ? (iaKeep = !1) : xfHide(),
        h3Set(!1),
        ne(),
        x(() => {
          Me && Me();
        });
      let t = z(),
        n = s.saved;
      e ||
        (s.z.forEach((r, a) => {
          a.isValid && N.setZ(a, r.orig);
        }),
        s.op.forEach((r) => N.fadeRestore(r)),
        s.flags.forEach((r, a) => {
          a.isValid && (a.is3DNode = r);
        }),
        s.stack.forEach((r) =>
          r.masks.forEach((a) => {
            a.isValid && (a.enabled = !0);
          }),
        ),
        s.fo.forEach((r, a) => {
          a.isValid && (a.setPosition(r.x, r.y), (a.scaleX = r.sx), (a.scaleY = r.sy));
        }),
        N.restoreCam(n)),
        t.view.setDesignResolutionSize(n.design[0], n.design[1], n.policy);
      let o = s.layouts;
      e ||
        setTimeout(() => {
          n.widgets.forEach((r) => {
            r.isValid && (r.enabled = !0);
          }),
            o.forEach((r) => {
              r.isValid && (r.enabled = !0);
            });
        }, 150),
        (s = dt()),
        M.show(!1),
        re(),
        ue();
    }
    function Ot() {
      let e = s.cam,
        t = s.saved,
        { f: n } = Ae(e.yaw, e.pitch);
      t.cn.isValid && N.place(t, e.cx + e.d * n[0], e.cy + e.d * n[1], e.cz + e.d * n[2], e.cx, e.cy, e.cz);
    }
    function Vt(e) {
      if (O || (requestAnimationFrame(Vt), !s.on)) return;
      let t = Math.min(0.05, (e - s.t) / 1e3 || 0);
      s.t = e;
      let n = 1 - Math.exp(-ee * t),
        o = z().Color,
        r = 0;
      x(() => {
        if (
          (s.z.forEach((a, i) => {
            i.isValid &&
              ((a.cur += (a.target - a.cur) * n),
              Math.abs(a.target - a.cur) < 0.05 && (a.cur = a.target),
              (r = Math.max(r, Math.abs(a.target - a.cur))),
              N.getZ(i) !== a.cur && N.setZ(i, a.cur));
          }),
          s.op.forEach((a) => {
            if (
              N.fadeValid(a) &&
              !(!a.dirty && a.cur === a.target && a.target === 1 && a.f === a.ft && a.ft === 1)
            ) {
              if (
                ((a.cur += (a.target - a.cur) * n),
                Math.abs(a.target - a.cur) <= 0.002 && (a.cur = a.target),
                N.fadeSet(a, a.hidden ? 0 : a.cur),
                a.cols && a.f !== a.ft)
              ) {
                (a.f += (a.ft - a.f) * n), Math.abs(a.ft - a.f) < 0.004 && (a.f = a.ft);
                let i = a.f;
                a.cols.forEach((c) => {
                  c[0].isValid && (c[0].color = new o(c[1].r * i, c[1].g * i, c[1].b * i, c[1].a));
                });
              }
              (r = Math.max(r, Math.abs(a.target - a.cur) * 255, Math.abs(a.ft - a.f) * 255)),
                a.cur === a.target && a.f === a.ft && (a.dirty = !1);
            }
          }),
          s.camT)
        ) {
          let a = s.cam,
            i = s.camT;
          ["cx", "cy", "cz", "d", "yaw", "pitch"].forEach((c) => {
            (a[c] += (i[c] - a[c]) * n), (r = Math.max(r, Math.abs(i[c] - a[c])));
          }),
            Ot();
        }
        pe() && dn(), re();
      }),
        s.leaving && r < 0.5 && x(() => Ie(!1));
    }
    let Ht = () => z().game.canvas || document.querySelector("canvas"),
      le = () => Ht().getBoundingClientRect(),
      nt = () => {
        let e = le();
        return { w: e.width || 1, h: e.height || 1 };
      },
      at = () => {
        let e = nt(),
          t = s.saved && s.saved.design;
        return t && /^2\.1\./.test(String(z().ENGINE_VERSION || "")) ? t[0] / t[1] : e.w / e.h;
      };
    function Pe(e, t, n) {
      let o = s.cam;
      if (!o) return null;
      let { f: r, r: a, u: i } = Ae(o.yaw, o.pitch),
        c = nt(),
        l = [e - o.cx, t - o.cy, n - o.cz],
        d = o.d - te(l, r);
      if (d < 1) return null;
      let u = Math.tan((U * Math.PI) / 360),
        p = u * at();
      return [((te(l, a) / d / p) * 0.5 + 0.5) * c.w, (0.5 - (te(l, i) / d / u) * 0.5) * c.h];
    }
    function Ft(e, t, n, o, r) {
      return [
        [e, t],
        [n, t],
        [n, o],
        [e, o],
      ].map((a) => Pe(a[0], a[1], r));
    }
    let Bt = (e) => e.every(Boolean);
    function Gn(e) {
      let t = N.bounds(e);
      if (!t || !s.saved) return t;
      let n = Ee(),
        o = s.saved.design[0],
        r = s.saved.design[1],
        a = {
          x0: Math.max(t.x0, n[0] - o),
          y0: Math.max(t.y0, n[1] - r),
          x1: Math.min(t.x1, n[0] + o),
          y1: Math.min(t.y1, n[1] + r),
        };
      return a.x1 > a.x0 && a.y1 > a.y0 ? a : null;
    }
    let de = 8;
    function Oe(e) {
      let t = Gn(e),
        n = t && N.bounds(e),
        o = N.worldZ(e),
        r = t && n && t.x0 === n.x0 && t.y0 === n.y0 && t.x1 === n.x1 && t.y1 === n.y1 ? N.orient(e) : null,
        a = r && s.cam ? r.map((b) => Pe(b[0], b[1], o)) : t && s.cam ? Ft(t.x0, t.y0, t.x1, t.y1, o) : null;
      if (!a || !Bt(a)) return null;
      let i = a.map((b) => b[0]),
        c = a.map((b) => b[1]),
        l = Math.min.apply(null, i),
        d = Math.max.apply(null, i),
        u = Math.min.apply(null, c),
        p = Math.max.apply(null, c);
      if (d - l >= 2 || p - u >= 2) return a;
      let f = (l + d) / 2,
        h = (u + p) / 2;
      return [
        [f - de, h - de],
        [f + de, h - de],
        [f + de, h + de],
        [f - de, h + de],
      ];
    }
    function Ee() {
      return N.worldXY(N.root());
    }
    function qn(e) {
      let t = Ee(),
        n = s.saved.design[0] / 2,
        o = s.saved.design[1] / 2,
        r = Ft(t[0] - n, t[1] - o, t[0] + n, t[1] + o, N.worldZ(e));
      return Bt(r) ? r : null;
    }
    function Wn(e, t, n) {
      let o = 0;
      for (let r = 0; r < 4; r++) {
        let a = e[r],
          i = e[(r + 1) % 4],
          c = (i[0] - a[0]) * (n - a[1]) - (i[1] - a[1]) * (t - a[0]);
        if (c !== 0) {
          if (o === 0) o = c > 0 ? 1 : -1;
          else if ((c > 0 ? 1 : -1) !== o) return !1;
        }
      }
      return o !== 0;
    }
    let Yn = (e) => {
      let t = 0;
      for (let n = 0; n < 4; n++) {
        let o = e[n],
          r = e[(n + 1) % 4];
        t += o[0] * r[1] - r[0] * o[1];
      }
      return Math.abs(t) / 2;
    };
    function Zn(e) {
      if (!s.on || s.leaving) return [];
      let t = le(),
        n = e.clientX - t.left,
        o = e.clientY - t.top,
        r = [];
      return (
        be().layers.forEach((a, i) => {
          let c = a.isValid && Oe(a);
          c && Wn(c, n, o) && r.push({ n: a, a: Yn(c), i });
        }),
        r.sort((a, i) => a.a - i.a || i.i - a.i).map((a) => a.n)
      );
    }
    function Ve(e) {
      let t = Zn(e);
      if (!t.length) return null;
      if (!e.altKey) return t[0];
      let n = t.indexOf(s.sel);
      return n >= 0 && e.detail > 1 ? s.sel : t[(n + 1) % t.length];
    }
    let He = (e) => (e ? e.map((t) => t.join(",")).join(" ") : "");
    function re() {
      if (!M.el) return;
      let e = s.on && !s.leaving,
        t = M.tag;
      e && M.fit();
      let n = "";
      e &&
        s.drag &&
        s.drag.level.layers.forEach((u) => {
          u.isValid &&
            (n +=
              '<polygon class="' +
              (u === s.drag.node ? "canat-drag" : "") +
              '" points="' +
              He(qn(u)) +
              '"/>');
        }),
        (M.frames.innerHTML = n);
      let o = "";
      e &&
        !E &&
        be().layers.forEach((u) => {
          let p = u.isValid && Oe(u);
          p && (o += '<polygon points="' + He(p) + '"/>');
        }),
        (M.zones.innerHTML = o);
      let r = e && !E && s.sel && s.sel.isValid && s.sel.activeInHierarchy && Oe(s.sel);
      M.sel.setAttribute("points", He(r)), Kn(e && !s.drag && !F && r ? s.sel : null, r || null);
      let a = e && !E && !s.drag && !F && s.hover,
        i = a && a.isValid && Oe(a);
      M.hl.setAttribute("points", He(i));
      let c = s.drag ? s.drag.node : a,
        l = s.drag ? r : i;
      if (!c || !l) {
        t.style.display = "none";
        return;
      }
      let d = We(c).length;
      (t.dataset.t = s.drag
        ? c.name +
          "  \xB7  layer " +
          (s.drag.level.layers.indexOf(c) + 1) +
          " / " +
          s.drag.level.layers.length
        : c.name + (d ? "  \xB7  " + d + " layers: double-click" : "")),
        (t.style.cssText =
          "display:block;left:" +
          Math.min.apply(
            null,
            l.map((u) => u[0]),
          ) +
          "px;top:" +
          Math.max(
            0,
            Math.min.apply(
              null,
              l.map((u) => u[1]),
            ) - 20,
          ) +
          "px");
    }
    function Kn(e, t) {
      let n = M.tools;
      if (!e || !t) {
        n.style.display = "none";
        return;
      }
      let o = vt(e);
      M.eye.classList.toggle("canat-off", o),
        (M.eye.innerHTML = o ? rn : lt),
        (M.eye.title = o ? "Show this node on the game" : "Hide this node on the game");
      let r = Math.max.apply(
          null,
          t.map((i) => i[0]),
        ),
        a = Math.min.apply(
          null,
          t.map((i) => i[1]),
        );
      n.style.cssText =
        "display:flex;left:" + r + "px;top:" + Math.max(0, a - 34) + "px;transform:translateX(-100%)";
    }
    function ue() {
      if (!M.crumb) return;
      let e = M.crumb;
      if (!s.on || docked()) {
        e.innerHTML = "";
        return;
      }
      let t = s.stack.map((o) => o.parent.name).join("  >  ");
      e.innerHTML = "<b></b><i></i>";
      let n = e.children;
      (n[0].dataset.t = t + "  (" + be().layers.length + " layers)"),
        (n[1].dataset.t = s.sel && s.sel.isValid ? "selected: " + tt(s.sel) : ""),
        ot();
    }
    function ot() {
      let e = M.hint;
      if (!e) return;
      if (!s.on || s.leaving || s.hintOff || docked()) {
        e.style.display = "none";
        return;
      }
      let t = e.children;
      (t[0].dataset.t = E
        ? (E.node ? "Drag to move the view  \xB7  " : "") +
          "double-click outside the panel, Esc or \xD7 to close"
        : "Click a layer (or pick it in the Layers list) to edit Position / Rotation / Scale, double-click to split it, drag it to reorder, Alt-click for the next one under the pointer  \xB7  " +
          (s.stack.length > 1
            ? "click empty space or Esc: back"
            : "swipe " +
              (s.dir === "ltr" ? "\u2190" : "\u2192") +
              ", double-click empty space or Esc to exit")),
        (t[1].dataset.t =
          "Rotate: right-drag, Shift-drag, two fingers or arrow keys  \xB7  Zoom: wheel, pinch or + / -  \xB7  I: interact with the game  \xB7  P: pause / resume  \xB7  .: step one frame"),
        (e.style.display = "flex");
    }
    let Dt = 0;
    function Fe(e) {
      M.build(),
        (M.toast.dataset.t = e),
        (M.toast.style.display = "block"),
        s.on || ((M.el.style.display = "block"), M.fit()),
        clearTimeout(Dt),
        (Dt = window.setTimeout(() => {
          (M.toast.style.display = "none"), s.on || (M.el.style.display = "none");
        }, 2200));
    }
    let Qn =
        "#" +
        _ +
        "{position:fixed;z-index:2147483647;display:none;cursor:default;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;font:12px system-ui,sans-serif}#" +
        _ +
        " .canat-tag::before,#" +
        _ +
        " .canat-crumb>*::before,#" +
        _ +
        " .canat-toast::before,#" +
        _ +
        " .canat-hint span::before{content:attr(data-t);white-space:inherit}#" +
        _ +
        " *{user-select:none;-webkit-user-select:none}#" +
        _ +
        " svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}#" +
        _ +
        ".canat-assets{cursor:grab}#" +
        _ +
        ".canat-panning{cursor:grabbing}#" +
        _ +
        ".canat-over{cursor:grab}#" +
        _ +
        ".canat-dragging{cursor:grabbing}#" +
        _ +
        " .canat-hl{fill:rgba(91,157,255,.16);stroke:#5b9dff;stroke-width:2;stroke-linejoin:round;stroke-dasharray:6 4}#" +
        _ +
        " .canat-sel{fill:rgba(255,179,71,.12);stroke:#ffb347;stroke-width:2;stroke-linejoin:round;stroke-dasharray:6 4}#" +
        _ +
        " .canat-zones polygon{fill:rgba(91,157,255,.05);stroke:rgba(91,157,255,.55);stroke-width:1;stroke-dasharray:3 3;stroke-linejoin:round}#" +
        _ +
        " .canat-frames polygon{fill:rgba(255,255,255,.03);stroke:rgba(230,231,234,.45);stroke-width:1;stroke-dasharray:5 4}#" +
        _ +
        " .canat-frames polygon.canat-drag{fill:rgba(255,179,71,.10);stroke:#ffb347;stroke-width:2;stroke-dasharray:none}#" +
        _ +
        " .canat-tag{position:absolute;display:none;padding:2px 6px;border-radius:4px;background:#5b9dff;color:#16171a;font:11px ui-monospace,Menlo,monospace;white-space:pre;pointer-events:none}#" +
        _ +
        " .canat-audio{position:absolute;right:10px;top:10px;width:28px;height:28px;border-radius:7px;background:rgba(22,23,26,.72);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.16);color:#f2f3f5;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;pointer-events:auto;transition:color .12s,border-color .12s,background .12s}#" +
        _ +
        " .canat-audio:hover,#" +
        _ +
        " .canat-audio.canat-active{color:#ffb347;border-color:#ffb347}#" +
        _ +
        " .canat-audio.canat-active{background:rgba(255,179,71,.16)}#" +
        _ +
        " .canat-audio svg{position:static;inset:auto;display:block;pointer-events:none;width:16px;height:16px}#" +
        _ +
        " .canat-audio:disabled{opacity:.35;cursor:default;pointer-events:none;color:#f2f3f5;border-color:rgba(255,255,255,.16)}#" +
        _ +
        " .canat-crumb{position:absolute;left:12px;top:10px;display:flex;max-width:calc(100% - 64px);overflow:hidden;flex-direction:column;gap:2px;pointer-events:none;text-shadow:0 1px 2px #000}#" +
        _ +
        " .canat-crumb b{font:600 12px ui-monospace,Menlo,monospace;color:#e6e7ea;white-space:pre}#" +
        _ +
        " .canat-crumb span{color:#b4b8c2}#" +
        _ +
        " .canat-crumb i{font:11px ui-monospace,Menlo,monospace;color:#ffb347;font-style:normal;white-space:pre}#" +
        _ +
        " .canat-tools{position:absolute;display:none;gap:4px;pointer-events:auto}#" +
        _ +
        " .canat-tools button{width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.55);color:#f2f3f5;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;box-shadow:0 0 6px rgba(255,255,255,.25);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);transition:background .12s,border-color .12s}#" +
        _ +
        " .canat-tools button:hover{background:rgba(255,255,255,.18);border-color:#fff}#" +
        _ +
        " .canat-tools button svg{position:static;inset:auto;display:block;width:16px;height:16px;pointer-events:none;filter:drop-shadow(0 0 2px rgba(0,0,0,.6))}#" +
        _ +
        " .canat-tools button.canat-off{color:rgba(242,243,245,.55);border-color:rgba(255,255,255,.28);box-shadow:none}#" +
        _ +
        ".canat-rotating{cursor:move}#" +
        _ +
        " .canat-hint{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);display:none;flex-direction:column;align-items:center;gap:2px;max-width:calc(100% - 24px);padding:6px 28px 6px 12px;border-radius:6px;background:rgba(22,23,26,.82);color:#e6e7ea;font-size:11px;text-align:center;white-space:normal;pointer-events:none}#" +
        _ +
        " .canat-hint-x{position:absolute;right:4px;top:2px;width:20px;height:20px;border:0;background:none;color:#b4b8c2;font-size:16px;line-height:1;cursor:pointer;padding:0;pointer-events:auto}#" +
        _ +
        " .canat-hint-x:hover{color:#fff}#" +
        _ +
        " .canat-toast{position:absolute;left:50%;bottom:76px;transform:translateX(-50%);display:none;padding:6px 12px;border-radius:6px;background:rgba(22,23,26,.9);color:#e6e7ea;pointer-events:none}",
      y = "#" + _ + "-pop",
      Jn =
        y +
        "{position:fixed;z-index:2147483647;display:flex;flex-direction:column;font:12px var(--ca-font,system-ui,sans-serif);color:var(--ca-text,#e6e7ea);user-select:none;-webkit-user-select:none;background:var(--ca-bg,rgba(30,32,36,.96));border:1px solid var(--ca-line,#34373d);border-radius:0;box-shadow:0 8px 30px rgba(0,0,0,.45);color-scheme:dark}" +
        y +
        " .canat-head{display:flex;align-items:baseline;gap:10px;padding:10px 12px;border-bottom:1px solid var(--ca-line,#34373d);flex:none}" +
        y +
        " .canat-head b{font:600 12px ui-monospace,Menlo,monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}" +
        y +
        " .canat-head span{color:var(--ca-muted,#9a9ea8);flex:1;white-space:nowrap;min-width:0;overflow:hidden;text-overflow:ellipsis}" +
        y +
        " .canat-x{background:none;border:0;color:var(--ca-muted2,#b4b8c2);font-size:18px;line-height:1;cursor:pointer;padding:0 4px;flex:none}" +
        y +
        " .canat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;padding:12px;align-content:start}" +
        y +
        " .canat-xform{flex:none;padding:8px 12px 10px;border-bottom:1px solid var(--ca-line,#34373d)}" +
        y +
        " .canat-xf-title{font:600 11px system-ui,sans-serif;color:var(--ca-muted,#9a9ea8);margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em}" +
        y +
        " .canat-xform .canat-matname{flex:0 0 64px}" +
        y +
        " .canat-xf-f{flex:1;min-width:0;display:flex;align-items:center;gap:3px}" +
        y +
        " .canat-xf-f i{font:normal 10px ui-monospace,Menlo,monospace;color:var(--ca-muted,#9a9ea8)}" +
        y +
        " .canat-xf-drag{cursor:ew-resize;padding:2px 3px;border-radius:2px;touch-action:none}" +
        y +
        " .canat-xf-drag:hover{background:var(--ca-line,#34373d);color:var(--ca-accent,#ffb347)}" +
        y +
        " .canat-xf-help{font:10px system-ui,sans-serif;color:var(--ca-muted,#9a9ea8);margin:0 0 6px;line-height:1.4}" +
        y +
        " .canat-xform input[type=number]{flex:1;min-width:0;width:100%;background:var(--ca-deep,#16171a);color:var(--ca-text,#e6e7ea);border:1px solid var(--ca-line,#34373d);border-radius:1px;padding:2px 4px;font:11px ui-monospace,Menlo,monospace;user-select:text;-webkit-user-select:text}" +
        y +
        " .canat-xf-dirty .canat-matname{color:var(--ca-accent,#ffb347)}" +
        y +
        " .canat-xf-undo{flex:none;background:none;border:0;color:var(--ca-muted2,#b4b8c2);font-size:13px;line-height:1;cursor:pointer;padding:0 2px}" +
        y +
        " .canat-matreset:disabled{opacity:.4;cursor:default}" +
        y +
        "[data-side=bottom]>.canat-grid{flex:1;min-height:0}" +
        y +
        ">.canat-grid," +
        y +
        " .canat-scroll{overflow:auto;flex:1;min-height:0}" +
        y +
        " .canat-sec{padding:12px 12px 0;font:600 11px system-ui,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:var(--ca-accent,#ffb347)}" +
        y +
        " .canat-agrid{gap:8px}" +
        y +
        ":not([data-side=bottom]) .canat-grid{grid-template-columns:1fr}" +
        y +
        "[data-side=bottom] .canat-grid{grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:minmax(230px,260px);overflow-x:auto;overflow-y:hidden;align-content:stretch}" +
        y +
        "[data-side=bottom]>.canat-grid{align-items:stretch}" +
        y +
        "[data-side=bottom] .canat-grid>.canat-cell{display:flex;flex-direction:column;min-height:0;overflow:hidden}" +
        y +
        "[data-side=bottom] .canat-grid>.canat-cell>.canat-view{aspect-ratio:auto;flex:1;min-height:0}" +
        y +
        "[data-side=bottom] .canat-scroll{overflow-y:auto}" +
        y +
        '[data-fit="1"]:not([data-side=bottom]) .canat-grid{grid-auto-rows:var(--cellh);align-content:start}' +
        y +
        '[data-fit="1"]:not([data-side=bottom]) .canat-grid>.canat-cell{display:flex;flex-direction:column;min-height:0;overflow:hidden;height:var(--cellh);box-sizing:border-box}' +
        y +
        '[data-fit="1"] .canat-grid>.canat-cell>.canat-view{aspect-ratio:auto;flex:1;min-height:0}' +
        y +
        '[data-fit="1"] .canat-grid>.canat-cell>.canat-view canvas{position:absolute;inset:0}' +
        y +
        '[data-fit="1"] .canat-grid>.canat-cell>.canat-matview{max-height:none}' +
        y +
        '[data-fit="1"][data-side=bottom] .canat-grid{grid-auto-columns:var(--cellw)}' +
        y +
        '[data-fit="1"][data-few="1"][data-side=bottom] .canat-grid{justify-content:center}' +
        y +
        " .canat-acell{display:flex;flex-direction:column;gap:6px;padding:8px 10px 10px;background:var(--ca-cell2,#1d1f23);border-color:var(--ca-line,#2e3238)}" +
        y +
        " .canat-player{display:flex;align-items:center;gap:8px;height:30px;padding:0 8px 0 0;background:var(--ca-deep,#0f1012);border:1px solid var(--ca-line,#2a2d33);border-radius:0}" +
        y +
        " .canat-view .canat-player{width:calc(100% - 16px)}" +
        y +
        " .canat-pp{width:30px;height:100%;flex:none;border:0;border-radius:0;background:var(--ca-accent,#ffb347);color:var(--ca-on,#16171a);font-size:10px;cursor:pointer;padding:0}" +
        y +
        " .canat-pp:hover{background:var(--ca-accent2,#ffc470)}" +
        y +
        " .canat-seek{flex:1;min-width:0;height:4px;margin:0;-webkit-appearance:none;appearance:none;border-radius:0;outline:0;cursor:pointer;background:linear-gradient(90deg,var(--ca-accent,#ffb347) var(--p,0%),var(--ca-line,#34373d) var(--p,0%))}" +
        y +
        " .canat-seek::-webkit-slider-thumb{-webkit-appearance:none;width:8px;height:12px;border-radius:0;background:var(--ca-text,#e6e7ea);border:0}" +
        y +
        " .canat-seek::-moz-range-thumb{width:8px;height:12px;border-radius:0;background:var(--ca-text,#e6e7ea);border:0}" +
        y +
        " .canat-time{flex:none;min-width:30px;text-align:right;color:var(--ca-muted,#9a9ea8);font:11px ui-monospace,Menlo,monospace}" +
        y +
        " .canat-ahead{display:flex;align-items:center;gap:8px;min-width:0}" +
        y +
        " .canat-ahead .canat-name{margin:0;min-width:0}" +
        y +
        " .canat-kind{flex:none;border:0;border-radius:1px;padding:2px 7px;font:700 10px system-ui,sans-serif;cursor:pointer;color:#16171a}" +
        y +
        " .canat-kind.canat-bgm{background:#5b9dff}" +
        y +
        " .canat-kind.canat-sfx{background:#7bd88f}" +
        y +
        " .canat-cell{background:var(--ca-cell,#26292e);border:1px solid var(--ca-line,#34373d);border-radius:0;padding:8px;min-width:0}" +
        y +
        " .canat-view{aspect-ratio:4/3;min-height:150px;width:100%;display:flex;align-items:center;justify-content:center;position:relative;background:repeating-conic-gradient(#2c2f35 0 25%,#24272b 0 50%) 0 0/14px 14px;border-radius:1px;overflow:hidden}" +
        y +
        " .canat-view canvas{width:100%;height:100%;object-fit:contain}" +
        y +
        " .canat-view canvas.canat-atlas{opacity:.55}" +
        y +
        " .canat-none{color:var(--ca-muted,#9a9ea8)}" +
        y +
        " .canat-matview{display:block;aspect-ratio:auto;min-height:150px;max-height:320px;overflow:auto;padding:8px;background:var(--ca-cell2,#1d1f23)}" +
        y +
        " .canat-mathead{font:600 11px ui-monospace,Menlo,monospace;color:var(--ca-accent,#ffb347);margin-bottom:6px;word-break:break-all}" +
        y +
        " .canat-matpass{margin:8px 0 4px;color:var(--ca-muted,#9a9ea8);font-size:10px;text-transform:uppercase;letter-spacing:.04em}" +
        y +
        " .canat-matrow{display:flex;align-items:center;gap:8px;margin:3px 0}" +
        y +
        " .canat-matname{flex:0 0 38%;min-width:0;font:11px ui-monospace,Menlo,monospace;color:var(--ca-muted2,#c8cbd2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
        y +
        " .canat-matval{flex:1;min-width:0;display:flex;gap:4px}" +
        y +
        " .canat-matval input[type=number]{flex:1;min-width:0;width:100%;background:var(--ca-deep,#16171a);color:var(--ca-text,#e6e7ea);border:1px solid var(--ca-line,#34373d);border-radius:1px;padding:2px 4px;font:11px ui-monospace,Menlo,monospace}" +
        y +
        " .canat-matval input[type=color]{width:34px;height:22px;padding:0;border:1px solid var(--ca-line,#34373d);background:none}" +
        y +
        " .canat-matinfo{flex:1;min-width:0;color:var(--ca-muted,#9a9ea8);font:11px ui-monospace,Menlo,monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
        y +
        " .canat-matbar{display:none;gap:6px;align-items:center;margin-bottom:8px}" +
        y +
        " .canat-matbar.canat-matsave," +
        y +
        " .canat-matbar.canat-matacts{display:flex;margin:8px 0 0}" +
        y +
        " .canat-matpreset{flex:1;min-width:0;height:24px;background:var(--ca-deep,#16171a);color:var(--ca-text,#e6e7ea);border:1px solid var(--ca-line,#34373d);border-radius:1px;font:11px ui-monospace,Menlo,monospace}" +
        y +
        " .canat-matsave input[type=text]{flex:1;min-width:0;height:22px;background:var(--ca-deep,#16171a);color:var(--ca-text,#e6e7ea);border:1px solid var(--ca-line,#34373d);border-radius:1px;padding:0 6px;font:11px ui-monospace,Menlo,monospace}" +
        y +
        " .canat-matbar .canat-matreset{margin-top:0}" +
        y +
        " .canat-matforget{background:none;border:1px solid var(--ca-line,#34373d);color:var(--ca-muted2,#b4b8c2);border-radius:1px;padding:1px 7px;cursor:pointer;font-size:13px;line-height:1.3}" +
        y +
        " .canat-matreset{margin-top:8px;background:var(--ca-accent,#ffb347);color:var(--ca-on,#16171a);border:0;border-radius:1px;padding:3px 10px;font:600 11px system-ui,sans-serif;cursor:pointer}" +
        y +
        " .canat-bar{position:absolute;left:6px;right:6px;bottom:6px;display:flex;gap:6px;align-items:center}" +
        y +
        " .canat-play{width:30px;height:24px;border-radius:1px;border:0;background:var(--ca-accent,#ffb347);color:var(--ca-on,#16171a);cursor:pointer;font-size:11px;padding:0;flex:none}" +
        y +
        " .canat-anim{flex:1;min-width:0;height:24px;background:var(--ca-deep,#16171a);color:var(--ca-text,#e6e7ea);border:1px solid var(--ca-line,#34373d);border-radius:1px}" +
        y +
        " .canat-frame{color:var(--ca-text,#e6e7ea);font:11px ui-monospace,Menlo,monospace;text-shadow:0 1px 2px #000}" +
        y +
        " .canat-live{position:absolute;left:6px;top:6px;color:var(--ca-accent,#ffb347);font-size:10px;text-shadow:0 1px 2px #000}" +
        y +
        " .canat-name{margin-top:8px;font:600 12px ui-monospace,Menlo,monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
        y +
        " .canat-sub{color:var(--ca-muted,#9a9ea8);font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      K = null,
      M = {
        el: K,
        ov: K,
        style: K,
        zones: K,
        frames: K,
        sel: K,
        hl: K,
        tag: K,
        crumb: K,
        toast: K,
        tools: K,
        eye: K,
        hint: K,
        audio: K,
        build() {
          if (this.el) return;
          let e = (this.style = document.createElement("style"));
          (e.textContent = Qn + Jn), document.head.appendChild(e);
          let t = (this.el = document.createElement("div"));
          (t.id = _),
            (t.innerHTML =
              '<svg><g class="canat-zones"></g><g class="canat-frames"></g><polygon class="canat-sel" points=""/><polygon class="canat-hl" points=""/></svg><span class="canat-tag"></span><button class="canat-audio" title="Audio assets of the game (background music, SFX)">' +
              sn +
              '</button><div class="canat-crumb"></div><div class="canat-tools"><button class="canat-eye"></button></div><div class="canat-toast"></div><div class="canat-hint"><span></span><span></span><button class="canat-hint-x" title="Hide this tip (H shows it again)">\xD7</button></div>'),
            document.body.appendChild(t),
            (this.ov = t),
            (this.zones = t.querySelector(".canat-zones")),
            (this.frames = t.querySelector(".canat-frames")),
            (this.sel = t.querySelector(".canat-sel")),
            (this.hl = t.querySelector(".canat-hl")),
            (this.tag = t.querySelector(".canat-tag")),
            (this.crumb = t.querySelector(".canat-crumb")),
            (this.toast = t.querySelector(".canat-toast")),
            (this.tools = t.querySelector(".canat-tools")),
            (this.eye = t.querySelector(".canat-eye")),
            (this.hint = t.querySelector(".canat-hint")),
            (this.audio = t.querySelector(".canat-audio")),
            (t.querySelector(".canat-hint-x").onclick = () => {
              (s.hintOff = !0), ot();
            }),
            (this.audio.onclick = () =>
              x(() => {
                (E && E.node) || (E && !E.node ? ne() : jn());
              })),
            (this.eye.onclick = () =>
              x(() => {
                let n = s.sel;
                n && n.isValid && (mn(n, !vt(n)), re());
              })),
            ["contextmenu", "selectstart", "dragstart"].forEach((n) =>
              t.addEventListener(n, (o) => o.preventDefault()),
            ),
            t.addEventListener("mousedown", (n) => {
              (n.button !== 0 || n.shiftKey) && n.preventDefault(), Yt();
            }),
            $n(t);
        },
        fit() {
          let e = le(),
            t = this.el.style;
          (t.left = e.left + "px"),
            (t.top = e.top + "px"),
            (t.width = e.width + "px"),
            (t.height = e.height + "px");
        },
        show(e) {
          this.build(),
            (this.el.style.display = e ? "block" : "none"),
            e
              ? (this.fit(), this.el.classList.add("canat-on"))
              : this.el.classList.remove("canat-on", "canat-over", "canat-dragging");
        },
      };
    function $n(e) {
      e.addEventListener(
        "wheel",
        (n) => {
          if ((n.preventDefault(), !s.on || s.leaving)) return;
          let o = n.deltaMode === 1 ? 16 : n.deltaMode === 2 ? 400 : 1;
          x(() => rt(Math.exp(-n.deltaY * o * (n.ctrlKey ? 0.01 : 0.0015))));
        },
        { passive: !1 },
      );
      let t = (n) => {
        let o = n.target;
        return o.closest && o.closest(".canat-tools, .canat-audio, .canat-hint");
      };
      e.addEventListener("mousedown", (n) => {
        if (n.button !== 0 || n.shiftKey || t(n) || E) return;
        let o = Ve(n);
        s.press = o ? { node: o, x: n.clientX, y: n.clientY } : null;
      }),
        w(window, "mousemove", (n) => {
          if (!(!s.on || E)) {
            if (n.buttons === 0 && (s.press || s.drag)) {
              Wt();
              return;
            }
            if (
              (s.press &&
                !s.drag &&
                Math.hypot(n.clientX - s.press.x, n.clientY - s.press.y) > Se &&
                x(() => Un(s.press)),
              s.drag)
            ) {
              x(() => Xn(n));
              return;
            }
            if (n.target === e && !F) {
              let o = Ve(n);
              o !== s.hover && ((s.hover = o), e.classList.toggle("canat-over", !!o), re());
            }
          }
        }),
        w(window, "mouseup", () => {
          s.drag && ((s.swallow = !0), x(It)), (s.press = null);
        }),
        e.addEventListener("mouseleave", () => {
          s.drag || ((s.hover = null), e.classList.remove("canat-over"), re());
        }),
        e.addEventListener("click", (n) => {
          if (t(n) || E) return;
          if (s.swallow) {
            s.swallow = !1;
            return;
          }
          let o = Ve(n);
          if (o) {
            x(() => zt(o));
            return;
          }
          n.detail > 1 || (x(xt) && (s.backAt = performance.now()));
        }),
        e.addEventListener("dblclick", (n) => {
          if (t(n) || E) return;
          let o = Ve(n);
          if (o) {
            x(() => hn(o));
            return;
          }
          s.stack.length === 1 && performance.now() - s.backAt > 600 && x(ze);
        });
    }
    w(
      window,
      "dblclick",
      (e) => {
        E && !E.el.contains(e.target) && (e.preventDefault(), e.stopPropagation(), ne());
      },
      !0,
    ),
      w(
        window,
        "keydown",
        (e) => {
          // Phím gõ trong cửa sổ Transform không được xoay camera / zoom / ẩn hint
          if (xfWin && xfWin.contains(e.target)) {
            e.key === "Escape" && e.target.blur && e.target.blur();
            return;
          }
          if (E) {
            if (e.key === "Escape") {
              e.preventDefault(), e.stopPropagation(), ne();
              return;
            }
            if (E.el.contains(e.target)) return;
          }
          if ((s.on && !s.leaving) || iaState) {
            if ((e.key === "p" || e.key === "P") && !e.ctrlKey && !e.metaKey && !e.altKey) {
              e.preventDefault();
              e.stopPropagation();
              x(() => pzSet(!pzIs()));
              return;
            }
            if (e.key === "." && !e.ctrlKey && !e.metaKey && !e.altKey) {
              e.preventDefault();
              e.stopPropagation();
              x(pzStep);
              return;
            }
          }
          if (!s.on || s.leaving) return;
          let t = { ArrowLeft: [-3, 0], ArrowRight: [3, 0], ArrowUp: [0, -3], ArrowDown: [0, 3] }[e.key];
          if (t) {
            e.preventDefault(), e.stopPropagation(), x(() => Ut(t[0], t[1]));
            return;
          }
          if ((e.key === "i" || e.key === "I") && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault(), e.stopPropagation(), x(iaEnter);
            return;
          }
          if ((e.key === "h" || e.key === "H") && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault(), e.stopPropagation(), (s.hintOff = !s.hintOff), ot();
            return;
          }
          if (e.key === "+" || e.key === "=" || e.key === "-" || e.key === "_") {
            e.preventDefault(),
              e.stopPropagation(),
              x(() => rt(e.key === "+" || e.key === "=" ? 1.15 : 1 / 1.15));
            return;
          }
          e.key === "Escape" && (e.preventDefault(), e.stopPropagation(), x(xt) || x(ze));
        },
        !0,
      ),
      w(window, "resize", () => {
        E && (Ce(E.el), x(ve));
      });
    let jt = (e, t) => Math.max(-t, Math.min(t, e));
    function rt(e) {
      (s.zoom = Math.max(ge, Math.min(ye, s.zoom * e))), s.fnodes && fe(s.fnodes);
    }
    function Ut(e, t) {
      (s.ry = jt(s.ry + e, an)), (s.rp = jt(s.rp + t, on)), s.fnodes && fe(s.fnodes);
    }
    let ea = 90,
      ae = null,
      Be = 0,
      F = null,
      Q = new Map(),
      J = null,
      ta = (e) => {
        let t = e.target;
        return !!t && (t === M.el || (t.tagName === "CANVAS" && t === z().game.canvas));
      },
      Xt = () => {
        let e = 0,
          t = 0;
        return (
          Q.forEach((n) => {
            (e += n.x), (t += n.y);
          }),
          { x: e / Q.size, y: t / Q.size }
        );
      },
      Gt = () => {
        let e = Array.from(Q.values());
        return e.length < 2 ? 0 : Math.hypot(e[0].x - e[1].x, e[0].y - e[1].y);
      };
    function De() {
      J &&
        (J.moved && (Be = performance.now() + 300),
        (J = null),
        M.ov && M.ov.classList.remove("canat-panning"));
    }
    function qt(e, t) {
      (s.press = null),
        (s.hover = null),
        (ae = null),
        De(),
        Yt(),
        (F = { x: e.x, y: e.y, id: t, dist: Gt() }),
        M.ov.classList.add("canat-rotating");
    }
    function Wt() {
      s.drag && x(It), (s.press = null), Q.clear(), (ae = null), De(), F && it();
    }
    w(window, "blur", Wt);
    function Yt() {
      let e = window.getSelection && window.getSelection();
      e && e.rangeCount && e.removeAllRanges();
    }
    function it() {
      F && ((F = null), (Be = performance.now() + 300), M.ov.classList.remove("canat-rotating"));
    }
    w(
      window,
      "pointerdown",
      (e) => {
        if (((ae = null), !Xe() || !ta(e))) return;
        e.pointerType === "touch" && Q.set(e.pointerId, { x: e.clientX, y: e.clientY });
        let t = e.pointerType === "mouse" && (e.button === 2 || (e.button === 0 && e.shiftKey)),
          n = s.on && !s.leaving && !s.drag;
        if (n && t) {
          qt({ x: e.clientX, y: e.clientY }, e.pointerId);
          return;
        }
        if (n && Q.size === 2) {
          qt(Xt(), "touch");
          return;
        }
        if (!(E && !E.node)) {
          if (E && n && !t && Q.size < 2 && e.isPrimary && (e.pointerType !== "mouse" || e.button === 0)) {
            (J = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: !1 }),
              M.ov.classList.add("canat-panning");
            return;
          }
          Q.size > 1 ||
            t ||
            (ae =
              e.isPrimary && (e.pointerType !== "mouse" || e.button === 0)
                ? { x: e.clientX, y: e.clientY, id: e.pointerId }
                : null);
        }
      },
      !0,
    ),
      w(
        window,
        "pointermove",
        (e) => {
          if (
            (Q.has(e.pointerId) && Q.set(e.pointerId, { x: e.clientX, y: e.clientY }),
            J && e.pointerId === J.id)
          ) {
            if (!E || (e.pointerType === "mouse" && e.buttons === 0)) {
              De();
              return;
            }
            let a = e.clientX - J.x,
              i = e.clientY - J.y;
            (J.x = e.clientX),
              (J.y = e.clientY),
              (a || i) && ((J.moved = !0), (E.pan = { x: E.pan.x + a, y: E.pan.y + i }), x(ve));
            return;
          }
          if (F && F.id !== "touch" && e.pointerType === "mouse" && e.buttons === 0) {
            it();
            return;
          }
          if (F) {
            let a =
              F.id === "touch"
                ? Q.size
                  ? Xt()
                  : null
                : e.pointerId === F.id
                  ? { x: e.clientX, y: e.clientY }
                  : null;
            if (a) {
              let i = a.x - F.x,
                c = a.y - F.y;
              if (((F.x = a.x), (F.y = a.y), x(() => Ut(-i * 0.25, c * 0.2)), F.id === "touch")) {
                let l = Gt(),
                  d = F.dist;
                d > 0 && l > 0 && l !== d && x(() => rt(l / d)), (F.dist = l);
              }
            }
            return;
          }
          if (!ae || e.pointerId !== ae.id) return;
          if (s.press || s.drag) {
            ae = null;
            return;
          }
          let t = e.clientX - ae.x,
            n = e.clientY - ae.y,
            o = le().width;
          if (Math.abs(t) < Math.max(ea, o * 0.15) || Math.abs(t) < 2 * Math.abs(n)) return;
          (ae = null), (Be = performance.now() + 500);
          let r = t > 0 ? "ltr" : "rtl";
          x(() => {
            s.on ? !s.leaving && r !== s.dir && ze() : s.leaving || iaState || Pt(r);
          });
        },
        !0,
      ),
      ["pointerup", "pointercancel"].forEach((e) =>
        w(
          window,
          e,
          (t) => {
            Q.delete(t.pointerId),
              (ae = null),
              J && J.id === t.pointerId && De(),
              F && (F.id === t.pointerId || (F.id === "touch" && Q.size < 2)) && it();
          },
          !0,
        ),
      ),
      ["click", "dblclick"].forEach((e) =>
        w(
          window,
          e,
          (t) => {
            performance.now() < Be && (t.stopPropagation(), t.preventDefault());
          },
          !0,
        ),
      );
    let Zt = setInterval(() => {
      let e = z();
      if (!e || !e.director || !e.Director) return;
      clearInterval(Zt);
      let t = () => {
        s.on && x(() => Ie(!0));
      };
      e.director.on(e.Director.EVENT_BEFORE_SCENE_LAUNCH, t),
        k.push(() => e.director.off(e.Director.EVENT_BEFORE_SCENE_LAUNCH, t));
      let n = () => {
        (he = null),
          setTimeout(() => {
            (he = null), E && !O && x(() => $e(E.el));
          }, 600);
      };
      e.director.on(e.Director.EVENT_AFTER_SCENE_LAUNCH, n),
        k.push(() => e.director.off(e.Director.EVENT_AFTER_SCENE_LAUNCH, n));
    }, 200);
    (window.__cocosAnatomy = {
      selected: null,
      isOn: () => s.on,
      version: T,
      toggle() {
        x(() => {
          Xe() && (iaState ? iaExit() : s.on ? ze() : Pt());
        });
      },
      edits: () => xfEdits(),
      panelState: () => apState(),
      cmd: (name, a, b) => x(() => apCmd(name, a, b)),
      dispose() {
        s.on && x(() => Ie(!1)),
          ne(),
          (O = !0),
          clearInterval(Zt),
          k.splice(0).forEach((e) => e()),
          M.el && (M.el.remove(), M.style.remove()),
          window.__cocosAnatomy === this && delete window.__cocosAnatomy;
      },
    }),
      w(window, "cocos-anatomy:toggle", () => window.__cocosAnatomy.toggle()),
      requestAnimationFrame(Vt);
  })();
})();
