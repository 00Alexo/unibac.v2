const userModel = require('../models/userModel')
const subiecteModel = require('../models/subiecteModel')
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');
const client = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY
});


const uploadPdf = async (req, res) => {
    try {
      let errorFields = [];  
      const username = req.body.username;
      if(!username)
        return res.status(400).json({error:"Trebuie sa fii logat ca sa postezi subiecte!"});
      const {profil, materie, descriere, titlu} = req.body;
      if (!profil) errorFields.push("profil");
      if (!materie) errorFields.push("materie");
      if (!descriere) errorFields.push("descriere");
      if (!titlu) errorFields.push("titlu");
      if (!req.files) errorFields.push("fișierele");
      if (!req.files.subiect) errorFields.push("subiect");
      if (!req.files.barem) errorFields.push("barem");

    if (errorFields.length > 0) 
        return res.status(400).json({error: `Următoarele câmpuri sunt obligatorii!`, errorFields });
  
      const newPdf = new subiecteModel({
        username,
        profil,
        materie,
        descriere,
        titlu,
        verified: false,
        subiect: {
          data: req.files.subiect[0].buffer, // Fișierul subiect
          contentType: req.files.subiect[0].mimetype,
        },
        barem: {
          data: req.files.barem[0].buffer, // Fișierul barem
          contentType: req.files.barem[0].mimetype,
        },
      });

      await newPdf.save();
  
      console.log('Fișierul salvat:', newPdf);
  
      res.status(200).json({ error: "Fișierele au fost salvate cu succes!" });
    } catch (err) {
      console.error("Eroare la salvarea fișierului:", err);
      res.status(500).json({ error:err});
    }
};

const getSubiect = async(req, res)=>{
  try{
    const {id} = req.params;
    const subiect = await subiecteModel.findById(id).select('-subiect -barem');
    res.status(200).json(subiect);
  }catch(err){
    console.error("Eroare la afișarea subiectului:", err);
    res.status(500).json({error:err});
  }
}
  
const getSubiecte = async(req, res) =>{
  try{
      const {materie} = req.query;
      console.log(materie);
      const subiecte = await subiecteModel.find({verified: true, materie}).select('-subiect -barem');;
      res.status(200).json(subiecte);
  }catch(err){
      console.error("Eroare la afișarea subiectelor:", err);
      res.status(500).json({error:err});
  }
}

const getSubiecteUnverified = async(req, res) =>{
  try{
      const subiecte = await subiecteModel.find({verified: false}).select('-subiect -barem');
      res.status(200).json(subiecte);
  }catch(err){
      console.error("Eroare la afișarea subiectelor:", err);
      res.status(500).json({error:err});
  }
}

const verifySubiect = async(req, res) =>{
  try{
      const id = req.params.id;
      await subiecteModel.findByIdAndUpdate(id, {verified: true});
      res.status(200).json({message: "Subiectul a fost verificat cu succes!"});
  }catch(err){
      console.error("Eroare la verificarea subiectului:", err);
      res.status(500).json({error:err});
  }
}

const deleteSubiect = async(req, res)=>{
  try{
      const id = req.params.id;
      await subiecteModel.findByIdAndDelete(id);
      res.status(200).json({message: "Subiectul a fost șters cu succes!"});
  }catch(err){
      console.error("Eroare la ștergerea subiectului:", err);
      res.status(500).json({error:err});
  }
}

const downloadSubiect = async (req, res) => {
    const fileId = req.params.id;
  
    try {
      const pdf = await subiecteModel.findById(fileId);
  
      if (!pdf) {
        return res.status(404).json({ message: "Fișierul nu a fost găsit." });
      }

      res.contentType(pdf.subiect.contentType);
  
      res.send(pdf.subiect.data);
    } catch (err) {
      console.error("Eroare la descărcarea fișierului:", err);
      res.status(500).json({ message: "Eroare la descărcarea fișierului.", error: err });
    }
}

const downloadBarem = async (req, res) => {
    const fileId = req.params.id;
  
    try {
      const pdf = await subiecteModel.findById(fileId);
  
      if (!pdf) {
        return res.status(404).json({ message: "Fișierul nu a fost găsit." });
      }

      res.contentType(pdf.barem.contentType);
  
      res.send(pdf.barem.data);
    } catch (err) {
      console.error("Eroare la descărcarea fișierului:", err);
      res.status(500).json({ message: "Eroare la descărcarea fișierului.", error: err });
    }
}

getRezolvariSubiect = async(req, res)=>{
  try{
    const {id, username} = req.params;

    console.log(id, username);
        
    const user = await userModel.findOne({username});

    if(!user)
      return res.status(404).json({error: "Trebuie sa fii logat!"});

    const subiect = user.subiecte.find(s => s._id.toString() === id);
    
    res.status(200).json(subiect.rezolvari);
  }catch(err){
    console.error("Eroare la afișarea rezolvarilor subiectului:", err);
    res.status(500).json({error:err});
  }
}

const addToSubiect = async (req, res) => {
  try{
    const {id, rezolvari, username} = req.body;
    
    const user = await userModel.findOne({username});

    if(!user)
      return res.status(404).json({error: "Trebuie sa fii logat!"});

    const subiectIndex = user.subiecte.findIndex(s => s._id.toString() === id);

    if (subiectIndex !== -1) {
      await userModel.updateOne(
        { username, "subiecte._id": id },
        { $push: { "subiecte.$.rezolvari": { $each: rezolvari } } }
      );
    } else {
      await userModel.updateOne(
        { username },
        { 
          $push: {
            subiecte: {
              _id: id,
              rezolvari: rezolvari,
              punctaj: [],
              createdAt: new Date()
            }
          }
        }
      );
    }

    const updatedUser = await userModel.findOne({username});
    const subiectActualizat = updatedUser.subiecte.find(s => s._id.toString() === id);
    
    res.status(200).json({
      subiect: subiectActualizat
    });
  }catch(err){
    console.error("Eroare la rezolvarea subiectului:", err);
    res.status(500).json({error:err});
  }
}

