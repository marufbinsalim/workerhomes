var EmailParser = (function (t) {
  var r = {};
  function n(e) {
    if (r[e]) return r[e].exports;
    var o = (r[e] = { i: e, l: !1, exports: {} });
    return t[e].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
  }
  return (
    (n.m = t),
    (n.c = r),
    (n.d = function (t, r, e) {
      n.o(t, r) || Object.defineProperty(t, r, { enumerable: !0, get: e });
    }),
    (n.r = function (t) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(t, "__esModule", { value: !0 });
    }),
    (n.t = function (t, r) {
      if ((1 & r && (t = n(t)), 8 & r)) return t;
      if (4 & r && "object" == typeof t && t && t.__esModule) return t;
      var e = Object.create(null);
      if (
        (n.r(e),
        Object.defineProperty(e, "default", { enumerable: !0, value: t }),
        2 & r && "string" != typeof t)
      )
        for (var o in t)
          n.d(
            e,
            o,
            function (r) {
              return t[r];
            }.bind(null, o),
          );
      return e;
    }),
    (n.n = function (t) {
      var r =
        t && t.__esModule
          ? function () {
              return t.default;
            }
          : function () {
              return t;
            };
      return n.d(r, "a", r), r;
    }),
    (n.o = function (t, r) {
      return Object.prototype.hasOwnProperty.call(t, r);
    }),
    (n.p = ""),
    n((n.s = 59))
  );
})([
  function (t, r) {
    var n = Array.isArray;
    t.exports = n;
  },
  function (t, r, n) {
    var e = n(31),
      o = "object" == typeof self && self && self.Object === Object && self,
      u = e || o || Function("return this")();
    t.exports = u;
  },
  function (t, r, n) {
    var e = n(74),
      o = n(79);
    t.exports = function (t, r) {
      var n = o(t, r);
      return e(n) ? n : void 0;
    };
  },
  function (t, r) {
    t.exports = function (t) {
      return null != t && "object" == typeof t;
    };
  },
  function (t, r) {
    t.exports = function (t) {
      var r = typeof t;
      return null != t && ("object" == r || "function" == r);
    };
  },
  function (t, r, n) {
    var e = n(6),
      o = n(75),
      u = n(76),
      i = e ? e.toStringTag : void 0;
    t.exports = function (t) {
      return null == t
        ? void 0 === t
          ? "[object Undefined]"
          : "[object Null]"
        : i && i in Object(t)
          ? o(t)
          : u(t);
    };
  },
  function (t, r, n) {
    var e = n(1).Symbol;
    t.exports = e;
  },
  function (t, r, n) {
    var e = n(35),
      o = n(99),
      u = n(14);
    t.exports = function (t) {
      return u(t) ? e(t) : o(t);
    };
  },
  function (t, r, n) {
    var e = n(64),
      o = n(65),
      u = n(66),
      i = n(67),
      c = n(68);
    function a(t) {
      var r = -1,
        n = null == t ? 0 : t.length;
      for (this.clear(); ++r < n; ) {
        var e = t[r];
        this.set(e[0], e[1]);
      }
    }
    (a.prototype.clear = e),
      (a.prototype.delete = o),
      (a.prototype.get = u),
      (a.prototype.has = i),
      (a.prototype.set = c),
      (t.exports = a);
  },
  function (t, r, n) {
    var e = n(18);
    t.exports = function (t, r) {
      for (var n = t.length; n--; ) if (e(t[n][0], r)) return n;
      return -1;
    };
  },
  function (t, r, n) {
    var e = n(2)(Object, "create");
    t.exports = e;
  },
  function (t, r, n) {
    var e = n(88);
    t.exports = function (t, r) {
      var n = t.__data__;
      return e(r) ? n["string" == typeof r ? "string" : "hash"] : n.map;
    };
  },
  function (t, r, n) {
    var e = n(33),
      o = n(34);
    t.exports = function (t, r, n, u) {
      var i = !n;
      n || (n = {});
      for (var c = -1, a = r.length; ++c < a; ) {
        var s = r[c],
          f = u ? u(n[s], t[s], s, n, t) : void 0;
        void 0 === f && (f = t[s]), i ? o(n, s, f) : e(n, s, f);
      }
      return n;
    };
  },
  function (t, r) {
    t.exports = function (t) {
      return (
        t.webpackPolyfill ||
          ((t.deprecate = function () {}),
          (t.paths = []),
          t.children || (t.children = []),
          Object.defineProperty(t, "loaded", {
            enumerable: !0,
            get: function () {
              return t.l;
            },
          }),
          Object.defineProperty(t, "id", {
            enumerable: !0,
            get: function () {
              return t.i;
            },
          }),
          (t.webpackPolyfill = 1)),
        t
      );
    };
  },
  function (t, r, n) {
    var e = n(30),
      o = n(22);
    t.exports = function (t) {
      return null != t && o(t.length) && !e(t);
    };
  },
  function (t, r, n) {
    var e = n(109),
      o = n(19),
      u = n(110),
      i = n(111),
      c = n(112),
      a = n(5),
      s = n(32),
      f = s(e),
      p = s(o),
      l = s(u),
      v = s(i),
      b = s(c),
      h = a;
    ((e && "[object DataView]" != h(new e(new ArrayBuffer(1)))) ||
      (o && "[object Map]" != h(new o())) ||
      (u && "[object Promise]" != h(u.resolve())) ||
      (i && "[object Set]" != h(new i())) ||
      (c && "[object WeakMap]" != h(new c()))) &&
      (h = function (t) {
        var r = a(t),
          n = "[object Object]" == r ? t.constructor : void 0,
          e = n ? s(n) : "";
        if (e)
          switch (e) {
            case f:
              return "[object DataView]";
            case p:
              return "[object Map]";
            case l:
              return "[object Promise]";
            case v:
              return "[object Set]";
            case b:
              return "[object WeakMap]";
          }
        return r;
      }),
      (t.exports = h);
  },
  function (t, r, n) {
    var e = n(29);
    t.exports = function (t) {
      if ("string" == typeof t || e(t)) return t;
      var r = t + "";
      return "0" == r && 1 / t == -1 / 0 ? "-0" : r;
    };
  },
  function (t, r, n) {
    var e = n(8),
      o = n(69),
      u = n(70),
      i = n(71),
      c = n(72),
      a = n(73);
    function s(t) {
      var r = (this.__data__ = new e(t));
      this.size = r.size;
    }
    (s.prototype.clear = o),
      (s.prototype.delete = u),
      (s.prototype.get = i),
      (s.prototype.has = c),
      (s.prototype.set = a),
      (t.exports = s);
  },
  function (t, r) {
    t.exports = function (t, r) {
      return t === r || (t != t && r != r);
    };
  },
  function (t, r, n) {
    var e = n(2)(n(1), "Map");
    t.exports = e;
  },
  function (t, r, n) {
    var e = n(80),
      o = n(87),
      u = n(89),
      i = n(90),
      c = n(91);
    function a(t) {
      var r = -1,
        n = null == t ? 0 : t.length;
      for (this.clear(); ++r < n; ) {
        var e = t[r];
        this.set(e[0], e[1]);
      }
    }
    (a.prototype.clear = e),
      (a.prototype.delete = o),
      (a.prototype.get = u),
      (a.prototype.has = i),
      (a.prototype.set = c),
      (t.exports = a);
  },
  function (t, r, n) {
    (function (t) {
      var e = n(1),
        o = n(97),
        u = r && !r.nodeType && r,
        i = u && "object" == typeof t && t && !t.nodeType && t,
        c = i && i.exports === u ? e.Buffer : void 0,
        a = (c ? c.isBuffer : void 0) || o;
      t.exports = a;
    }).call(this, n(13)(t));
  },
  function (t, r) {
    t.exports = function (t) {
      return (
        "number" == typeof t && t > -1 && t % 1 == 0 && t <= 9007199254740991
      );
    };
  },
  function (t, r) {
    t.exports = function (t) {
      return function (r) {
        return t(r);
      };
    };
  },
  function (t, r, n) {
    (function (t) {
      var e = n(31),
        o = r && !r.nodeType && r,
        u = o && "object" == typeof t && t && !t.nodeType && t,
        i = u && u.exports === o && e.process,
        c = (function () {
          try {
            var t = u && u.require && u.require("util").types;
            return t || (i && i.binding && i.binding("util"));
          } catch (t) {}
        })();
      t.exports = c;
    }).call(this, n(13)(t));
  },
  function (t, r) {
    var n = Object.prototype;
    t.exports = function (t) {
      var r = t && t.constructor;
      return t === (("function" == typeof r && r.prototype) || n);
    };
  },
  function (t, r, n) {
    var e = n(41),
      o = n(42),
      u = Object.prototype.propertyIsEnumerable,
      i = Object.getOwnPropertySymbols,
      c = i
        ? function (t) {
            return null == t
              ? []
              : ((t = Object(t)),
                e(i(t), function (r) {
                  return u.call(t, r);
                }));
          }
        : o;
    t.exports = c;
  },
  function (t, r, n) {
    var e = n(48);
    t.exports = function (t) {
      var r = new t.constructor(t.byteLength);
      return new e(r).set(new e(t)), r;
    };
  },
  function (t, r, n) {
    var e = n(0),
      o = n(29),
      u = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      i = /^\w*$/;
    t.exports = function (t, r) {
      if (e(t)) return !1;
      var n = typeof t;
      return (
        !(
          "number" != n &&
          "symbol" != n &&
          "boolean" != n &&
          null != t &&
          !o(t)
        ) ||
        i.test(t) ||
        !u.test(t) ||
        (null != r && t in Object(r))
      );
    };
  },
  function (t, r, n) {
    var e = n(5),
      o = n(3);
    t.exports = function (t) {
      return "symbol" == typeof t || (o(t) && "[object Symbol]" == e(t));
    };
  },
  function (t, r, n) {
    var e = n(5),
      o = n(4);
    t.exports = function (t) {
      if (!o(t)) return !1;
      var r = e(t);
      return (
        "[object Function]" == r ||
        "[object GeneratorFunction]" == r ||
        "[object AsyncFunction]" == r ||
        "[object Proxy]" == r
      );
    };
  },
  function (t, r) {
    var n =
      "object" == typeof global && global && global.Object === Object && global;
    t.exports = n;
  },
  function (t, r) {
    var n = Function.prototype.toString;
    t.exports = function (t) {
      if (null != t) {
        try {
          return n.call(t);
        } catch (t) {}
        try {
          return t + "";
        } catch (t) {}
      }
      return "";
    };
  },
  function (t, r, n) {
    var e = n(34),
      o = n(18),
      u = Object.prototype.hasOwnProperty;
    t.exports = function (t, r, n) {
      var i = t[r];
      (u.call(t, r) && o(i, n) && (void 0 !== n || r in t)) || e(t, r, n);
    };
  },
  function (t, r, n) {
    var e = n(93);
    t.exports = function (t, r, n) {
      "__proto__" == r && e
        ? e(t, r, { configurable: !0, enumerable: !0, value: n, writable: !0 })
        : (t[r] = n);
    };
  },
  function (t, r, n) {
    var e = n(95),
      o = n(36),
      u = n(0),
      i = n(21),
      c = n(37),
      a = n(38),
      s = Object.prototype.hasOwnProperty;
    t.exports = function (t, r) {
      var n = u(t),
        f = !n && o(t),
        p = !n && !f && i(t),
        l = !n && !f && !p && a(t),
        v = n || f || p || l,
        b = v ? e(t.length, String) : [],
        h = b.length;
      for (var y in t)
        (!r && !s.call(t, y)) ||
          (v &&
            ("length" == y ||
              (p && ("offset" == y || "parent" == y)) ||
              (l &&
                ("buffer" == y || "byteLength" == y || "byteOffset" == y)) ||
              c(y, h))) ||
          b.push(y);
      return b;
    };
  },
  function (t, r, n) {
    var e = n(96),
      o = n(3),
      u = Object.prototype,
      i = u.hasOwnProperty,
      c = u.propertyIsEnumerable,
      a = e(
        (function () {
          return arguments;
        })(),
      )
        ? e
        : function (t) {
            return o(t) && i.call(t, "callee") && !c.call(t, "callee");
          };
    t.exports = a;
  },
  function (t, r) {
    var n = /^(?:0|[1-9]\d*)$/;
    t.exports = function (t, r) {
      var e = typeof t;
      return (
        !!(r = null == r ? 9007199254740991 : r) &&
        ("number" == e || ("symbol" != e && n.test(t))) &&
        t > -1 &&
        t % 1 == 0 &&
        t < r
      );
    };
  },
  function (t, r, n) {
    var e = n(98),
      o = n(23),
      u = n(24),
      i = u && u.isTypedArray,
      c = i ? o(i) : e;
    t.exports = c;
  },
  function (t, r) {
    t.exports = function (t, r) {
      return function (n) {
        return t(r(n));
      };
    };
  },
  function (t, r, n) {
    var e = n(35),
      o = n(102),
      u = n(14);
    t.exports = function (t) {
      return u(t) ? e(t, !0) : o(t);
    };
  },
  function (t, r) {
    t.exports = function (t, r) {
      for (var n = -1, e = null == t ? 0 : t.length, o = 0, u = []; ++n < e; ) {
        var i = t[n];
        r(i, n, t) && (u[o++] = i);
      }
      return u;
    };
  },
  function (t, r) {
    t.exports = function () {
      return [];
    };
  },
  function (t, r, n) {
    var e = n(44),
      o = n(45),
      u = n(26),
      i = n(42),
      c = Object.getOwnPropertySymbols
        ? function (t) {
            for (var r = []; t; ) e(r, u(t)), (t = o(t));
            return r;
          }
        : i;
    t.exports = c;
  },
  function (t, r) {
    t.exports = function (t, r) {
      for (var n = -1, e = r.length, o = t.length; ++n < e; ) t[o + n] = r[n];
      return t;
    };
  },
  function (t, r, n) {
    var e = n(39)(Object.getPrototypeOf, Object);
    t.exports = e;
  },
  function (t, r, n) {
    var e = n(47),
      o = n(26),
      u = n(7);
    t.exports = function (t) {
      return e(t, u, o);
    };
  },
  function (t, r, n) {
    var e = n(44),
      o = n(0);
    t.exports = function (t, r, n) {
      var u = r(t);
      return o(t) ? u : e(u, n(t));
    };
  },
  function (t, r, n) {
    var e = n(1).Uint8Array;
    t.exports = e;
  },
  function (t, r, n) {
    var e = n(41),
      o = n(125),
      u = n(51),
      i = n(0);
    t.exports = function (t, r) {
      return (i(t) ? e : o)(t, u(r, 3));
    };
  },
  function (t, r, n) {
    var e = n(126),
      o = n(129)(e);
    t.exports = o;
  },
  function (t, r, n) {
    var e = n(130),
      o = n(143),
      u = n(153),
      i = n(0),
      c = n(154);
    t.exports = function (t) {
      return "function" == typeof t
        ? t
        : null == t
          ? u
          : "object" == typeof t
            ? i(t)
              ? o(t[0], t[1])
              : e(t)
            : c(t);
    };
  },
  function (t, r, n) {
    var e = n(132),
      o = n(3);
    t.exports = function t(r, n, u, i, c) {
      return (
        r === n ||
        (null == r || null == n || (!o(r) && !o(n))
          ? r != r && n != n
          : e(r, n, u, i, t, c))
      );
    };
  },
  function (t, r, n) {
    var e = n(133),
      o = n(136),
      u = n(137);
    t.exports = function (t, r, n, i, c, a) {
      var s = 1 & n,
        f = t.length,
        p = r.length;
      if (f != p && !(s && p > f)) return !1;
      var l = a.get(t);
      if (l && a.get(r)) return l == r;
      var v = -1,
        b = !0,
        h = 2 & n ? new e() : void 0;
      for (a.set(t, r), a.set(r, t); ++v < f; ) {
        var y = t[v],
          x = r[v];
        if (i) var d = s ? i(x, y, v, r, t, a) : i(y, x, v, t, r, a);
        if (void 0 !== d) {
          if (d) continue;
          b = !1;
          break;
        }
        if (h) {
          if (
            !o(r, function (t, r) {
              if (!u(h, r) && (y === t || c(y, t, n, i, a))) return h.push(r);
            })
          ) {
            b = !1;
            break;
          }
        } else if (y !== x && !c(y, x, n, i, a)) {
          b = !1;
          break;
        }
      }
      return a.delete(t), a.delete(r), b;
    };
  },
  function (t, r, n) {
    var e = n(4);
    t.exports = function (t) {
      return t == t && !e(t);
    };
  },
  function (t, r) {
    t.exports = function (t, r) {
      return function (n) {
        return null != n && n[t] === r && (void 0 !== r || t in Object(n));
      };
    };
  },
  function (t, r, n) {
    var e = n(57),
      o = n(16);
    t.exports = function (t, r) {
      for (var n = 0, u = (r = e(r, t)).length; null != t && n < u; )
        t = t[o(r[n++])];
      return n && n == u ? t : void 0;
    };
  },
  function (t, r, n) {
    var e = n(0),
      o = n(28),
      u = n(145),
      i = n(148);
    t.exports = function (t, r) {
      return e(t) ? t : o(t, r) ? [t] : u(i(t));
    };
  },
  function (t, r) {
    t.exports = function (t, r) {
      for (var n = -1, e = null == t ? 0 : t.length, o = Array(e); ++n < e; )
        o[n] = r(t[n], n, t);
      return o;
    };
  },
  function (t, r, n) {
    var e = n(60);
    t.exports = function (t, r) {
      var n = new e().parse(t);
      return r ? (n ? n.getVisibleText() : "") : n;
    };
  },
  function (t, r, n) {
    var e = n(61),
      o = n(159),
      u = n(160),
      i = n(49),
      c = n(161);
    const a =
        /(?:^\s*--|^\s*__|^-\w|^-- $)|(?:^Sent from my (?:\s*\w+){1,4}$)|(?:^={30,}$)$/,
      s = />+$/,
      f = [
        /^\s*(On(?:(?!.*On\b|\bwrote:)[\s\S])+wrote:)$/m,
        /^\s*(Le(?:(?!.*Le\b|\bécrit:)[\s\S])+écrit :)$/m,
        /^\s*(El(?:(?!.*El\b|\bescribió:)[\s\S])+escribió:)$/m,
        /^\s*(Il(?:(?!.*Il\b|\bscritto:)[\s\S])+scritto:)$/m,
        /^\s*(Op\s[\S\s]+?schreef[\S\s]+:)$/m,
        /^\s*((W\sdniu|Dnia)\s[\S\s]+?(pisze|napisał(\(a\))?):)$/mu,
        /^\s*(Den\s.+\sskrev\s.+:)$/m,
        /^\s*(Am\s.+\sum\s.+\sschrieb\s.+:)$/m,
        /^(在[\S\s]+写道：)$/m,
        /^(20[0-9]{2}\..+\s작성:)$/m,
        /^(20[0-9]{2}\/.+のメッセージ:)$/m,
        /^(.+\s<.+>\sschrieb:)$/m,
        /^\s*(From\s?:.+\s?(\[|<).+(\]|>))/mu,
        /^\s*(De\s?:.+\s?(\[|<).+(\]|>))/mu,
        /^\s*(Van\s?:.+\s?(\[|<).+(\]|>))/mu,
        /^\s*(Da\s?:.+\s?(\[|<).+(\]|>))/mu,
        /^(20[0-9]{2}-(?:0?[1-9]|1[012])-(?:0?[0-9]|[1-2][0-9]|3[01]|[1-9])\s[0-2]?[0-9]:\d{2}\s[\S\s]+?:)$/m,
        /^\s*([a-z]{3,4}\.[\s\S]+\sskrev[\s\S]+:)$/m,
      ];
    /**
     * Represents a fragment that hasn't been constructed (yet)
     * @license MIT License
     */
    class p {
      constructor() {
        (this.lines = []),
          (this.isHidden = !1),
          (this.isSignature = !1),
          (this.isQuoted = !1);
      }
      toFragment() {
        var t = c.reverse(this.lines.join("\n")).replace(/^\n/, "");
        return new o(t, this.isHidden, this.isSignature, this.isQuoted);
      }
    }
    t.exports = class {
      constructor(t, r, n) {
        (this._signatureRegex = t || a),
          (this._quotedLineRegex = r || s),
          (this._quoteHeadersRegex = n || f);
      }
      parse(t) {
        if ("string" != typeof t) return new e([]);
        var r = [];
        for (var n of ((t = t.replace("\r\n", "\n")),
        this._quoteHeadersRegex)) {
          var o = t.match(n);
          o && o.length >= 2 && (t = t.replace(o[1], o[1].replace(/\n/g, " ")));
        }
        var i = null;
        for (var a of c.reverse(t).split("\n")) {
          if (
            ((a = a.replace(/\n+$/, "")),
            this._isSignature(a) || (a = a.replace(/^\s+/, "")),
            i)
          ) {
            var s = i.lines[i.lines.length - 1];
            this._isSignature(s)
              ? ((i.isSignature = !0), this._addFragment(i, r), (i = null))
              : 0 === a.length &&
                this._isQuoteHeader(s) &&
                ((i.isQuoted = !0), this._addFragment(i, r), (i = null));
          }
          var f = this._isQuote(a);
          (null !== i && this._isFragmentLine(i, a, f)) ||
            (i && this._addFragment(i, r), ((i = new p()).isQuoted = f)),
            i.lines.push(a);
        }
        i && this._addFragment(i, r);
        var l = [];
        for (var v of r) l.push(v.toFragment());
        return new e(u(l));
      }
      _addFragment(t, r) {
        (t.isQuoted || t.isSignature || 0 === t.lines.join("").length) &&
          (t.isHidden = !0),
          r.push(t);
      }
      _isFragmentLine(t, r, n) {
        return (
          t.isQuoted === n ||
          (!!t.isQuoted && (this._isQuoteHeader(r) || 0 === r.length))
        );
      }
      _isSignature(t) {
        return this._signatureRegex.test(c.reverse(t));
      }
      _isQuote(t) {
        return this._quotedLineRegex.test(t);
      }
      _isQuoteHeader(t) {
        return (
          i(this._quoteHeadersRegex, (r) => r.test(c.reverse(t))).length > 0
        );
      }
    };
  },
  function (t, r, n) {
    var e = n(62),
      o = n(49),
      u = n(157);
    t.exports = class {
      constructor(t) {
        this._fragments = t;
      }
      getFragments() {
        return e(this._fragments);
      }
      getVisibleText() {
        var t = o(this._fragments, (t) => !t.isHidden());
        return u(t, (t) => t.getContent()).join("\n");
      }
    };
  },
  function (t, r, n) {
    var e = n(63);
    t.exports = function (t) {
      return e(t, 5);
    };
  },
  function (t, r, n) {
    var e = n(17),
      o = n(92),
      u = n(33),
      i = n(94),
      c = n(101),
      a = n(104),
      s = n(105),
      f = n(106),
      p = n(107),
      l = n(46),
      v = n(108),
      b = n(15),
      h = n(113),
      y = n(114),
      x = n(119),
      d = n(0),
      j = n(21),
      _ = n(121),
      g = n(4),
      m = n(123),
      O = n(7),
      w = {};
    (w["[object Arguments]"] =
      w["[object Array]"] =
      w["[object ArrayBuffer]"] =
      w["[object DataView]"] =
      w["[object Boolean]"] =
      w["[object Date]"] =
      w["[object Float32Array]"] =
      w["[object Float64Array]"] =
      w["[object Int8Array]"] =
      w["[object Int16Array]"] =
      w["[object Int32Array]"] =
      w["[object Map]"] =
      w["[object Number]"] =
      w["[object Object]"] =
      w["[object RegExp]"] =
      w["[object Set]"] =
      w["[object String]"] =
      w["[object Symbol]"] =
      w["[object Uint8Array]"] =
      w["[object Uint8ClampedArray]"] =
      w["[object Uint16Array]"] =
      w["[object Uint32Array]"] =
        !0),
      (w["[object Error]"] =
        w["[object Function]"] =
        w["[object WeakMap]"] =
          !1),
      (t.exports = function t(r, n, F, A, S, D) {
        var $,
          P = 1 & n,
          z = 2 & n,
          E = 4 & n;
        if ((F && ($ = S ? F(r, A, S, D) : F(r)), void 0 !== $)) return $;
        if (!g(r)) return r;
        var k = d(r);
        if (k) {
          if ((($ = h(r)), !P)) return s(r, $);
        } else {
          var B = b(r),
            M = "[object Function]" == B || "[object GeneratorFunction]" == B;
          if (j(r)) return a(r, P);
          if (
            "[object Object]" == B ||
            "[object Arguments]" == B ||
            (M && !S)
          ) {
            if ((($ = z || M ? {} : x(r)), !P))
              return z ? p(r, c($, r)) : f(r, i($, r));
          } else {
            if (!w[B]) return S ? r : {};
            $ = y(r, B, P);
          }
        }
        D || (D = new e());
        var I = D.get(r);
        if (I) return I;
        D.set(r, $),
          m(r)
            ? r.forEach(function (e) {
                $.add(t(e, n, F, e, r, D));
              })
            : _(r) &&
              r.forEach(function (e, o) {
                $.set(o, t(e, n, F, o, r, D));
              });
        var C = E ? (z ? v : l) : z ? keysIn : O,
          Q = k ? void 0 : C(r);
        return (
          o(Q || r, function (e, o) {
            Q && (e = r[(o = e)]), u($, o, t(e, n, F, o, r, D));
          }),
          $
        );
      });
  },
  function (t, r) {
    t.exports = function () {
      (this.__data__ = []), (this.size = 0);
    };
  },
  function (t, r, n) {
    var e = n(9),
      o = Array.prototype.splice;
    t.exports = function (t) {
      var r = this.__data__,
        n = e(r, t);
      return (
        !(n < 0) &&
        (n == r.length - 1 ? r.pop() : o.call(r, n, 1), --this.size, !0)
      );
    };
  },
  function (t, r, n) {
    var e = n(9);
    t.exports = function (t) {
      var r = this.__data__,
        n = e(r, t);
      return n < 0 ? void 0 : r[n][1];
    };
  },
  function (t, r, n) {
    var e = n(9);
    t.exports = function (t) {
      return e(this.__data__, t) > -1;
    };
  },
  function (t, r, n) {
    var e = n(9);
    t.exports = function (t, r) {
      var n = this.__data__,
        o = e(n, t);
      return o < 0 ? (++this.size, n.push([t, r])) : (n[o][1] = r), this;
    };
  },
  function (t, r, n) {
    var e = n(8);
    t.exports = function () {
      (this.__data__ = new e()), (this.size = 0);
    };
  },
  function (t, r) {
    t.exports = function (t) {
      var r = this.__data__,
        n = r.delete(t);
      return (this.size = r.size), n;
    };
  },
  function (t, r) {
    t.exports = function (t) {
      return this.__data__.get(t);
    };
  },
  function (t, r) {
    t.exports = function (t) {
      return this.__data__.has(t);
    };
  },
  function (t, r, n) {
    var e = n(8),
      o = n(19),
      u = n(20);
    t.exports = function (t, r) {
      var n = this.__data__;
      if (n instanceof e) {
        var i = n.__data__;
        if (!o || i.length < 199)
          return i.push([t, r]), (this.size = ++n.size), this;
        n = this.__data__ = new u(i);
      }
      return n.set(t, r), (this.size = n.size), this;
    };
  },
  function (t, r, n) {
    var e = n(30),
      o = n(77),
      u = n(4),
      i = n(32),
      c = /^\[object .+?Constructor\]$/,
      a = Function.prototype,
      s = Object.prototype,
      f = a.toString,
      p = s.hasOwnProperty,
      l = RegExp(
        "^" +
          f
            .call(p)
            .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
            .replace(
              /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
              "$1.*?",
            ) +
          "$",
      );
    t.exports = function (t) {
      return !(!u(t) || o(t)) && (e(t) ? l : c).test(i(t));
    };
  },
  function (t, r, n) {
    var e = n(6),
      o = Object.prototype,
      u = o.hasOwnProperty,
      i = o.toString,
      c = e ? e.toStringTag : void 0;
    t.exports = function (t) {
      var r = u.call(t, c),
        n = t[c];
      try {
        t[c] = void 0;
        var e = !0;
      } catch (t) {}
      var o = i.call(t);
      return e && (r ? (t[c] = n) : delete t[c]), o;
    };
  },
  function (t, r) {
    var n = Object.prototype.toString;
    t.exports = function (t) {
      return n.call(t);
    };
  },
  function (t, r, n) {
    var e,
      o = n(78),
      u = (e = /[^.]+$/.exec((o && o.keys && o.keys.IE_PROTO) || ""))
        ? "Symbol(src)_1." + e
        : "";
    t.exports = function (t) {
      return !!u && u in t;
    };
  },
  function (t, r, n) {
    var e = n(1)["__core-js_shared__"];
    t.exports = e;
  },
  function (t, r) {
    t.exports = function (t, r) {
      return null == t ? void 0 : t[r];
    };
  },
  function (t, r, n) {
    var e = n(81),
      o = n(8),
      u = n(19);
    t.exports = function () {
      (this.size = 0),
        (this.__data__ = {
          hash: new e(),
          map: new (u || o)(),
          string: new e(),
        });
    };
  },
  function (t, r, n) {
    var e = n(82),
      o = n(83),
      u = n(84),
      i = n(85),
      c = n(86);
    function a(t) {
      var r = -1,
        n = null == t ? 0 : t.length;
      for (this.clear(); ++r < n; ) {
        var e = t[r];
        this.set(e[0], e[1]);
      }
    }
    (a.prototype.clear = e),
      (a.prototype.delete = o),
      (a.prototype.get = u),
      (a.prototype.has = i),
      (a.prototype.set = c),
      (t.exports = a);
  },
  function (t, r, n) {
    var e = n(10);
    t.exports = function () {
      (this.__data__ = e ? e(null) : {}), (this.size = 0);
    };
  },
  function (t, r) {
    t.exports = function (t) {
      var r = this.has(t) && delete this.__data__[t];
      return (this.size -= r ? 1 : 0), r;
    };
  },
  function (t, r, n) {
    var e = n(10),
      o = Object.prototype.hasOwnProperty;
    t.exports = function (t) {
      var r = this.__data__;
      if (e) {
        var n = r[t];
        return "__lodash_hash_undefined__" === n ? void 0 : n;
      }
      return o.call(r, t) ? r[t] : void 0;
    };
  },
  function (t, r, n) {
    var e = n(10),
      o = Object.prototype.hasOwnProperty;
    t.exports = function (t) {
      var r = this.__data__;
      return e ? void 0 !== r[t] : o.call(r, t);
    };
  },
  function (t, r, n) {
    var e = n(10);
    t.exports = function (t, r) {
      var n = this.__data__;
      return (
        (this.size += this.has(t) ? 0 : 1),
        (n[t] = e && void 0 === r ? "__lodash_hash_undefined__" : r),
        this
      );
    };
  },
  function (t, r, n) {
    var e = n(11);
    t.exports = function (t) {
      var r = e(this, t).delete(t);
      return (this.size -= r ? 1 : 0), r;
    };
  },
  function (t, r) {
    t.exports = function (t) {
      var r = typeof t;
      return "string" == r || "number" == r || "symbol" == r || "boolean" == r
        ? "__proto__" !== t
        : null === t;
    };
  },
  function (t, r, n) {
    var e = n(11);
    t.exports = function (t) {
      return e(this, t).get(t);
    };
  },
  function (t, r, n) {
    var e = n(11);
    t.exports = function (t) {
      return e(this, t).has(t);
    };
  },
  function (t, r, n) {
    var e = n(11);
    t.exports = function (t, r) {
      var n = e(this, t),
        o = n.size;
      return n.set(t, r), (this.size += n.size == o ? 0 : 1), this;
    };
  },
  function (t, r) {
    t.exports = function (t, r) {
      for (
        var n = -1, e = null == t ? 0 : t.length;
        ++n < e && !1 !== r(t[n], n, t);

      );
      return t;
    };
  },
  function (t, r, n) {
    var e = n(2),
      o = (function () {
        try {
          var t = e(Object, "defineProperty");
          return t({}, "", {}), t;
        } catch (t) {}
      })();
    t.exports = o;
  },
  function (t, r, n) {
    var e = n(12),
      o = n(7);
    t.exports = function (t, r) {
      return t && e(r, o(r), t);
    };
  },
  function (t, r) {
    t.exports = function (t, r) {
      for (var n = -1, e = Array(t); ++n < t; ) e[n] = r(n);
      return e;
    };
  },
  function (t, r, n) {
    var e = n(5),
      o = n(3);
    t.exports = function (t) {
      return o(t) && "[object Arguments]" == e(t);
    };
  },
  function (t, r) {
    t.exports = function () {
      return !1;
    };
  },
  function (t, r, n) {
    var e = n(5),
      o = n(22),
      u = n(3),
      i = {};
    (i["[object Float32Array]"] =
      i["[object Float64Array]"] =
      i["[object Int8Array]"] =
      i["[object Int16Array]"] =
      i["[object Int32Array]"] =
      i["[object Uint8Array]"] =
      i["[object Uint8ClampedArray]"] =
      i["[object Uint16Array]"] =
      i["[object Uint32Array]"] =
        !0),
      (i["[object Arguments]"] =
        i["[object Array]"] =
        i["[object ArrayBuffer]"] =
        i["[object Boolean]"] =
        i["[object DataView]"] =
        i["[object Date]"] =
        i["[object Error]"] =
        i["[object Function]"] =
        i["[object Map]"] =
        i["[object Number]"] =
        i["[object Object]"] =
        i["[object RegExp]"] =
        i["[object Set]"] =
        i["[object String]"] =
        i["[object WeakMap]"] =
          !1),
      (t.exports = function (t) {
        return u(t) && o(t.length) && !!i[e(t)];
      });
  },
  function (t, r, n) {
    var e = n(25),
      o = n(100),
      u = Object.prototype.hasOwnProperty;
    t.exports = function (t) {
      if (!e(t)) return o(t);
      var r = [];
      for (var n in Object(t)) u.call(t, n) && "constructor" != n && r.push(n);
      return r;
    };
  },
  function (t, r, n) {
    var e = n(39)(Object.keys, Object);
    t.exports = e;
  },
  function (t, r, n) {
    var e = n(12),
      o = n(40);
    t.exports = function (t, r) {
      return t && e(r, o(r), t);
    };
  },
  function (t, r, n) {
    var e = n(4),
      o = n(25),
      u = n(103),
      i = Object.prototype.hasOwnProperty;
    t.exports = function (t) {
      if (!e(t)) return u(t);
      var r = o(t),
        n = [];
      for (var c in t)
        ("constructor" != c || (!r && i.call(t, c))) && n.push(c);
      return n;
    };
  },
  function (t, r) {
    t.exports = function (t) {
      var r = [];
      if (null != t) for (var n in Object(t)) r.push(n);
      return r;
    };
  },
  function (t, r, n) {
    (function (t) {
      var e = n(1),
        o = r && !r.nodeType && r,
        u = o && "object" == typeof t && t && !t.nodeType && t,
        i = u && u.exports === o ? e.Buffer : void 0,
        c = i ? i.allocUnsafe : void 0;
      t.exports = function (t, r) {
        if (r) return t.slice();
        var n = t.length,
          e = c ? c(n) : new t.constructor(n);
        return t.copy(e), e;
      };
    }).call(this, n(13)(t));
  },
  function (t, r) {
    t.exports = function (t, r) {
      var n = -1,
        e = t.length;
      for (r || (r = Array(e)); ++n < e; ) r[n] = t[n];
      return r;
    };
  },
  function (t, r, n) {
    var e = n(12),
      o = n(26);
    t.exports = function (t, r) {
      return e(t, o(t), r);
    };
  },
  function (t, r, n) {
    var e = n(12),
      o = n(43);
    t.exports = function (t, r) {
      return e(t, o(t), r);
    };
  },
  function (t, r, n) {
    var e = n(47),
      o = n(43),
      u = n(40);
    t.exports = function (t) {
      return e(t, u, o);
    };
  },
  function (t, r, n) {
    var e = n(2)(n(1), "DataView");
    t.exports = e;
  },
  function (t, r, n) {
    var e = n(2)(n(1), "Promise");
    t.exports = e;
  },
  function (t, r, n) {
    var e = n(2)(n(1), "Set");
    t.exports = e;
  },
  function (t, r, n) {
    var e = n(2)(n(1), "WeakMap");
    t.exports = e;
  },
  function (t, r) {
    var n = Object.prototype.hasOwnProperty;
    t.exports = function (t) {
      var r = t.length,
        e = new t.constructor(r);
      return (
        r &&
          "string" == typeof t[0] &&
          n.call(t, "index") &&
          ((e.index = t.index), (e.input = t.input)),
        e
      );
    };
  },
  function (t, r, n) {
    var e = n(27),
      o = n(115),
      u = n(116),
      i = n(117),
      c = n(118);
    t.exports = function (t, r, n) {
      var a = t.constructor;
      switch (r) {
        case "[object ArrayBuffer]":
          return e(t);
        case "[object Boolean]":
        case "[object Date]":
          return new a(+t);
        case "[object DataView]":
          return o(t, n);
        case "[object Float32Array]":
        case "[object Float64Array]":
        case "[object Int8Array]":
        case "[object Int16Array]":
        case "[object Int32Array]":
        case "[object Uint8Array]":
        case "[object Uint8ClampedArray]":
        case "[object Uint16Array]":
        case "[object Uint32Array]":
          return c(t, n);
        case "[object Map]":
          return new a();
        case "[object Number]":
        case "[object String]":
          return new a(t);
        case "[object RegExp]":
          return u(t);
        case "[object Set]":
          return new a();
        case "[object Symbol]":
          return i(t);
      }
    };
  },
  function (t, r, n) {
    var e = n(27);
    t.exports = function (t, r) {
      var n = r ? e(t.buffer) : t.buffer;
      return new t.constructor(n, t.byteOffset, t.byteLength);
    };
  },
  function (t, r) {
    var n = /\w*$/;
    t.exports = function (t) {
      var r = new t.constructor(t.source, n.exec(t));
      return (r.lastIndex = t.lastIndex), r;
    };
  },
  function (t, r, n) {
    var e = n(6),
      o = e ? e.prototype : void 0,
      u = o ? o.valueOf : void 0;
    t.exports = function (t) {
      return u ? Object(u.call(t)) : {};
    };
  },
  function (t, r, n) {
    var e = n(27);
    t.exports = function (t, r) {
      var n = r ? e(t.buffer) : t.buffer;
      return new t.constructor(n, t.byteOffset, t.length);
    };
  },
  function (t, r, n) {
    var e = n(120),
      o = n(45),
      u = n(25);
    t.exports = function (t) {
      return "function" != typeof t.constructor || u(t) ? {} : e(o(t));
    };
  },
  function (t, r, n) {
    var e = n(4),
      o = Object.create,
      u = (function () {
        function t() {}
        return function (r) {
          if (!e(r)) return {};
          if (o) return o(r);
          t.prototype = r;
          var n = new t();
          return (t.prototype = void 0), n;
        };
      })();
    t.exports = u;
  },
  function (t, r, n) {
    var e = n(122),
      o = n(23),
      u = n(24),
      i = u && u.isMap,
      c = i ? o(i) : e;
    t.exports = c;
  },
  function (t, r, n) {
    var e = n(15),
      o = n(3);
    t.exports = function (t) {
      return o(t) && "[object Map]" == e(t);
    };
  },
  function (t, r, n) {
    var e = n(124),
      o = n(23),
      u = n(24),
      i = u && u.isSet,
      c = i ? o(i) : e;
    t.exports = c;
  },
  function (t, r, n) {
    var e = n(15),
      o = n(3);
    t.exports = function (t) {
      return o(t) && "[object Set]" == e(t);
    };
  },
  function (t, r, n) {
    var e = n(50);
    t.exports = function (t, r) {
      var n = [];
      return (
        e(t, function (t, e, o) {
          r(t, e, o) && n.push(t);
        }),
        n
      );
    };
  },
  function (t, r, n) {
    var e = n(127),
      o = n(7);
    t.exports = function (t, r) {
      return t && e(t, r, o);
    };
  },
  function (t, r, n) {
    var e = n(128)();
    t.exports = e;
  },
  function (t, r) {
    t.exports = function (t) {
      return function (r, n, e) {
        for (var o = -1, u = Object(r), i = e(r), c = i.length; c--; ) {
          var a = i[t ? c : ++o];
          if (!1 === n(u[a], a, u)) break;
        }
        return r;
      };
    };
  },
  function (t, r, n) {
    var e = n(14);
    t.exports = function (t, r) {
      return function (n, o) {
        if (null == n) return n;
        if (!e(n)) return t(n, o);
        for (
          var u = n.length, i = r ? u : -1, c = Object(n);
          (r ? i-- : ++i < u) && !1 !== o(c[i], i, c);

        );
        return n;
      };
    };
  },
  function (t, r, n) {
    var e = n(131),
      o = n(142),
      u = n(55);
    t.exports = function (t) {
      var r = o(t);
      return 1 == r.length && r[0][2]
        ? u(r[0][0], r[0][1])
        : function (n) {
            return n === t || e(n, t, r);
          };
    };
  },
  function (t, r, n) {
    var e = n(17),
      o = n(52);
    t.exports = function (t, r, n, u) {
      var i = n.length,
        c = i,
        a = !u;
      if (null == t) return !c;
      for (t = Object(t); i--; ) {
        var s = n[i];
        if (a && s[2] ? s[1] !== t[s[0]] : !(s[0] in t)) return !1;
      }
      for (; ++i < c; ) {
        var f = (s = n[i])[0],
          p = t[f],
          l = s[1];
        if (a && s[2]) {
          if (void 0 === p && !(f in t)) return !1;
        } else {
          var v = new e();
          if (u) var b = u(p, l, f, t, r, v);
          if (!(void 0 === b ? o(l, p, 3, u, v) : b)) return !1;
        }
      }
      return !0;
    };
  },
  function (t, r, n) {
    var e = n(17),
      o = n(53),
      u = n(138),
      i = n(141),
      c = n(15),
      a = n(0),
      s = n(21),
      f = n(38),
      p = "[object Object]",
      l = Object.prototype.hasOwnProperty;
    t.exports = function (t, r, n, v, b, h) {
      var y = a(t),
        x = a(r),
        d = y ? "[object Array]" : c(t),
        j = x ? "[object Array]" : c(r),
        _ = (d = "[object Arguments]" == d ? p : d) == p,
        g = (j = "[object Arguments]" == j ? p : j) == p,
        m = d == j;
      if (m && s(t)) {
        if (!s(r)) return !1;
        (y = !0), (_ = !1);
      }
      if (m && !_)
        return (
          h || (h = new e()),
          y || f(t) ? o(t, r, n, v, b, h) : u(t, r, d, n, v, b, h)
        );
      if (!(1 & n)) {
        var O = _ && l.call(t, "__wrapped__"),
          w = g && l.call(r, "__wrapped__");
        if (O || w) {
          var F = O ? t.value() : t,
            A = w ? r.value() : r;
          return h || (h = new e()), b(F, A, n, v, h);
        }
      }
      return !!m && (h || (h = new e()), i(t, r, n, v, b, h));
    };
  },
  function (t, r, n) {
    var e = n(20),
      o = n(134),
      u = n(135);
    function i(t) {
      var r = -1,
        n = null == t ? 0 : t.length;
      for (this.__data__ = new e(); ++r < n; ) this.add(t[r]);
    }
    (i.prototype.add = i.prototype.push = o),
      (i.prototype.has = u),
      (t.exports = i);
  },
  function (t, r) {
    t.exports = function (t) {
      return this.__data__.set(t, "__lodash_hash_undefined__"), this;
    };
  },
  function (t, r) {
    t.exports = function (t) {
      return this.__data__.has(t);
    };
  },
  function (t, r) {
    t.exports = function (t, r) {
      for (var n = -1, e = null == t ? 0 : t.length; ++n < e; )
        if (r(t[n], n, t)) return !0;
      return !1;
    };
  },
  function (t, r) {
    t.exports = function (t, r) {
      return t.has(r);
    };
  },
  function (t, r, n) {
    var e = n(6),
      o = n(48),
      u = n(18),
      i = n(53),
      c = n(139),
      a = n(140),
      s = e ? e.prototype : void 0,
      f = s ? s.valueOf : void 0;
    t.exports = function (t, r, n, e, s, p, l) {
      switch (n) {
        case "[object DataView]":
          if (t.byteLength != r.byteLength || t.byteOffset != r.byteOffset)
            return !1;
          (t = t.buffer), (r = r.buffer);
        case "[object ArrayBuffer]":
          return !(t.byteLength != r.byteLength || !p(new o(t), new o(r)));
        case "[object Boolean]":
        case "[object Date]":
        case "[object Number]":
          return u(+t, +r);
        case "[object Error]":
          return t.name == r.name && t.message == r.message;
        case "[object RegExp]":
        case "[object String]":
          return t == r + "";
        case "[object Map]":
          var v = c;
        case "[object Set]":
          var b = 1 & e;
          if ((v || (v = a), t.size != r.size && !b)) return !1;
          var h = l.get(t);
          if (h) return h == r;
          (e |= 2), l.set(t, r);
          var y = i(v(t), v(r), e, s, p, l);
          return l.delete(t), y;
        case "[object Symbol]":
          if (f) return f.call(t) == f.call(r);
      }
      return !1;
    };
  },
  function (t, r) {
    t.exports = function (t) {
      var r = -1,
        n = Array(t.size);
      return (
        t.forEach(function (t, e) {
          n[++r] = [e, t];
        }),
        n
      );
    };
  },
  function (t, r) {
    t.exports = function (t) {
      var r = -1,
        n = Array(t.size);
      return (
        t.forEach(function (t) {
          n[++r] = t;
        }),
        n
      );
    };
  },
  function (t, r, n) {
    var e = n(46),
      o = Object.prototype.hasOwnProperty;
    t.exports = function (t, r, n, u, i, c) {
      var a = 1 & n,
        s = e(t),
        f = s.length;
      if (f != e(r).length && !a) return !1;
      for (var p = f; p--; ) {
        var l = s[p];
        if (!(a ? l in r : o.call(r, l))) return !1;
      }
      var v = c.get(t);
      if (v && c.get(r)) return v == r;
      var b = !0;
      c.set(t, r), c.set(r, t);
      for (var h = a; ++p < f; ) {
        var y = t[(l = s[p])],
          x = r[l];
        if (u) var d = a ? u(x, y, l, r, t, c) : u(y, x, l, t, r, c);
        if (!(void 0 === d ? y === x || i(y, x, n, u, c) : d)) {
          b = !1;
          break;
        }
        h || (h = "constructor" == l);
      }
      if (b && !h) {
        var j = t.constructor,
          _ = r.constructor;
        j == _ ||
          !("constructor" in t) ||
          !("constructor" in r) ||
          ("function" == typeof j &&
            j instanceof j &&
            "function" == typeof _ &&
            _ instanceof _) ||
          (b = !1);
      }
      return c.delete(t), c.delete(r), b;
    };
  },
  function (t, r, n) {
    var e = n(54),
      o = n(7);
    t.exports = function (t) {
      for (var r = o(t), n = r.length; n--; ) {
        var u = r[n],
          i = t[u];
        r[n] = [u, i, e(i)];
      }
      return r;
    };
  },
  function (t, r, n) {
    var e = n(52),
      o = n(144),
      u = n(150),
      i = n(28),
      c = n(54),
      a = n(55),
      s = n(16);
    t.exports = function (t, r) {
      return i(t) && c(r)
        ? a(s(t), r)
        : function (n) {
            var i = o(n, t);
            return void 0 === i && i === r ? u(n, t) : e(r, i, 3);
          };
    };
  },
  function (t, r, n) {
    var e = n(56);
    t.exports = function (t, r, n) {
      var o = null == t ? void 0 : e(t, r);
      return void 0 === o ? n : o;
    };
  },
  function (t, r, n) {
    var e = n(146),
      o =
        /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
      u = /\\(\\)?/g,
      i = e(function (t) {
        var r = [];
        return (
          46 === t.charCodeAt(0) && r.push(""),
          t.replace(o, function (t, n, e, o) {
            r.push(e ? o.replace(u, "$1") : n || t);
          }),
          r
        );
      });
    t.exports = i;
  },
  function (t, r, n) {
    var e = n(147);
    t.exports = function (t) {
      var r = e(t, function (t) {
          return 500 === n.size && n.clear(), t;
        }),
        n = r.cache;
      return r;
    };
  },
  function (t, r, n) {
    var e = n(20);
    function o(t, r) {
      if ("function" != typeof t || (null != r && "function" != typeof r))
        throw new TypeError("Expected a function");
      var n = function () {
        var e = arguments,
          o = r ? r.apply(this, e) : e[0],
          u = n.cache;
        if (u.has(o)) return u.get(o);
        var i = t.apply(this, e);
        return (n.cache = u.set(o, i) || u), i;
      };
      return (n.cache = new (o.Cache || e)()), n;
    }
    (o.Cache = e), (t.exports = o);
  },
  function (t, r, n) {
    var e = n(149);
    t.exports = function (t) {
      return null == t ? "" : e(t);
    };
  },
  function (t, r, n) {
    var e = n(6),
      o = n(58),
      u = n(0),
      i = n(29),
      c = e ? e.prototype : void 0,
      a = c ? c.toString : void 0;
    t.exports = function t(r) {
      if ("string" == typeof r) return r;
      if (u(r)) return o(r, t) + "";
      if (i(r)) return a ? a.call(r) : "";
      var n = r + "";
      return "0" == n && 1 / r == -1 / 0 ? "-0" : n;
    };
  },
  function (t, r, n) {
    var e = n(151),
      o = n(152);
    t.exports = function (t, r) {
      return null != t && o(t, r, e);
    };
  },
  function (t, r) {
    t.exports = function (t, r) {
      return null != t && r in Object(t);
    };
  },
  function (t, r, n) {
    var e = n(57),
      o = n(36),
      u = n(0),
      i = n(37),
      c = n(22),
      a = n(16);
    t.exports = function (t, r, n) {
      for (var s = -1, f = (r = e(r, t)).length, p = !1; ++s < f; ) {
        var l = a(r[s]);
        if (!(p = null != t && n(t, l))) break;
        t = t[l];
      }
      return p || ++s != f
        ? p
        : !!(f = null == t ? 0 : t.length) && c(f) && i(l, f) && (u(t) || o(t));
    };
  },
  function (t, r) {
    t.exports = function (t) {
      return t;
    };
  },
  function (t, r, n) {
    var e = n(155),
      o = n(156),
      u = n(28),
      i = n(16);
    t.exports = function (t) {
      return u(t) ? e(i(t)) : o(t);
    };
  },
  function (t, r) {
    t.exports = function (t) {
      return function (r) {
        return null == r ? void 0 : r[t];
      };
    };
  },
  function (t, r, n) {
    var e = n(56);
    t.exports = function (t) {
      return function (r) {
        return e(r, t);
      };
    };
  },
  function (t, r, n) {
    var e = n(58),
      o = n(51),
      u = n(158),
      i = n(0);
    t.exports = function (t, r) {
      return (i(t) ? e : u)(t, o(r, 3));
    };
  },
  function (t, r, n) {
    var e = n(50),
      o = n(14);
    t.exports = function (t, r) {
      var n = -1,
        u = o(t) ? Array(t.length) : [];
      return (
        e(t, function (t, e, o) {
          u[++n] = r(t, e, o);
        }),
        u
      );
    };
  },
  function (t, r) {
    t.exports = class {
      constructor(t, r, n, e) {
        (this._content = t),
          (this._isHidden = r),
          (this._isSignature = n),
          (this._isQuoted = e);
      }
      getContent() {
        return this._content;
      }
      isHidden() {
        return this._isHidden;
      }
      isSignature() {
        return this._isSignature;
      }
      isQuoted() {
        return this._isQuoted;
      }
      isEmpty() {
        return 0 === this.getContent().replace("\n", "").length;
      }
    };
  },
  function (t, r) {
    var n = Array.prototype.reverse;
    t.exports = function (t) {
      return null == t ? t : n.call(t);
    };
  },
  function (t, r, n) {
    (function (t) {
      var e;
      /*! https://mths.be/esrever v0.2.0 by @mathias */ !(function (o) {
        var u = r,
          i = (t && t.exports, "object" == typeof global && global);
        i.global !== i && i.window;
        var c =
            /([\0-\u02FF\u0370-\u1AAF\u1B00-\u1DBF\u1E00-\u20CF\u2100-\uD7FF\uE000-\uFE1F\uFE30-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])([\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]+)/g,
          a = /([\uD800-\uDBFF])([\uDC00-\uDFFF])/g,
          s = function (t) {
            for (
              var r = "",
                n = (t = t
                  .replace(c, function (t, r, n) {
                    return s(n) + r;
                  })
                  .replace(a, "$2$1")).length;
              n--;

            )
              r += t.charAt(n);
            return r;
          },
          f = { version: "0.2.0", reverse: s };
        void 0 ===
          (e = function () {
            return f;
          }.call(r, n, r, t)) || (t.exports = e);
      })();
    }).call(this, n(13)(t));
  },
]);

