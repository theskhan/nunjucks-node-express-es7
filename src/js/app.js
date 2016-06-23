'use strict';

class App {

    constructor() {
        this.debug = true;
    }

    render(element, template, data, injectBehaviour) {

        let html = nunjucks.render(template, data);

        if (this.debug)
            console.log(html);

        if (!(element instanceof jQuery))
            element = $(element);

        injectBehaviour = this._givenOrDefault(arguments[3], 'set');

        if (injectBehaviour === 'set')
            element.html(html);
        else if (injectBehaviour === 'replace')
            element.replaceWith(html);
        else if (injectBehaviour === 'append')
            element.append(html);
        else if (injectBehaviour === 'settext')
            element.text(html);
    }

    _givenOrDefault(given, defaultValue) {
        if (typeof given !== 'undefined') {
            return given;
        } else {
            return defaultValue;
        }
    }
}

window.app = window.app || new App();

