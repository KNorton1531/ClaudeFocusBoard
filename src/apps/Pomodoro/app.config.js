// Pomodoro settings. Edit the lists here to change what you can customise.
export const config = {
  type: 'pomodoro',
  name: 'Pomodoro',
  w: 6,
  h: 6,
  minW: 4,
  minH: 5,
  defaultSettings: {
    focusMinutes: 25,
    breakMinutes: 5,
    autoStartNext: true,
  },
  settingsFields: [
    { key: 'focusMinutes', label: 'Focus minutes', type: 'number', min: 1, max: 180 },
    { key: 'breakMinutes', label: 'Break minutes', type: 'number', min: 1, max: 60 },
    { key: 'autoStartNext', label: 'Start the next round on its own', type: 'toggle' },
  ],
}
