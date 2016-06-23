'use strict'
require('babel-polyfill');

import express from 'express';
import request from 'request-promise';

let router = express.Router();

let wrap = fn => (...args) => fn(...args).catch(args[2])

router.get('/', wrap(async function (req, res, next) {
    let persons = await request('http://localhost:8000/api/persons');
    res.render('index.html', { persons: JSON.parse(persons) });
}));

router.get('/about', function (req, res) {
    res.render('about.html');
});

module.exports = router;