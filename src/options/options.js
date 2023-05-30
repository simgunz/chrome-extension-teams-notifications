// Saves options to chrome.storage
function saveOptions() {
  const options = {
    playNotificationSound: document.getElementById('playNotificationSound').checked,
    switchToNewChatOnBlur: document.getElementById('switchToNewChatOnBlur').checked,
  };

  console.log('Options to be saved', options);

  chrome.storage.sync.set(options, () => {
    console.log('Options saved');
    var status = document.getElementById('statusMessage');
    status.textContent = 'Options saved';
    setTimeout(() => { status.textContent = '' }, 1000);
  });
}

function restoreOptions() {
  // Use default value for minimizeWindow
  chrome.storage.sync.get(
    defaultOptions,
    options => {
      console.log('Options from storage or defaults', options);
      document.getElementById('playNotificationSound').checked = Boolean(options.playNotificationSound);
      document.getElementById('switchToNewChatOnBlur').checked = Boolean(options.switchToNewChatOnBlur);
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveButton')
  .addEventListener('click', saveOptions);
