// LookWindow: the "Look" window, with a tab for each part of how the board looks.
// The tabs are listed in content/menu-bar.js. Each tab's page is its own file here.
import { useState } from 'react'
import Window from '../Window/Window.jsx'
import BackgroundsTab from './BackgroundsTab.jsx'
import BackgroundSettingsTab from './BackgroundSettingsTab.jsx'
import StylingTab from './StylingTab.jsx'
import EffectsTab from './EffectsTab.jsx'
import { lookTabs, lookText } from '../../content/menu-bar.js'
import './LookWindow.css'

function LookWindow({ settings, onClose, onSettingsChange }) {
  const [selectedTab, setSelectedTab] = useState(lookTabs[0].id)

  let page = null
  if (selectedTab === 'backgrounds') {
    page = <BackgroundsTab settings={settings} onSettingsChange={onSettingsChange} />
  } else if (selectedTab === 'background-settings') {
    page = <BackgroundSettingsTab settings={settings} onSettingsChange={onSettingsChange} />
  } else if (selectedTab === 'styling') {
    page = <StylingTab settings={settings} onSettingsChange={onSettingsChange} />
  } else if (selectedTab === 'effects') {
    page = <EffectsTab settings={settings} onSettingsChange={onSettingsChange} />
  }

  return (
    <Window
      title={lookText.title}
      onClose={onClose}
      tabs={lookTabs}
      selectedTab={selectedTab}
      onPickTab={setSelectedTab}
    >
      {page}
    </Window>
  )
}

export default LookWindow
