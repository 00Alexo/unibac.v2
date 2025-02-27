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

        if (!username) errorFields.push({field: "username", error: "Acest camp este obligatoriu!"});
        if (!password) errorFields.push({field: "pass", error: "Acest camp este obligatoriu!"});
        if (!confirmPassword) errorFields.push({field: "cpass", error: "Acest camp este obligatoriu!"});
        if (!statut) errorFields.push({field: "statut", error: "Acest camp este obligatoriu!"});
        if (!email) errorFields.push({field: "email", error: "Acest camp este obligatoriu!"});
        
        if (errorFields.length > 0) {
            return res.status(400).json({error: 'Toate campurile sunt obligatorii!', errorFields: errorFields});
        }

        if(!schema.validate(password)){
            errorFields.push({field: "pass", error: "Parola nu are minim 7 caractere, o litera mare si 2 cifre!"});
            errorFields.push({field: "cpass", error: ""});
            return res.status(400).json({error: 'Parola nu are minim 7 caractere, o litera mare si 2 cifre!', errorFields: errorFields})
        }

        if(password !== confirmPassword){
            errorFields.push({field: "pass", error: "Parolele nu sunt identice!"});
            errorFields.push({field: "cpass", error: ""});
            return res.status(400).json({error:"Parolele nu sunt identice", errorFields: errorFields});
        }

        const existingUser = await userModel.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
        if(existingUser){
            errorFields.push({field: "username", error: "Usernameul este deja folosit!"});
            return res.status(400).json({ error: 'Usernameul este deja folosit!', errorFields: errorFields});
        }

        if(!email.includes('@') && !email.includes('+') && !email.includes('%')){
            errorFields.push({field: "email", error: "Emailul invalid!"});
            return res.status(400).json({error:"Email invalid!", errorFields: errorFields});
        }
        if(!/^[a-zA-Z0-9.]*$/.test(username)){
            errorFields.push({field: "username", error: "Numele poate sa contina doar litere din alfabetul englez!"});
            return res.status(400).json({error: 'Numele poate sa contina doar litere din alfabetul englez!', errorFields: errorFields});
        }
        const existingEmail = await userModel.findOne({email})
        if(existingEmail){
            errorFields.push({field: "email", error: "Emailul este deja folosit!"});
            return res.status(400).json({error:'Emailul este deja folosit!', errorFields: errorFields})
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const data = {
            username: username.toLowerCase(),
            email,
            password: hashedPassword,
            statut,
            adminPerms: false,
            prompts: []
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
        console.log('test');
        const {username, password} = req.body;
        let errorFields = [];

        if (!username) errorFields.push({field: "username", error: "Acest camp este obligatoriu!"});
        if (!password) errorFields.push({field: "pass", error: "Acest camp este obligatoriu!"});
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
            user = await userModel.findOne({email: username});
        else
            user = await userModel.findOne({username: username.toLowerCase()});

        if(user){
            const passMatch = await bcrypt.compare(password, user.password);

            if(passMatch){
                const token = createToken(user._id)

                res.status(200).json({username:user.username, token});
            }
            else{
                errorFields.push({field: "pass", error: "Parola incorecta!"});
                return res.status(400).json({error: 'Parola incorecta!', errorFields});
            }
        }
        else
            return res.status(400).json({error: 'Contul nu exista!', errorFields: [{field:"username", error:"Acest cont nu exista!"}]} );
    }catch(error){
        console.error(error.message);
        return res.status(400).json(error.message);
    }
}

const getUserProfile = async (req, res) =>{
    try{
        const {username} = req.params;
        const user = await userModel.findOne({username: username.toLowerCase()}).select(`-password -userIp `)
        if(!user){
            return res.status(404).json({ error: 'Acest utilizator nu exista!' });
        }
        res.status(200).json(user);
    }catch(error){
        res.status(400).json(error.message);
    }
}

module.exports={
    signup,
    signin,
    getUserProfile
}