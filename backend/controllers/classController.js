const userModel = require('../models/userModel')
const classModel = require('../models/classModel');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
//const { createNotification } = require('./notificationController');

// FUNCTIONALITATI

const trimiteMesaj = async(req, res)=>{
    try{
        const {username, content, classId, avatar} = req.body;
        console.log(username);

        if(!username)
            return res.status(400).json({error:"Trebuie sa fii logat!"});

        if(!content)
            return res.status(400).json({error:"Mesajul nu poate sa fie gol!"});

        if(!classId)
            return res.status(400).json({error:"Clasa invalida!"});

        const clasa = await classModel.findOne({classId});

        if(!clasa)
            return res.status(400).json({error:"Clasa invalida!"});

        if(!clasa.students.includes(username.toLowerCase()) && !clasa.teachers.includes(username.toLowerCase()) && clasa.creator.toLowerCase() !== username.toLowerCase())
            return res.status(400).json({error:"Nu ai acces la aceasta functie!"});

        const mesaj = {
            username,
            avatar,
            content,
            time: new Date().toLocaleString('ro-RO', { hour12: false })
        }

        await classModel.findOneAndUpdate(
            {classId},
            {$push: {chat: mesaj}},
            {new: true}
        )

        return res.status(200).json({mesaj});
    }catch(err){
        console.error(err.message);
        res.status(400).json(err.message);
    }
}

const posteazaAnunt = async(req, res)=>{
    try{
        const {classId, username, anunt} = req.body;
        if(!classId)
            return res.status(400).json({error:"Clasa invalida!"});
        if(!username)
            return res.status(400).json({error:"Trebuie sa fii logat!"});
        if(!anunt)
            return res.status(400).json({error:"Un anunt nu poate sa fie gol!"});

        const check = await classModel.findOne({classId});

        if(!check)
            return res.status(400).json({error:"Clasa invalida!"});

        const user = await userModel.findOne({username});

        if(!user)
            return res.status(400).json({error:"Trebuie sa fii logat!"});

        if(!check.teachers.includes(username.toLowerCase()) && check.creator.toLowerCase() !== username.toLowerCase())
            return res.status(400).json({error:"Nu ai acces la aceasta functie!"});

        const clasa = await classModel.findOneAndUpdate(
            { classId }, 
            { 
                $push: { 
                    anunturi: { 
                        username, 
                        anunt, 
                        time: new Date().toLocaleString('ro-RO', { hour12: false }) 
                    },
                    logs: `Anunt nou de la ${username}`
                } 
            },
            { new: true }
        );

        return res.status(200).json({clasa});
    }
    catch(err){
        console.error(err.message);
        res.status(400).json(err.message);
    }
}

const createClass = async (req, res) =>{
    try{
        const saltRounds = 12
        const {creator, className, password, confirmPassword, subject, description, avatar, status} = req.body;

        let errorFields = [];

        if (!creator) errorFields.push("creator");
        if (!className) errorFields.push("className");
        if (!password && status == 'private') errorFields.push("password");
        if (!confirmPassword && status == 'private') errorFields.push("confirmPassword");
        if (!subject) errorFields.push("subject");
        if (!description) errorFields.push("description");
        if (!status) errorFields.push("status");

        if (errorFields.length > 0) {
            return res.status(400).json({error: 'Toate campurile sunt obligatorii!', errorFields: errorFields});
        };

        const checkCreator = await userModel.findOne({username: creator.toLowerCase()}).select('statut');

        if(checkCreator.statut !== 'profesor')
            return res.status(400).json({error: 'Trebuie sa ai statutul de profesor ca sa poti crea o clasa!'})

        let classId = 1;

        const lastClass = await classModel.findOne().sort({ classId: -1 }).select('classId');
        if (lastClass) {
            classId = lastClass.classId + 1;
        }

        console.log(classId);

        let hashedPassword = null;

        if(status === 'private'){
            if(password != confirmPassword){
                errorFields.push("password");
                errorFields.push("confirmPassword");
                return res.status(400).json({error: 'Parolele nu sunt identice!', errorFields});
            }
            hashedPassword = await bcrypt.hash(password, saltRounds);
        }

        const data = {
            creator,
            className,
            classId,
            password: hashedPassword,
            status,
            subject,
            description,
            teachers: [],
            avatar,
            students: [],
            assignments: [],
            lessons: [],
            tests: [],
            chat: [],
            logs: [`${creator} a creat clasa cu succes!`],
            anunturi: []
        }

        const clasa = await classModel.create(data)

        const data2 = {
            classId: classId,
            statut: "owner"
        }
        
        const activitate ={
            type: 'createClass',
            msg: `a creat o clasa noua, ${className}`,
            currentAvatar: checkCreator.avatar,
            timestamp: new Date().toLocaleString('ro-RO', { hour12: false })
        }

        await userModel.findOneAndUpdate(
            {username: creator.toLowerCase()},
            {$addToSet: {clase: data2, activitate: activitate}},
            {new: true}
        )

        res.status(200).json({classId});
    }catch(error){
        console.error(error.message);
        res.status(400).json(error.message);
    }
}

