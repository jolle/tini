# tini

A very tiny (~0.5kb) element creation helper. Supports styles, attributes, event listeners, text node creation, classes, IDs and children.

```js
import { mk } from 'tini';

document.body.appendChild(
    mk(
        '{color=red}[data-cool=yes].nice#hello',
        "I'm a cool div",
        mk('strong.extraCool', 'with a super cool strong tag!'),
        {
            onclick: () => console.log('and I can listen for events too!')
        },
        mk('input', { disabled: true })
    )
);
```
