// themes/fonts.js: the list of every font pair you can pick.
// To add one: add its [data-font] block to fonts.css, add the font to the
// Google Fonts link at the top of src/index.css, then add one line below.
// "fontId" lets the picker show each button in its own font.
export const fontList = [
  { id: 'soft-round', name: 'Soft & Round', fontId: 'soft-round' },
  { id: 'storybook', name: 'Storybook', fontId: 'storybook' },
  { id: 'handwritten', name: 'Handwritten', fontId: 'handwritten' },
  { id: 'typewriter', name: 'Typewriter', fontId: 'typewriter' },
  { id: 'clean', name: 'Clean', fontId: 'clean' },
]

export function findFont(id) {
  for (const font of fontList) {
    if (font.id === id) {
      return font
    }
  }

  // Unknown id: fall back to the first font.
  return fontList[0]
}
