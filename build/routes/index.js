'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

require('babel-polyfill');

var router = _express2.default.Router();

var wrap = function wrap(fn) {
    return function () {
        return fn.apply(undefined, arguments).catch(arguments.length <= 2 ? undefined : arguments[2]);
    };
};

router.get('/', wrap(function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res, next) {
        var persons;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return (0, _requestPromise2.default)('http://localhost:8000/api/persons');

                    case 2:
                        persons = _context.sent;

                        res.render('index.html', { persons: JSON.parse(persons) });

                    case 4:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function (_x, _x2, _x3) {
        return ref.apply(this, arguments);
    };
}()));

router.get('/about', function (req, res) {
    res.render('about.html');
});

module.exports = router;