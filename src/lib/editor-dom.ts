/**
 * Pure DOM/HTML Section Manipulation & Iframe Selection Bridge
 * Location: src/lib/editor-dom.ts
 */

export interface ParsedSection {
  id: string;
  tagName: string;
  rawHtml: string;
}

interface SectionSpan extends ParsedSection {
  start: number;
  end: number;
}

function findMatchingClosingTag(html: string, tagName: string, openTagEnd: number): number {
  const lowerTag = tagName.toLowerCase();
  const tagScan = new RegExp(`<(\\/)?${lowerTag}\\b([^>]*)>`, "gi");
  tagScan.lastIndex = openTagEnd;
  let depth = 1;
  let m: RegExpExecArray | null;

  while ((m = tagScan.exec(html)) !== null) {
    const isClosing = Boolean(m[1]);
    const attrs = m[2] || "";
    const isSelfClosing = attrs.trim().endsWith("/");
    if (isClosing) {
      depth -= 1;
      if (depth === 0) {
        return m.index + m[0].length;
      }
    } else if (!isSelfClosing) {
      depth += 1;
    }
  }
  return -1;
}

function parseSectionSpans(html: string): SectionSpan[] {
  if (!html || !html.trim()) return [];
  const openTagRegex = /<(header|section|footer)\b([^>]*)>/gi;
  const spans: SectionSpan[] = [];
  let cursor = 0;

  while (cursor < html.length) {
    openTagRegex.lastIndex = cursor;
    const match = openTagRegex.exec(html);
    if (!match) break;

    const tagName = match[1].toLowerCase();
    const attrs = match[2] || "";
    const openStart = match.index;
    const openEnd = openStart + match[0].length;
    const closeEnd = findMatchingClosingTag(html, tagName, openEnd);
    if (closeEnd === -1) {
      cursor = openEnd;
      continue;
    }

    const dataSecMatch = attrs.match(/data-section=["']([^"']+)["']/i);
    const idMatch = attrs.match(/\bid=["']([^"']+)["']/i);
    const id = dataSecMatch?.[1] || idMatch?.[1] || `${tagName}-${spans.length + 1}`;

    spans.push({
      id,
      tagName,
      rawHtml: html.slice(openStart, closeEnd),
      start: openStart,
      end: closeEnd,
    });
    cursor = closeEnd;
  }

  return spans;
}

/**
 * Splits an HTML document fragment into top-level <section>, <header>, and <footer> blocks
 * while handling nested tags safely and preserving surrounding style/script tags.
 */
export function parseTopLevelSections(html: string): {
  prefix: string;
  sections: ParsedSection[];
  suffix: string;
} {
  const spans = parseSectionSpans(html);
  if (spans.length === 0) {
    return { prefix: html || "", sections: [], suffix: "" };
  }

  return {
    prefix: html.slice(0, spans[0].start),
    sections: spans.map(({ id, tagName, rawHtml }) => ({ id, tagName, rawHtml })),
    suffix: html.slice(spans[spans.length - 1].end),
  };
}

function findSpanIndex(spans: SectionSpan[], sectionId: string, sectionIndex?: number): number {
  if (
    typeof sectionIndex === "number" &&
    sectionIndex >= 0 &&
    sectionIndex < spans.length &&
    (!sectionId ||
      spans[sectionIndex].id.toLowerCase() === sectionId.toLowerCase() ||
      spans[sectionIndex].tagName.toLowerCase() === sectionId.toLowerCase())
  ) {
    return sectionIndex;
  }
  return spans.findIndex(
    (s) =>
      s.id.toLowerCase() === sectionId.toLowerCase() ||
      s.tagName.toLowerCase() === sectionId.toLowerCase()
  );
}

function replaceSpan(html: string, span: SectionSpan, nextRawHtml: string): string {
  return html.slice(0, span.start) + nextRawHtml + html.slice(span.end);
}

