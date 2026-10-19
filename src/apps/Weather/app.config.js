// Weather settings. Edit the lists here to change what you can customise.
// The saved places themselves are not settings: they are added with the
// search inside the App and saved under their own key (see Weather.jsx).
export const config = {
  type: 'weather',
  name: 'Weather',
  icon: '☁',
  // No title bar: drag from anywhere, buttons show on hover. See AppFrame.jsx.
  compact: true,
  w: 6,
  h: 8,
  // How small and big it can be dragged, in grid squares. The text grows to
  // fill the card, so a card that's a very different shape from its layout
  // leaves big gaps. Tall is narrow, Wide is wide and short.
  sizeLimits: function (settings) {
    if (settings.layout === 'wide') {
      return { minW: 9, minH: 5, maxW: 14, maxH: 8 }
    } else {
      return { minW: 4, minH: 6, maxW: 8, maxH: 11 }
    }
  },
  defaultSettings: {
    layout: 'tall',
    useMyLocation: true,
    units: 'celsius',
    days: '7',
    switchEvery: '0',
  },
  settingsFields: [
    {
      // Wide is laid out like Google's weather card. Make the App wider to fit it.
      key: 'layout',
      label: 'Layout',
      type: 'choice',
      options: [
        { value: 'tall', name: 'Tall' },
        { value: 'wide', name: 'Wide' },
      ],
    },
    { key: 'useMyLocation', label: 'Include my location', type: 'toggle' },
    {
      key: 'units',
      label: 'Units',
      type: 'choice',
      options: [
        { value: 'celsius', name: '°C' },
        { value: 'fahrenheit', name: '°F' },
      ],
    },
    {
      key: 'days',
      label: 'Days ahead',
      type: 'choice',
      options: [
        { value: '0', name: 'None' },
        { value: '3', name: '3 days' },
        { value: '5', name: '5 days' },
        { value: '7', name: '7 days' },
      ],
    },
    {
      // In seconds. "0" means never switch on its own.
      key: 'switchEvery',
      label: 'Next place on its own',
      type: 'choice',
      options: [
        { value: '0', name: 'Off' },
        { value: '30', name: 'Every 30 sec' },
        { value: '60', name: 'Every minute' },
        { value: '300', name: 'Every 5 min' },
      ],
    },
  ],
}
