const userModel = require('../models/userModel')
const subiecteModel = require('../models/subiecteModel')


const uploadPdf = async (req, res) => {
    try {
      // Verifică dacă ambele fișiere au fost încărcate
      if (!req.files || !req.files.subiect || !req.files.barem) {
        return res.status(400).json({ message: "Ambele fișiere (subiect și barem) trebuie să fie încărcate." });
      }
  
      // Creează un nou document în colecția Subiecte
      const newPdf = new subiecteModel({
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
  
      res.status(200).json({ message: "Fișierele au fost salvate cu succes!" });
    } catch (err) {
      console.error("Eroare la salvarea fișierului:", err);
      res.status(500).json({ message: "Eroare la salvarea fișierului.", error: err.message }); // Afișează mesajul erorii
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