const viewClass = async (req, res) =>{
    try{
        const {classId} = req.params;
        const {username} = req.query;

        if(!classId)
            return res.status(400).json({error:"Clasa invalida!"});

        const check = await classModel.findOne({classId}).select('-password');

        if(!check)
            return res.status(400).json({error:"Clasa invalida!"});

        if(check.status === 'private')
            if(!check.students.includes(username?.toLowerCase()) && !check.teachers.includes(username?.toLowerCase()) 
                && check.creator !== username?.toLowerCase())
                    return res.status(400).json({error:"Clasa privata", className: check.className, username})

        res.status(200).json(check);
    }catch(error){
        console.error(error.message);
        res.status(400).json(error.message);
    }
}

const joinClass = async (req, res) =>{
    try{
        const {classId, password, username} = req.body;
        let errorFields = [];

        console.log(classId);
        if(!classId){
            errorFields.push('classId');
            return res.status(400).json({error: "Nu ai introdus ID-ul clasei!", errorFields});
        }
        if(!username)
            return res.status(400).json({error:"Trebuie sa fii logat ca sa te poti alatura unei clase!"});

        const check1 = await userModel.findOne({username: username.toLowerCase()});
        if(!check1)
            return res.status(400).json({error:"Utilizator invalid"});

        const check = await classModel.findOne({classId});

        if(!check){
            errorFields.push('classId');
            return res.status(400).json({error:"Aceasta clasa nu exista", errorFields});
        }
        if(!password && check.status == 'private'){
            errorFields.push('password');
            return res.status(400).json({error:"Toate campurile sunt obligatorii!", errorFields});
        }

        let passwordMatch = null;

        if(check.status === 'private')
            passwordMatch = await bcrypt.compare(password, check.password);

        if (!passwordMatch && check.status === 'private') {
            errorFields.push('password');
            return res.status(400).json({ error: "Parola gresita", errorFields });
        }

        const check2 = await classModel.findOne({classId});

        if(check2.students?.includes(username.toLowerCase()) || check2.teachers?.includes(username.toLowerCase()) || check2.creator == username.toLowerCase()){
            errorFields.push('classId');
            return res.status(400).json({error:"Deja faci parte din aceasta clasa.", errorFields});
        }

         await classModel.findOneAndUpdate(
            { classId },
            { $addToSet: { students: username.toLowerCase() , logs:`${username} s-a alaturat clasei cu succes!`}},
            { new: true }
        );


        const data = {
            classId: classId,
            statut: "elev"
        }

        const activitate = {
            type: 'joinClass',
            msg: `s-a alaturat unei clase noi, ${check2.className}`,
            currentAvatar: check1.avatar,
            timestamp: new Date().toLocaleString('ro-RO', { hour12: false })
        }


        await userModel.findOneAndUpdate(
            {username: username.toLowerCase()},
            {
                $addToSet: { clase: data },
                $push: { activitate: activitate }
            },
        )

        res.status(200).json({msg: `Te-ai alaturat cu succes clasei cu id-ul ${classId}`});
        
    }catch(error){
        console.error(error.message);
        res.status(400).json(error.message);
    }
}

