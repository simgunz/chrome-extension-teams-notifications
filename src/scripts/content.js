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

chrome.storage.sync.get(defaultOptions, optionsFromStorageOrDefaults => {
  teamsExtension.options = optionsFromStorageOrDefaults;
  console.debug('Teams extension options', teamsExtension.options);

  createTeamsNotificationScript();
});

chrome.storage.onChanged.addListener((changes) => {
  console.log('Extension options changed:', changes);
  chrome.storage.sync.get(defaultOptions, optionsFromStorageOrDefaults => {
    teamsExtension.options = optionsFromStorageOrDefaults;
    sendOptionsToApplicationWindow();
  });
});
