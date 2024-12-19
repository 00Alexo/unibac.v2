const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const passwordValidator = require('password-validator');
var schema = new passwordValidator();
schema
.is().min(7)
.has().uppercase()
.has().lowercase()
.has().digits(2)

const createToken = (_id) =>{
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

const signup = async(req, res) =>{
    try{
        const {username, email, password, confirmPassword, statut} = req.body;
        const saltRounds = 12; let errorFields = [];
        if (!email) errorFields.push("email");
        if (!username) errorFields.push("username");
        if (!password) errorFields.push("pass");
        if (!confirmPassword) errorFields.push("cpass");
        if (!statut) errorFields.push("statut");
        
        if (errorFields.length > 0) {
            return res.status(400).json({error: 'Toate campurile sunt obligatorii!', errorFields: errorFields});
        }

        if(password !== confirmPassword){
            errorFields.push("pass");
            errorFields.push("cpass");
            return res.status(400).json({error:"Parolele nu sunt identice", errorFields: errorFields});
        }

        if(!schema.validate(password)){
            errorFields.push("pass");
            return res.status(400).json({error: 'Parola trebuie sa aiba minim 7 caractere, o litera mare, mica si 2 cifre!', errorFields: errorFields})
        }

        const existingUser = await userModel.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
        if(existingUser){
            errorFields.push("username");
            return res.status(400).json({ error: 'Usernameul este deja folosit!', errorFields: errorFields});
        }

        if(!email.includes('@') && !email.includes('+') && !email.includes('%')){
            errorFields.push("email");
            return res.status(400).json({error:"Email invalid!", errorFields: errorFields});
        }
        if(!/^[a-zA-Z0-9.]*$/.test(username)){
            errorFields.push("username");
            return res.status(400).json({error: 'Numele poate sa contina doar litere din alfabetul englez!', errorFields: errorFields});
        }
        const existingEmail = await userModel.findOne({email})
        if(existingEmail){
            errorFields.push("email");
            return res.status(400).json({error:'Emailul este deja folosit!', errorFields: errorFields})
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const data = {
            username: username.toLowerCase(),
            email,
            password: hashedPassword,
            statut,
            adminPerms: false
        }
        const user = await userModel.create(data);
        const token = createToken(user._id);
        res.status(200).json({username:data.username, token});
    }catch(error){
        console.error(error.message);
        return res.status(400).json(error.message);
    }
}

const signin = async(req, res) =>{
    try{
        const {username, password} = req.body;
        let errorFields = [];

        if (!username) errorFields.push("username");
        if (!password) errorFields.push("pass");
        if (errorFields.length > 0) {
            return res.status(400).json({error: 'Toate campurile sunt obligatorii!', errorFields: errorFields});
        }

        let emailValidator = req.body.username.split("");
        let isEmail = false;
        for (let i =0; i < emailValidator.length; i++) {
            if(emailValidator[i] == '@' || emailValidator[i] == '+' || emailValidator[i] == '%'){
                isEmail = true;
                break;
            }
        }

        let user;
        if(isEmail)
            user = await userModel.findOne({email: username.toLowerCase()});
        else
            user = await userModel.findOne({username: username});

        if(user){
            const passMatch = await bcrypt.compare(password, user.password);

            if(passMatch){
                const token = createToken(user._id)

                res.status(200).json({username:user.username, token});
            }
            else{
                errorFields.push("pass")
                return res.status(400).json({error: 'Parola incorecta!', errorFields});
            }
        }
        else
            return res.status(400).json({error: 'Contul nu exista!', errorFields: ["pass", "username"]} );
    }catch(error){
        console.error(error.message);
        return res.status(400).json(error.message);
    }
}

module.exports={
    signup,
    signin
}