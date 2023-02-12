// https://stackoverflow.com/a/9517879
const s = document.createElement('script');
s.src = chrome.runtime.getURL('scripts/teams-notification.js');
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);

const createFocusLossHandler = windowId => { 
  return () => {
    if (!document.hasFocus()) {
      console.debug('Trying to minimize current window. Origin: ' + windowId);
      chrome.runtime.sendMessage(
        {
          action: 'minimizeCurrentWindow'
        },
        () => console.debug('Window minimized - confirmed'));
    }
  };
};

window.addEventListener('blur', createFocusLossHandler('main-window'));

// The main window doesn't fire blur event if the focus was in an iframe. So add listeners to iframes as well.
window.addEventListener('load', () => {
  console.debug('Searching for iframes');
  document.querySelectorAll('iframe').forEach(docIframe => {
    console.debug('Adding blur listener for iframe', docIframe.src);
    docIframe.contentWindow.addEventListener('blur', createFocusLossHandler('iframe#' + docIframe.id));
  })
});
