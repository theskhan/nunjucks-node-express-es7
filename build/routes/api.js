'use strict';

var express = require('express'),
    router = express.Router();

router.get('/get_json', function (req, res) {
    res.send({
        success: true,
        result: [{
            a: "b",
            b: "c"
        }]
    });
});

module.exports = router;