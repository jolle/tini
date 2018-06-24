module['exports']['mk'] = function() {
    var d = document;
    var e = d.createElement.bind(d);
    var specialStarts = ['#', '.', '{', '}', '[', ']'];

    var selector = arguments[0];
    var children = Array.prototype.slice.call(arguments).slice(1);

    var element;

    let stack = [];
    for (let i = 0; i <= selector.length; i++) {
        var current = selector[i];
        var bb = specialStarts.indexOf(current);

        if (i == 0 && bb > -1) element = e('div');

        if (
            !current ||
            (stack.length > 0 &&
                (stack[0] == '{' || stack[0] == '['
                    ? stack[0] == specialStarts[bb - 1]
                    : bb > -1))
        ) {
            var n = stack.join(''),
                b = n.substr(1);
            if (!element) {
                element = e(n);
                stack = [current];
            } else if (stack[0] == '{' || stack[0] == '[') {
                var ll1 = b.split('=');
                var ll = [ll1[0], ll1.slice(1).join('=')];
                if (stack[0] == '[') element.setAttribute(ll[0], ll[1]);
                else if (stack[0] == '{') element.style[ll[0]] = ll[1];
                stack = [];
            } else {
                if (stack[0] == '.') element.classList.add(b);
                else if (stack[0] == '#') element.id = b;
                stack = [current];
            }
        } else {
            stack.push(current);
        }
    }

    for (let i = 0; i < children.length; i++) {
        if (
            children[i] instanceof Object &&
            !(children[i] instanceof HTMLElement)
        ) {
            for (var key in children[i]) {
                if (key.substr(0, 2) == 'on')
                    element.addEventListener(key.substr(2), children[i][key]);
                else element[key] = children[i][key];
            }
        } else
            element.appendChild(
                children[i] instanceof HTMLElement
                    ? children[i]
                    : d.createTextNode(children[i])
            );
    }

    return element;
};
