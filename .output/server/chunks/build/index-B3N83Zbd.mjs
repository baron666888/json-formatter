import { defineComponent, ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';

const messages = {
  en: {
    appTitle: "JSON Formatter",
    appSubtitle: "Format, validate and beautify your JSON data",
    input: "Input",
    output: "Output",
    placeholder: "Paste or type your JSON here...",
    emptyOutput: "Formatted JSON will appear here",
    emptyState: "Paste or type JSON to start formatting",
    format: "Format",
    compress: "Compress",
    copy: "Copy",
    clear: "Clear",
    expandAll: "Expand All",
    collapseAll: "Collapse All",
    copied: "Copied to clipboard!",
    errorPrefix: "Error",
    line: "Line",
    keys: "keys",
    items: "items",
    key: "key",
    item: "item",
    empty: "empty",
    nestedJson: "nested JSON",
    language: "Language",
    footer: "Made with ❤️ and a sprinkle of JSON magic ✨",
    copyright: "© {year} JSON Formatter. All rights reserved."
  },
  zh: {
    appTitle: "JSON 格式化工具",
    appSubtitle: "格式化、验证和美化您的 JSON 数据",
    input: "输入",
    output: "输出",
    placeholder: "粘贴或输入您的 JSON...",
    emptyOutput: "格式化后的 JSON 将显示在这里",
    emptyState: "粘贴或输入 JSON 开始格式化",
    format: "格式化",
    compress: "压缩",
    copy: "复制",
    clear: "清空",
    expandAll: "全部展开",
    collapseAll: "全部折叠",
    copied: "已复制到剪贴板！",
    errorPrefix: "错误",
    line: "行",
    keys: "个键",
    items: "个元素",
    key: "个键",
    item: "个元素",
    empty: "空",
    nestedJson: "嵌套 JSON",
    language: "语言",
    footer: "用 ❤️ 和一点点 JSON 魔法 ✨ 打造",
    copyright: "© {year} JSON Formatter 版权所有"
  },
  ja: {
    appTitle: "JSON フォーマッター",
    appSubtitle: "JSONデータの整形、検証、美化",
    input: "入力",
    output: "出力",
    placeholder: "JSONを入力またはペースト...",
    emptyOutput: "整形されたJSONがここに表示されます",
    emptyState: "JSONを入力して整形を開始",
    format: "整形",
    compress: "圧縮",
    copy: "コピー",
    clear: "クリア",
    expandAll: "すべて展開",
    collapseAll: "すべて折りたたむ",
    copied: "クリップボードにコピーしました！",
    errorPrefix: "エラー",
    line: "行",
    keys: "個のキー",
    items: "個のアイテム",
    key: "個のキー",
    item: "個のアイテム",
    empty: "空",
    nestedJson: "ネストされたJSON",
    language: "言語",
    footer: "❤️とJSON魔法✨でお届け 🍣",
    copyright: "© {year} JSON Formatter. 全著作権所有。"
  }
};
const locales = [
  { code: "en", name: "English" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" }
];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const currentLocale = ref("en");
    const inputJson = ref("");
    const outputJson = ref("");
    const errorInfo = ref(null);
    const showToast = ref(false);
    const toastMessage = ref("");
    let formatTimeout = null;
    let collapseKeyCounter = 0;
    const hasInput = computed(() => inputJson.value.trim().length > 0);
    function t(key, count) {
      const msg = messages[currentLocale.value];
      const translation = msg[key];
      if (Array.isArray(translation)) {
        return count === 1 ? translation[1] : translation[0];
      }
      return translation || key;
    }
    function isValidJson(str) {
      try {
        const parsed = JSON.parse(str);
        return typeof parsed === "object" && parsed !== null;
      } catch {
        return false;
      }
    }
    function escapeHtml(str) {
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    function syntaxHighlightValue(value, depth = 0) {
      if (value === null) {
        return '<span class="json-null">null</span>';
      }
      if (typeof value === "boolean") {
        return `<span class="json-boolean">${value}</span>`;
      }
      if (typeof value === "number") {
        return `<span class="json-number">${value}</span>`;
      }
      if (typeof value === "string") {
        const escaped = escapeHtml(value);
        if (isValidJson(value)) {
          const parsed = JSON.parse(value);
          JSON.stringify(parsed, null, 2);
          const key = `collapse-${collapseKeyCounter++}`;
          const childCount = countObjectKeys(parsed);
          const label = childCount > 0 ? `${childCount} ${t("keys", childCount)}` : t("empty");
          let result = `<span class="json-string">"${escaped.slice(0, 20)}${escaped.length > 20 ? "..." : ""}"</span>`;
          result += `<span class="nested-json-wrapper">`;
          result += `<span class="json-collapsible nested" data-key="${key}" onclick="toggleCollapse(this)">`;
          result += `<span class="toggle-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>`;
          result += `<span class="nested-label">[${t("nestedJson")}: ${label}]</span>`;
          result += `</span>`;
          result += `<span class="json-content nested" data-end="${key}">`;
          result += `
${"  ".repeat(depth + 1)}<span class="nested-content">`;
          result += syntaxHighlightValue(parsed, depth + 1).trim();
          result += `</span>
${"  ".repeat(depth)}</span>`;
          result += `</span>`;
          return result;
        }
        return `<span class="json-string">"${escaped}"</span>`;
      }
      if (Array.isArray(value)) {
        return syntaxHighlightArray(value, depth);
      }
      if (typeof value === "object") {
        return syntaxHighlightObject(value, depth);
      }
      return String(value);
    }
    function countObjectKeys(obj) {
      if (typeof obj !== "object" || obj === null) return 0;
      if (Array.isArray(obj)) return obj.length;
      return Object.keys(obj).length;
    }
    function syntaxHighlightArray(arr, depth) {
      if (arr.length === 0) {
        return '<span class="json-bracket">[]</span>';
      }
      const key = `collapse-${collapseKeyCounter++}`;
      const label = `${arr.length} ${t("items", arr.length)}`;
      let result = `<span class="json-collapsible" data-key="${key}" onclick="toggleCollapse(this)">`;
      result += `<span class="toggle-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>`;
      result += `<span class="json-bracket">[</span>`;
      result += `<span class="json-collapsed-content"> ${label} </span>`;
      result += `</span>`;
      result += `<span class="json-content" data-end="${key}">`;
      arr.forEach((item, index) => {
        result += `
${"  ".repeat(depth + 1)}`;
        result += syntaxHighlightValue(item, depth + 1);
        if (index < arr.length - 1) {
          result += `<span class="json-comma">,</span>`;
        }
      });
      result += `
${"  ".repeat(depth)}</span>`;
      result += `<span class="json-bracket">]</span>`;
      return result;
    }
    function syntaxHighlightObject(obj, depth) {
      const keys = Object.keys(obj);
      if (keys.length === 0) {
        return '<span class="json-bracket">{}</span>';
      }
      const key = `collapse-${collapseKeyCounter++}`;
      const label = `${keys.length} ${t("keys", keys.length)}`;
      let result = `<span class="json-collapsible" data-key="${key}" onclick="toggleCollapse(this)">`;
      result += `<span class="toggle-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>`;
      result += `<span class="json-bracket">{</span>`;
      result += `<span class="json-collapsed-content"> ${label} </span>`;
      result += `</span>`;
      result += `<span class="json-content" data-end="${key}">`;
      keys.forEach((k, index) => {
        result += `
${"  ".repeat(depth + 1)}`;
        result += `<span class="json-key">"${escapeHtml(k)}"</span>`;
        result += `<span class="json-bracket">:</span> `;
        result += syntaxHighlightValue(obj[k], depth + 1);
        if (index < keys.length - 1) {
          result += `<span class="json-comma">,</span>`;
        }
      });
      result += `
${"  ".repeat(depth)}</span>`;
      result += `<span class="json-bracket">}</span>`;
      return result;
    }
    function validateAndFormat() {
      const input = inputJson.value.trim();
      collapseKeyCounter = 0;
      if (!input) {
        outputJson.value = "";
        errorInfo.value = null;
        return;
      }
      try {
        const parsed = JSON.parse(input);
        outputJson.value = syntaxHighlightValue(parsed, 0);
        errorInfo.value = null;
      } catch (e) {
        outputJson.value = "";
        const msg = e.message || "Invalid JSON";
        const lineMatch = msg.match(/position\s+(\d+)/i);
        let line;
        if (lineMatch) {
          const pos = parseInt(lineMatch[1]);
          const lines = input.substring(0, pos).split("\n");
          line = lines.length;
        }
        errorInfo.value = { message: msg, line };
      }
    }
    function handleInput() {
      if (formatTimeout) clearTimeout(formatTimeout);
      formatTimeout = setTimeout(validateAndFormat, 300);
    }
    watch(inputJson, handleInput);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container" }, _attrs))}><header class="header" role="banner"><div class="logo-wrapper" aria-hidden="true"><svg class="logo-icon" viewBox="0 0 48 48" fill="none" aria-label="JSON Formatter Logo"><defs><linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#3b82f6"></stop><stop offset="50%" stop-color="#8b5cf6"></stop><stop offset="100%" stop-color="#10b981"></stop></linearGradient></defs><rect x="4" y="4" width="40" height="40" rx="10" fill="url(#logoGrad)" opacity="0.15"></rect><rect x="4" y="4" width="40" height="40" rx="10" stroke="url(#logoGrad)" stroke-width="2"></rect><text x="24" y="32" text-anchor="middle" font-family="&#39;JetBrains Mono&#39;, monospace" font-size="18" font-weight="700" fill="url(#logoGrad)">{ }</text></svg></div><h1>${ssrInterpolate(t("appTitle"))}</h1><p>${ssrInterpolate(t("appSubtitle"))}</p><div class="visually-hidden" aria-hidden="true"><span>JSON Formatter 是一款免费的在线 JSON 验证和格式化工具。</span><span>主要功能包括：JSON 语法校验、JSON 美化（格式化）、JSON 压缩、</span><span>语法高亮显示、错误位置定位、嵌套对象展开折叠、以及一键复制功能。</span><span>支持中英文双语界面，适用于 Web 开发者、API 测试人员和数据处理工程师。</span></div><nav class="language-switcher" aria-label="Language selection"><label for="lang-select">${ssrInterpolate(t("language"))}:</label><select id="lang-select"><!--[-->`);
      ssrRenderList(unref(locales), (loc) => {
        _push(`<option${ssrRenderAttr("value", loc.code)}${ssrIncludeBooleanAttr(Array.isArray(currentLocale.value) ? ssrLooseContain(currentLocale.value, loc.code) : ssrLooseEqual(currentLocale.value, loc.code)) ? " selected" : ""}>${ssrInterpolate(loc.name)}</option>`);
      });
      _push(`<!--]--></select></nav></header><main class="main-content" role="main"><section class="panel" aria-labelledby="input-panel-title"><div class="panel-header"><h2 id="input-panel-title" class="panel-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg> ${ssrInterpolate(t("input"))}</h2><div class="panel-actions"><button class="btn btn-secondary"${ssrRenderAttr("title", t("clear"))}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button></div></div><textarea class="${ssrRenderClass({ error: errorInfo.value })}"${ssrRenderAttr("placeholder", t("placeholder"))} spellcheck="false">${ssrInterpolate(inputJson.value)}</textarea>`);
      if (errorInfo.value) {
        _push(`<div class="error-message fade-in"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg><div>`);
        if (errorInfo.value.line) {
          _push(`<span class="error-line">${ssrInterpolate(t("line"))} ${ssrInterpolate(errorInfo.value.line)}: </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` ${ssrInterpolate(errorInfo.value.message)}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="toolbar" role="toolbar" aria-label="JSON formatting tools"><button class="btn btn-primary"${ssrIncludeBooleanAttr(!hasInput.value) ? " disabled" : ""} aria-label="格式化 JSON" title="格式化 JSON"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg> ${ssrInterpolate(t("format"))}</button><button class="btn btn-secondary"${ssrIncludeBooleanAttr(!hasInput.value) ? " disabled" : ""} aria-label="压缩 JSON" title="压缩 JSON"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="4,14 10,14 10,20"></polyline><polyline points="20,10 14,10 14,4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg> ${ssrInterpolate(t("compress"))}</button><button class="btn btn-success"${ssrIncludeBooleanAttr(!hasInput.value || errorInfo.value) ? " disabled" : ""} aria-label="复制到剪贴板" title="复制格式化结果"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> ${ssrInterpolate(t("copy"))}</button></div></section><section class="panel" aria-labelledby="output-panel-title"><div class="panel-header"><h2 id="output-panel-title" class="panel-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="16,18 22,12 16,6"></polyline><polyline points="8,6 2,12 8,18"></polyline></svg> ${ssrInterpolate(t("output"))}</h2><div class="panel-actions"><button class="btn btn-secondary"${ssrRenderAttr("title", t("collapseAll"))}${ssrIncludeBooleanAttr(!outputJson.value) ? " disabled" : ""}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4,14 10,14 10,20"></polyline><polyline points="20,10 14,10 14,4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg></button><button class="btn btn-secondary"${ssrRenderAttr("title", t("expandAll"))}${ssrIncludeBooleanAttr(!outputJson.value) ? " disabled" : ""}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15,3 21,3 21,9"></polyline><polyline points="9,21 3,21 3,15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg></button></div></div><div class="output-area">`);
      if (outputJson.value) {
        _push(`<pre class="fade-in">${outputJson.value ?? ""}</pre>`);
      } else {
        _push(`<div class="output-placeholder">${ssrInterpolate(t("emptyOutput"))}</div>`);
      }
      _push(`</div></section></main><div class="${ssrRenderClass(["toast", { show: showToast.value }])}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline></svg> ${ssrInterpolate(t(toastMessage.value))}</div><footer class="app-footer" role="contentinfo"><span>${ssrInterpolate(t("footer"))}</span><span class="footer-sep">·</span><span>${ssrInterpolate(t("copyright").replace("{year}", (/* @__PURE__ */ new Date()).getFullYear().toString()))}</span></footer></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B3N83Zbd.mjs.map
