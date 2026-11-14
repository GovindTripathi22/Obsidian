/**
 * Pure DOM/HTML Section Manipulation & Iframe Selection Bridge
 * Location: src/lib/editor-dom.ts
 */

export interface ParsedSection {
  id: string;
  tagName: string;
  rawHtml: string;
}

/**
 * Splits an HTML document fragment into top-level <section>, <header>, and <footer> blocks
 * while preserving any surrounding style/script tags.
 */
export function parseTopLevelSections(html: string): {
  prefix: string;
  sections: ParsedSection[];
  suffix: string;
} {
  if (!html || !html.trim()) {
    return { prefix: "", sections: [], suffix: "" };
  }

  const blockRegex = /<(header|section|footer)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  const sections: ParsedSection[] = [];
  let firstIndex = -1;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(html)) !== null) {
    if (firstIndex === -1) {
      firstIndex = match.index;
    }
    const tagName = match[1].toLowerCase();
    const attrs = match[2] || "";
    const dataSecMatch = attrs.match(/data-section=["']([^"']+)["']/i);
    const idMatch = attrs.match(/\bid=["']([^"']+)["']/i);
    const id = dataSecMatch?.[1] || idMatch?.[1] || `${tagName}-${sections.length + 1}`;

    sections.push({
      id,
      tagName,
      rawHtml: match[0],
    });
    lastIndex = match.index + match[0].length;
  }

  if (sections.length === 0) {
    return { prefix: html, sections: [], suffix: "" };
  }

  const prefix = html.slice(0, firstIndex);
  const suffix = html.slice(lastIndex);
  return { prefix, sections, suffix };
}

function reassembleSections(prefix: string, sections: ParsedSection[], suffix: string): string {
  return `${prefix}${sections.map((s) => s.rawHtml).join("\n\n")}${suffix}`;
}

export function moveSectionInHtml(
  html: string,
  sectionId: string,
  direction: "up" | "down"
): string {
  const { prefix, sections, suffix } = parseTopLevelSections(html);
  if (sections.length < 2) return html;

  const idx = sections.findIndex(
    (s) => s.id.toLowerCase() === sectionId.toLowerCase() || s.tagName.toLowerCase() === sectionId.toLowerCase()
  );
  if (idx === -1) return html;

  const targetIdx = direction === "up" ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= sections.length) return html;

  const copy = [...sections];
  const temp = copy[idx];
  copy[idx] = copy[targetIdx];
  copy[targetIdx] = temp;

  return reassembleSections(prefix, copy, suffix);
}

export function duplicateSectionInHtml(html: string, sectionId: string): string {
  const { prefix, sections, suffix } = parseTopLevelSections(html);
  if (sections.length === 0) return html;

  const idx = sections.findIndex(
    (s) => s.id.toLowerCase() === sectionId.toLowerCase() || s.tagName.toLowerCase() === sectionId.toLowerCase()
  );
  if (idx === -1) return html;

  const original = sections[idx];
  const duplicateId = `${original.id}-copy`;
  const clonedRaw = original.rawHtml
    .replace(/data-section=["']([^"']+)["']/i, `data-section="${duplicateId}"`)
    .replace(/\bid=["']([^"']+)["']/i, `id="${duplicateId}"`);

  const copy = [...sections];
  copy.splice(idx + 1, 0, {
    id: duplicateId,
    tagName: original.tagName,
    rawHtml: clonedRaw,
  });

  return reassembleSections(prefix, copy, suffix);
}

export function deleteSectionInHtml(html: string, sectionId: string): string {
  const { prefix, sections, suffix } = parseTopLevelSections(html);
  if (sections.length <= 1) return html;

  const idx = sections.findIndex(
    (s) => s.id.toLowerCase() === sectionId.toLowerCase() || s.tagName.toLowerCase() === sectionId.toLowerCase()
  );
  if (idx === -1) return html;

  const copy = sections.filter((_, i) => i !== idx);
  return reassembleSections(prefix, copy, suffix);
}

