/* ============================================================
 * bootstrap-dropdown.js v2.2.2
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
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
 * ============================================================ */

 Element.implement ({
    dropdown: function () {
        if (this.retrieve('dropdown') === null) {
            this.store('dropdown', new Dropdown (this));
        }
        return this.retrieve('dropdown');
    }
 });

 Dropdown = new Class({
    initialize: function (element) {
        this.element = element;

        // Dropdown menu with class of .dropdown-menu SHOULD be the be a next sibling.
        this.dropdown_menu = this.element.getNext('.dropdown-menu');


        // if it's not the next sibling, fall back to a previous sibling.
        if (!this.dropdown_menu) {
            this.dropdown_menu = this.element.getPrevious('.dropdown-menu');
        }

        // Well it's not a next or previous sibling, perhaps for unknown reasons he's a child.
        if (!this.dropdown_menu) {
            this.dropdown_menu = this.element.getElement('.dropdown-menu');
        }

        // And now we give up. Cause hey, what's going on here. (Someone going to read the comments I wonder?)  =D
        if (!this.dropdown_menu) {
            return;
        }

        this.touchStart = false;


        $(document.body).addEvent('click', function (event) {
            if (this.touchStart) {

                this.touchStart = false;

            } else {

                if (this.isShown()) {

                    if (event.target != this.element && event.target.getParent('[data-toggle=dropdown]') != this.element) {

                        if (event.target != this.dropdown_menu && event.target.getParent('.dropdown-menu') != this.dropdown_menu) {
                            // We did not click on anything relating to this element, or this dropdown box.
                            this.hide();
                        }
                    }

                    if (event.target.getParent('[data-toggle=dropdown]') != this.element && event.target != this.element) {

                        if (typeof event.target.href != 'undefined') { // Ensure we're actually going somewhere before moving on.
                            this.hide();
                        }

                    }

                }

            }

        }.bind(this));

        element.addEvent('click', function(event) {
            this.toggle();
            event.preventDefault(); // stop a href tags on the element from going somewhere.
        }.bind(this));
    },

    toggle: function () {
        if ( this.isShown() ) {
            this.hide();
        } else {
            this.show();
        }
    },

    show: function () {
        this.touchStart = true;
        this.element.addClass('open active');
        this.dropdown_menu.show();
    },

    hide: function () {
        this.element.removeClass('open active');
        this.dropdown_menu.hide();
    },

    isShown: function () {
        if (this.dropdown_menu.isVisible() || this.element.hasClass('open')) {
            return true;
        } else {
            return false;
        }
    }
 });

/**
 * Seek out all data-toggle=modal elements, and if they have data-target="#foo" or href="#foo" - that's our target modal.
 * @return void
 */
window.addEvent('domready', function() {
    $(document.body).getElements('[data-toggle=dropdown]').each(function (element) {
        element.dropdown();
    });
});
