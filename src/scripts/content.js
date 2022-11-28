// https://stackoverflow.com/a/9517879
const s = document.createElement('script');
s.src = chrome.runtime.getURL('scripts/teams-notification.js');
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);
