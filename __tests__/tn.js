const { tn } = require('../src/tn');

describe('tn', () => {
    it('creates a div with a non-explicit query', () => {
        expect(tn('.test')).toBeInstanceOf(HTMLDivElement);
    });

    it('creates an element with a class', () => {
        expect(tn('.test').classList.contains('test')).toBeTruthy();
    });

    it('creates an element with an ID', () => {
        expect(tn('#test').id).toBe('test');
    });

    it('creates a paragraph element with an explicit query', () => {
        expect(tn('p')).toBeInstanceOf(HTMLParagraphElement);
    });

    it('creates a paragraph element with a class with an explicit query', () => {
        const el = tn('p.test');
        expect(el).toBeInstanceOf(HTMLParagraphElement);
        expect(el.classList.contains('test')).toBeTruthy();
    });

    it('creates a paragraph element with an ID with an explicit query', () => {
        const el = tn('p#test');
        expect(el).toBeInstanceOf(HTMLParagraphElement);
        expect(el.id).toBe('test');
    });

    it('creates an element with an ID and a class', () => {
        const el = tn('.test#test');
        expect(el.id).toBe('test');
        expect(el.classList.contains('test')).toBeTruthy();
    });

    it('creates an element with the last ID with multiple IDs', () => {
        expect(tn('#test1#test2#test3').id).toBe('test3');
    });

    it('creates an element with a background color', () => {
        expect(tn('{backgroundColor=red}').style.backgroundColor).toBe('red');
    });

    it('creates a paragraph element with a background color', () => {
        const el = tn('p{backgroundColor=red}');
        expect(el).toBeInstanceOf(HTMLParagraphElement);
        expect(el.style.backgroundColor).toBe('red');
    });

    it('creates an element with an attribute', () => {
        expect(tn('[testKey=testValue]').attributes.testKey.value).toBe(
            'testValue'
        );
    });

    it('creates a paragraph element with an attribute', () => {
        const el = tn('p[testKey=testValue]');
        expect(el).toBeInstanceOf(HTMLParagraphElement);
        expect(el.attributes.testKey.value).toBe('testValue');
    });

    it('creates an element with an ID, a class, an attribute and a background color', () => {
        const el = tn('.test[testKey=testValue]{backgroundColor=red}#test');
        expect(el.id).toBe('test');
        expect(el.classList.contains('test')).toBeTruthy();
        expect(el.attributes.testKey.value).toBe('testValue');
        expect(el.style.backgroundColor).toBe('red');
    });

    it('creates an element with a textnode', () => {
        const nodes = tn('div', 'test').childNodes;
        expect(nodes).toHaveLength(1);
        expect(nodes[0]).toBeInstanceOf(Text);
        expect(nodes[0].textContent).toBe('test');
    });

    it('creates an element with another element', () => {
        const nodes = tn('div', tn('div')).childNodes;
        expect(nodes).toHaveLength(1);
        expect(nodes[0]).toBeInstanceOf(HTMLElement);
    });

    it('listens to an event and triggers callback', () => {
        const mock = jest.fn();

        const el = tn('div', function onclick() {
            mock();
        });

        el.click();

        expect(mock).toBeCalled();
    });
});
