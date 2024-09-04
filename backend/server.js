// require("dotenv").config();
// const express = require("express");

// const multer = require("multer");
// const upload = multer({dest: "uploads/"});

// const { uploadFile, getFile } = require("./s3");

// const app = express();

// app.get("/images/:key", (req, res) => {
//     const key = req.params.key;
//     const result = getFile(key);
//     result.pipe(res);
// })

// app.post("/images", upload.single("images"), async (req, res) => {
//     const file = req.file
//     console.log(file);
//     const result = await uploadFile();
//     res.send(result);
// });

// app.listen(8080, () => console.log("Listening on port 8080"));


require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { uploadFile, getFile } = require("./s3");

const upload = multer({ dest: "uploads/" });  // Dosyaların geçici olarak kaydedileceği klasör

const app = express();

app.get("/images/:key", async (req, res) => {
    const key = req.params.key;
    try {
        const url = await getFile(key);
        res.redirect(url);  // Dosya URL'sine yönlendirme
    } catch (error) {
        res.status(500).send("Dosya indirilirken bir hata oluştu.");
    }
});

app.post("/images", upload.single("image"), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send("Dosya yüklenmedi.");
    }

    try {
        const result = await uploadFile(file);
        res.send({ imageUrl: result.Location });  // Yüklenen dosyanın URL'sini gönder
    } catch (error) {
        res.status(500).send("Dosya yüklenirken bir hata oluştu.");
    }
});

app.listen(8080, () => console.log("8080 portundan dinleniyor"));