const changeAcces = async (req, res) =>{
    try{
        const {teacher, username, classId, action} = req.body

        if(!classId){
            return res.status(400).json({error:"Clasa invalida!"});
        }

        const check = await userModel.findOne({username:username.toLowerCase()})

        if(!check){
            return res.status(400).json({error:"Utilizator invalid!"});
        }

        const check2 = await classModel.findOne({classId});

        if(!check2.students?.includes(username.toLowerCase()) && !check2.teachers?.includes(username.toLowerCase()))
            return res.status(400).json({error:"Acest utilizator nu face parte din clasa respectiva!"});

        if(check2.creator != teacher.toLowerCase())
            return res.status(400).json({error: 'Doar creatorul poate sa faca acest lucru!'})

        if(action === 'up'){
            if(check2.teachers.includes(username.toLowerCase()))
                return res.status(400).json({error:"Utilizatorul este deja profesor."});

            await classModel.findOneAndUpdate(
                {classId: classId}, 
                {$pull: {students: username.toLowerCase()},
                $addToSet: {teachers: username.toLowerCase(), logs: `${username} a fost promovat la functia de profesor de catre ${teacher}`}},
                {new: true}
            )

            await userModel.findOneAndUpdate(
                {username:username.toLowerCase()},
                {$set: { 'clase.$[elem].statut': "profesor"}},
                {new: true,  arrayFilters: [{ "elem.classId": classId }]}
            )

            res.status(200).json("Acest elev a fost promovat la functia de profesor.")
        }else if(action === 'down'){
            if(check2.students.includes(username.toLowerCase()))
                return res.status(400).json({error:"Utilizatorul este deja elev."});

            await classModel.findOneAndUpdate(
                {classId: classId}, 
                {$pull: {teachers: username.toLowerCase()},
                $addToSet: {students: username.toLowerCase(), logs: `${username} a fost retrogradat la functia de elev de catre ${teacher}`}},
                {new: true}
            )

            await userModel.findOneAndUpdate(
                {username:username.toLowerCase()},
                {$set: { 'clase.$[elem].statut': "elev"}},
                {new: true,  arrayFilters: [{ "elem.classId": classId }]}
            )

            res.status(200).json("Acest profesor este acum elev.")
        }
    }catch(error){
        console.error(error.message);
        res.status(400).json(error.message);
    }
}


const leaveClass = async (req, res) =>{
    try{
        const {classId, username} = req.body;

        if(!classId){
            return res.status(400).json({error:"Clasa invalida!"});
        }else if(!username){
            return res.status(400).json({error:"Utilizator invalid!"});
        }

        const check = await userModel.findOne({username:username.toLowerCase()})

        if(!check){
            return res.status(400).json({error:"Utilizator invalid!"});
        }

        const check2 = await classModel.findOne({classId});

        if(!check2.students?.includes(username.toLowerCase()) && !check2.teachers?.includes(username.toLowerCase()))
            return res.status(400).json({error:"Nu faci parte din aceasta clasa sau esti creatorul ei."});

        await classModel.findOneAndUpdate(
            {classId: classId},
            {$pull:{students: username.toLowerCase(), teachers: username.toLowerCase()},
            $addToSet: {logs: `${username} a parasit clasa...`}},
            {new: true}
        )

        const activitate = {
            type: 'leaveClass',
            msg: `a parasit o clasa ${check2.className}`,
            currentAvatar: check.avatar,
            timestamp: new Date().toLocaleString('ro-RO', { hour12: false })
        }

        await userModel.findOneAndUpdate(
            {username: username.toLowerCase()},
            {$pull: {clase: {classId: classId}}, $addToSet: {activitate: activitate}},
        )

        res.status(200).json("Ai parasit cu succes clasa!");
    }catch(error){
        console.error(error.message);
        res.status(400).json(error.message);
    }
}

