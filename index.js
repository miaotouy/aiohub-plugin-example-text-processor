(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __moduleCache = /* @__PURE__ */ new WeakMap;
  var __toCommonJS = (from) => {
    var entry = __moduleCache.get(from), desc;
    if (entry)
      return entry;
    entry = __defProp({}, "__esModule", { value: true });
    if (from && typeof from === "object" || typeof from === "function")
      __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
        get: () => from[key],
        enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
      }));
    __moduleCache.set(from, entry);
    return entry;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {
        get: all[name],
        enumerable: true,
        configurable: true,
        set: (newValue) => all[name] = () => newValue
      });
  };

  // index.ts
  var exports_example_text_processor = {};
  __export(exports_example_text_processor, {
    default: () => example_text_processor_default
  });
  async function toUpperCase({ text }) {
    return text.toUpperCase();
  }
  async function toLowerCase({ text }) {
    return text.toLowerCase();
  }
  async function reverse({ text }) {
    return text.split("").reverse().join("");
  }
  async function countWords({ text }) {
    const words = text.trim().split(/\s+/);
    return words.filter((word) => word.length > 0).length;
  }
  var example_text_processor_default = {
    toUpperCase,
    toLowerCase,
    reverse,
    countWords
  };
})();
