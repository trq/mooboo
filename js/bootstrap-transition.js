var Transition = function () {

    var transitionEnd = (function () {

        var el = document.createElement('bootstrap');
        var transEndEventNames = {
            'WebkitTransition' : 'webkitTransitionEnd',
            'MozTransition'    : 'transitionend',
            'OTransition'      : 'oTransitionEnd',
            'msTransition'     : 'MSTransitionEnd',
            'transition'       : 'transitionend'
        }
        var name;

        for (name in transEndEventNames){
            if (el.style[name] !== undefined) {
                return transEndEventNames[name]
            }
        }

    }());

    return transitionEnd && {
        end: transitionEnd
    }

}
