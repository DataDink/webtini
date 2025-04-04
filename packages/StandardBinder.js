/**
 * @author Greenwald
 * @license PDL
 */
import Binder from '../src/Binder.js';
import TextBinder from '../src/TextBinder.js';
import TemplateBinder from '../src/TemplateBinder.js';
import EventBinder from '../src/EventBinder.js';
import StyleBinder from '../src/StyleBinder.js';
import ClassBinder from '../src/ClassBinder.js';
import AttributeBinder from '../src/AttributeBinder.js';

export default 
/**
 * @class StandardBinder
 * @description A standard binder with all the default extensions.
 */
class StandardBinder extends Binder {
  constructor(...extensions) {
    super(
      ...extensions,
      new TextBinder(),
      new TemplateBinder(),
      new EventBinder(),
      new StyleBinder(),
      new ClassBinder(),
      new AttributeBinder()
    );
  }
  static Extension = Binder.Extension;
}