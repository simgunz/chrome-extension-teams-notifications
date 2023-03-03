const currentScriptSrc = document.currentScript.src;
const extensionRoot = currentScriptSrc.split('/').slice(0, -2).join('/');
const audioUrl = extensionRoot + '/sounds/teams-notification.mp3';
const audio = new Audio(audioUrl);

const teamsExtension = {
  options: undefined
};

function playNotificationSound() {
  if (teamsExtension.options.playNotificationSound) {
    audio.play();
  }
}

function extend(cls) {
  function new_constructor(...args) {
    playNotificationSound();
    new cls(...args);
  }
  new_constructor.prototype = Object.create(cls.prototype);
  return new_constructor;
}

window.addEventListener("message", (event) => {
  // We only accept messages from ourselves
  if (event.source !== window) {
    return;
  }

  if (event.data.type && (event.data.type === "teams-extension-options")) {
    console.debug("Teams extension options received: " + event.data.text);
    if (event.data.text) {
      const options = JSON.parse(event.data.text);
      if (!teamsExtension.options) {
        window.Notification = extend(window.Notification);
      }
      teamsExtension.options = options;
    }
  }
}, false);
