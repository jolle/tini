module['exports']['mk'] = function() {
    var d = document;
    var e = d.createElement.bind(d);
    var specialStarts = ['#', '.', '{', '}', '[', ']'];

    var children = arguments;
    var selector = children[0];

    var element;

    var stack = '';
    var currentFirst = '';
    var isBlock; // falsish
    for (var i = 0; i <= selector.length; i++) {
        var current = selector[i];
        var bb = specialStarts.indexOf(current);
        var nc = bb && !(bb % 2);
        var l = bb > -1;

        if (!i && l) element = e('div');

        if (
            !current || // end
            (isBlock // if the first char is an endable block...
                ? currentFirst == bb - 1 // check that if the char is the ending char
                : l) //) // otherwise just check that the current char is a special char
        ) {
            var n = stack.slice(1);
            if (!element) {
                // if there is no element already, we must be reading for the element type/name
                element = e(stack); // create new element with given name
            } else if (isBlock) {
                // check if the first char is an endable block
                var ll = n.split(/=(.*)/);
                if (currentFirst == 4) element.setAttribute(ll[0], ll[1]);
                // if block is an attribute block, set the attribute
                else element.style[ll[0]] = ll[1]; // otherwise presume that it's a style block; apply style
                current = '';
            } else if (stack) {
                if (currentFirst == 1) element.classList.add(n);
                else element.id = n;
            }
            isBlock = nc;
            currentFirst = bb;
            stack = current;
        } else {
            !isBlock && (isBlock = nc);
            !currentFirst && (currentFirst = bb);
            stack += current;
        }
    }

    for (var i = 1; i < children.length; i++) {
        var o = children[i],
            v = o.tagName;
        if (o.call) {
            element.addEventListener(o.name.slice(2), o);
        } else
            element.appendChild(
                v // if a HTMLElement, will have a tagName
                    ? o
                    : d.createTextNode(o)
            );
    }

    return element;
};
