const userModel = require('../models/userModel')
const subiecteModel = require('../models/subiecteModel')


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


module.exports = {
    uploadPdf,
    downloadSubiect,
    downloadBarem,
    getSubiecte,
    getSubiecteUnverified,
    verifySubiect,
    deleteSubiect,
    getSubiect
}