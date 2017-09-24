// @preval
// Force tree shaking on emojione by exposing just a subset of its functionality

const { emojis }    = require('emoji-mart').emojiIndex;
const mappedUnicode = {};
const excluded      = ['®', '©', '™'];
const skins         = ['1F3FA', '1F3FB', '1F3FC', '1F3FD', '1F3FE', '1F3FF'];

const fromCodePoint = codepoint => {
  let code = typeof codepoint === 'string' ? parseInt(codepoint, 16) : codepoint;

  if (code < 0x10000) {
    return String.fromCharCode(code);
  }

  code -= 0x10000;

  return String.fromCharCode(
    0xD800 + (code >> 10),
    0xDC00 + (code & 0x3FF)
  );
};

Object.keys(emojis).forEach(shortcode => {
  const emoji = emojis[shortcode];

  if (excluded.includes(emoji.native)) {
    return;
  }

  mappedUnicode[emoji.native] = [emoji.unified, shortcode];

  if (emoji.skin !== null) {
    skins.forEach((skinCodePoint, skinIndex) => {
      mappedUnicode[emoji.native + fromCodePoint(skinCodePoint)] = [[emoji.unified, skinCodePoint.toLowerCase()].join('-'), shortcode + `::skin-tone-${skinIndex + 1}`];
    });
  }
});

module.exports.unicodeMapping = mappedUnicode;
