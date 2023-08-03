const fs = require("fs/promises");
const path = require("path");

async function searchOldFiles(){
  const AllImages = await fs.readdir(path.join(__dirname, "..", "..", "tmp", "uploads"))
  .then(files => {
    return files.filter(file => file !== ".gitkeep");
  });

  return AllImages;
}

module.exports = searchOldFiles;