const calculeazaPunctaj = async (jsonString) =>{
  try {
    const rezultat = JSON.parse(jsonString);
    let total = 0;

    if (!rezultat.exercitii || typeof rezultat.exercitii !== 'object') {
      throw new Error('Format invalid - lipsesc exercițiile');
    }

    Object.values(rezultat.exercitii).forEach(punctaj => {
      const puncte = parseFloat(punctaj.toString().replace('p', ''));
      
      if (!isNaN(puncte)) {
        total += puncte;
      } else {
        console.warn(`Valoare invalidă ignorată: ${punctaj}`);
      }
    });

    return total;
  } catch (err) {
    console.error('Eroare la calculul punctajului:', err);
    return 0; 
  }
}

const gradeSubiect = async (req, res) => {
  try {
    const { id, username } = req.body;
    const subiect = await subiecteModel.findById(id);
    
    if(!username)
      return res.status(400).json({error: "Trebuie sa fii logat!"});

    if (!subiect) {
      return res.status(404).json({ error: "Subiectul nu a fost găsit!" });
    }

    // const pdfBuffer = subiect.subiect.data;
    // if (!pdfBuffer || !(pdfBuffer instanceof Buffer)) {
    //   return res.status(400).json({ error: "PDF invalid" });
    // }

    const user = await userModel.findOne({username});

    const subiecte = user.subiecte.find(s => s._id.toString() === id);

    let prompts = [];
    // const data = await pdfParse(subiect.subiect.data);
    // const pdfText = data.text;
    const Subiect = await pdfParse(subiect.subiect.data);
    const SubiectText = Subiect.text;
    const Barem = await pdfParse(subiect.barem.data);
    const BaremText = Barem.text;
    
    prompts.push({
      role: "system",
      content: `ACT AS A MATH TEACHER. ANALYZE THESE ANSWERS STEP-BY-STEP:
                1. Compare each answer (text/image) with the grading rubric
                2. Calculate points for each exercise
                3. Return ONLY JSON format: {"exercitii": {"1": "xp", "2": "xp", ...}}
                DO NOT include explanations.`
    });

    prompts.push({
      role: "system",
      content: `[SUBJECT TEXT]\n${SubiectText}\n\n[GRADING RUBRIC]\n${BaremText}`
    });
    
    subiecte.rezolvari.forEach(rez => {
      if (rez.type === 'text') {
        prompts.push({
          role: "user",
          content: [
            { 
              type: "text",
              text: rez.rezolvare
            }
          ]
        });
      } else if (rez.type === 'image' || rez.type === 'canvas') {
        // 1. Extrage tipul MIME corect
        const mimeType = rez.type === 'image' ? 'jpeg' : 'png';
        
        // 2. Verifică dacă rezolvare este deja în format base64
        let base64Data;
        if (rez.rezolvare.startsWith('data:')) {
          // Dacă e deja data URL, extrage doar partea de base64
          base64Data = rez.rezolvare.split(',')[1];
        } else {
          // Dacă e Buffer, convertește la base64
          base64Data = Buffer.from(rez.rezolvare).toString('base64');
        }
    
        // 3. Construiește URL-ul corect
        prompts.push({
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/${mimeType};base64,${base64Data}`
              }
            }
          ]
        });
      }
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: prompts,
      temperature: 0.1,
      response_format: { type: "json_object" } 
    })

    const punctaj = await calculeazaPunctaj(response.choices[0].message.content) + 10;

    console.log(response.choices[0].message.content, punctaj);

    await userModel.updateOne(
      { username, "subiecte._id": id },
      { $push: { "subiecte.$.punctaj": { punctaj, createdAt: new Date() } } }
    );

    res.status(200).json({punctaj});

  } catch (err) {
    console.error("Eroare:", err);
    res.status(500).json({ 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

const getPunctaje = async(req, res) =>{
  try{
    const{id, username} = req.params;
    if(!username)
      return res.status(400).json({error: "Trebuie sa fii logat!"});
    if(!id)
      return res.status(400).json({error: "Id-ul subiectului este invalid!"});

    const user = await userModel.findOne({username});

    const subiecte = user.subiecte.find(s => s._id.toString() === id);

    res.status(200).json(subiecte.punctaj);
  }catch(err){
    console.error("Eroare la afișarea punctajelor:", err);
    res.status(500).json({error:err});
  }
}

const getSubiecteRezolvateTotale = async(req, res)=>{
  try{
    const {username} = req.params;
    if(!username)
      return res.status(400).json({error: "Trebuie sa fii logat!"});

    const user = await userModel.findOne({username});

    const subiecte = user.subiecte;

    res.status(200).json({stele: subiecte.length});
  }catch(error){
    console.error("Eroare la afișarea punctajelor:", err);
    res.status(500).json({error:err});
  }
}


module.exports = {
    uploadPdf,
    downloadSubiect,
    downloadBarem,
    getSubiecte,
    getSubiecteUnverified,
    verifySubiect,
    deleteSubiect,
    getSubiect,
    gradeSubiect,
    addToSubiect,
    getRezolvariSubiect,
    getPunctaje,
    getSubiecteRezolvateTotale
}