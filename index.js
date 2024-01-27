const express = require("express");
const axios = require("axios");
const nanoid = require("nanoid-esm");
const app = express();

const BASE_DB_URL = `http://localhost:1338`;

const techStack = ["front-end", "back-end", "full-stack"];

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("<h1>Hello World !</h1>");
});

/*
---------------------
 GET Handler Section
---------------------
*/

app.get("/notes", async (_req, res) => {
  try {
    const response = await axios.get(`${BASE_DB_URL}/notes`);
    const notes = response.data;

    res.status(200).json(notes);
  } catch (error) {
    if (error.response) {
      console.error("Error Status Code:", error.response.status);

      const errorMessage = "Internal Server Error happened";

      res.status(error.response.status).json({ error: errorMessage });
    } else {
      console.error("Error: No response received");
      res
        .status(500)
        .json({ error: "Unable to connect to the database server" });
    }
  }
});

app.get("/technologies", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_DB_URL}/technologies`);
    const technologies = response.data;

    res.status(200).json(technologies);
  } catch (error) {
    if (error.response) {
      console.error("Error Status Code:", error.response.status);

      const errorMessage = "Internal Server Error happened";

      res.status(error.response.status).json({ error: errorMessage });
    } else {
      // The request was made but no response was received
      console.error("Error: No response received");
      res
        .status(500)
        .json({ error: "Unable to connect to the database server" });
    }
  }
});

/*
-----------------------------
 Custom GET Handler Section
-----------------------------
*/

app.get("/technologies/stack/:stack", async (req, res) => {
  try {
    const { stack } = req.params;

    if (!techStack.includes(stack.toLowerCase())) {
      return res.status(400).json({
        error: "Invalid stack specified",
      });
    }

    const response = await axios.get(`${BASE_DB_URL}/technologies`);
    const technologies = response.data;

    const filteredTechnologies = technologies.filter(
      (technology) => technology.stack === stack.toLowerCase()
    );

    res.status(200).json({
      [`total ${stack.toLowerCase()} technologies`]:
        filteredTechnologies.length,
      [`${stack.toLowerCase()} technologies`]: filteredTechnologies,
    });
  } catch (error) {
    if (error.response) {
      console.error("Error Status Code:", error.response.status);

      const errorMessage = "Internal Server Error happened";

      res.status(error.response.status).json({ error: errorMessage });
    } else {
      // The request was made but no response was received
      console.error("Error: No response received");
      res
        .status(500)
        .json({ error: "Unable to connect to the database server" });
    }
  }
});

app.get("/technologies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${BASE_DB_URL}/technologies/${id}`);

    console.log("Status:", response.status);

    const foundTechnology = response.data;
    res.status(200).json(foundTechnology);
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error("Error Status Code:", error.response.status);

      const errorMessage =
        error.response.status === 404
          ? `Technology with id ${req.params.id} not found!`
          : "Internal Server Error happened";

      res.status(error.response.status).json({ error: errorMessage });
    } else {
      // The request was made but no response was received
      console.error("Error: No response received");
      res
        .status(500)
        .json({ error: "Unable to connect to the database server" });
    }
  }
});

app.get("/important-notes", async (_req, res) => {
  try {
    const response = await axios.get(`${BASE_DB_URL}/notes`);
    const notes = response.data;
    const importantNotes = notes.filter((note) => note.important === true);

    if (importantNotes.length === 0) {
      res.json({
        message: "No important note(s) found",
      });
    } else {
      res.json({
        "total important-notes": importantNotes.length,
        "important-notes": importantNotes,
      });
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error("Error Status Code:", error.response.status);

      const errorMessage = "Internal Server Error happened";

      res.status(error.response.status).json({ error: errorMessage });
    } else {
      // The request was made but no response was received
      console.error("Error: No response received");
      res
        .status(500)
        .json({ error: "Unable to connect to the database server" });
    }
  }
});

