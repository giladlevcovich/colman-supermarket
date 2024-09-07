const UserModel = require('../models/users.model');

class UserController {
    async createUser(req, res) {
        try {
            const newUser = new UserModel(req.body);
            await newUser.save();
            res.status(201).json({ message: 'User created successfully', user: newUser });
        } catch (error) {
            res.status(400).json({ message: 'Error creating user', error: error.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await UserModel.find({});
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error: error.message });
        }
    }

    async getUserById(req, res) {
        try {
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user', error: error.message });
        }
    }

    async updateUser(req, res) {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User updated successfully', user: updatedUser });
        } catch (error) {
            res.status(400).json({ message: 'Error updating user', error: error.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user', error: error.message });
        }
    }

    async authenticateUser(req, res) {
        const { username, password } = req.body;

        try {
            const user = await UserModel.findOne({ username });
            if (user && user.password === password) {
                return res.status(200).json({ isAdmin: user.isAdmin, id: user._id });
            } else {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error authenticating user', error: error.message });
        }
    }
}

module.exports = new UserController();
