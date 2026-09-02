/**
 * Continua Markdown + KaTeX Renderer
 * Shared canonical renderer for NCERT Solutions and Formulae Sheets.
 * Adapted from the embedded Solutions renderer and extended to support
 * the full Markdown/LaTeX subset used by Continua content:
 *  headings, paragraphs, bold, italic, lists, blockquotes, hr,
 *  inline/display math, links, images, tables, escaped characters,
 *  and responsive math overflow.
 *
 * Usage:
 *   ContinuaRenderer.renderMarkdown(mdString) -> HTML string
 *   ContinuaRenderer.renderMath(containerEl) -> invokes KaTeX auto-render
 */
(function (global) {
  const MATH_PLACEHOLDER = '@@MATH';
  const ESC_DOLLAR = '@@ESCDOLLAR@@';
  const ESC_STAR = '@@ESCSTAR@@';
  const ESC_UND = '@@ESCUND@@';
  const ESC_BACKTICK = '@@ESCBACK@@';
  const ESC_LB = '@@ESCLB@@';
  const ESC_RB = '@@ESCRB@@';

  function escapeHtml(str) {
    // Minimal escape for raw text that is not already HTML.
    // We do NOT escape math placeholders; they will be restored later.
    return str;
  }

  function inlineRender(text) {
    // Images must be processed before links.
    let out = text;
    out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function (_, alt, url) {
      const safeAlt = alt.replace(/"/g, '&quot;');
      const safeUrl = url.replace(/"/g, '&quot;');
      return '<img src="' + safeUrl + '" alt="' + safeAlt + '" loading="lazy">';
    });
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, label, url) {
      const safeUrl = url.replace(/"/g, '&quot;');
      return '<a href="' + safeUrl + '">' + label + '</a>';
    });
    // Bold (strong)
    out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/__(.+?)__/g, '<strong>$1</strong>');
    // Italic (em) — avoid interfering with already handled strong.
    // Use *...* and _..._  (single). We require non-empty content.
    out = out.replace(/\*([^\*\n]+?)\*/g, '<em>$1</em>');
    out = out.replace(/(^|[^_])_([^_\n]+?)_([^_]|$)/g, function (m, pre, content, post) {
      return pre + '<em>' + content + '</em>' + post;
    });
    return out;
  }

  function renderTable(headerLine, sepLine, rowLines) {
    function splitRow(line) {
      let t = line.trim();
      if (t.startsWith('|')) t = t.slice(1);
      if (t.endsWith('|')) t = t.slice(0, -1);
      return t.split('|').map(function (c) { return c.trim(); });
    }
    const headers = splitRow(headerLine);
    let html = '<div class="table-wrap"><table><thead><tr>';
    headers.forEach(function (h) { html += '<th>' + inlineRender(h) + '</th>'; });
    html += '</tr></thead><tbody>';
    rowLines.forEach(function (row) {
      const cells = splitRow(row);
      html += '<tr>';
      cells.forEach(function (c, idx) {
        // Fill missing cells
        html += '<td>' + inlineRender(c) + '</td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    return html;
  }

  function renderMarkdown(src) {
    if (!src) return '';
    src = src.replace(/\r\n/g, '\n');

    // 1. Store math segments with placeholders BEFORE handling escapes
    //    This preserves real LaTeX delimiters and avoids conflating escaped literals.
    const mathStore = [];
    function storeMath(match) {
      const idx = mathStore.length;
      mathStore.push(match);
      return MATH_PLACEHOLDER + idx + '@@';
    }

    // Display $$ ... $$ (multiline, non-greedy)
    src = src.replace(/\$\$([\s\S]*?)\$\$/g, function (m) { return storeMath(m); });
    // Display \[ ... \]  — use negative lookbehind to avoid escaped \[
    // Fallback for environments without lookbehind: use alternative handling.
    try {
      src = src.replace(/(?<!\\)\\\[([\s\S]*?)(?<!\\)\\\]/g, function (m) { return storeMath(m); });
    } catch (e) {
      src = src.replace(/\\\[([\s\S]*?)\\\]/g, function (m) { return storeMath(m); });
    }
    // Inline \( ... \)
    try {
      src = src.replace(/(?<!\\)\\\(([\s\S]*?)(?<!\\)\\\)/g, function (m) { return storeMath(m); });
    } catch (e) {
      src = src.replace(/\\\(([\s\S]*?)\\\)/g, function (m) { return storeMath(m); });
    }

    // 2. Protect escaped characters that should remain literal after math is extracted
    //    Escaped \$ must not become inline math; \* should not become italic, etc.
    src = src.replace(/\\\$/g, ESC_DOLLAR);
    src = src.replace(/\\\*/g, ESC_STAR);
    src = src.replace(/\\_/g, ESC_UND);
    src = src.replace(/\\`/g, ESC_BACKTICK);
    src = src.replace(/\\\[/g, ESC_LB);
    src = src.replace(/\\\]/g, ESC_RB);

    // 3. Protect inline $ ... $ (single dollar) — must run after $$ and escaped \$ handling
    //    Match $...$ where $ is not escaped (already placeholder) and not part of $$
    src = src.replace(/\$([^\$\n]+?)\$/g, function (m) { return storeMath(m); });

    // At this point, mathStore holds all math segments and src contains placeholders like @@MATH0@@

    // 3. Block parsing
    const lines = src.split('\n');
    let html = '';
    let i = 0;

    function isHr(line) {
      const t = line.trim();
      return /^---+$/.test(t) || /^\*\*\*+$/.test(t) || /^___+$/.test(t);
    }
    function isHeading(line) {
      return /^(#{1,6})\s+(.*)$/.test(line.trim());
    }
    function headingMatch(line) {
      const m = line.trim().match(/^(#{1,6})\s+(.*)$/);
      if (!m) return null;
      return { level: m[1].length, text: m[2] };
    }

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed === '') { i++; continue; }

      if (isHr(trimmed)) {
        html += '<hr>';
        i++; continue;
      }

      const hm = headingMatch(line);
      if (hm) {
        const inner = inlineRender(hm.text);
        html += '<h' + hm.level + '>' + inner + '</h' + hm.level + '>';
        i++; continue;
      }

      if (trimmed.startsWith('>')) {
        const bqLines = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          bqLines.push(lines[i].trim().replace(/^>\s?/, ''));
          i++;
        }
        const bqRaw = bqLines.join('\n');
        // Blockquote may contain multiple inline elements and even math placeholders
        // Process blockquote content as inline (since list inside blockquote not required)
        html += '<blockquote>' + inlineRender(bqRaw) + '</blockquote>';
        continue;
      }

      // Table detection
      if (trimmed.includes('|') && i + 1 < lines.length && /^\s*\|?[\s\-\:\|]+\|?[\s\-\:\|]*$/.test(lines[i + 1].trim()) && lines[i + 1].includes('|')) {
        const headerLine = line;
        const sepLine = lines[i + 1];
        // Check sep line looks like table separator (contains --- )
        if (/[-:]{2,}/.test(sepLine)) {
          const rowLines = [];
          i += 2;
          while (i < lines.length && lines[i].trim().includes('|') && lines[i].trim() !== '') {
            rowLines.push(lines[i]);
            i++;
          }
          html += renderTable(headerLine, sepLine, rowLines);
          continue;
        }
      }

      // Unordered list
      if (/^\s*[\*\-\+]\s+/.test(line)) {
        html += '<ul>';
        while (i < lines.length && /^\s*[\*\-\+]\s+/.test(lines[i])) {
          const itemRaw = lines[i].replace(/^\s*[\*\-\+]\s+/, '');
          html += '<li>' + inlineRender(itemRaw) + '</li>';
          i++;
        }
        html += '</ul>';
        continue;
      }

      // Ordered list
      if (/^\s*\d+\.\s+/.test(line)) {
        html += '<ol>';
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
          const itemRaw = lines[i].replace(/^\s*\d+\.\s+/, '');
          html += '<li>' + inlineRender(itemRaw) + '</li>';
          i++;
        }
        html += '</ol>';
        continue;
      }

      // Standalone math placeholder line (display math)
      if (/^@@MATH\d+@@$/.test(trimmed)) {
        const idx = parseInt(trimmed.match(/\d+/)[0], 10);
        const original = mathStore[idx] || '';
        const isDisplay = original.trim().startsWith('$$') || original.trim().startsWith('\\[');
        if (isDisplay) {
          // Output placeholder directly (no <p>) to keep block display semantics; will be replaced later
          html += trimmed;
          i++;
          continue;
        }
        // Inline math alone on line -> treat as paragraph
        html += '<p>' + inlineRender(trimmed) + '</p>';
        i++;
        continue;
      }

      // Paragraph: collect consecutive lines that are not blank and not special block starters
      const paraLines = [];
      while (i < lines.length) {
        const cur = lines[i];
        const curTrim = cur.trim();
        if (curTrim === '') break;
        if (isHr(curTrim) || headingMatch(cur) || curTrim.startsWith('>') || /^\s*[\*\-\+]\s+/.test(cur) || /^\s*\d+\.\s+/.test(cur) || /^@@MATH\d+@@$/.test(curTrim) || (curTrim.includes('|') && i + 1 < lines.length && /[-:]{2,}/.test(lines[i + 1] || ''))) {
          break;
        }
        paraLines.push(cur);
        i++;
        // If next line is blank, paragraph ends
        if (i < lines.length && lines[i].trim() === '') break;
      }
      if (paraLines.length) {
        const paraRaw = paraLines.join(' ').trim();
        // Preserve line breaks as spaces; inlineRender will handle bold/italic/links
        if (paraRaw) {
          html += '<p>' + inlineRender(paraRaw) + '</p>';
        }
        continue;
      }

      i++;
    }

    // 4. Restore placeholders
    html = html.replace(/@@MATH(\d+)@@/g, function (_, idx) {
      const n = parseInt(idx, 10);
      return mathStore[n] !== undefined ? mathStore[n] : '';
    });
    html = html.replace(new RegExp(ESC_DOLLAR.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '$');
    html = html.replace(new RegExp(ESC_STAR.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '*');
    html = html.replace(new RegExp(ESC_UND.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '_');
    html = html.replace(new RegExp(ESC_BACKTICK.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '`');
    // ESC_LB / ESC_RB remaining are literal brackets
    html = html.replace(new RegExp(ESC_LB.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '[');
    html = html.replace(new RegExp(ESC_RB.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), ']');

    return html;
  }

  function renderMath(container) {
    if (!container) return;
    if (global.renderMathInElement) {
      global.renderMathInElement(container, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  }

  global.ContinuaRenderer = {
    renderMarkdown: renderMarkdown,
    renderMath: renderMath
  };
})(window);
