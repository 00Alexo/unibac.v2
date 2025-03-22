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
        const {username, email, password, confirmPassword, statut, judet} = req.body;
        const saltRounds = 12; let errorFields = [];

        if (!username) errorFields.push({field: "username", error: "Acest camp este obligatoriu!"});
        if (!password) errorFields.push({field: "pass", error: "Acest camp este obligatoriu!"});
        if (!confirmPassword) errorFields.push({field: "cpass", error: "Acest camp este obligatoriu!"});
        if (!statut) errorFields.push({field: "statut", error: "Acest camp este obligatoriu!"});
        if (!judet) errorFields.push({field: "judet", error: "Acest camp este obligatoriu!"});
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

        timestamp = new Date().toLocaleString('ro-RO', { hour12: false });

        const data = {
            username: username.toLowerCase(),
            email,
            password: hashedPassword,
            statut,
            adminPerms: false,
            prompts: [],
            avatar: '',
            badges: [{name: 'Veteran', description: 'Utilizator inregistrat de peste 1 an',
            icon: `<svg class="badge" xmlns="http://www.w3.org/2000/svg" height="80" width="80" viewBox="20 -40 440 440">
            <circle class="outer" fill="#F9D535" stroke="#fff" stroke-width="8" stroke-linecap="round" cx="180" cy="180" r="157"/>
            <circle class="inner" fill="#DFB828" stroke="#fff" stroke-width="8" cx="180" cy="180" r="108.3"/>
            <path class="inline" d="M89.4 276.7c-26-24.2-42.2-58.8-42.2-97.1 0-22.6 5.6-43.8 15.5-62.4m234.7.1c9.9 18.6 15.4 39.7 15.4 62.2 0 38.3-16.2 72.8-42.1 97" stroke="#CAA61F" stroke-width="7" stroke-linecap="round" fill="none"/>
                <g class="star">
                    <path fill="#F9D535" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" d="M180 107.8l16.9 52.1h54.8l-44.3 32.2 16.9 52.1-44.3-32.2-44.3 32.2 16.9-52.1-44.3-32.2h54.8z"/>
                    <circle fill="#DFB828" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" cx="180" cy="107.8" r="4.4"/>
                    <circle fill="#DFB828" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" cx="223.7" cy="244.2" r="4.4"/>
                    <circle fill="#DFB828" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" cx="135.5" cy="244.2" r="4.4"/>
                    <circle fill="#DFB828" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" cx="108.3" cy="160.4" r="4.4"/>
                    <circle fill="#DFB828" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" cx="251.7" cy="160.4" r="4.4"/>
                </g>	
            </svg>`}],
            activitate: [{type: 'welcome!', msg: `s-a inregistrat pe platforma!`, timestamp: timestamp, currentAvatar: ''}],
            clase:[],
            subiecte:[],
            judet
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

const updateUserAvatar = async(req, res) =>{
    try{
        const {username, avatar} = req.body;
        const activitate = {
            type: 'newAvatar',
            msg: 'si-a modificat poza de profil',
            currentAvatar: avatar,
            timestamp: new Date().toLocaleString('ro-RO', { hour12: false })
        }
        const user = await userModel.findOneAndUpdate({username: username.toLowerCase()}, 
        {$set:{avatar: avatar}, $addToSet: {activitate: activitate}}, {new: true}).select('avatar');
    
        res.status(200).json(user);
    }catch(error){
        console.error(error.message);
        res.status(400).json(error.message);
    }
}

const search = async(req, res) =>{
    try{
        const {search, page = 1, limit = 9} = req.query;
        const limitNum = parseInt(limit);
        const skip = (parseInt(page) - 1) * limitNum;
        const users = await userModel.find({username: {$regex: search, $options: 'i'}}).select
        ('username displayName avatar followers following statut').skip(skip).limit(limitNum);

        const totalUsers = await userModel.countDocuments({username: {$regex: search, $options: 'i'}});
        
        res.status(200).json({users, totalUsers});

    }catch(error){
        console.error(error.message);
        res.status(400).json(error.message);
    }
}

const statusVerifier = async(req, res) =>{
    try{
        const {username} = req.query;

        if(!username)
            return res.status(400).json({error: 'Invalid username'});

        const user = await userModel.findOne({username: username.toLowerCase()}).select('statut');

        if(!user)
            return res.status(400).json({error:'Utilizator invalid!'});

        res.status(200).json({user});
    }catch(error){
        console.error(error.message);
        res.status(400).json(error.message);
    }
}

module.exports={
    signup,
    signin,
    getUserProfile,
    updateUserAvatar,
    search,
    statusVerifier
}