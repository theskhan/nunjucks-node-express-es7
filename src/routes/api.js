var express = require('express'),
    router = express.Router();

router.get('/persons', function (req, res) {
    res.send([
        'From Server',
        'Penney Wilmoth',
        'Susanne Templeton',
        'Marisha Lawson',
        'Nellie Greenly',
        'Karon Mckernan',
        'Suzette Roan']);
});

module.exports = router;