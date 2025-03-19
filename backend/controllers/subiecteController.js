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

const analyzeSubjectContent = async (pdfBuffer) => {
  try {
    // Extrage textul din PDF
    const data = await pdfParse(pdfBuffer);
    const pdfText = data.text;

    // Trimite cererea către GPT-4o pentru analiză
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Ești un expert în analiza documentelor educaționale. Analizează în detaliu conținutul acestui subiect."
        },
        {
          role: "user",
          content: `Text extras din document:\n\n${pdfText}\n\nTe rog să faci următoarele:
            1. spune mi primele 2 exercitii
            2. spune mi ultimul exercitiu`
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Eroare în analiza conținutului:", error);
    throw new Error("Nu am putut analiza subiectul");
  }
};

const gradeSubiect = async (req, res) => {
  try {
    const { id } = req.body;
    const subiect = await subiecteModel.findById(id);
    
    if (!subiect) {
      return res.status(404).json({ error: "Subiectul nu a fost găsit!" });
    }

    const pdfBuffer = subiect.subiect.data;
    if (!pdfBuffer || !(pdfBuffer instanceof Buffer)) {
      return res.status(400).json({ error: "PDF invalid" });
    }

    const analiza = await analyzeSubjectContent(pdfBuffer);
    
    res.status(200).json({
      success: true,
      analiza: analiza.split('\n').filter(line => line.trim()), // Formatează răspunsul
      metadata: {
        materie: subiect.materie,
        profil: subiect.profil,
        dificultate: "Medie" // Poți adăuga logica de determinare a dificultății
      }
    });
    
  } catch (err) {
    console.error("Eroare:", err);
    res.status(500).json({ 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};




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
    getRezolvariSubiect
}