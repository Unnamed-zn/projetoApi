import { Router } from "express";
import Data from "./controller/data.js";

const data = new Data();
data.read();

const routes = new Router();

routes.get('/', (request, response)=> {
    response.status(200).json({'response': 'Server on'});
});

routes.get('/pedidos', (request, response) => {
    response.status(200).json(data.data)
});

routes.get('/pedidos/status=:status', (request, response) => data.findByStatus(request, response));

routes.get('/pedidos/id=:id', (request, response) => data.findById(request, response));

routes.post('/pedidos', (request, response) => data.createOrder(request, response));

routes.put('/pedidos/id=:id', (request, response) => data.updateOrder(request, response));

export default routes;