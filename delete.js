const fs = require('fs');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const logs = JSON.parse(fs.readFileSync('logs.json', 'utf8'));
const agora = new Date();

async function processar() {
  for (let log of logs) {
    if (log.status === "scheduled") {
      const data = new Date(log.scheduled_delete_at);

      if (agora >= data) {
        try {
          await cloudinary.uploader.destroy(log.public_id);
          log.status = "deleted";
          console.log("Deletado:", log.public_id);
        } catch (e) {
          console.log("Erro:", log.public_id);
        }
      }
    }
  }

  fs.writeFileSync('logs.json', JSON.stringify(logs, null, 2));
}

processar();