export function moveSectionInHtml(
  html: string,
  sectionId: string,
  direction: "up" | "down"
): string {
  const spans = parseSectionSpans(html);
  if (spans.length < 2) return html;

  const idx = findSpanIndex(spans, sectionId);
  if (idx === -1) return html;

  const targetIdx = direction === "up" ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= spans.length) return html;

  const firstIdx = Math.min(idx, targetIdx);
  const secondIdx = Math.max(idx, targetIdx);
  const a = spans[firstIdx];
  const b = spans[secondIdx];

  return (
    html.slice(0, a.start) +
    b.rawHtml +
    html.slice(a.end, b.start) +
    a.rawHtml +
    html.slice(b.end)
  );
}

export function duplicateSectionInHtml(html: string, sectionId: string): string {
  const spans = parseSectionSpans(html);
  if (spans.length === 0) return html;

  const idx = findSpanIndex(spans, sectionId);
  if (idx === -1) return html;

  const original = spans[idx];
  let duplicateId = `${original.id}-copy`;
  let counter = 2;
  while (spans.some((s) => s.id === duplicateId)) {
    duplicateId = `${original.id}-copy-${counter}`;
    counter += 1;
  }

  let clonedRaw = original.rawHtml;
  if (/data-section=["']([^"']+)["']/i.test(clonedRaw)) {
    clonedRaw = clonedRaw.replace(/data-section=["']([^"']+)["']/i, `data-section="${duplicateId}"`);
  }
  if (/\bid=["']([^"']+)["']/i.test(clonedRaw)) {
    clonedRaw = clonedRaw.replace(/\bid=["']([^"']+)["']/i, `id="${duplicateId}"`);
  }

  return html.slice(0, original.end) + "\n\n" + clonedRaw + html.slice(original.end);
}

export function deleteSectionInHtml(html: string, sectionId: string): string {
  const spans = parseSectionSpans(html);
  if (spans.length <= 1) return html;

  const idx = findSpanIndex(spans, sectionId);
  if (idx === -1) return html;

  const target = spans[idx];
  return (html.slice(0, target.start) + html.slice(target.end)).replace(/\n{3,}/g, "\n\n");
}

function escapeHtmlText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function locateNthTagInSection(
  sectionHtml: string,
  tagName: string,
  nodeIndex: number
): { start: number; openTagEnd: number; closeTagStart: number; end: number; attrs: string; innerHtml: string } | null {
  const lowerTag = tagName.toLowerCase();
  const openRegex = new RegExp(`<${lowerTag}\\b([^>]*)>`, "gi");
  let count = 0;
  let m: RegExpExecArray | null;

  while ((m = openRegex.exec(sectionHtml)) !== null) {
    const attrs = m[1] || "";
    const openEnd = m.index + m[0].length;
    const isVoid = /^(img|input|br|hr|source|meta|link)$/i.test(lowerTag) || attrs.trim().endsWith("/");
    const end = isVoid ? openEnd : findMatchingClosingTag(sectionHtml, lowerTag, openEnd);
    if (end === -1) continue;

    if (count === nodeIndex) {
      const closeTagStart = isVoid ? end : sectionHtml.lastIndexOf(`</`, end);
      return {
        start: m.index,
        openTagEnd: openEnd,
        closeTagStart,
        end,
        attrs,
        innerHtml: isVoid ? "" : sectionHtml.slice(openEnd, closeTagStart),
      };
    }
    count += 1;
  }
  return null;
}

