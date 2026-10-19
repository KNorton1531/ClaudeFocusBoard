// menu-bar.js: the buttons in the menu bar, and the words in the windows they open.

// The buttons, in the order they appear. Each one opens its own window.
// "Look" opens the scene editor instead, so you see changes on the real board.
export const menuBarButtons = [
  { id: 'apps', name: 'Apps', icon: '▦' },
  { id: 'scene', name: 'Look', icon: '✧' },
  { id: 'settings', name: 'Settings', icon: '⚙' },
]

// The tabs along the top of the scene editor, in order.
export const lookTabs = [
  { id: 'background', name: 'Background', icon: '▣' },
  { id: 'colours', name: 'Colours', icon: '◐' },
  { id: 'font', name: 'Font', icon: 'Aa' },
  { id: 'effects', name: 'Effects', icon: '❄' },
]

export const lookText = {
  title: 'Look',
  videoToggle: 'Use the music video as the background (while music plays)',
  coloursHint: 'Colours for the Apps, menus and music bar.',
  fontHint: 'The welcome message shows it off. Your Apps use it too.',
  effectsHint:
    'Effects work on any background. The moving parts that belong to one scene, like the chimney smoke, are part of the background itself.',
}

// The row of App buttons the Apps button opens.
export const appsText = {
  title: 'Apps',
  add: 'Add to the board',
  hide: 'Hide (keeps its place and settings)',
  show: 'Show',
}
