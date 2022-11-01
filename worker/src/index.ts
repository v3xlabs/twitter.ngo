import express from 'express';

const app = express();
const port = 8080;

app.get('/', (request, res) => {
    res.send('200 OK');
});

app.listen(port, () => {
    console.log(`Ready to go on port ${port}`);
});