export function updateSectionTextInHtml(
  html: string,
  sectionId: string,
  oldText: string,
  newText: string,
  nodeIndex?: number,
  tagName?: string,
  sectionIndex?: number
): string {
  if (!newText.trim()) return html;

  const spans = parseSectionSpans(html);
  const idx = findSpanIndex(spans, sectionId, sectionIndex);

  // 1. Exact structural targeting via section + tag + nodeIndex
  if (idx !== -1 && typeof nodeIndex === "number" && nodeIndex >= 0 && tagName) {
    const lowerTag = tagName.toLowerCase();
    if (!/^(section|header|footer|div|img|body)$/.test(lowerTag)) {
      const targetTag = locateNthTagInSection(spans[idx].rawHtml, lowerTag, nodeIndex);
      if (targetTag && targetTag.closeTagStart > targetTag.openTagEnd) {
        const updatedSection =
          spans[idx].rawHtml.slice(0, targetTag.openTagEnd) +
          escapeHtmlText(newText) +
          spans[idx].rawHtml.slice(targetTag.closeTagStart);
        return replaceSpan(html, spans[idx], updatedSection);
      }
    }
  }

  // 2. Exact match inside the target section first (prevents accidentally replacing text in an earlier section)
  const trimmedOld = (oldText || "").trim();
  const escapedOld = trimmedOld ? escapeHtmlText(trimmedOld) : "";
  if (idx !== -1 && trimmedOld) {
    const secHtml = spans[idx].rawHtml;
    if (secHtml.includes(trimmedOld)) {
      return replaceSpan(html, spans[idx], secHtml.replace(trimmedOld, escapeHtmlText(newText)));
    }
    if (escapedOld && secHtml.includes(escapedOld)) {
      return replaceSpan(html, spans[idx], secHtml.replace(escapedOld, escapeHtmlText(newText)));
    }
  }

  // 3. Global exact string match (backward-compatible)
  if (trimmedOld && html.includes(trimmedOld)) {
    return html.replace(trimmedOld, escapeHtmlText(newText));
  }
  if (escapedOld && html.includes(escapedOld)) {
    return html.replace(escapedOld, escapeHtmlText(newText));
  }

  // 4. Fallback: replace matching element or primary heading inside target section
  if (idx !== -1) {
    const updatedSection = spans[idx].rawHtml.replace(
      /(<h[1-4][^>]*>)([\s\S]*?)(<\/h[1-4]>)/i,
      `$1${escapeHtmlText(newText)}$3`
    );
    return replaceSpan(html, spans[idx], updatedSection);
  }

  return html.replace(/(<h1[^>]*>)([\s\S]*?)(<\/h1>)/i, `$1${escapeHtmlText(newText)}$3`);
}