export function updateSectionTextInHtml(
  html: string,
  sectionId: string,
  oldText: string,
  newText: string
): string {
  if (!newText.trim()) return html;
  const trimmedOld = (oldText || "").trim();
  if (trimmedOld && html.includes(trimmedOld)) {
    return html.replace(trimmedOld, newText);
  }

  // Fallback: replace the primary heading inside the target section
  const { prefix, sections, suffix } = parseTopLevelSections(html);
  const idx = sections.findIndex(
    (s) => s.id.toLowerCase() === sectionId.toLowerCase() || s.tagName.toLowerCase() === sectionId.toLowerCase()
  );
  if (idx !== -1) {
    const updatedSection = sections[idx].rawHtml.replace(
      /(<h[1-4][^>]*>)([\s\S]*?)(<\/h[1-4]>)/i,
      `$1${newText}$3`
    );
    const copy = [...sections];
    copy[idx] = { ...copy[idx], rawHtml: updatedSection };
    return reassembleSections(prefix, copy, suffix);
  }

  return html.replace(/(<h1[^>]*>)([\s\S]*?)(<\/h1>)/i, `$1${newText}$3`);
}

export function updateSectionImageInHtml(
  html: string,
  sectionId: string,
  newSrc?: string,
  transformEffect?: string,
  currentImgSrc?: string
): string {
  let updated = html;

  if (newSrc) {
    if (currentImgSrc && updated.includes(currentImgSrc)) {
      updated = updated.replace(currentImgSrc, newSrc);
    } else {
      const { prefix, sections, suffix } = parseTopLevelSections(updated);
      const idx = sections.findIndex(
        (s) => s.id.toLowerCase() === sectionId.toLowerCase() || s.tagName.toLowerCase() === sectionId.toLowerCase()
      );
      if (idx !== -1 && /<img\b[^>]*src=["']([^"']+)["']/i.test(sections[idx].rawHtml)) {
        const copy = [...sections];
        copy[idx] = {
          ...copy[idx],
          rawHtml: copy[idx].rawHtml.replace(/(<img\b[^>]*src=["'])([^"']+)(["'])/i, `$1${newSrc}$3`),
        };
        updated = reassembleSections(prefix, copy, suffix);
      } else {
        updated = updated.replace(/(<img\b[^>]*src=["'])([^"']+)(["'])/i, `$1${newSrc}$3`);
      }
    }
  }

  if (transformEffect) {
    const effectClassMap: Record<string, string> = {
      "tr:bg-remove": "mix-blend-lighten contrast-125",
      "tr:w-1200,h-1200,q-90": "contrast-110 saturate-110",
      "tr:drop-shadow": "drop-shadow-[0_20px_35px_rgba(255,255,255,0.22)]",
      "tr:bg-sunset": "sepia-[0.25] contrast-125 brightness-105",
    };
    const extraClasses = effectClassMap[transformEffect] || "contrast-110";
    updated = updated.replace(/(<img\b[^>]*class=["'])([^"']*)(["'])/i, `$1$2 ${extraClasses}$3`);
  }

  return updated;
}

/**
 * Generates an interactive script for the preview iframe so clicking any section, heading, or image
 * sends its exact sectionId, tagName, textContent, and imgSrc to the parent editor.
 */
export function buildIframeBridgeScript(): string {
  return `
<script>
  (function() {
    document.addEventListener('click', function(e) {
      var target = e.target;
      if (!target || !target.closest) return;
      var anchor = target.closest('a');
      if (anchor && anchor.getAttribute('href') && anchor.getAttribute('href').startsWith('#')) {
        return;
      }
      e.preventDefault();
      var sectionEl = target.closest('[data-section], section, header, footer') || document.body;
      var sectionId = (sectionEl && (sectionEl.getAttribute('data-section') || sectionEl.id || sectionEl.tagName.toLowerCase())) || 'hero';
      var imgEl = target.tagName === 'IMG' ? target : (sectionEl ? sectionEl.querySelector('img') : null);
      var headingEl = target.closest('h1, h2, h3, h4, p, button, span') || (sectionEl ? sectionEl.querySelector('h1, h2, h3') : null);
      var textContent = headingEl ? (headingEl.innerText || headingEl.textContent || '').trim().slice(0, 160) : 'Section Content';
      var imgSrc = imgEl ? imgEl.getAttribute('src') || '' : '';

      window.parent.postMessage({
        type: 'OBSIDIAN_SELECT_ELEMENT',
        element: {
          sectionId: sectionId,
          tagName: target.tagName ? target.tagName.toLowerCase() : 'section',
          textContent: textContent || 'Luxury Storefront',
          imgSrc: imgSrc || undefined
        }
      }, '*');
    }, true);
  })();
</script>`;
}
