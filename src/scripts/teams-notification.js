const currentScriptSrc = document.currentScript.src;
const extensionRoot = currentScriptSrc.split('/').slice(0, -2).join('/');
const audioUrl = extensionRoot + '/sounds/teams-notification.mp3';
const audio = new Audio(audioUrl);

function playNotificationSound() {
  audio.play();
}

function extend(cls) {
  function new_constructor(...args) {
    playNotificationSound();
    new cls(...args);
  }
  new_constructor.prototype = Object.create(cls.prototype);
  return new_constructor;
}

window.Notification = extend(window.Notification);
