// storage.js: the ONLY file that knows where data is saved.
// For now that's localStorage. Later this can call a server instead.

export function loadData(key) {
  const saved = localStorage.getItem(key);

  if (saved) {
    return JSON.parse(saved);
  } else {
    return null;
  }
}

export function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
