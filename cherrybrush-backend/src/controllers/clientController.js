import * as clientService from "../services/clientServices.js"

export const getUsers = async(req, res) => {
    try {
        const users = await clientService.getUsers();
        res.status(200).json(users)
    } catch (err){
        console.error('error fetching clients', err);
        res.status(500).json({ message: 'Internal Server Error'});
    }
}

export const createUser = async(req, res) => {
    try {
        const userData = req.body;
        console.log(userData);
        const newUser = await clientService.createUser(userData);
        res.status(200).json(newUser);
    } catch (err){
        console.error('Error Creating User', err);
        res.status(500).json({ message: 'Internal Server Error'});
    }
}

export const updateUser = async(req, res) => {
    try {
        const userId = req.params.id;
        const userData = req.body;
        console.log(userData);
        const updatedUser = await clientService.updateUser(userData, userId);
        if(!updatedUser) {
            return res.status(404).json({ message: "User not Found" });
        }
        res.status(200).json(updatedUser);
    } catch (err){
        console.error('Error Updating User', err);
        res.status(500).json({ message: 'Internal Server Error'});
    }
}

export const deleteUser = async(req, res) => {
    try {
        const userId = req.params.id;
        const deleted = await clientService.deleteUser(userId);
        if (!deleted) {
            res.status(404).json({ message: "User not found" })
        }
        res.status(200).send();
    } catch (err){
        console.error('Error Deleting User', err);
        res.status(500).json({ message: 'Internal Server Error'});
    }
}

export const searchUser = async(req, res) => {
    try {
        const searchTerm = req.query.q;
        const user = await clientService.searchUser(searchTerm);
        res.status(200).json(user);
    } catch (err){
        console.error('Error Searching User', err);
        res.status(500).json({ message: 'Internal Server Error'});
    }
}