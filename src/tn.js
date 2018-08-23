module['exports']['tn'] = function(selector) {
    // module properties in computational blocks for closure compiler
    // uses function() {...} for `arguments` support

    const d = document;
    const e = d.createElement.bind(d);
    const specialStarts = '.{}[]~#'.split(''); // ~ is padding; when checking for block starters, indexes divisible by 2 are block starters

    let element;

    let stack = '';
    let currentFirst;
    let isBlock; // falsish
    for (let i = 0; i <= selector.length; i++) {
        let current = selector[i];
        let currentIndex = specialStarts.indexOf(current);
        let currentIsStartingBlock = currentIndex % 2; // returns an integer but output can be 1 or 0; 1 is trueish and 0 is falseish
        const isSpecialStart = ~currentIndex; // if not found, output is 0 (=falseish), otherwise -1 (=trueish)

        if (!i && isSpecialStart) element = e('div'); // if it's the first iteration (i is falseish) and the first char is special, fall back to default element (div)

        if (
            !current || // we use <= in the for cond so we can detect when the current doesn't exist -> we are at the end
            (isBlock // if the first char is an endable block...
                ? currentFirst == currentIndex - 1 // check that if the char is the ending char
                : isSpecialStart) //) // otherwise just check that the current char is a special char
        ) {
            const n = stack.slice(1);
            if (!element) {
                // if there is no element already, we must be reading for the element type/name
                element = e(stack); // create new element with given name
            } else if (isBlock) {
                // split by first =
                const ll = n.split(/=(.*)/);
                if (currentFirst % 3) element.style[ll[0]] = ll[1];
                // the {'s index is not divisible by 3 (=trueish value)
                else element.setAttribute(ll[0], ll[1]); // we'll presume that if it's not {, it's [
                currentIsStartingBlock = currentIndex = current = ''; // resets everything and treats next round like a first round
            } else if (stack) {
                if (currentFirst) element.id = n;
                // the class selector has index of 0 which is falseish and thus # has a trueish value
                else element.classList.add(n); // we'll presuma that if it's not #, it's .
            }
            isBlock = currentIsStartingBlock;
            currentFirst = currentIndex;
            stack = current;
        } else {
            stack += current;
        }
    }

    for (let i = 1, arg = arguments; i < arg.length; i++) {
        // starts at 1 as the first argument is the selector
        const currentArg = arg[i];
        if (currentArg.call) {
            // o.call exists only on functions; not on HTMLElements nor strings/integers
            element.addEventListener(currentArg.name.slice(2), currentArg);
        } else
            element.appendChild(
                currentArg.tagName // if a HTMLElement, will have a tagName
                    ? currentArg
                    : d.createTextNode(currentArg) // new Text(...) would be shorter but browser support is poor
            );
    }

    return element;
};
