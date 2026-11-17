import express from 'express';
import routes from './routes.js';

const app = new express();
app.use(express.json());
app.use(routes);

app.listen(3001, ()=> {
    console.log('BurguerAPI online!');
});