function extractRelevantText(input) {
  // Define patterns for different types of test cases
  const outlookPattern = /(.+?)\n+Gesendet von Outlook für Android/;
  const gmailPattern = /(.+?)\n+.*? schrieb am/;

  // Try matching Outlook pattern
  let match = input.match(outlookPattern);
  if (match) return match[1].trim();

  // Try matching Gmail pattern
  match = input.match(gmailPattern);
  if (match) return match[1].trim();

  // If no pattern matches, return original input (or handle as needed)
  return input.trim();
}

function extractTextBetweenAmAndTo(text) {
  const startKeyword = "Am";
  const endKeyword = ":";

  // Find the position of "Am"
  const startIndex = text.indexOf(startKeyword);
  if (startIndex === -1) return text; // "Am" not found

  // Find the position of the last ":"
  const endIndex = text.lastIndexOf(endKeyword);
  if (endIndex === -1) return text; // ":" not found

  // Extract the substring between "Am" and the last ":"
  const substring = text
    .slice(startIndex + startKeyword.length, endIndex)
    .trim();

  // Check if "@parse.workerhomes.pl" is in the substring
  if (substring.includes("@parse.workerhomes.pl")) {
    return text.slice(0, startIndex).trim();
  } else {
    return text;
  }
}

function extractReplyContent(message) {
  const email = EmailParser(message);
  const reply = email.getFragments()[0].getContent().trim();
  return extractTextBetweenAmAndTo(extractRelevantText(reply));
}

export { extractReplyContent };