app.get("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${BASE_DB_URL}/notes/${id}`);

    console.log("Status:", response.status);

    const foundNote = response.data;
    res.status(200).json(foundNote);
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error("Error Status Code:", error.response.status);

      const errorMessage =
        error.response.status === 404
          ? `Note with id ${req.params.id} not found!`
          : "Internal Server Error happened";

      res.status(error.response.status).json({ error: errorMessage });
    } else {
      // The request was made but no response was received
      console.error("Error: No response received");
      res
        .status(500)
        .json({ error: "Unable to connect to the database server" });
    }
  }
});

/*
-----------------------
 POST Handler Section
-----------------------
*/

app.post("/technologies", async (req, res) => {
  try {
    const { name, stack } = req.body;

    console.table(`
    name -> ${name},
    stack -> ${stack}
    `);

    // Validate request parameters
    if (!name && !stack) {
      return res
        .status(400)
        .json({ error: "Technology name and stack parameters are missing." });
    } else if (!name) {
      return res
        .status(400)
        .json({ error: "Technology name parameter is missing." });
    } else if (!stack) {
      return res
        .status(400)
        .json({ error: "Technology stack parameter is missing." });
    } else if (!techStack.includes(stack.toLowerCase())) {
      return res.status(400).json({
        error:
          "Only front-end, back-end or full-stack values are permitted for stack parameter.",
      });
    }

    const newTechnology = {
      id: nanoid(),
      name,
      stack,
    };

    const response = await axios.post(
      `${BASE_DB_URL}/technologies`,
      newTechnology,
      {
        "Content-Type": "application/json",
      }
    );

    console.log(response.data);

    res.status(201).json({
      message: "New technlogy created successfully",
      newTechnology: newTechnology,
    });
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error("Error Status Code:", error.response.status);

      const errorMessage = "Internal Server Error happened";

      res.status(error.response.status).json({ error: errorMessage });
    } else {
      // The request was made but no response was received
      console.error("Error: No response received");
      res
        .status(500)
        .json({ error: "Unable to connect to the database server" });
    }
  }
});

app.post("/notes", async (req, res) => {
  try {
    const { content, important } = req.body;

    console.table(`
    content -> ${content},
    important -> ${important}
    `);

    // Validate request parameters
    if (!content && important === undefined) {
      return res
        .status(400)
        .json({ error: "Note content and important parameters are required." });
    } else if (!content) {
      return res
        .status(400)
        .json({ error: "Note content parameter is missing." });
    } else if (important === undefined) {
      return res
        .status(400)
        .json({ error: "Note important parameter is missing." });
    } else if (typeof important !== "boolean") {
      return res.status(400).json({
        error:
          "Note important parameter can only be true or false, enter either of value without quotes.",
      });
    }

    // If we have reached here, it means all above validations are working fine, hence create a note and post it
    const newNote = {
      id: nanoid(),
      content,
      important,
    };

    const response = await axios.post(`${BASE_DB_URL}/notes`, newNote, {
      "content-type": "application/json",
    });

    console.log(response.data);

    res.status(201).json({
      message: "New note created successfully",
      note: newNote,
    });
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error("Error Status Code:", error.response.status);

      const errorMessage = "Internal Server Error happened";

      res.status(error.response.status).json({ error: errorMessage });
    } else {
      // The request was made but no response was received
      console.error("Error: No response received");
      res.json({ error: "Unable to connect to the database server" });
    }
  }
});

/*
---------------------
 PUT Handler Section
---------------------
*/