//TODO + de facut backend la settings (security code confirmation) (de lasat pe final ca nush ce api sa folosesc si n am nici chef de el)
//TODO + MODIFICAT TOKEN REVIEW (IN FUNCTIE DE REMEMBER ME)
//TODO + SEARCH RESPONSIVE CA E CAM buGGY
//TODO + CV API CA SA SE UPDATEZE POZELE GLOBAL CA AI 5 POZE in 10 LOCATII DIFERITE PROSTU PLII
//TODO + BUTTON DISABLED LA POSTARE SUBIECTE IN TIMP CE E LOADING
//TODO + CV OPTIUNE DE FILTER LA SUBIECTE + ARTICOLE (CAND O SA FIE GATA)
//TODO + sa faci aia cu verificarea la subiecte handicapatule ca ai uitat total, se posteaza automat, nu mai trec prin filtre
//TODO + la achivements nu merge pt tel viewul


const kickMember = async (req, res) =>{
    try{
        const {classId, username, teacher} = req.body

        if(!classId)
            return res.status(400).json({error:"Clasa invalida!"});

        const check = await userModel.findOne({username:username.toLowerCase()})

        if(!check){
            return res.status(400).json({error:"Utilizator invalid!"});
        }

        const check2 = await userModel.findOne({username: teacher.toLowerCase()})

        if(!check2){
            return res.status(400).json({error:"Utilizator invalid!"});
        }

        const check3 = await classModel.findOne({classId});

        if(!check3.students?.includes(username.toLowerCase()) && !check3.teachers?.includes(username.toLowerCase()))
            return res.status(400).json({error:"Acest utilizator nu face parte din clasa respectiva."});

        if (!check3.teachers?.includes(teacher.toLowerCase()) && check3.creator !== teacher.toLowerCase())
            return res.status(400).json({error:"Doar creatorul si profesorii pot da afara un utilizator din clasa."});
        
        if(username === teacher) 
            return res.status(400).json({error: "Nu poti sa te dai afara singur din clasa."})

        if(check3.creator != teacher && check3.teachers.includes(username.toLowerCase()))
            return res.status(400).json({error: "Doar creatorul poate sa dea afara alti profesori!"});

        await classModel.findOneAndUpdate(
            {classId: classId},
            {$pull:{students: username.toLowerCase(), teachers: username.toLowerCase()},
            $addToSet: {logs: `${username} a fost data afara de catre ${teacher}.`}},
            {new: true}
        )

        
        const activitate = {
            type: 'kickClass',
            msg: `a fost dat afara din clasa ${check3.className}`,
            currentAvatar: check.avatar,
            timestamp: new Date().toLocaleString('ro-RO', { hour12: false })
        }

        await userModel.findOneAndUpdate(
            {username: username.toLowerCase()},
            {$pull: {clase: {classId: classId}}, $addToSet: {activitate: activitate}},
        )

        //createNotification(teacher, username, 'classKick',
        //`<span style="color:white; font-size:1.05rem; cursor:pointer;" 
       // //onclick="navigateToProfile('${teacher}')">${teacher}</span> te-a dat afara din clasa cu id-ul ${classId}.`);

        res.status(200).json(`Utilizatorul ${username} a fost dat afara din clasa cu succes`);
    }catch(error){
        console.error(error.message);
        res.status(400).json(error.message);
    }
}

