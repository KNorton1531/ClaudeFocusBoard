// Sticky note settings. Edit the lists here to change what you can customise.
export const config = {
  type: 'notes',
  name: 'Sticky note',
  w: 5,
  h: 6,
  minW: 3,
  minH: 3,
  defaultSettings: {
    textSize: 'medium',
    paper: 'clear',
  },
  settingsFields: [
    {
      key: 'textSize',
      label: 'Text size',
      type: 'choice',
      options: [
        { value: 'small', name: 'Small' },
        { value: 'medium', name: 'Medium' },
        { value: 'large', name: 'Large' },
      ],
    },
    {
      key: 'paper',
      label: 'Paper',
      type: 'choice',
      options: [
        { value: 'clear', name: 'Clear' },
        { value: 'butter', name: 'Butter' },
        { value: 'mint', name: 'Mint' },
        { value: 'rose', name: 'Rose' },
      ],
    },
  ],
}
