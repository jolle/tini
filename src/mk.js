module['exports']['mk'] = function() {
    var d = document;
    var e = d.createElement.bind(d);
    var specialStarts = ['#', '.', '{', '}', '[', ']'];

    var children = arguments;
    var selector = children[0];

    var element;

    var stack = '';
    for (var i = 0; i <= selector.length; i++) {
        var current = selector[i];
        var bb = specialStarts.indexOf(current);

        if (i == 0 && bb > -1) element = e('div');

        if (
            !current || // end
            //(stack.length > 0 && // check that the stack has been populated NOTE: this might not be required?
            (stack[0] == '{' || stack[0] == '[' // if the first char is an endable block...
                ? stack[0] == specialStarts[bb - 1] // check that if the char is the ending char
                : bb > -1) //) // otherwise just check that the current char is a special char
        ) {
            var n = stack.slice(1);
            if (!element) {
                // if there is no element already, we must be reading for the element type/name
                element = e(stack); // create new element with given name
            } else if (stack[0] == '{' || stack[0] == '[') {
                // check if the first char is an endable block
                var ll1 = n.split('='); // split the current stack with =
                var ll = [ll1[0], ll1.slice(1).join('=')]; // make an array with the left side and right side of = (in case right side has more than one =)
                if (stack[0] == '[') element.setAttribute(ll[0], ll[1]);
                // if block is an attribute block, set the attribute
                else element.style[ll[0]] = ll[1]; // otherwise presume that it's a style block; apply style
                current = '';
            } else if (stack) {
                if (stack[0] == '.') element.classList.add(n);
                else element.id = n;
            }
            stack = current;
        } else {
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
