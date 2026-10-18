// BackgroundsTab: the "Backgrounds" tab of the Look window. Pick the background.
import ChoiceList from '../ChoiceList/ChoiceList.jsx'
import { backgroundList } from '../../backgrounds/index.js'

function BackgroundsTab({ settings, onSettingsChange }) {
  function handlePickBackground(id) {
    onSettingsChange({ ...settings, backgroundId: id })
  }

  return <ChoiceList options={backgroundList} selectedId={settings.backgroundId} onPick={handlePickBackground} />
}

export default BackgroundsTab
