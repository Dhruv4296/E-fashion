
const userService = require("../services/user.service");

const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const newUser = await userService.createUser({ firstName, lastName, email, password, role });
        return res.status(201).send(newUser);
    } catch (error) {
        console.log("Error creating user: ", error);
        return res.status(500).send({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;  // ID to be updated
        const userData = req.body;      // Data to update
        const updatedUser = await userService.updateUser(userId, userData);
        return res.status(200).send(updatedUser);
    } catch (error) {
        console.log("Error updating user: ", error);
        return res.status(500).send({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;  // ID to be deleted
        await userService.deleteUser(userId);
        return res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
        console.log("Error deleting user: ", error);
        return res.status(500).send({ error: error.message });
    }
};


const getUserProfile=async (req,res)=>{
    try {
        const jwt= req.headers.authorization?.split(' ')[1];

        if(!jwt){
            return res.status(404).send({error:"token not found"})
        }
        const user=await userService.getUserProfileByToken(jwt)

        return res.status(200).send(user)

    
    } catch (error) {
        console.log("error from controller - ",error)
        return res.status(500).send({error:error.message})
    }
}

const getAllUsers=async(req,res)=>{
    try {
        const users=await userService.getAllUsers()
        return res.status(200).send(users)
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

module.exports = { getUserProfile, getAllUsers, createUser, updateUser, deleteUser };