function mergeInlineStyleAttr(tagOpenStr: string, styleUpdates: Record<string, string>): string {
  const styleMatch = tagOpenStr.match(/\bstyle=(["'])([\s\S]*?)\1/i);
  const existingMap: Record<string, string> = {};

  if (styleMatch?.[2]) {
    styleMatch[2].split(";").forEach((decl) => {
      const colonIdx = decl.indexOf(":");
      if (colonIdx > 0) {
        const prop = decl.slice(0, colonIdx).trim().toLowerCase();
        const val = decl.slice(colonIdx + 1).trim();
        if (prop && val) existingMap[prop] = val;
      }
    });
  }

  Object.entries(styleUpdates).forEach(([k, v]) => {
    const prop = k.trim().toLowerCase();
    if (!v) {
      delete existingMap[prop];
    } else {
      existingMap[prop] = v;
    }
  });

  const serialized = Object.entries(existingMap)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");

  if (!serialized) {
    return styleMatch ? tagOpenStr.replace(/\s*\bstyle=(["'])([\s\S]*?)\1/i, "") : tagOpenStr;
  }
  if (styleMatch) {
    return tagOpenStr.replace(/\bstyle=(["'])([\s\S]*?)\1/i, `style="${serialized}"`);
  }
  return tagOpenStr.replace(/>$/, ` style="${serialized}">`);
}

export function updateElementStyleInHtml(
  html: string,
  sectionId: string,
  tagName: string,
  nodeIndex: number,
  styleUpdates: Record<string, string>,
  href?: string,
  sectionIndex?: number
): string {
  const spans = parseSectionSpans(html);
  const idx = findSpanIndex(spans, sectionId, sectionIndex);
  if (idx === -1) return html;

  const secHtml = spans[idx].rawHtml;
  const lowerTag = (tagName || "section").toLowerCase();

  const patchOpenTag = (openTag: string): string => {
    let next = mergeInlineStyleAttr(openTag, styleUpdates);
    if (typeof href === "string" && href.trim() && /^<a\b/i.test(next)) {
      if (/\bhref=(["'])([\s\S]*?)\1/i.test(next)) {
        next = next.replace(/\bhref=(["'])([\s\S]*?)\1/i, `href="${href.trim().replace(/"/g, "&quot;")}"`);
      } else {
        next = next.replace(/>$/, ` href="${href.trim().replace(/"/g, "&quot;")}">`);
      }
    }
    return next;
  };

  if (lowerTag === spans[idx].tagName || lowerTag === "section" || lowerTag === "header" || lowerTag === "footer") {
    const openEnd = secHtml.indexOf(">") + 1;
    if (openEnd <= 0) return html;
    const updatedSection = patchOpenTag(secHtml.slice(0, openEnd)) + secHtml.slice(openEnd);
    return replaceSpan(html, spans[idx], updatedSection);
  }

  const targetTag = locateNthTagInSection(secHtml, lowerTag, Math.max(0, nodeIndex));
  if (targetTag) {
    const openTagStr = secHtml.slice(targetTag.start, targetTag.openTagEnd);
    const patchedOpen = patchOpenTag(openTagStr);
    const updatedSection =
      secHtml.slice(0, targetTag.start) + patchedOpen + secHtml.slice(targetTag.openTagEnd);
    return replaceSpan(html, spans[idx], updatedSection);
  }

  const openEnd = secHtml.indexOf(">") + 1;
  if (openEnd > 0) {
    const updatedSection = patchOpenTag(secHtml.slice(0, openEnd)) + secHtml.slice(openEnd);
    return replaceSpan(html, spans[idx], updatedSection);
  }

  return html;
}

export function updateSectionImageInHtml(
  html: string,
  sectionId: string,
  newSrc?: string,
  transformEffect?: string,
  currentImgSrc?: string,
  sectionIndex?: number
): string {
  const spans = parseSectionSpans(html);
  const idx = findSpanIndex(spans, sectionId, sectionIndex);

  const applyTransformToTag = (sectionStr: string, effect: string): string => {
    const effectClassMap: Record<string, string> = {
      "tr:bg-remove": "mix-blend-lighten contrast-125",
      "tr:w-1200,h-1200,q-90": "contrast-110 saturate-110",
      "tr:drop-shadow": "drop-shadow-[0_20px_35px_rgba(255,255,255,0.22)]",
      "tr:bg-sunset": "sepia-[0.25] contrast-125 brightness-105",
      "tr:rounded": "rounded-3xl",
      "tr:reset": "",
    };

    const effectiveSrc = newSrc || currentImgSrc;
    const imgRegex = effectiveSrc
      ? new RegExp(`(<img\\b[^>]*src=["']${effectiveSrc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*>)`, "i")
      : /(<img\b[^>]*>)/i;

    if (effect === "tr:reset") {
      return sectionStr.replace(imgRegex, (imgTag) =>
        imgTag
          .replace(/\b(mix-blend-lighten|contrast-125|contrast-110|saturate-110|sepia-\[0\.25\]|brightness-105|rounded-3xl|drop-shadow-\[[^\]]+\])\s*/g, "")
      );
    }

    const extraClasses = effectClassMap[effect] || "contrast-110";
    return sectionStr.replace(imgRegex, (imgTag) => {
      if (/\bclass=["'][^"']*["']/i.test(imgTag)) {
        return imgTag.replace(/\bclass=(["'])([^"']*)(["'])/i, `class=$1$2 ${extraClasses}$3`);
      }
      return imgTag.replace(/\/?>$/, ` class="${extraClasses}" />`);
    });
  };

  if (idx !== -1) {
    let secHtml = spans[idx].rawHtml;
    if (newSrc) {
      if (currentImgSrc && secHtml.includes(currentImgSrc)) {
        secHtml = secHtml.replace(currentImgSrc, () => newSrc);
      } else if (/<img\b[^>]*src=["']([^"']+)["']/i.test(secHtml)) {
        secHtml = secHtml.replace(/(<img\b[^>]*src=["'])([^"']+)(["'])/i, (_m, p1, _p2, p3) => `${p1}${newSrc}${p3}`);
      } else {
        // Insert an editorial image block right before closing section tag if none existed
        const closeIdx = secHtml.lastIndexOf("</");
        if (closeIdx !== -1) {
          const insertedImg = `\n<div class="mt-6 max-w-4xl mx-auto"><img src="${newSrc}" alt="Studio Visual" class="w-full h-72 object-cover rounded-2xl border border-zinc-800" /></div>\n`;
          secHtml = secHtml.slice(0, closeIdx) + insertedImg + secHtml.slice(closeIdx);
        }
      }
    }

    if (transformEffect) {
      secHtml = applyTransformToTag(secHtml, transformEffect);
    }
    return replaceSpan(html, spans[idx], secHtml);
  }

  let updated = html;
  if (newSrc) {
    if (currentImgSrc && updated.includes(currentImgSrc)) {
      updated = updated.replace(currentImgSrc, newSrc);
    } else {
      updated = updated.replace(/(<img\b[^>]*src=["'])([^"']+)(["'])/i, `$1${newSrc}$3`);
    }
  }
  if (transformEffect) {
    updated = applyTransformToTag(updated, transformEffect);
  }
  return updated;
}

export interface BridgeSelectedElement {
  sectionId: string;
  tagName: string;
  textContent: string;
  imgSrc?: string;
  nodeIndex?: number;
  sectionIndex?: number;
  href?: string;
  inlineStyle?: {
    color?: string;
    backgroundColor?: string;
    textAlign?: string;
    fontSize?: string;
  };
}

export interface InlineTextCommitPayload {
  sectionId: string;
  tagName: string;
  nodeIndex: number;
  sectionIndex: number;
  oldText: string;
  newText: string;
}

/**
 * Safely normalizes postMessage payloads from the Live Preview iframe bridge.
 */
export function extractSelectedElementFromMessage(data: unknown): BridgeSelectedElement | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  if (record.type !== "OBSIDIAN_SELECT_ELEMENT") return null;

  const nested =
    record.element && typeof record.element === "object"
      ? (record.element as Record<string, unknown>)
      : record;

  const result: BridgeSelectedElement = {
    sectionId: String(nested.sectionId || "hero"),
    tagName: String(nested.tagName || "section"),
    textContent: String(nested.textContent || "Section Content"),
    imgSrc: nested.imgSrc ? String(nested.imgSrc) : undefined,
  };

  if (typeof nested.nodeIndex === "number") result.nodeIndex = nested.nodeIndex;
  if (typeof nested.sectionIndex === "number") result.sectionIndex = nested.sectionIndex;
  if (typeof nested.href === "string" && nested.href) result.href = nested.href;
  if (nested.inlineStyle && typeof nested.inlineStyle === "object") {
    result.inlineStyle = nested.inlineStyle as BridgeSelectedElement["inlineStyle"];
  }

  return result;
}

export function extractInlineCommitFromMessage(data: unknown): InlineTextCommitPayload | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  if (record.type !== "OBSIDIAN_INLINE_COMMIT") return null;
  const payload = (record.payload as Record<string, unknown>) || record;
  return {
    sectionId: String(payload.sectionId || "hero"),
    tagName: String(payload.tagName || "h1"),
    nodeIndex: typeof payload.nodeIndex === "number" ? payload.nodeIndex : 0,
    sectionIndex: typeof payload.sectionIndex === "number" ? payload.sectionIndex : 0,
    oldText: String(payload.oldText || ""),
    newText: String(payload.newText || ""),
  };
}

/**
 * Generates an interactive script for the preview iframe so:
 * - Single-clicking ANY section, heading, paragraph, button, link, or image selects it precisely (sectionId + tagName + nodeIndex)
 * - Double-clicking text allows direct on-canvas contentEditable inline typing with automatic commit
 * - Real-time OBSIDIAN_LIVE_PATCH messages update text & styles inside the iframe without flicker
 */
export function buildIframeBridgeScript(editMode: boolean = true): string {
  return `
<style id="obsidian-bridge-style">
  ${
    editMode
      ? `
  [data-section]:hover, section:hover, header:hover, footer:hover {
    outline: 1px dashed rgba(255, 255, 255, 0.25);
    outline-offset: -2px;
  }
  [data-section] h1:hover, [data-section] h2:hover, [data-section] h3:hover, [data-section] p:hover, [data-section] a:hover, [data-section] button:hover, [data-section] img:hover,
  section h1:hover, section h2:hover, section h3:hover, section p:hover, section a:hover, section button:hover, section img:hover {
    outline: 1px dashed rgba(139, 92, 246, 0.7);
    outline-offset: 2px;
    cursor: pointer;
  }
  `
      : ""
  }
  [data-obsidian-selected="true"] {
    outline: 1px solid rgba(255, 255, 255, 0.45) !important;
    outline-offset: -2px;
  }
  [data-obsidian-el-selected="true"] {
    outline: 2px solid #8b5cf6 !important;
    outline-offset: 2px;
  }
  [data-obsidian-editing="true"] {
    outline: 2px solid #10b981 !important;
    outline-offset: 3px;
    border-radius: 4px;
    cursor: text !important;
  }
</style>
<script>
  (function() {
    var editMode = ${editMode ? "true" : "false"};
    var lastSection = null;
    var lastEl = null;
    var topSections = function() {
      return Array.prototype.slice.call(document.querySelectorAll('header, section, footer')).filter(function(el) {
        return !el.parentElement || !el.parentElement.closest('header, section, footer');
      });
    };

    function resolveSectionInfo(target) {
      var list = topSections();
      var sectionEl = target.closest('[data-section], section, header, footer');
      while (sectionEl && sectionEl.parentElement && sectionEl.parentElement.closest('header, section, footer')) {
        sectionEl = sectionEl.parentElement.closest('header, section, footer');
      }
      if (!sectionEl) sectionEl = list[0] || document.body;
      var sectionIndex = list.indexOf(sectionEl);
      var sectionId = (sectionEl && sectionEl.getAttribute && (sectionEl.getAttribute('data-section') || sectionEl.id || sectionEl.tagName.toLowerCase())) || 'hero';
      return { sectionEl: sectionEl, sectionId: sectionId, sectionIndex: sectionIndex };
    }

    function computeNodeIndex(sectionEl, el) {
      if (!sectionEl || !el || el === sectionEl) return 0;
      var tag = el.tagName.toLowerCase();
      var matches = Array.prototype.slice.call(sectionEl.querySelectorAll(tag));
      var idx = matches.indexOf(el);
      return idx >= 0 ? idx : 0;
    }

    document.addEventListener('click', function(e) {
      var target = e.target;
      if (!target || !target.closest) return;

      if (!editMode) {
        return;
      }

      if (target.closest('[data-variant-btn]') || target.closest('#obsidian-quick-reserve-btn') || target.closest('summary')) {
        return;
      }

      if (target.getAttribute && target.getAttribute('data-obsidian-editing') === 'true') {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      var info = resolveSectionInfo(target);
      var sectionEl = info.sectionEl;
      var interactiveEl = target.closest('h1, h2, h3, h4, h5, h6, p, a, button, span, li, img') || sectionEl;
      if (interactiveEl && interactiveEl.tagName === 'SPAN' && interactiveEl.closest('button, a, h1, h2, h3, p')) {
        var parentBtn = interactiveEl.closest('button, a');
        if (parentBtn) interactiveEl = parentBtn;
      }

      if (lastSection && lastSection !== sectionEl) lastSection.removeAttribute('data-obsidian-selected');
      if (lastEl && lastEl !== interactiveEl) lastEl.removeAttribute('data-obsidian-el-selected');

      if (sectionEl && sectionEl.setAttribute) {
        sectionEl.setAttribute('data-obsidian-selected', 'true');
        lastSection = sectionEl;
      }
      if (interactiveEl && interactiveEl.setAttribute && interactiveEl !== sectionEl) {
        interactiveEl.setAttribute('data-obsidian-el-selected', 'true');
        lastEl = interactiveEl;
      }

      var tagName = interactiveEl && interactiveEl.tagName ? interactiveEl.tagName.toLowerCase() : 'section';
      var nodeIndex = computeNodeIndex(sectionEl, interactiveEl);
      var imgEl = tagName === 'img' ? interactiveEl : (sectionEl && sectionEl.querySelector ? sectionEl.querySelector('img') : null);
      var textSource = interactiveEl !== sectionEl ? interactiveEl : (sectionEl.querySelector('h1, h2, h3, p') || sectionEl);
      var textContent = textSource ? (textSource.innerText || textSource.textContent || '').trim() : 'Section Content';
      var href = interactiveEl && interactiveEl.tagName === 'A' ? interactiveEl.getAttribute('href') || '' : '';
      var imgSrc = imgEl ? imgEl.getAttribute('src') || '' : '';
      var computed = interactiveEl ? window.getComputedStyle(interactiveEl) : null;

      window.parent.postMessage({
        type: 'OBSIDIAN_SELECT_ELEMENT',
        element: {
          sectionId: info.sectionId,
          sectionIndex: info.sectionIndex,
          tagName: tagName,
          nodeIndex: nodeIndex,
          textContent: textContent || 'Luxury Storefront',
          imgSrc: imgSrc || undefined,
          href: href || undefined,
          inlineStyle: computed ? {
            color: interactiveEl.style.color || '',
            backgroundColor: interactiveEl.style.backgroundColor || '',
            textAlign: interactiveEl.style.textAlign || computed.textAlign || '',
            fontSize: interactiveEl.style.fontSize || ''
          } : undefined
        }
      }, '*');
    }, true);

    // Double-click direct inline typing right inside the Live Canvas
    document.addEventListener('dblclick', function(e) {
      if (!editMode) return;
      var target = e.target;
      if (!target || !target.closest) return;
      var textEl = target.closest('h1, h2, h3, h4, h5, h6, p, a, button, span, li');
      if (!textEl) return;

      e.preventDefault();
      e.stopPropagation();

      var info = resolveSectionInfo(textEl);
      var tagName = textEl.tagName.toLowerCase();
      var nodeIndex = computeNodeIndex(info.sectionEl, textEl);
      var oldText = (textEl.innerText || textEl.textContent || '').trim();

      textEl.setAttribute('contenteditable', 'true');
      textEl.setAttribute('data-obsidian-editing', 'true');
      textEl.focus();

      function finishEditing(commit) {
        textEl.removeAttribute('contenteditable');
        textEl.removeAttribute('data-obsidian-editing');
        textEl.removeEventListener('blur', onBlur);
        textEl.removeEventListener('keydown', onKeyDown);
        var nextText = (textEl.innerText || textEl.textContent || '').trim();
        if (commit && nextText && nextText !== oldText) {
          window.parent.postMessage({
            type: 'OBSIDIAN_INLINE_COMMIT',
            payload: {
              sectionId: info.sectionId,
              sectionIndex: info.sectionIndex,
              tagName: tagName,
              nodeIndex: nodeIndex,
              oldText: oldText,
              newText: nextText
            }
          }, '*');
        } else if (!commit) {
          textEl.textContent = oldText;
        }
      }

      function onBlur() { finishEditing(true); }
      function onKeyDown(ev) {
        if (ev.key === 'Enter' && !ev.shiftKey) {
          ev.preventDefault();
          finishEditing(true);
        } else if (ev.key === 'Escape') {
          ev.preventDefault();
          finishEditing(false);
        }
      }

      textEl.addEventListener('blur', onBlur);
      textEl.addEventListener('keydown', onKeyDown);
    }, true);

    // Real-time patch receiver from parent InlineCustomizer
    window.addEventListener('message', function(event) {
      var msg = event.data;
      if (!msg || typeof msg !== 'object') return;
      if (msg.type === 'OBSIDIAN_LIVE_PATCH') {
        var list = topSections();
        var sec = (typeof msg.sectionIndex === 'number' && list[msg.sectionIndex]) ||
                  document.querySelector('[data-section="' + msg.sectionId + '"]') ||
                  document.getElementById(msg.sectionId);
        if (!sec) return;
        var el = msg.tagName && msg.tagName !== sec.tagName.toLowerCase()
          ? (sec.querySelectorAll(msg.tagName)[msg.nodeIndex || 0] || sec)
          : sec;
        if (!el) return;
        if (typeof msg.text === 'string') {
          el.textContent = msg.text;
        }
        if (msg.styles && typeof msg.styles === 'object') {
          Object.keys(msg.styles).forEach(function(prop) {
            var val = msg.styles[prop];
            if (!val) {
              el.style.removeProperty(prop);
            } else {
              el.style.setProperty(prop, val);
            }
          });
        }
      }
    });
  })();
</script>`;
}