app.put("/technologies/:id", async (req, res) => {
  try {
    const { name, stack } = req.body;
    const { id } = req.params;

    console.table(`
    name -> ${name},
    stack -> ${stack}
    `);

    // Validate request parameters
    if (!name && !stack) {
      return res
        .status(400)
        .json({ error: "Technology name and stack parameters are missing." });
    } else if (!name) {
      return res
        .status(400)
        .json({ error: "Technology name parameter is missing." });
    } else if (!stack) {
      return res
        .status(400)
        .json({ error: "Technology stack parameter is missing." });
    } else if (!techStack.includes(stack.toLowerCase())) {
      return res.status(400).json({
        error:
          "Only front-end, back-end or full-stack values are permitted for stack parameter.",
      });
    }

    // If we have reached here, it means all above validations are working fine, hence create a technlogy object and post it
    const updatedTechnology = {
      name,
      stack,
    };

    const response = await axios.put(
      `${BASE_DB_URL}/technologies/${id}`,
      updatedTechnology,
      {
        "Content-Type": "application/json",
      }
    );

    console.log(response.data);

    res.status(200).json({
      message: `Technology with id ${id} updated successfully`,
      updatedTechnology: updatedTechnology,
    });
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error("Error Status Code:", error.response.status);

      const errorMessage =
        error.response.status === 404
          ? `Technology with id ${req.params.id} cannot be updated because its not found!`
          : "Internal Server Error happened";

      res.status(error.response.status).json({ error: errorMessage });
    } else {
      // The request was made but no response was received
      console.error("Error: No response received");
      res
        .status(500)
        .json({ error: "Unable to connect to the database server" });
    }
  }
});

app.put("/notes/:id", async (req, res) => {
  try {
    const { content, important } = req.body;
    const { id } = req.params;

    console.table(`
    content -> ${content},
    important -> ${important}
    `);

    // Validate request parameters
    if (!content && important === undefined) {
      return res
        .status(400)
        .json({ error: "Note content and important parameters are required." });
    } else if (!content) {
      return res
        .status(400)
        .json({ error: "Note content parameter is missing." });
    } else if (important === undefined) {
      return res
        .status(400)
        .json({ error: "Note important parameter is missing." });
    } else if (typeof important !== "boolean") {
      return res.status(400).json({
        error:
          "Note important parameter can only be true or false, enter either of value without quotes.",
      });
    }

    const updatedNote = {
      content,
      important,
    };

    const response = await axios.put(
      `${BASE_DB_URL}/notes/${id}`,
      updatedNote,
      {
        "content-type": "application/json",
      }
    );

    console.log(response.data);

    res.status(200).json({
      message: `Note with id ${id} updated successfully`,
      note: updatedNote,
    });
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error("Error Status Code:", error.response.status);

      const errorMessage =
        error.response.status === 404
          ? `Note with id ${req.params.id} cannot be updated because its not found!`
          : "Internal Server Error happened";

      res.status(error.response.status).json({ error: errorMessage });
    } else {
      // The request was made but no response was received
      console.error("Error: No response received");
      res.json({ error: "Unable to connect to the database server" });
    }
  }
});

/*
------------------------
 DELETE Handler Section
------------------------
*/

app.delete("/technologies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.delete(`${BASE_DB_URL}/technologies/${id}`);
    console.log(response.data);

    res.status(204).end();
  } catch (error) {
    if (error.response) {
      console.error("Error Status Code:", error.response.status);

      const errorMessage =
        error.response.status === 404
          ? `Technology with id ${req.params.id} cannot be deleted because it is not found!`
          : "Internal Server Error happened";

      res.status(error.response.status).json({ error: errorMessage });
    } else {
      // The request was made but no response was received
      console.error("Error: No response received");
      res
        .status(500)
        .json({ error: "Unable to connect to the database server" });
    }
  }
});

app.delete("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.delete(`${BASE_DB_URL}/notes/${id}`);
    // const notes = response.data;
    console.log(response.data);

    res.status(204).end();
  } catch (error) {
    if (error.response) {
      console.error("Error Status Code:", error.response.status);

      const errorMessage =
        error.response.status === 404
          ? `Note with id ${req.params.id} cannot be deleted because it is not found!`
          : "Internal Server Error happened";

      res.status(error.response.status).json({ error: errorMessage });
    } else {
      // The request was made but no response was received
      console.error("Error: No response received");
      res
        .status(500)
        .json({ error: "Unable to connect to the database server" });
    }
  }
});

/*
Do not change the PORT, else tests won't work !
*/
const PORT = 1337;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
