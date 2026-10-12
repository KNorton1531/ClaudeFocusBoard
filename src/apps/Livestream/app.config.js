// Livestream settings. Edit the lists here to change what you can customise.
// The saved streams themselves are not settings: they are pasted in inside
// the App and saved under their own key (see Livestream.jsx).
export const config = {
  type: 'livestream',
  name: 'Livestream',
  w: 8,
  h: 7,
  minW: 5,
  minH: 5,
  defaultSettings: {
    showControls: 'always',
  },
  settingsFields: [
    {
      key: 'showControls',
      label: 'Media controls',
      type: 'choice',
      options: [
        { value: 'always', name: 'Always' },
        { value: 'hover', name: 'On hover' },
      ],
    },
  ],
}
