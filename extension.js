const vscode = require('vscode');
const path = require('path');
const playSound = require('play-sound')();

let enableSounds = true;

function activate(context) {
  // Register a command to toggle sounds
  context.subscriptions.push(
    vscode.commands.registerCommand('myExtension.toggleSounds', () => {
      enableSounds = !enableSounds;
      vscode.window.showInformationMessage(`Sounds are now ${enableSounds ? 'enabled' : 'disabled'}.`);
    })
  );

  // Register a listener for file save events
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document) => {
      if (enableSounds) {
        const saveSoundPath = path.join(__dirname, 'sounds', 'save.mp3');
        playSound.play(saveSoundPath, (err) => {
          if (err) console.log('Error playing sound:', err);
        });
      }
    })
  );

  // Register a listener for push events
  context.subscriptions.push(
    vscode.workspace.onDidPush(() => {
      if (enableSounds) {
        const pushSoundPath = path.join(__dirname, 'sounds', 'push.mp3');
        playSound.play(pushSoundPath, (err) => {
          if (err) console.log('Error playing sound:', err);
        });
        vscode.window.showInformationMessage('Push successful!');
      }
    })
  );

  // Register a listener for hover events
  const disposableHover = vscode.languages.registerHoverProvider('*', {
    provideHover(document, position) {
      if (enableSounds) {
        const hoverSoundPath = path.join(__dirname, 'sounds', 'hover.mp3');
        playSound.play(hoverSoundPath, (err) => {
          if (err) console.log('Error playing sound:', err);
        });
      }
      return null;
    }
  });
  context.subscriptions.push(disposableHover);

  // Register a listener for error events
  const disposableError = vscode.languages.registerDiagnosticCollectionProvider('*', {
    onDidChangeDiagnostics(e) {
      if (enableSounds) {
        const errorSoundPath = path.join(__dirname, 'sounds', 'error.mp3');
        playSound.play(errorSoundPath, (err) => {
          if (err) console.log('Error playing sound:', err);
        });
      }
    }
  });
  context.subscriptions.push(disposableError);

  // Play a sound on extension activation
  const startupSoundPath = path.join(__dirname, 'sounds', 'startup.mp3');
  playSound.play(startupSoundPath, (err) => {
    if (err) console.log('Error playing sound:', err);
  });
}

function deactivate() {
  enableSounds = false;
}

module.exports = {
  activate,
  deactivate
};