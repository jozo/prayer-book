import fs from "node:fs/promises";
import path from "node:path";
import toml from "toml";
import {HtmlRenderer, Parser} from "commonmark";

// Initialize the CommonMark parser and renderer
const parser = new Parser();
const writer = new HtmlRenderer();

/**
 * Function to validate the structure of the parsed TOML content.
 * Ensures that each prayer has 'version', 'title', and 'content' fields.
 * @param {Object} parsedToml - The parsed TOML object.
 * @param {string} filePath - The path to the TOML file (for error messages).
 */
function validateTomlStructure(parsedToml, filePath) {
  if (!parsedToml.versions) {
    throw new Error(`File ${filePath} does not contain the "versions" array.`);
  }

  if (!Array.isArray(parsedToml.versions)) {
    throw new Error(`The "versions" field in file ${filePath} is not an array.`);
  }

  if (typeof parsedToml.title === "undefined") {
    throw new Error(`Prayer in file ${filePath} is missing the "title" field.`);
  }

  if (typeof parsedToml.categories === "undefined") {
    throw new Error(`Prayer in file ${filePath} is missing the "categories" field.`);
  }

  parsedToml.versions.forEach((prayer, index) => {
    if (typeof prayer.name === "undefined") {
      throw new Error(`Prayer at index ${index} in file ${filePath} is missing the "version" field.`);
    }
    if (typeof prayer.content === "undefined") {
      throw new Error(`Prayer at index ${index} in file ${filePath} is missing the "content" field.`);
    }
  });
}

/**
 * Function to convert Markdown (CommonMark) to HTML using 'commonmark' library.
 * @param {string} markdown - The Markdown content to convert.
 * @returns {string} - The converted HTML content.
 */
function convertMarkdownToHTML(markdown) {
  const parsed = parser.parse(markdown);
  const html = writer.render(parsed);
  return html;
}

/**
 * Main function to convert TOML files to JSON with HTML content.
 * @param {string} inputDir - The input directory containing language subdirectories.
 * @param {string} outputDir - The output directory to save JSON files.
 */
async function convertTomlFiles(inputDir, outputDir) {
  try {
    // Ensure the output directory exists
    await fs.mkdir(outputDir, {recursive: true});

    // Read the contents of the input directory
    const languages = await fs.readdir(inputDir, {withFileTypes: true});

    // Iterate through each language directory
    for (const langDirent of languages) {
      if (langDirent.isDirectory()) {
        const lang = langDirent.name;
        const langPath = path.join(inputDir, lang);

        // Read all files in the language directory
        const files = await fs.readdir(langPath, {withFileTypes: true});

        const prayersInLanguage = [];

        for (const fileDirent of files) {
          if (fileDirent.isFile() && path.extname(fileDirent.name) === ".toml") {
            const filePath = path.join(langPath, fileDirent.name);

            try {
              const fileContent = await fs.readFile(filePath, "utf-8");
              const parsed = toml.parse(fileContent);

              // Validate the structure of the TOML content
              validateTomlStructure(parsed, filePath);

              // Convert 'content' from CommonMark to HTML for each prayer
              const convertedVersions = parsed.versions.map((version) => {
                return {
                  ...version,
                  content: convertMarkdownToHTML(version.content) // Convert Markdown to HTML
                };
              });

              // Replace the original prayer_versions with converted prayer_versions
              prayersInLanguage.push({
                ...parsed,
                id: fileDirent.name.replace(".toml", ""),
                versions: convertedVersions
              });
            } catch (err) {
              console.error(`Error processing file ${filePath}:`, err.message);
              // Continue with the next file
            }
          }
        }

        // Group the prayers by categories
        const categories = {};
        for (const prayer of prayersInLanguage) {
          prayer.categories.forEach((category) => {
            if (!categories[category]) {
              categories[category] = [];
            }
            categories[category].push({id: prayer.id, title: prayer.title});
          });
        }

        // Create object with ID as key and prayer as value
        const prayersById = {};
        for (const prayer of prayersInLanguage) {
          prayersById[prayer.id] = prayer;
        }

        // Save the converted data to a JSON file if there is any valid data
        if (Object.keys(prayersInLanguage).length > 0) {
          const outputFilePath = path.join(outputDir, `${lang}.json`);
          try {
            const finalData = {prayers: prayersById, categories: categories};
            await fs.writeFile(outputFilePath, JSON.stringify(finalData), "utf-8");
            console.log(`Successfully saved: ${outputFilePath}`);
          } catch (err) {
            console.error(`Error saving file ${outputFilePath}:`, err.message);
            process.exitCode = 1;
          }
        } else {
          console.warn(`No valid files found for language "${lang}" or all files failed validation.`);
        }
      }
    }

    console.log("Conversion completed.");
  } catch (err) {
    console.error("Error:", err.message);
    process.exitCode = 1;
  }
}

// Retrieve input and output directories from command-line arguments
const args = process.argv.slice(2);
const inputDirectory = args[0] || path.join(import.meta.dirname, "src/prayers"); // Default input directory
const outputDirectory = args[1] || path.join(import.meta.dirname, "public"); // Default output directory

// Execute the main function
await convertTomlFiles(inputDirectory, outputDirectory);
