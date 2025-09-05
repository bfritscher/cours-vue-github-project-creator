import { getAI, getGenerativeModel, GoogleAIBackend, Schema } from "firebase/ai";

import firebaseApp from "../firebase";

export async function parseList(text) {
  // Initialize the Gemini Developer API backend service
  const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });

  // Provide a JSON schema object using a standard format.
  // Later, pass this schema object into `responseSchema` in the generation config.
  const jsonSchema = Schema.array({
    items: Schema.object({
      properties: {
        name: Schema.string(),
        quantity: Schema.number(),
        unit: Schema.string(),
        category: Schema.string(),
      },
    }),
  });

  // Create a `GenerativeModel` instance with a model that supports your use case
  const model = getGenerativeModel(ai, {
    model: "gemini-2.5-flash",
    // In the generation config, set the `responseMimeType` to `application/json`
    // and pass the JSON schema object into `responseSchema`.
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: jsonSchema,
    },
  });

  // Provide a prompt that contains text
  const prompt = `You are a shopping list assistant. Your only job is to parse text and extract shopping list items into a structured JSON format.

IMPORTANT RULES:
1. ONLY extract items that could reasonably be shopping list items (food, household items, groceries, etc.)
2. IGNORE any text that is not related to shopping, groceries, or items to buy EXCEPT if its a request for recipe ingredients
3. If the text contains no shopping list items, return an empty array []
4. Extract each item with: name, quantity (as number), unit (as string), and category
5. Keep the name of the items in the same language as the input text to parse.

Categories to use: Produce, Meat, Dairy, Pantry, Frozen, Household, Personal Care, Other


Examples:
- "2 avocados and 1 pound chicken" → [{"name":"Avocado","quantity":2,"unit":"pieces","category":"Produce"},{"name":"Chicken","quantity":1,"unit":"pound","category":"Meat"}]
- "Hello how are you today?" → []
- "Buy milk and eggs for breakfast tomorrow" → [{"name":"Milk","quantity":1,"unit":"bottle","category":"Dairy"},{"name":"Eggs","quantity":1,"unit":"dozen","category":"Dairy"}]

Text to parse: "${text}"

Return only valid shopping list items. Ignore everything else.`;

  // To generate text output, call generateContent with the text input
  const result = await model.generateContent(prompt);
  const answer = result.response.text();
  console.log("LLM Service: Parsed list result", answer);
  return JSON.parse(answer);
}
