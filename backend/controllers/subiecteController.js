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
  
      // Creează un nou document în colecția Subiecte
      const newPdf = new subiecteModel({
        username,
        profil,
        materie,
        descriere,
        titlu,
        subiect: {
          data: req.files.subiect[0].buffer, // Fișierul subiect
          contentType: req.files.subiect[0].mimetype,
        },
        barem: {
          data: req.files.barem[0].buffer, // Fișierul barem
          contentType: req.files.barem[0].mimetype,
        }
      });
  
      await newPdf.save();
  
      console.log('Fișierul salvat:', newPdf);
  
      res.status(200).json({ error: "Fișierele au fost salvate cu succes!" });
    } catch (err) {
      console.error("Eroare la salvarea fișierului:", err);
      res.status(500).json({ error:err}); // Afișează mesajul erorii
    }
};
  
  

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
}