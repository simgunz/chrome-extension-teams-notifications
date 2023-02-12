let defaultOptions = {
  minimizeWindow: true
};

const minimizeCurrentWindowListener = (request, sender, sendResponse) => {
  console.debug('Message received: ' + request.action);
  if (request && request.action === 'minimizeCurrentWindow') {
    chrome.storage.sync.get(defaultOptions, extensionOptions => {
      if (extensionOptions.minimizeWindow) {
        chrome.windows.get(sender.tab.windowId, { populate: true }).then(senderWindow => {
          if (senderWindow.tabs.length === 1) {
            console.debug('Trying to minimize current window: ' + sender.tab.windowId);
            chrome.windows.update(senderWindow.id, { state: 'minimized' })
            .then(() => {
              console.debug('Window ' + senderWindow.id + ' minimized');
              sendResponse();
            });
          } else {
            console.debug('Current window has ' + senderWindow.tabs.length + ' - it will not be minimized');
          }
        });
      } else {
        console.debug('Minimizing Teams window is disabled in the extension options');
      }
    });
  }
  return true;
};

chrome.runtime.onMessage.addListener(minimizeCurrentWindowListener);