const deleteClass = async (req, res) =>{
    try{
        const {username, classId} = req.body;

        const check = await userModel.findOne({username: username.toLowerCase()});
        
        if(!check) 
            return res.status(400).json({error:"Utilizator invalid!"});

        const check2 = await classModel.findOne({classId});

        if(!check2)
            return res.status(400).json({error:"Clasa invalida!"});

        if(check2.creator !== username)
            return res.status(400).json({error:'Doar creatorul poate sa stearga clasa!'});

        await classModel.deleteOne({classId});

        const members = [...check2.students, ...check2.teachers, check2.creator ];

        
        await userModel.updateMany(
            { username: { $in: members } },
            { $pull: { clase: { classId: classId } } }
        );

        res.status(200).json("Clasa a fost stearsa cu succes!");
    }catch(error){
        console.error(error.message);
        res.status(400).json(error.message);
    }
}

const transferOwnership = async (req, res) => {
    try{
        const {username, classId, newOwner} = req.body;

        if(username === newOwner)
            return res.status(400).json({error: "Nu poti sa iti cedezi clasa singur."});

        const check = await userModel.findOne({username: username.toLowerCase()});
        
        if(!check) 
            return res.status(400).json({error:"Utilizator invalid!"});

        const check2 = await classModel.findOne({classId});

        if(!check2)
            return res.status(400).json({error:"Clasa invalida!"});

        const check3 = await userModel.findOne({username: newOwner.toLowerCase()});

        if(!check3)
            return res.status(400).json({error:"Utilizator invalid!"});

        if(check2.creator !== username)
            return res.status(400).json({error:'Nu esti creatorul clasei'});

        console.log(newOwner);
        if(!check2.teachers.includes(newOwner))
            return res.status(400).json({error:"Noul administrator trebuie sa fie profesor in clasa respectiva ca sa poti ceda clasa."});

        await classModel.updateOne({classId}, {$set:{creator: newOwner}, $pull:{teachers:newOwner}, $addToSet: 
        {logs: `${username} a cedat clasa catre ${newOwner}.`}});

        await classModel.updateOne({classId}, {$addToSet:{teachers:username}});

        await userModel.findOneAndUpdate(
            {username:username.toLowerCase()},
            {$set: { 'clase.$[elem].statut': "teacher"}},
            {new: true,  arrayFilters: [{ "elem.classId": classId }]}
        )

        const activitate = {
            type: 'changeOwnershipClass',
            msg: `este acum administratorul clasei ${check2.className}`,
            currentAvatar: check3.avatar,
            timestamp: new Date().toLocaleString('ro-RO', { hour12: false })
        }

        await userModel.findOneAndUpdate(
            {username:newOwner.toLowerCase()},
            {$set: { 'clase.$[elem].statut': "creator"}, $push: {activitate: activitate}},
            {new: true,  arrayFilters: [{ "elem.classId": classId }]}
        )
        console.log(activitate)

        //createNotification(username, newOwner, 'classKick',
        //    `<span style="color:white; font-size:1.05rem; cursor:pointer;" 
        //    //onclick="navigateToProfile('${username}')">${username}</span> ti-a acordat clasa cu id-ul ${classId}.`);

        res.status(200).json(`${newOwner} este acum administratorul clasei.`)

    }catch(error){
        console.error(error.message);
        res.status(400).json(error.message);
    }
}

const getUserClasses = async(req, res) =>{
    try{
        const {username} = req.query;

        if(!username)
            return res.status(400).json({error: "Invalid data!"});

        const user = await userModel.findOne({username: username.toLowerCase()});
        
        let clase = [];

        for(let i=0; i<user.clase.length; i++)
            clase.push(user.clase[i].classId)

        if (clase.length == 0) {
            return res.status(404).json({ error: "Acest utilizator nu este intr-o clasa." });
        }

        const classes = await classModel.find({ classId: { $in: clase } });

        res.status(200).json(classes);
    }catch(error){
        console.error(error.message);
        res.status(400).json(error.message);
    }
}

const getPublicClasses = async(req, res) =>{
    try{
        const publicClasses = await classModel.find({ status: 'public' });
        res.status(200).json(publicClasses);
    }catch(error){
        console.error(error.message);
        res.status(400).json(error.message);
    }
}

