import { writeFile, readFile } from 'fs/promises';

class Data {
    constructor() {
        this.data = null;
    }

    async read() {
        try {
            const content = await readFile('database.json', 'utf-8');
            this.data = JSON.parse(content);
            console.log('Informação recuperada com sucesso.');
        } catch (error) {
            console.log('Arquivo não encontrado, gerando database.json.');
            try {
                await writeFile('database.json', '[]');
                this.data = [];
            } catch (error2) {
                console.log(error2);
                this.data = [];
            }
        }
    }

    async write() {
        try {
            const content = JSON.stringify(this.data, null, " ");
            await writeFile('database.json', content);
        } catch (error) {
            console.log(error);
        }
    }

    findByStatus(request, response) {
        const message = this.data.filter(order => order.status === request.params.status);

        if (message.length === 0) return response.status(404).json({"Info": "Nenhum pedido correspondente"})

        return response.status(200).json(message);
    }

    findById(request, response) {
        const message = this.data.find(order => order.id === parseInt(request.params.id));

        if (!message) return response.status(404).json({"Info": "Pedido não encontrado"});

        return response.status(200).json(message);
    }

    updateOrder(request, response) {
        const info = request.body;
        console.log(this.data, info);
        const valido = (info.cliente || info.lanche || info.valor);
        if (!valido) return response.status(400).json({"Info": "Alguma informação essencial não foi enviada"});
        this.data.push({
            "id": this.data.length? this.data.at(-1).id+1 : 1,
            "cliente": info.cliente,
            "lanche": info.lanche,
            "adicionais": info.adicionais,
            "valor": info.valor,
            "status": "pendente"
        });
        this.write();
        response.status(201).json({"info": "Pedido criado com sucesso."});
    }

    updateOrder(request, response) {
        const order = this.data.find(order => order.id === parseInt(request.params.id));
        if (!order) return response.status(404).json({"Info": "Pedido não encontrado"});
        const index = this.data.findIndex(order => order.id === parseInt(request.params.id));
        
        const newData = request.body;
        this.data[index] = {
            "id": order.id,
            "cliente": newData.cliente? newData.cliente : order.cliente,
            "lanche": newData.lanche? newData.lanche : order.lanche,
            "adicionais": newData.adicionais? newData.adicionais : order.adicionais,
            "valor": newData.valor? newData.valor : order.valor,
            "status": newData.status? newData.status : order.status,
        };

        this.write();
    }
}

export default Data;