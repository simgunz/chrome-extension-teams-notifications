// Saves options to chrome.storage
function saveOptions() {
  var minimizeWindow = document.getElementById('minimizeWindow').checked;

  const options = {
    minimizeWindow: minimizeWindow
  };

  console.debug('Options to be saved', options);

  chrome.storage.sync.set(options, () => {
    console.debug('Options saved');
    var status = document.getElementById('statusMessage');
    status.textContent = 'Options saved';
    setTimeout(() => { status.textContent = '' }, 1000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
  // Use default value for minimizeWindow
  chrome.storage.sync.get(
    { minimizeWindow: true },
    options => {
      console.debug('Options from storage or defaults', options);
      document.getElementById('minimizeWindow').checked = Boolean(options.minimizeWindow);
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveButton')
  .addEventListener('click', saveOptions);
