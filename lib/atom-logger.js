'use babel';

import AtomLoggerView from './atom-logger-view';
import { CompositeDisposable } from 'atom';

export default {

  atomLoggerView: null,
  modalPanel: null,
  subscriptions: null,
  logsCounter: 0,
  points: [],
  handler: null,

  activate(state) {
    this.atomLoggerView = new AtomLoggerView(state.atomLoggerViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomLoggerView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-logger:toggle': () => this.toggle(),
      'atom-logger:showLogs': () => this.showLogs()
    }));

    this.handler = window.setInterval(() => this.sample(), 5000)
    this.points = []
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomLoggerView.destroy();
    window.clearInterval(handler)
  },

  serialize() {
    return {
      atomLoggerViewState: this.atomLoggerView.serialize()
    };
  },

  toggle() {
    const editor = atom.workspace.getActiveTextEditor()
    if (editor) {
      editor.onDidChange(() => {
        ++this.logsCounter
      })
    }
  },

  sample() {
    this.points.push(this.logsCounter)
    this.logsCounter = 0
  },

  showLogs() {
    if (this.modalPanel.isVisible()) {
      this.modalPanel.hide();
    } else {
      this.atomLoggerView.setPoints([...this.points]);
      this.modalPanel.show();
    }
  },
};
