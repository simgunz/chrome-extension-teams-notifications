const teamsExtension = {
  options: undefined
}

const sendOptionsToApplicationWindow = () => {
  console.debug('Sending extension options to application window', teamsExtension.options);
  window.postMessage({type : 'teams-extension-options', text: JSON.stringify(teamsExtension.options)}, "*");
}

const createTeamsNotificationScript = () => {
  // https://stackoverflow.com/a/9517879
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL('scripts/teams-notification.js');
  s.onload = function () {
    sendOptionsToApplicationWindow();
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
};

const createFocusLostHandler = windowId => () => {
  console.debug('Focus lost: ' + windowId);
  if (teamsExtension.options.switchToNewChatOnBlur) {
    // This timeout is necessary to be able to focus a Teams window by clicking its notification. Otherwise it just minimizes right away.
    setTimeout(() => {
      if (!document.hasFocus()) {
        // Don't switch to New Chat if there is a call is running
        const hangupButton = top.document.querySelector('iframe.embedded-page-content').contentDocument.getElementById('hangup-button');
        if (!hangupButton) {
          const buttonNewChat = top.document.querySelector('[title="Nuova chat (Alt+N)"]');
          if(buttonNewChat){
            const elemNewChat = document.querySelector('[data-tid="chat-li-entry-with-Nuova chat"]');
            if(elemNewChat){
              console.log('element newChat already present, no need to do nothing');
            } else {
              console.debug('click on buttonNewChat');
              buttonNewChat.click();
            }
          }
        } else {
          console.debug('There is running call, switching to New Chat is suspended');
        }
      }
    }, 10);
  } else {
    console.debug('Switching to New Chat is disabled in the extension options');
  }
};

window.addEventListener('load', () => {
  chrome.storage.sync.get(defaultOptions, optionsFromStorageOrDefaults => {
    teamsExtension.options = optionsFromStorageOrDefaults;
    console.debug('Teams extension options', teamsExtension.options);

    console.debug('Adding window blur listener');
    window.addEventListener('blur', createFocusLostHandler('main-window'));

    // The main window doesn't fire blur event if the focus was in an iframe. So add listeners to iframes as well.
    document.querySelectorAll('iframe').forEach(docIframe => {
      console.debug('Adding blur listener for iframe', docIframe.id);
      docIframe.contentWindow.addEventListener('blur', createFocusLostHandler('iframe#' + docIframe.id));
    });

    createTeamsNotificationScript();
  });

  chrome.storage.onChanged.addListener((changes) => {
    console.log('Extension options changed:', changes);
    chrome.storage.sync.get(defaultOptions, optionsFromStorageOrDefaults => {
      teamsExtension.options = optionsFromStorageOrDefaults;
      sendOptionsToApplicationWindow();
    });
  });
});