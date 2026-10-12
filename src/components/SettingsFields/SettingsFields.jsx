// SettingsFields: draws a settings form from a plain list of fields.
// Every App describes its settings in its app.config.js, and this file turns
// that list into real controls. Adding a setting means adding one line of data,
// not writing a new form.
//
// A field looks like this:
//   { key: 'showDate', label: 'Show the date', type: 'toggle' }
//   { key: 'focusMinutes', label: 'Focus minutes', type: 'number', min: 1, max: 120 }
//   { key: 'label', label: 'Label', type: 'text' }
//   { key: 'size', label: 'Text size', type: 'choice', options: [{ value: 'm', name: 'Medium' }] }
import './SettingsFields.css'

function SettingsFields({ fields, values, onChange }) {
  function handleChange(key, value) {
    onChange({ ...values, [key]: value })
  }

  const rows = fields.map(function (field) {
    const value = values[field.key]
    let control = null

    if (field.type === 'toggle') {
      control = (
        <input
          key={field.key}
          className="settings-field-toggle"
          type="checkbox"
          checked={value}
          onChange={function (event) {
            handleChange(field.key, event.target.checked)
          }}
        />
      )
    } else if (field.type === 'number') {
      control = (
        <input
          key={field.key}
          className="settings-field-input"
          type="number"
          value={value}
          min={field.min}
          max={field.max}
          onChange={function (event) {
            // An empty box gives an empty string, so fall back to the smallest allowed number.
            const typed = Number(event.target.value)

            if (Number.isNaN(typed)) {
              handleChange(field.key, field.min)
            } else {
              handleChange(field.key, typed)
            }
          }}
        />
      )
    } else if (field.type === 'text') {
      control = (
        <input
          key={field.key}
          className="settings-field-input"
          type="text"
          value={value}
          placeholder={field.placeholder}
          onChange={function (event) {
            handleChange(field.key, event.target.value)
          }}
        />
      )
    } else if (field.type === 'choice') {
      const options = field.options.map(function (option) {
        return (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        )
      })

      control = (
        <select
          key={field.key}
          className="settings-field-input"
          value={value}
          onChange={function (event) {
            handleChange(field.key, event.target.value)
          }}
        >
          {options}
        </select>
      )
    } else {
      // Unknown field type: show nothing rather than crashing.
      control = null
    }

    return (
      <label key={field.key} className="settings-field">
        <span className="settings-field-label">{field.label}</span>
        {control}
      </label>
    )
  })

  return <div className="settings-fields">{rows}</div>
}

export default SettingsFields
