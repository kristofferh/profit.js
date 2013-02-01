// Namespace
var Profit = Profit || {};

/**
 * Various common helper and convenience methods. These methods (other than
 * __bind) depend on ES5 or an ES5 shim.
 * Methods with double underscores are named thusly to not interfere with ES5
 * functions. Many of these are inspired, and sometimes copied directly, from
 * Prototype and jQuery. Or from Dan Dean's Pants library:
 * https://github.com/dandean/element-pants/blob/master/index.js
 * @TODO: Split this out into modules (dom, string, object, ajax, etc).
 * and make it a CommonJS module so it can be included with require shims.
 */
Profit.$ = {


    /**************************************************************************
     * FUNCTION HELPERS
     **************************************************************************/

    /**
     * Bind a function to scope.
     * @param {Function} fn Name of the function to bind.
     * @param {Object} scope Scope to bind to.
     * @return {Function} The bound function.
     */
    __bind: function(fn, scope) {
        return function() {
            return fn.apply(scope, arguments);
        };
    },

    /**************************************************************************
     * STRINGS
     **************************************************************************/

    /**
     * Capitalize string.
     * @param {String} str Input string.
     * @return {String} Capitalized return.
     */
    capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Camelize a string. Turns a string like `margin-top` into `marginTop`.
     * @param {String} str The original string.
     * @return {String} Camelized string.
     */
    camelize: function(str) {
        return str.replace(/-+(.)?/g, function(match, chr) {
            return chr ? chr.toUpperCase() : '';
        });
    },
  
    /**
     * Truncate a string to a set length.
     * @param {String} str The original string.
     * @param {Number} length Max number of characters in string.
     * @return {String} Truncated string.
     */
    truncate: function(str, length) {
        return str.substring(0, Math.min(length, str.length));
    },


    /**
     * Trim whitespace from string.
     * @param {String} str String we want to prune.
     * @return {String} The trimmed string.
     */
    trim: function(str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    },

    /**
     * Format file size in something more user friendly than 1373454 bytes.
     * @param {Number} bytes Number of bytes to format.
     * @return {String} Friendly string representation of bytes.
     */
    format_file_size: function (bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }
        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }
        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }
        return (bytes / 1000).toFixed(2) + ' KB';
    },

    /**************************************************************************
     * DOM
     **************************************************************************/

    hasLocalStorage: function() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    },

    /**
     * Check if an element matches the supplied CSS selector.
     * @param {Element} el The DOM element.
     * @param {String} selector Selector to match.
     * @return {Boolean}
     */
    matchesSelector: function(el, selector) {
        var slice = Array.prototype.slice;
        var proto = (typeof Element !== 'undefined') ? Element.prototype : {};
        // Check for native `matchesSelector` method.
        var matchesSelector =   proto.matchesSelector ||
                                proto.webkitMatchesSelector ||
                                proto.mozMatchesSelector ||
                                proto.msMatchesSelector ||
                                proto.oMatchesSelector;

        if (!matchesSelector) {
            // No native `matchesSelector` method. Make our own.
            matchesSelector = function(selector) {
                var matches = this.parentNode.querySelectorAll(selector);
                return slice.call(matches).indexOf(this) > -1;
            };
        }
        
        return matchesSelector.call(el, selector);
    },

    /**
     * Alias of document.querySelector.
     * @param {String} selector CSS Selector.
     * @return {Node} Matched element.
     */
    find: function(selector) {
        return document.querySelector(selector);
    },

    /**
     * Alias of document.querySelectorAll.
     * @param {String} selector CSS Selector.
     * @return {NodeList} Matched elements.
     */
    findAll: function(selector) {
        return document.querySelectorAll(selector);
    },

    /**
     * Hide an element.
     * @param {Node} el Element to hide.
     */
    hide: function(el) {
        el.style.display = 'none';
    },

    /**
     * Show an element.
     * @param {Node} el Element to show.
     */
    show: function(el) {
        el.style.display = '';
    },

    /**
     * Get `style` from the element's computed style.
     * @param {Element} el The element.
     * @param {String} style The name of the style to get.
     * @return {String} Value of style.
     */
    getStyle: function(el, style) {
        style = style == 'float' ? 'cssFloat' : this.camelize(style);
        var value = el.style[style];
        if (!value || value == 'auto') {
            var css = window.getComputedStyle(el, null);
            value = css ? css[style] : null;
        }
        if (style == 'opacity') return value ? parseFloat(value) : 1.0;
        return value == 'auto' ? null : value;
    },

    /**
     * Get outerHeight (height + padding + border and optionally margin) of an
     * element.
     * @param {Element} el Element to get outerHeight of.
     * @param {Boolean} margin Should we include margin?
     */
    outerHeight: function(el, margin) {
        // Height.
        var combined = parseFloat(this.getStyle(el, 'height'), 10);
        // Borders.
        combined += parseFloat(this.getStyle(el, 'border-top-width'), 10);
        combined += parseFloat(this.getStyle(el, 'border-bottom-width'), 10);
        // Padding.
        combined += parseFloat(this.getStyle(el, 'padding-top'), 10);
        combined += parseFloat(this.getStyle(el, 'padding-bottom'), 10);
        if(margin) {
            // Margin.
            combined += parseFloat(this.getStyle(el, 'margin-top'), 10);
            combined += parseFloat(this.getStyle(el, 'margin-bottom'), 10);
        }
        return combined;
    },

    /**
     * Get outerWidth (width + padding + border and optionally margin) of an
     * element.
     * @param {Element} el Element to get outerHeight of.
     * @param {Boolean} margin Should we include margin?
     */
    outerWidth: function(el, margin) {
        // Width.
        var combined = parseFloat(this.getStyle(el, 'width'), 10);

        // Borders.
        combined += parseFloat(this.getStyle(el, 'border-left-width'), 10);
        combined += parseFloat(this.getStyle(el, 'border-right-width'), 10);
        // Padding.
        combined += parseFloat(this.getStyle(el, 'padding-left'), 10);
        combined += parseFloat(this.getStyle(el, 'padding-right'), 10);
        if(margin) {
            // Margin.
            combined += parseFloat(this.getStyle(el, 'margin-right'), 10);
            combined += parseFloat(this.getStyle(el, 'margin-left'), 10);
        }
        return combined;
    },

    /**
     * Sets `style` on the element's style attribute.
     * @param {Element} el The element.
     * @param {String} style The name of the style to set.
     * @param {String} val Value of style.
     */
    setStyle: function(el, name, val) {
        var styles;

        if (arguments.length == 3) {
            // Two args (not counting el), name and value given.
            styles = name + ':' + val + ';';
        } else if (arguments.length == 2 && typeof name === 'string') {
            // One arg, and it's a string. Must be string of CSS.
            styles = name;
        }

        var style = el.style;

        if (styles) {
            style.cssText += ';' + styles;
        }

        // Single argument which is not a string: must be an object of
        // key/value pairs.
        styles = name;
        for (var property in styles) {
            style[
                (property == 'float' || property == 'cssFloat') ?
                    ((typeof style.styleFloat == 'undefined') ?
                            'cssFloat' : 'styleFloat') :
                property
            ] = styles[property];
        }

    },

    /**
     * Returns siblings.
     * @param {Node} cur Current node.
     * @param {String} dir Direction: previous or next... example 'nextSibling'.
     * @return {Node|null} Sibling node.
     */
    sibling: function(cur, dir) {
        do {
            cur = cur[dir];
        } while (cur && cur.nodeType !== 1);

        return cur;
    },

    /**
     * Returns next element.
     * @param {Node} el Element to act on.
     * @return {Node|null} Next node.
     */
    next: function(el) {
        return this.sibling(el, "nextSibling");
    },

    /**
     * Find previous element.
     * @param {Node} el Element to act on.
     * @return {Node|null} Previous node.
     */
    previous: function(el) {
        return this.sibling(el, "previousSibling");
    },

    /**
     * Find child element nodes (only returns element nodes, skips others).
     * @param {Node} el Element to act on.
     * @return {Array} Array of child nodes.
     */
    children: function(el) {
        var kids = el.childNodes;
        var nodes = [];
        for(var i = 0, l = kids.length; i < l; i++) {
            if(kids[i] && kids[i].nodeType === 1) {
                nodes.push(kids[i]);
            }
        }
       return nodes;
    },

    /**
     * Determine if element has CSS class property.
     * @param {DOMElement} el Element to inspect.
     * @param {String} cls Class name to check for.
     * @return {Boolean} Yep or Nope.
     */
    hasClass: function(el, name) {
        return new RegExp('(\\s|^)' + name + '(\\s|$)').test(el.className);
    },

    /**
     * Add a CSS 'class' to an element.
     * @param {DOMElement} el Element to add class to.
     * @param {String} cls Class name to add.
     */
    addClass: function(el, cls) {
        if(!this.hasClass(el,cls)) el.className += " " + cls;
    },

    /**
     * Remove a CSS class property from element.
     * @param {DOMElement} el Element to remove class from.
     * @param {String} cls Class name to remove from element.
     */
    removeClass: function(el, cls) {
        if(this.hasClass(el,cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            el.className = el.className.replace(reg, ' ');
            el.className = this.trim(el.className);
        }
    },

    /**
     * Toggle class.
     * @param {DOMElement} el Element to toggle class on.
     * @param {String} cls Class name to toggle.
     */
    toggleClass: function(el, cls) {
        if(this.hasClass(el, cls)) {
            this.removeClass(el, cls);
        } else {
            this.addClass(el, cls);
        }
    },

    /**
     * Creates a new Element.
     * @param {String} tag Element tag name.
     * @param {Object} attributes Optional hash of Element attributes.
     * @param {String|Node} content Optional content to insert into new element.
     * @return {Node} New element.
     * @TODO: Test this more, feels brittle.
     */
    create: function(name, attributes, content) {
        var element = document.createElement(name);
        var contentIsNode = content &&
            (content.nodeType === 1 || content.nodeType === 3);
        var contentIsString = (typeof content === 'string');

        if (attributes) {
            for (var key in attributes) {
                element.setAttribute(key, attributes[key]);
            }
        }

        if (content) {
            if (contentIsString) {
                element.innerHTML = content;
            } else if (contentIsNode) {
                element.appendChild(content);
            }
        }

        return element;
    },

    /**
     * Insert a node into the DOM at a given position.
     * @param {Element} el Where in the DOM to inset the element.
     * @param {Node} node Node to insert.
     * @param {String|Undefined} position Optional position to insert node at.
     * - bottom (default)
     * - before
     * - after
     * - top
     * @return {Node} New element.
     */
    insert: function(el, node, position) {
        switch(position) {
            case 'before':
                el.parentNode.insertBefore(node, el);
                break;
            case 'top':
                el.insertBefore(node, el.firstChild);
                break;
            case 'after':
                el.parentNode.insertBefore(node, el.nextSibling);
                break;
            default:
                el.appendChild(node);
                break;
        }
    },

    /**************************************************************************
     * EVENTS
     **************************************************************************/

    /**
     * Provide DOM event observing with optional event delegation when `selector`
     * is provided.
     * @param {Element} el Element to bind event to.
     * @param {String} eventName DOM Event Name to listen to.
     * @param {String} selector Optional CSS Selector.
     * @param {Function} handler Event handler.
     *
     * Unlike `addEventListener` API, the handler function is bound to the
     * scope of the matched element, so `this` within the handler will refer
     * to the element. For directly bound events this is the element where
     * the event was attached and for delegated events this is an element
     * matching selector. Note that this may not be equal to event.target if
     * the event has bubbled from a descendant element.
     *
     * To prevent memory leaks, always call `Profit.$.off` before removing
     * an element from the DOM.
     * @todo: Add namespaced events.
     */
    on: function(el, eventName, selector, handler) {
        var scope = this,
            wrappedHandler;

        if (!this.__registry__) {
            // Lazily create the event registry.
            Object.defineProperty(this, '__registry__', {
                value: [],
                configurable: false,
                enumerable: false,
                writable: true
            });
        }
        
        if (typeof selector === 'string' && arguments.length === 4) {
            wrappedHandler = function(e) {
                var match = null;
                var stop = false;
                if (selector) {
                    var current = e.target;
                    while(current !== scope && match === null && stop === false) {
                        if (Profit.$.matchesSelector(current, selector)) {
                            match = current;
                        } else {
                            if(current.parentNode && current.parentNode.nodeType !== 9) {
                                current = current.parentNode;
                            } else {
                                stop = true;
                            }
                        }
                    }
                    if (match) handler.call(match, e);
                }
            };
        } else if(typeof selector === 'function') {
            wrappedHandler = function(e) {
                selector.call(el, e);
            };
        }

        this.__registry__.push([el, eventName, selector, handler, wrappedHandler]);
        el.addEventListener(eventName, wrappedHandler, false);
    },

    /**
     * Removes DOM event observes for the element. When called without
     * additional arguments, all event handlers are removed from element.
     * @param {Element} el Element to remove listener from.
     * @param {String} eventName DOM event name to remove.
     * @param {Function} handler Event handler method.
     *
     */
    off: function(el, eventName, handler) {
        if (!this.__registry__) return;
        var group;
        if (arguments.length === 1) {
            // Remove all event listeners bound to this element.
            var length = this.__registry__.length;
            while(length--) {
                group = this.__registry__[length];
                if(group[0] === el) {
                    el.removeEventListener(group[1], group[4], false);
                    this.__registry__.splice(length, 1);
                }
            }
            return;
        }

        // @TODO: remove events on event delegated selectors.
        for (var i = 0; i < this.__registry__.length; i++) {
            group = this.__registry__[i];
            if (group[1] == eventName && group[2] == handler) {
                el.removeEventListener(eventName, group[4], false);
                var rest = this.__registry__.slice(i+1);
                this.__registry__.length = i;
                this.__registry__.push.apply(this.__registry__, rest);
                break;
            }
        }
    },

    /**
     * Decide which transition end event to use, if any.
     * @return {String|Boolean} The name of the transition event, or false if
     * no event found.
     */
    transEndEvent: function() {
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
          'transition': 'transitionEnd',
          'OTransition': 'oTransitionEnd',
          'MSTransition': 'msTransitionEnd',
          'MozTransition': 'transitionend',
          'WebkitTransition': 'webkitTransitionEnd'
        };

        for(t in transitions){
            if( el.style[t] !== undefined ) {
                return transitions[t];
            }
        }

        // No transition end event available.
        return false;
    },

    /**
     * Check if event ('click', 'mouseenter', 'hashchange', etc) is supported.
     * Source: http://kangax.github.com/iseventsupported/
     * @param {String} eventName Event to check for.
     * @param {Element} Optional element to test on.
     * @return {Boolean} Yep or nope.
     */
    isEventSupported: function(eventName, element) {

        var TAGNAMES = {
            'select':'input','change':'input',
            'submit':'form','reset':'form',
            'error':'img','load':'img','abort':'img'
        };

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;
        
        var isSupported = (eventName in element);
        
        if (!isSupported) {
          // if it has no `setAttribute` (i.e. doesn't implement Node
          // interface), try generic element.
          if (!element.setAttribute) {
            element = document.createElement('div');
          }
          if (element.setAttribute && element.removeAttribute) {
            element.setAttribute(eventName, '');
            isSupported = typeof element[eventName] == 'function';

            // if property was created, "remove it" (by setting value
            // to `undefined`).
            if (typeof element[eventName] != 'undefined') {
              element[eventName] = undef;
            }
            element.removeAttribute(eventName);
          }
        }
        
        element = null;
        return isSupported;
  }
};