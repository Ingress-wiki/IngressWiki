/**
 * Heti add-on v 0.1.0
 * Add right spacing between CJK & ANS characters
 * Modified from https://github.com/sivan/heti/blob/d0d0b5f496b737704f7a5b74417d52d19956a2c8/js/heti-addon.js
 *
 * MIT License
 * Copyright (c) 2020 Sivan
 */

import type { Element, ElementContent, Root } from 'hast';
import { SKIP, visitParents } from 'unist-util-visit-parents';

const HETI_SKIPPED_CLASS = 'heti-skip';

// 部分正则表达式修改自 pangu.js https://github.com/vinta/pangu.js
const REG_BD_STOP = '。．，、：；！‼？⁇';
const REG_BD_SEP = '·・‧';
const REG_BD_OPEN = '「『（《〈【〖〔［｛';
const REG_BD_CLOSE = '」』）》〉】〗〕］｝';
const REG_BD_HALF_OPEN = '“‘';
const REG_BD_HALF_CLOSE = '”’';

const regexPatterns = [
  {
    regex: new RegExp(
      `([${REG_BD_STOP}])(?=[${REG_BD_OPEN}${REG_BD_CLOSE}])|` +
      `([${REG_BD_OPEN}])(?=[${REG_BD_OPEN}])|` +
      `([${REG_BD_CLOSE}])(?=[${REG_BD_STOP}${REG_BD_OPEN}${REG_BD_CLOSE}])`,
      'g'
    ),
    className: 'heti-adjacent-half'
  },
  {
    regex: new RegExp(
      `([${REG_BD_SEP}])(?=[${REG_BD_OPEN}])|` +
      `([${REG_BD_CLOSE}])(?=[${REG_BD_SEP}])`,
      'g'
    ),
    className: 'heti-adjacent-quarter'
  },
  {
    regex: new RegExp(
      `([${REG_BD_STOP}])(?=[${REG_BD_HALF_OPEN}${REG_BD_HALF_CLOSE}])|` +
      `([${REG_BD_HALF_OPEN}])(?=[${REG_BD_OPEN}])`,
      'g'
    ),
    className: 'heti-adjacent-quarter'
  }
];

function shouldSkip(ancestors: (Element | Root)[]): boolean {
  return ancestors.some(node => {
    if (node.type === 'element') {
      const className = node.properties?.className || [];
      const classes = Array.isArray(className) ? className :
        typeof className === 'string' ? className.split(' ') : [];
      if (classes.includes(HETI_SKIPPED_CLASS)) return true;

      if (node.tagName === 'heti-adjacent') return true;
    }
    return false;
  });
}

function processTextNode(text: string): ElementContent[] {
  let nodes: ElementContent[] = [{ type: 'text', value: text }];

  for (const { regex, className } of regexPatterns) {
    nodes = nodes.flatMap(node => {
      if (node.type !== 'text') return node;

      const parts: ElementContent[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      regex.lastIndex = 0;

      while ((match = regex.exec(node.value)) !== null) {
        const index = match.index;
        const char = match[0];

        if (index > lastIndex) {
          parts.push({
            type: 'text',
            value: node.value.slice(lastIndex, index)
          });
        }

        parts.push({
          type: 'element',
          tagName: 'heti-adjacent',
          properties: { className: [className] },
          children: [{ type: 'text', value: char }]
        });

        lastIndex = index + char.length;
      }

      if (lastIndex < node.value.length) {
        parts.push({
          type: 'text',
          value: node.value.slice(lastIndex)
        });
      }

      return parts;
    });
  }

  return nodes;
}

export default function rehypeHeti() {
  return (tree: Root) => {
    visitParents(tree, 'text', (node, ancestors) => {
      if (shouldSkip(ancestors)) return SKIP;

      const processed = processTextNode(node.value);
      if (processed.length === 1 && processed[0].type === 'text') return;

      const parent = ancestors[ancestors.length - 1] as Element;
      const index = parent.children.indexOf(node);
      parent.children.splice(index, 1, ...processed);

      return [SKIP, index + processed.length];
    });
  };
}
