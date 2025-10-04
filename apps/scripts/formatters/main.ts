// filename: index.ts
import { ObjectId } from "bson";
import fs from "fs";
import path from "path";

type Content = {
  title: string;
  subcontent?: Content[];
};

type ContentWithId = {
  id: string;
  title: string;
  subcontent?: ContentWithId[];
};

// Read and parse JSON file as Content[]
const getFileContent = (filePath: string): Content[] => {
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error(`Input JSON in ${filePath} must be an array of Content objects.`);
  }
  return data;
};

// Recursively assign an id to a single Content node
const createNewContent = (content: Content): ContentWithId => {
  const id = new ObjectId().toString();

  const nc: ContentWithId = { id, title: content.title };

  if (content.subcontent && Array.isArray(content.subcontent)) {
    nc.subcontent = content.subcontent.map(createNewContent);
  }
  return nc;
};

// Helper: map an array of Content -> ContentWithId[]
const createNewContentArray = (contents: Content[]): ContentWithId[] =>
  contents.map(createNewContent);

export const main = () => {
  // List of input files
  const inputFiles = [
    "6b126b39-79b4-40b6-a663-8495cb1fdfb8.in.json", 
    "0385a601-6762-4062-afd0-eced6fe14fae.in.json",
    "c0dc9340-8c50-4c2a-bf6f-37792b06b8ff.in.json"
  ]; // <- agrega aquí todos los archivos que quieras procesar

  inputFiles.forEach((fileName) => {
    const inputPath = path.join(__dirname, fileName);
    const outputPath = path.join(__dirname, `out-${fileName}`);

    if (fs.existsSync(outputPath)) {
      console.log(`Skipped ${outputPath} (already exists).`);
      return;
    }

    const content = getFileContent(inputPath);
    const newContent: ContentWithId[] = createNewContentArray(content);

    fs.writeFileSync(outputPath, JSON.stringify(newContent, null, 2), "utf-8");
    console.log(`Wrote ${newContent.length} top-level items to ${outputPath}`);
  });
};

// Optional: run if executed directly
if (require.main === module) {
  main();
}