//* TESTE

const createTest = async (req, res) =>{
    try{

        const {classId, teacher, type, timeLimit, questions, offPoints, startDate, endDate, status} = req.body;

        if(!classId || !teacher || !type || !timeLimit || !questions || !offPoints || !startDate || !endDate || !status)
            return res.status(400).json({error: "Toate campurile sunt obligatorii!"});

        const check = await classModel.findOne({classId});

        if(!check)
            return res.status(400).json({error:"Clasa invalida!"});

        const check2 = await userModel.findOne({username: teacher.toLowerCase()});

        if(!check2)
            return res.status(400).json({error:"Utilizator invalid!"});

        if(!check.teachers.includes(teacher.toLowerCase()) && check.creator !== teacher.toLowerCase())
            return res.status(400).json({error: 'Nu esti profesor in clasa respectiva!'});

        const test = {
            teacher,
            type,
            timeLimit, 
            questions,
            offPoints, 
            startDate,
            endDate,
            status,
            submittedTests: [],
            disqualifiedStudents: [],
            grades: [],
            testId: classId + uuidv4()
        }
        console.log(classId, test.testId)

        await classModel.updateOne({classId}, {$addToSet: {tests: test}});

        res.status(200).json(`Testul a fost creat cu succes `)
    }catch(error){
        console.error(error.message);
        res.status(400).json(error.message);
    }
}

const getTestData = async (req, res) =>{
    try{
        const {classId, testId, username} = req.query;

        if(!classId || !testId || !username)
            return res.status(400).json({error: "Invalid data!"});

        const check = await classModel.findOne({classId});

        if(!check)
            return res.status(400).json({error:"Clasa invalida!"});

        const check2 = await userModel.findOne({username: username.toLowerCase()});

        if(!check2)
            return res.status(400).json({error:"Utilizator invalid!"});

        if(!check.students.includes(username.toLowerCase()) && !check.teachers.includes(username.toLowerCase) && check.creator !== username.toLowerCase())
            return res.status(400).json({error:'Nu faci parte din clasa respectiva.'});

        const classData = await classModel.findOne(
            { classId, 'tests.testId': testId },
            { 'tests.$': 1 }
        )
        
        if (!classData || !classData.tests || classData.tests.length === 0) {
            return res.status(400).json({ error: "Test invalid!" });
        }
        
        const test = classData.tests[0];
        
        for (let question of test.questions) {
            delete question.correctOption;
        }

        res.status(200).json(test);
    }catch(error){
        console.error(error.message);
        res.status(400).json(error.message);
    }
}

const submitTest = async (req, res) =>{
    try{
        const {username, testId, classId, submittedTest} = req.body;

        if(!username || !classId || !submittedTest || !testId)
            return res.status(400).json({error: "Invalid data!"});

        const check = await classModel.findOne({classId});

        if(!check)
            return res.status(400).json({error: "Clasa invalida!"});

        const check2 = await userModel.findOne({username: username.toLowerCase()});

        if(!check2)
            return res.status(400).json({error: "User invalida!"});

        if(!check.students.includes(username.toLowerCase()))
            return res.status(400).json({error: 'Nu esti elev in clasa respectiva!'})

        const classData = await classModel.findOne(
            { classId, 'tests.testId': testId },
            { 'tests.$': 1 }
        )

        if (!classData || !classData.tests || classData.tests.length === 0) {
            return res.status(400).json({ error: "Test invalid!" });
        }

        res.status(200).json({});
    }catch(error){
        console.error(error.message);
        res.status(400).json(error.message);
    }
}
 
module.exports={
    createClass,
    viewClass,
    changeAcces,
    joinClass,
    leaveClass,
    kickMember,
    deleteClass,
    transferOwnership,
    createTest,
    getTestData,
    submitTest,
    getUserClasses,
    getPublicClasses,
    posteazaAnunt,
    trimiteMesaj
}