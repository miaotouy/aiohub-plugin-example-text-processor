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
  async function applyPrefixSuffix(text, context) {
    if (!context)
      return text;
    const enablePrefix = await context.settings.get("enablePrefix");
    if (!enablePrefix)
      return text;
    const prefix = await context.settings.get("prefix") || "";
    const suffix = await context.settings.get("suffix") || "";
    return `${prefix}${text}${suffix}`;
  }
  async function toUpperCase({ text, context }) {
    const result = text.toUpperCase();
    return await applyPrefixSuffix(result, context);
  }
  async function toLowerCase({ text, context }) {
    const result = text.toLowerCase();
    return await applyPrefixSuffix(result, context);
  }
  async function reverse({ text, context }) {
    const result = text.split("").reverse().join("");
    return await applyPrefixSuffix(result, context);
  }
  async function countWords({ text, context }) {
    const words = text.trim().split(/\s+/);
    return words.filter((word) => word.length > 0).length;
  }
  async function applyDefaultCase({ text, context }) {
    if (!context)
      return text;
    const defaultCase = await context.settings.get("defaultCase");
    let result = text;
    switch (defaultCase) {
      case "upper":
        result = text.toUpperCase();
        break;
      case "lower":
        result = text.toLowerCase();
        break;
      case "none":
      default:
        result = text;
        break;
    }
    return await applyPrefixSuffix(result, context);
  }
  var example_text_processor_default = {
    toUpperCase,
    toLowerCase,
    reverse,
    countWords,
    applyDefaultCase
  };
})();
