/* ===========================================================
 * bootstrap-tooltip.js v2.2.2
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
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
 * ========================================================== */

Element.implement ({
    popover: function(options) {
        if ( this.retrieve('popover') === null ) {
            this.store('popover', new Popover (options, this));
        }
        return this.retrieve('popover');
    }
});

Popover = new Class({
    Extends: Tooltip,
    options: {
        animation:  true,       // apply a css fade transition to the tooltip
        html:       false,      // Insert html into the popover. If false, jquery's text method will be used to insert content into the dom. Use text if you're worried about XSS attacks.
        placement:  'right',    // how to position the popover - top | bottom | left | right
        selector:   false,      // if a selector is provided, tooltip objects will be delegated to the specified targets
        trigger:    'click',    // how popover is triggered - click | hover | focus | manual
        title:      '',         // default title value if `title` attribute isn't present
        content:    '',         // default content value if `data-content` attribute isn't present
        delay:      0,          // delay showing and hiding the popover (ms) - does not apply to manual trigger type
                                // If a number is supplied, delay is applied to both hide/show
                                //  Object structure is: delay: { show: 500, hide: 100 }
        template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"></div></div></div>'
    },
    initialize: function (options, element) {
        this.parent(options, element);
    },

    setContent: function () {
        var tip           = this.getTip();
        var title         = this.getTitle();
        var content       = this.getContent();
        var insert_method = this.options.html ? 'html' : 'text';

        tip.getElement('.popover-title').set(insert_method, title);
        tip.getElement('.popover-content').set(insert_method, content);

        tip.removeClass('fade top bottom left right in');
    },

    hasContent: function () {
        return this.getTitle() || this.getContent();
    },

    getContent: function () {
        return this.options.content;
    }


});
