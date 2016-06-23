'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
    function App() {
        _classCallCheck(this, App);

        this.debug = true;
    }

    _createClass(App, [{
        key: 'render',
        value: function render(element, template, data, injectBehaviour) {

            var html = nunjucks.render(template, data);

            if (this.debug) console.log(html);

            if (!(element instanceof jQuery)) element = $(element);

            injectBehaviour = this._givenOrDefault(arguments[3], 'set');

            if (injectBehaviour === 'set') element.html(html);else if (injectBehaviour === 'replace') element.replaceWith(html);else if (injectBehaviour === 'append') element.append(html);else if (injectBehaviour === 'settext') element.text(html);
        }
    }, {
        key: '_givenOrDefault',
        value: function _givenOrDefault(given, defaultValue) {
            if (typeof given !== 'undefined') {
                return given;
            } else {
                return defaultValue;
            }
        }
    }]);

    return App;
}();

window.app = window.app || new App();
'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

$(document).ready(function () {
    $("#loadpersons").click(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return request.get('http://localhost:8000/api/persons');

                    case 2:
                        result = _context.sent;


                        if (app.debug) console.log(result);

                        app.render($("#rendered"), 'includes/persons.html', { persons: result }, 'append');

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    })));
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = function () {
    function Request() {
        _classCallCheck(this, Request);
    }

    _createClass(Request, [{
        key: 'get',
        value: function get(url) {
            return new Promise(function (resolve, reject) {
                $.get(url).done(function (data) {
                    resolve(data);
                }).fail(function (err) {
                    reject(err.responseText);
                });
            });
        }
    }]);

    return Request;
}();

window.request = window.request || new Request();