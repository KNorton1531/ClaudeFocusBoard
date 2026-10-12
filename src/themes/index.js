// themes/index.js: the list of every theme you can pick.
// To add a theme: make its CSS file here, import it in src/index.css,
// then add one line to the list below.
export const themeList = [
  { id: 'warm-cafe', name: 'Warm Cafe' },
  { id: 'midnight', name: 'Midnight' },
  { id: 'forest', name: 'Forest' },
  { id: 'sakura', name: 'Sakura' },
  { id: 'frost', name: 'Frost' },
]

export function findTheme(id) {
  for (const theme of themeList) {
    if (theme.id === id) {
      return theme
    }
  }

  // Unknown id: fall back to the first theme.
  return themeList[0]
}
