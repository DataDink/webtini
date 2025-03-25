/**
 * @author Greenwald
 * @license PDL
 */
import Binder from './src/Binder.js';
import TemplateBinder from './src/TemplateBinder.js';
import EventBinder from './src/EventBinder.js';

/**
 * @class MinimalBinder
 * @description A minimal binder with only the basic extensions needed for content generation and interactivity.
 */
export default class MinimalBinder extends Binder {
  constructor(...extensions) {
    super(
      ...extensions,
      new TemplateBinder(),
      new EventBinder(),
    );
  }
}