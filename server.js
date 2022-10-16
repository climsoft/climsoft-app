const express = require('express');
const app = express();
const port = process.env.NODE_ENV === 'dev' ? 3000 : 80;
const path = require('path');

app.use(express.static('dist/'));

app.get('*', function(req,res) {
    res.sendFile(path.resolve('dist/index.html'));
});

app.listen(port, () => {
    console.log(`Opencdms app listening on port ${port}`);
});
