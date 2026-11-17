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

    createOrder(request, response) {
        const info = request.body;
        const valido = info.cliente && info.lanche && info.valor && !isNaN(info.valor);
        if (!valido) return response.status(400).json({"Info": "Alguma informação essencial não foi enviada ou é inválida"});
        this.data.push({
            "id": this.data.length? this.data.at(-1).id+1 : 1,
            "cliente": info.cliente,
            "lanche": info.lanche,
            "adicionais": info.adicionais,
            "valor": Number.parseFloat(info.valor),
            "status": "pendente"
        });
        this.write();
        return response.status(201).json({"info": "Pedido criado com sucesso."});
    }

    updateOrder(request, response) {
        const order = this.data.find(order => order.id === parseInt(request.params.id));
        if (!order) return response.status(404).json({"Info": "Pedido não encontrado"});
        const index = this.data.findIndex(order => order.id === parseInt(request.params.id));
        
        const newData = request.body;
        const valido = (!newData.valor || typeof newData.valor === Number || newData.valor.trim().length===0) && (!newData.status || ['pendente','preparando','pronto','entregue'].includes(newData.status));
        if (!valido) return response.status(400).json({"Info": "Alguma informação enviada é inválida"});



        this.data[index] = {
            "id": order.id,
            "cliente": (newData.cliente && newData.cliente.trim().length>1)? newData.cliente.trim() : order.cliente,
            "lanche": (newData.lanche && newData.lanche.trim().length>1)? newData.lanche.trim() : order.lanche,
            "adicionais": (newData.adicionais && newData.adicionais.trim().length>1)? newData.adicionais.trim() : order.adicionais,
            "valor": (newData.valor && newData.valor.trim().length>1)? newData.valor : order.valor,
            "status": (newData.status && newData.status.trim().length>1)? newData.status.trim() : order.status,
        };

        this.write();
        return response.status(200).json({'info': 'Atualização concluída'});
    }

    deleteOrder(request, response) {
        const message = this.data.find(order => order.id === parseInt(request.params.id));
        if (!message) return response.status(404).json({"Info": "Pedido não encontrado"});

        const index = this.data.findIndex(order => order.id === parseInt(request.params.id));
        this.data.splice(index, 1);
        this.write();
        return response.status(200).json({'info': 'Remoção concluída'});
    }
}

export default Data;