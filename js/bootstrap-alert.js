/* ==========================================================
 * bootstrap-alert.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Modified for MooTools by GP Technology Solutions Pty Ltd
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
 * ========================================================== */

!function () {

    var dismiss = '[data-dismiss="alert"]';

    var Alert = function (el) {
        $(el).getElements(dismiss).addEvent('click', this.close);
    }

    Alert.prototype.close = function (e) {
        var this = e.target;
        var selector = this.getProperty('data-target');
        var parent;

        if (!selector) {
            selector = this.getProperty('href');
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
        }

        parent = $(selector);

        e && e.preventDefault();

        parent !== null || (parent = this.hasClass('alert') ? this : this.getParent());

        parent.fireEvent('close', e.target);

        if (e.isDefaultPrevented) return

        parent.removeClass('in');

        function removeElement() {
            parent.fireEvent('closed', new Event.Mock);
            parent.dispose();
        }

        Transition && parent.hasClass('fade') ? parent.on(Transition.end, removeElement) :removeElement()
    }

    window.addEvent('domready', function() {
        $(document.body).getElements(dismiss).addEvent('click', Alert.prototype.close);
    });

}();
