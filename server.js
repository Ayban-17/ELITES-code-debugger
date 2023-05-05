import { Configuration, OpenAIApi } from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";

config();

const configuration = new Configuration({
  apiKey: process.env.apiKey,
});

const openai = new OpenAIApi(configuration);

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
});

app.post("/", async (req, res) => {
  const { message, languageInput } = req.body;
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: ` Describe what's wrong in my ${languageInput} code and show me the right code. Here is my code \n ${message}`,
      },
    ],
    temperature: 0,
    max_tokens: 500,
  });
  res.json({
    response: completion.data.choices[0].message.content,
  });
});

app.listen(port, () => {
  console.log(`app is listening at http://localhost:${port}`);
});

// module.exports.handler = serverless(app);
