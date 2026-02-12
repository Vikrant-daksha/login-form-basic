import * as clientService from "../services/clientServices.js"

export const getClients = async(req, res) => {
    try {
        const clients = await clientService.getClients();
        res.status(200).json(clients)
    } catch (err){
        console.error('error fetching clients', err);
        res.status(500).json({ message: 'Internal Server Error'});
    }
}

export const createClients = async(req, res) => {
    try {
        const clientData = req.body;
        const newClient = await clientService.createClients(clientData);
        res.status(200).json(newClient);
    } catch (err){
        console.error('error Creating clients', err);
        res.status(500).json({ message: 'Internal Server Error'});
    }
}