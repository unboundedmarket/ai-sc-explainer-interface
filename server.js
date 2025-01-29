const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});
app.post("/api/openai", async (req, res) => {
  try {
    const { code } = req.body;
      const prompt = `
        You are given this code:
        ${code}

        Output a JSON structure that describes the code's execution flow 
        as a directed acyclic graph (DAG). The JSON must have the following structure:

        {
        "nodes": [
            { "id": "unique_id", "label": "Name or short description" },
            ...
        ],
        "links": [
            { "source": "unique_id_of_source_node", "target": "unique_id_of_target_node" },
            ...
        ]
        }

        Ensure valid JSON is returned without additional commentary.
        `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a code analysis assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.0,
    });
    // parse data
    let content = completion.choices[0]?.message?.content;
    content = content.replace(/^```json\s*/, "");
    content = content.replace(/^```/, "");
    content = content.replace(/```$/, "");
    const flowObj = JSON.parse(content);
    res.json({ flow: flowObj });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "OpenAI request failed" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
