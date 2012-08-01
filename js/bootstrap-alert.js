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
