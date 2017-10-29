'use babel';

import AutoreplaceView from './autoreplace-view';
import { CompositeDisposable } from 'atom';

export default {

  autoreplaceView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.autoreplaceView = new AutoreplaceView(state.autoreplaceViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.autoreplaceView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'autoreplace:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.autoreplaceView.destroy();
  },

  serialize() {
    return {
      autoreplaceViewState: this.autoreplaceView.serialize()
    };
  },

  toggle() {

    var exec = require('child_process').exec;
    path = require('path')

    let ed = atom.workspace.getActivePaneItem()
    file = ed.buffer.file
    filename = path.basename(file.path)

    let dictionary =
    {
      'ą' : 'ą',
      'ś' : 'ś',//ś
      'ó' : 'ó',
      'ć' : 'ć',//ć
      'ę' : 'ę',//ę
      'ń' : 'ń',//ń
      'ż' : 'ż',
      'ź' : 'ź'
    }

    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      var out = editor.getSelectedText()
      for(var key in dictionary) {
        out = out.replace(new RegExp(key, 'g'), dictionary[key]);
      }
      editor.insertText(out)
    }
  }
};
