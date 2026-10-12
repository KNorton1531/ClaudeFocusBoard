// Clock settings. Edit the lists here to change what you can customise.
export const config = {
  type: 'clock',
  name: 'Clock',
  // Floats freely on the board instead of sitting in the grid.
  // It is the size of its text, and its settings open in a pop-up.
  floating: true,
  // Where it starts, from 0 to 1 across and down the board. See FloatingApp.jsx.
  left: 0.5,
  top: 0.15,
  defaultSettings: {
    minimal: false,
    size: 'medium',
    label: '',
    timeZone: 'local',
    hour24: true,
    showSeconds: false,
    showDate: true,
  },
  settingsFields: [
    { key: 'minimal', label: 'Minimal (just the time)', type: 'toggle' },
    {
      key: 'size',
      label: 'Size',
      type: 'choice',
      options: [
        { value: 'small', name: 'Small' },
        { value: 'medium', name: 'Medium' },
        { value: 'large', name: 'Large' },
        { value: 'huge', name: 'Huge' },
      ],
    },
    { key: 'label', label: 'Label', type: 'text', placeholder: 'e.g. Home' },
    {
      key: 'timeZone',
      label: 'City',
      type: 'choice',
      options: [
        { value: 'local', name: 'My time' },
        { value: 'Europe/London', name: 'London' },
        { value: 'Europe/Paris', name: 'Paris' },
        { value: 'America/New_York', name: 'New York' },
        { value: 'America/Los_Angeles', name: 'Los Angeles' },
        { value: 'Asia/Tokyo', name: 'Tokyo' },
        { value: 'Australia/Sydney', name: 'Sydney' },
      ],
    },
    { key: 'hour24', label: '24 hour clock', type: 'toggle' },
    { key: 'showSeconds', label: 'Show seconds', type: 'toggle' },
    { key: 'showDate', label: 'Show the date', type: 'toggle' },
  ],
}
