const express = require("express");
const Ajv = require("ajv").default; 
const fs = require("fs");
const path = require("path");

const app = express();
const ajv = new Ajv(); // make ajv instance

// cargar los schemas
const personSchema = JSON.parse(fs.readFileSync(path.join(__dirname, "schemas", "person.schema.json"), "utf8"));
const coordinateSchema = JSON.parse(fs.readFileSync(path.join(__dirname, "schemas", "coordinate.schema.json"), "utf8"));

// compilar schemas
const validatePerson = ajv.compile(personSchema);
const validateCoordinate = ajv.compile(coordinateSchema);

// Middleware para parsear JSON
app.use(express.json());

// ruta para validar persona
app.post("/validate-person", (req, res) => {
  const isValid = validatePerson(req.body);
  if (isValid) {
    res.status(200).send("JSON válido");
  } else {
    res.status(400).json({ errors: validatePerson.errors });
  }
});

// ruta para validar coordenadas
app.post("/validate-coordinate", (req, res) => {
  const isValid = validateCoordinate(req.body);
  if (isValid) {
    res.status(200).send("JSON válido");
  } else {
    res.status(400).json({ errors: validateCoordinate.errors });
  }
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});