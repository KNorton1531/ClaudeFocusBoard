// Flight settings. Edit the lists here to change what you can customise.
export const config = {
  type: 'flight',
  name: 'Flight',
  // No title bar: drag from anywhere, buttons show on hover. See AppFrame.jsx.
  compact: true,
  w: 7,
  h: 5,
  minW: 5,
  minH: 4,
  defaultSettings: {
    units: 'miles',
    radius: '30',
  },
  settingsFields: [
    {
      key: 'units',
      label: 'Units',
      type: 'choice',
      options: [
        { value: 'miles', name: 'Miles' },
        { value: 'km', name: 'Kilometres' },
      ],
    },
    {
      // In miles. Bigger finds more planes, smaller finds the ones overhead.
      key: 'radius',
      label: 'Look for planes within',
      type: 'choice',
      options: [
        { value: '15', name: '15 miles' },
        { value: '30', name: '30 miles' },
        { value: '60', name: '60 miles' },
      ],
    },
  ],
}
