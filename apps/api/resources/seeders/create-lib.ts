import fs from "fs";
import path from "path";

// Definir rutas de archivo
const inputFilePath = path.join(__dirname, "./books.json");
const outputFilePath = path.join(__dirname, "./titles.txt");

// Leer el archivo JSON de manera síncrona
fs.readFile(inputFilePath, "utf-8", (err, data) => {
  if (err) {
    console.error("Error al leer el archivo:", err);
    return;
  }

  try {
    // Parsear el contenido del archivo JSON
    const books = JSON.parse(data);

    // Extraer los títulos
    const titles = books.map((book: { title: string }) => book.title).join("\n");

    // Escribir los títulos en el archivo .txt
    fs.writeFile(outputFilePath, titles, (err) => {
      if (err) {
        console.error("Error al escribir el archivo:", err);
        return;
      }
      console.log("Archivo titles.txt creado con éxito.");
    });
  } catch (error) {
    console.error("Error al parsear el JSON:", error);
  }
});
