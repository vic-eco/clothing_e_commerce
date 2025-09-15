const express = require('express');
const {hashPassword} = require('../utils/bcrypt');
const pool = require('../db/db');
const authUser = require('../middleware/authUser');

const userRouter = express.Router();

userRouter.param('userId', (req, res, next, userId) => {

    if (isNaN(userId)){
        return res.status(400).json({message: 'User ID is not a number'});
    }

    const id = parseInt(userId, 10);
    
    if (!Number.isInteger(id) || id<0){
        return res.status(400).json({message: 'Invalid user ID'});
    }

    req.userId = id; // store parsed number for later use in routes
    next();
});

userRouter.post('/register', async (req,res) => {
    const {email, password} = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)){
        return res.status(400).json({message: 'Email must follow correct format'});
    }
    if (typeof password != 'string'){
        return res.status(400).json({message: 'Password must be a string'});
    }
    if (!password || password.length < 8){
        return res.status(400).json({message: 'Password must be at least 8 characters long'});
    }
    
    try{
    const hashedPassword = hashPassword(password);

    await pool.query(`
        INSERT INTO "user" (email, password) VALUES ($1, $2)`, 
        [email, hashedPassword]
    );

    return res.status(201).json({ message: 'User registered successfully', email });

    }catch(err){
    if (err.code === '23505') { // PostgreSQL unique violation
        return res.status(400).json({ message: 'Email already exists' });
    }
    return res.status(500).json({ message: 'Database error' });
    }
});

userRouter.get('/:userId', authUser, async (req, res)=>{
    try{
        const result = await pool.query(`SELECT id, email, first_name, last_name FROM "user" WHERE id= $1`, [req.userId]);

        if(result.rows.length === 0){
            return res.status(404).json({message: `User with id ${id} Not Found`});
        }

        const user = result.rows[0];

        return res.status(200).send(user);
    }catch(err){
        return res.status(500).json({message: "Database Error"});
    }
});

userRouter.put('/:userId', authUser, async (req,res)=>{
    const {email, password, first_name, last_name} = req.body;

    const fields = [];
    const values = [];
    let idx = 1;

    //Build dynamic query placeholders
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
            return res.status(400).json({message: 'Email must follow correct format'});
        }
        fields.push(`email = $${idx++}`);
        values.push(email);
    }
    if (first_name) {
        fields.push(`first_name = $${idx++}`);
        values.push(first_name);
    }
    if (last_name) {
        fields.push(`last_name = $${idx++}`);
        values.push(last_name);
    }
    if (password) {
        if (typeof password != 'string'){
            return res.status(400).json({message: 'Password must be a string'});
        }
        if (!password || password.length < 8){
            return res.status(400).json({message: 'Password must be at least 8 characters long'});
        }
        const hashedPassword = hashPassword(password);
        fields.push(`password = $${idx++}`);
        values.push(hashedPassword);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    values.push(req.userId);

    try{
    const query = `UPDATE "user" SET ${fields.join(", ")} WHERE id = $${idx} RETURNING id, email, first_name, last_name`;

    const result = await pool.query(query, values);
    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
    }catch (err) {
        console.error("Update error:", err);

        if (err.code === '23505') { // PostgreSQL unique violation
        return res.status(400).json({ message: 'Email already exists' });
        }

        res.status(500).json({ message: "Server error" });
    }
});

userRouter.delete('/:userId', authUser, async (req,res) => {
  try {
    const result = await pool.query('DELETE FROM "user" WHERE id = $1', [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = userRouter;