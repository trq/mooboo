/* =========================================================
 * bootstrap-modal.js v2.2.2
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

Element.implement ({
    modal: function(options) {
        if ( this.retrieve('modal') === null ) {
            this.store('modal', new Modal (options, this));
        }
        return this.retrieve('modal');
    }
});

Modal = new Class({
    Implements: [Options, Events],
    options: {
        backdrop:   true,   // Includes a modal-backdrop element. Alternatively, specify static for a backdrop which doesn't close the modal on click.
        keyboard:   true,   // Closes the modal when escape key is pressed
        show:       true,   // Shows the modal when initialized.
        remote:     false,   // If a remote url is provided, content will be loaded via jQuery's load method and injected into the .modal-body. If you're using the data api, you may alternatively use the href tag to specify the remote source. An example of this is shown below:
                            // <a data-toggle="modal" href="remote.html" data-target="#modal">click me</a>
        target:     false
    },
    initialize: function (options, selector) {
        this.browser_transition_end = this.browserTransitionEnd();

        this.selector = selector;
        this.setOptions(options);               // Merge passed options to this.options
        this.setOptions(this.getDataOptions(selector)); // Merge Data- Options to this.options

        if (this.selector.get('href')) {
            var href = this.selector.get('href');

            // If href does not start with a selector for ID or class, assume remote.
            if (href[0] != '#' || '.') {
                this.options.remote = href;
                this.selector.set('href', null);
            } else {
                this.options.target = href;
            }
        }

        if (!this.options.target) {
            return false; // No modal target? iono what to do!
        } else {
            this.element = $(document.body).getElement(this.options.target);
        }



        // Listen on Modal for data-dismiss=modal click
        this.element.addEvent('click:relay([data-dismiss=modal])', function(event) {
            this.hide(event);
        }.bind(this));

        if (this.options.remote && this.element.getElement('.modal-body')) {
            this.element.getElement('.modal-body').load(this.options.remote);
        }

        if (this.options.show) {
            this.show();
        }
    },

    toggle: function () {
        if (this.isShown) {
            this.hide();
        } else {
            this.show();
        }
    },

    show: function () {
        e = new Event.Mock(this.element, 'show');
        this.element.fireEvent('show', e);

        if (this.isShown || e.isDefaultPrevented()) {
            return;
        }

        this.isShown = true;

        this.escape();

        this.backdrop(function () {
            var transition = this.browser_transition_end && this.element.hasClass('fade');

            if (!this.element.getParent().length) {
                // don't move modals dom position
                this.element.inject($(document.body));
            }

            this.element.show();

            if (transition) {
                this.element.offsetWidth; // apparently forces reflow
            }

            this.element.addClass('in').set('aria-hidden', false);

            this.enforceFocus();

            if (transition) {
                var eventFunctionShowModal = function () {
                    clearTimeout(timeout);
                    this.element.removeEventListener(this.browser_transition_end, eventFunctionShowModal);
                    this.focusElement();
                    this.element.fireEvent('shown');
                }.bind(this);

                /* Timeout Function catches if event transition not picked up! */
                var timeout = setTimeout(function () {
                    this.element.removeEventListener(this.browser_transition_end, eventFunctionShowModal);
                    this.focusElement();
                    this.element.fireEvent('shown');
                }.bind(this), 500);

                this.element.addEventListener(this.browser_transition_end, eventFunctionShowModal);

            } else {
                this.focusElement();
                this.element.fireEvent('shown');
            }

        }.bind(this));
    },

    focusElement: function () {
        if (this.isShown) {
            this.element.setAttribute('tabIndex', 1);
            this.element.focus();
        } else {
            this.element.setAttribute('tabIndex', -1);
        }
    },

    hide: function (e) {
        e && e.preventDefault();

        e = new Event.Mock(this.element, 'hide');
        this.element.fireEvent('hide', e);

        if (!this.isShown || e.isDefaultPrevented()) {
            return;
        }

        this.isShown = false;

        this.escape();

        $(document.body).removeEvent('focus:relay(.modal)');

        this.element.removeClass('in').set('aria-hidden', true);

        if (this.browser_transition_end && this.element.hasClass('fade')) {
            this.hideWithTransition();
        } else {
            this.hideModal();
        }
    },

    enforceFocus: function () {
        $(document.body).addEvent('focus:relay(.modal)', function (e) {
            if (this.element !== e.target && !this.element.contains(e.target)) {
                this.focusElement();
            }
        }.bind(this));
    },

    escape: function () {
        if (this.isShown && this.options.keyboard) {
            this.element.addEvent('keyup', function (e) {
                if (e.key == 'esc') {
                    this.hide();
                }
            }.bind(this));
        } else if (!this.isShown) {
            this.element.removeEvent('keyup');
        }
    },

    hideWithTransition: function () {
        var eventFunctionHideModal = function () {
            clearTimeout(timeout);
            this.element.removeEventListener(this.browser_transition_end, eventFunctionHideModal);
            this.hideModal();
        }.bind(this);

        /* Timeout Function catches if event transition not picked up! */
        var timeout = setTimeout(function () {
            this.element.removeEventListener(this.browser_transition_end, eventFunctionHideModal);
            this.hideModal();
        }.bind(this), 500);

        this.element.addEventListener(this.browser_transition_end, eventFunctionHideModal);
    },

    hideModal: function () {
        this.element.hide();

        if (this.browser_transition_end) {
            this.element.fireEvent('hidden', null, 500);
        } else {
            this.element.fireEvent('hidden');
        }

        this.backdrop();
    },

    removeBackdrop: function () {
        this.backdrop_element.dispose();
        this.backdrop_element = null;
    },

    backdrop: function (callback) {
        var timeout, eventFunctionHideBackdrop;
        var animate = this.element.hasClass('fade') ? 'fade' : '';

        doAnimate = this.browser_transition_end && animate;

        if (this.isShown && this.options.backdrop) {

            this.backdrop_element = new Element('div', {'class': 'modal-backdrop ' + animate});
            $(document.body).grab(this.backdrop_element);

            if (this.options.backdrop == 'static') {

                this.backdrop_element.addEvent('click', function () {
                    this.focusElement();
                }.bind(this));

            } else {

                this.backdrop_element.addEvent('click', function () {
                    this.hide();
                }.bind(this));

            }

            if (doAnimate) {
                this.backdrop_element.offsetWidth; // apparently forces reflow
            }

            this.backdrop_element.addClass('in');

            if (doAnimate) {
                eventFunctionHideBackdrop = function () {
                    clearTimeout(timeout);
                    this.backdrop_element.removeEventListener(this.browser_transition_end, eventFunctionHideBackdrop);
                    callback();
                }.bind(this);

                /* Timeout Function catches if event transition not picked up! */
                timeout = setTimeout(function () {
                    this.backdrop_element.removeEventListener(this.browser_transition_end, eventFunctionHideBackdrop);
                    callback();
                }.bind(this), 500);

                this.backdrop_element.addEventListener(this.browser_transition_end, eventFunctionHideBackdrop);
            } else {
                callback();
            }

        } else if (callback) {

            callback();

        } else if (!this.isShown && this.backdrop_element) {

            this.backdrop_element.removeClass('in');

            if (doAnimate) {
                eventFunctionHideBackdrop = function () {
                    clearTimeout(timeout);
                    this.backdrop_element.removeEventListener(this.browser_transition_end, eventFunctionHideBackdrop);
                    this.removeBackdrop();
                }.bind(this);

                /* Timeout Function catches if event transition not picked up! */
                timeout = setTimeout(function () {
                    this.backdrop_element.removeEventListener(this.browser_transition_end, eventFunctionHideBackdrop);
                    this.removeBackdrop();
                }.bind(this), 500);

                this.backdrop_element.addEventListener(this.browser_transition_end, eventFunctionHideBackdrop);

            } else {
                this.removeBackdrop();
            }

        } else if (callback) {

            callback();

        }
    },

    /**
     * Get Options set on the Element via the dataset tags, data-animation etc.
     * @return object Key Value pair object of dataset tags.
     */
    getDataOptions: function (selector) {
        var dataset_name;
        var dataset_value;
        var options = {};
        var element = selector;

        if (typeof element.dataset != 'undefined') {

            for (dataset_name in element.dataset) {

                dataset_value = this.trueValue( element.dataset[dataset_name] );

                options[dataset_name] = dataset_value;
            }

            return options;

        } else if (Browser.ie) {

            // Cycle through options name to find data-<name> values where dataset is not available to us.
            for (dataset_name in this.options) {

                if (element.get('data-' + dataset_name)) {

                    options[dataset_name] = this.trueValue( element.get('data-' + dataset_name) );

                }

            }

            return options;

        } else {

            // Can't find data options, return empty object
            return {};

        }
    },

    /**
     * trueValue convert strings to their literals.
     * @param  string value String Value to convert to literal
     * @return mixed        Literal value of string where applicable, or the string.
     */
    trueValue: function (value) {
        if (value == 'true') {
            return true;
        } else if (value == 'false') {
            return false;
        } else if (value == 'null') {
            return null;
        } else {
            return value;
        }
    },

    /**
     * Find the supported browser transition end event name.
     * @return mixed false on unsupported, or string of the event name
     */
    browserTransitionEnd: function (){
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
          'transition':'transitionEnd',
          'OTransition':'oTransitionEnd',
          'MSTransition':'msTransitionEnd',
          'MozTransition':'transitionend',
          'WebkitTransition':'webkitTransitionEnd'
        };

        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }

        return false;
    }

});

/**
 * http://davidwalsh.name/mootools-event
 * creates a Mock event to be used with fire event
 * @param Element target an element to set as the target of the event - not required
 *  @param string type the type of the event to be fired. Will not be used by IE - not required.
 *
 */
Event.Mock = function(target,type){
    var e = window.event;
    type = type || 'click';

    if (document.createEvent){
        e = document.createEvent('HTMLEvents');
        e.initEvent(
          type, //event type
          false, //bubbles - set to false because the event should like normal fireEvent
          true //cancelable
        );
    }
    e = new Event(e);
    e.target = target;
    return e;
};

Event.implement({
    isDefaultPrevented: function () {
        return this.event.defaultPrevented;
    }
});

/**
 * Seek out all data-toggle=modal elements, and if they have data-target="#foo" or href="#foo" - that's our target modal.
 * @return void
 */
window.addEvent('domready', function() {
    $(document.body).getElements('[data-toggle=modal]').each(function (element) {
        if (element.get('data-target') !== null || element.get('href') !== null) {
            // Don't automagically listen unless we have data-target or a href
            element.addEvent('click', function() {
                element.modal({show: false}).toggle();
            });
        }
    });
});
