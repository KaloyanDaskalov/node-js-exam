const express = require('express');
const { PORT, DB_URI } = require('./config');
const router = require('./config/routes');

fireUp();

async function fireUp() {

    const app = express();

    await require('./config/mongoose')(DB_URI);

    require('./config/expressConfig')(app, express.static, express.urlencoded);

    app.use(router);

    app.use((err, req, res, next) => {
        if (!err) {
            res.end();
        }
        console.log(err);
        res.locals.error = ['500: Internal server error'];
        res.status(500).render('500: Internal server error');
    });

    app.listen(PORT, (err) => {
        if (err) console.error('>Server Failed <' + err);
        console.log('Server listening at http://localhost:' + PORT);
    });
}
