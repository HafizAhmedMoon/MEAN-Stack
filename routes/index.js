var express = require('express'),
    router = express.Router(),
    api = require('../controllers/api');

router.get("/users", api.getUsers);

router.all('*', function (req, res) {
    res.status(400).json({msg: 'invalid api'})
});

module.exports = router;