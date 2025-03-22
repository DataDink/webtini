/**
 * @author Greenwald
 * @license PDL
 */
import Binder from './src/Binder.js';
import TemplateBinder from './src/TemplateBinder.js';
import EventBinder from './src/EventBinder.js';
import StyleBinder from './src/StyleBinder.js';
import ClassBinder from './src/ClassBinder.js';
import AttributeBinder from './src/AttributeBinder.js';

/**
 * @class StandardBinder
 * @description A standard binder with all the default extensions.
 */
export default class StandardBinder extends Binder {
  constructor() {
    super(
      new TemplateBinder(),
      new EventBinder(),
      new StyleBinder(),
      new ClassBinder(),
      new AttributeBinder()
    );
  }
}