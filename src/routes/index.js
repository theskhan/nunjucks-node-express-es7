'use strict'
require('babel-polyfill');

import express from 'express';
import request from 'request-promise';

let router = express.Router();

let wrap = fn => (...args) => fn(...args).catch(args[2])

router.get('/',wrap(async function(req, res, next){

    let google = await request('http://www.google.com');

    res.render('index.html', {
        page: {
            title: 'Home',
            body_cls: 'home',
            google: google
        }
    });
}));

router.get('/about', function(req, res){
    res.render('about.html');
});

module.exports = router;