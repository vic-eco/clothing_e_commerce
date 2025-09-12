const passport = require('passport');
const {Strategy} = require('passport-local');
const pool = require('../db/db.js');

/** Responsible for getting a validated user and storing them in a session.
*  Saves the id of the user (we provided that) into the session.
*  This is called only when logging in.
*  Deserialize will look for whatever we used in Serialize
*/
passport.serializeUser((user,done)=>{
    console.log(`Serializing user ${user}`);
    done(null, user.id)
});

/** Responsible for taking the user via the property we provided (here id from serialize)
 *  and storing that user in the request object.
 *  This is called for every request.
 *  Then we will be able to do things like req.user
 */
passport.deserializeUser(async (id, done)=>{
    console.log(`Desirializing user with id: ${id}`);
    try{
        const findUser = await pool.query(`SELECT * FROM "user" WHERE id= $1`, [id]);
        if (findUser.rows.length == 0){
            throw new Error('User not found');
        }
        
        const user = findUser.rows[0];
        done(null, user); //add the user to the request object
    }catch(err){
        done(err, null);
    }
});


module.exports = passport.use(
    new Strategy({usernameField: "email"}, async (username, password, done) => {
        try{
            const findUser = await pool.query(`SELECT id, email, password FROM "user" WHERE email= $1`, [username]); //the results are in findUser.rows

            if (findUser.rows.length === 0) {
                throw new Error('User not found');
            }
            
            const user = findUser.rows[0];
            if (user.password != password){
                throw new Error('Invalid credentials');
            }

            done(null, user)
        }
        catch(err){
            done(err, null)
        }
    })
)