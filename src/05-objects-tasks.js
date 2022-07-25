/* eslint-disable no-param-reassign */
/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const objects = JSON.parse(json);
  const value = Object.values(objects);
  return new proto.constructor(...value);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

function SimpleSelector() {
  this.data = {
    element: null,
    id: null,
    class: [],
    attr: [],
    pseudoClass: [],
    pseudoElement: null,
  };

  this.currentStage = 0;
  this.unChangeableFieldes = [1, 2, 6];
}

SimpleSelector.prototype = {
  checkSequence(index) {
    if (this.unChangeableFieldes.indexOf(index) !== -1 && this.currentStage === index) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    if (index < this.currentStage) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.currentStage = index;
  },

  element(value) {
    this.checkSequence(1);
    this.data.element = value;

    return this;
  },

  id(value) {
    this.checkSequence(2);
    this.data.id = value;

    return this;
  },

  class(value) {
    this.checkSequence(3);
    this.data.class.push(value);

    return this;
  },

  attr(value) {
    this.checkSequence(4);
    this.data.attr.push(value);

    return this;
  },

  pseudoClass(value) {
    this.checkSequence(5);
    this.data.pseudoClass.push(value);

    return this;
  },

  pseudoElement(value) {
    this.checkSequence(6);
    this.data.pseudoElement = value;

    return this;
  },

  stringifyItem(items, before, after) {
    items = items || [];

    if (!Array.isArray(items) && items != null) items = [items];

    return items.reduce((prev, curr) => prev + before + curr + after, '');
  },

  stringify() {
    const d = this.data;

    return this.stringifyItem(d.element, '', '')
          + this.stringifyItem(d.id, '#', '')
          + this.stringifyItem(d.class, '.', '')
          + this.stringifyItem(d.attr, '[', ']')
          + this.stringifyItem(d.pseudoClass, ':', '')
          + this.stringifyItem(d.pseudoElement, '::', '');
  },
};

function CombinedSelector(selector1, combinator, selector2) {
  this.data = {
    selector1,
    combinator,
    selector2,
  };
}

CombinedSelector.prototype = {
  stringify() {
    return `${this.data.selector1.stringify()} ${this.data.combinator} ${this.data.selector2.stringify()}`;
  },
};

const cssSelectorBuilder = {
  element(value) {
    return new SimpleSelector().element(value);
  },

  id(value) {
    return new SimpleSelector().id(value);
  },

  class(value) {
    return new SimpleSelector().class(value);
  },

  attr(value) {
    return new SimpleSelector().attr(value);
  },

  pseudoClass(value) {
    return new SimpleSelector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new SimpleSelector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new CombinedSelector(selector1, combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
