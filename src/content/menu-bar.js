// menu-bar.js: the buttons in the menu bar, and the words in the windows they open.

// The buttons, in the order they appear. Each one opens its own window.
export const menuBarButtons = [
  { id: 'apps', name: 'Apps', icon: '▦' },
  { id: 'look', name: 'Look', icon: '✧' },
  { id: 'settings', name: 'Settings', icon: '⚙' },
]

// The tabs down the side of the Look window, in order.
export const lookTabs = [
  { id: 'backgrounds', name: 'Backgrounds', icon: '▣' },
  { id: 'background-settings', name: 'Background settings', icon: '⤢' },
  { id: 'styling', name: 'Styling', icon: '◐' },
  { id: 'effects', name: 'Effects', icon: '❄' },
]

export const lookText = {
  title: 'Look',
  videoTitle: 'Video background',
  videoToggle: 'Use the music video as the background',
  themeTitle: 'Theme',
  effectsHint:
    'Effects work on any background. The moving parts that belong to one scene, like the chimney smoke, are part of the background itself.',
}
