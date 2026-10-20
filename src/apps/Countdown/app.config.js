// Countdown settings. Edit the lists here to change what you can customise.
// Which countdowns are picked, and the ones you add yourself, are not settings:
// they're chosen inside the App and saved under their own key (see Countdown.jsx).
export const config = {
  type: 'countdown',
  name: 'Countdown',
  icon: '⏳',
  // No title bar: drag from anywhere, buttons show on hover. See AppFrame.jsx.
  compact: true,
  w: 6,
  h: 7,
  minW: 4,
  minH: 4,
  defaultSettings: {
    mode: 'all',
    rotateEvery: '15',
    showHours: false,
  },
  settingsFields: [
    {
      key: 'mode',
      label: 'Show',
      type: 'choice',
      options: [
        { value: 'all', name: 'All at once' },
        { value: 'rotate', name: 'One at a time (rotating)' },
      ],
    },
    {
      // In seconds. Only used when Show is "One at a time".
      key: 'rotateEvery',
      label: 'Rotate every',
      type: 'choice',
      options: [
        { value: '5', name: '5 sec' },
        { value: '15', name: '15 sec' },
        { value: '30', name: '30 sec' },
        { value: '60', name: '1 min' },
        { value: '300', name: '5 min' },
      ],
    },
    { key: 'showHours', label: 'Show hours and minutes', type: 'toggle' },
  ],
}
