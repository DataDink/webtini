import Binder from '../src/Binder.js';
import run from './run.js';

run('new Binder()', {Binder}, () => {
  assert.succeeds(() => { new Binder(); }, "new Binder w/ no arguments");
});

run('new Binder.Extension()', {Binder}, () => {
  assert.succeeds(() => { new Binder.Extension(); }, "new Binder.Extension w/ no arguments");
});

run('Binder.Extension.handleElement default false', {Binder}, () => {
  const extension = new Binder.Extension();
  assert.falsey(extension.handleElement(null, null, null), 'Extension.handleElement should default to false');
});

run('Binder.Extension.handleAttribute default false', {Binder}, () => {
  const extension = new Binder.Extension();
  assert.falsey(extension.handleAttribute(null, null, null, null, null), 'Extension.handleAttribute should default to false');
});


