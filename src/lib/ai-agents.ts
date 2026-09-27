import { generateObject, generateText } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

// Gemini 3.7 Flash
// Current Google Gemini API free tier model.
const model = google("gemini-3.7-flash");

// TYPES
export interface RequestSuggestionParams {
  workspaceName: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url?: string;
  description?: string;
}

export interface JsonBodyGenerationParams {
  prompt: string;
  method?: string;
  endpoint?: string;
  context?: string;
}

// Schema for request name suggestions
const RequestNameSchema = z.object({
  suggestions: z
    .array(
      z.object({
        name: z
          .string()
          .describe("Suggested request name"),

        reasoning: z
          .string()
          .describe(
            "Brief explanation of why this name was chosen"
          ),

        confidence: z
          .number()
          .min(0)
          .max(1)
          .describe(
            "Confidence score for this suggestion"
          ),
      })
    )
    .length(3)
    .describe(
      "Three different name suggestions ordered by relevance"
    ),
});

// Schema for JSON body generation
const JsonBodySchema = z.object({
  jsonBody: z
    .string()
    .describe(
      "Generated JSON body as a valid JSON string"
    ),

  explanation: z
    .string()
    .describe(
      "Brief explanation of the generated structure"
    ),

  suggestions: z
    .array(z.string())
    .describe(
      "Alternative field suggestions or improvements"
    ),
});

// Structured JSON body schema
const StructuredJsonBodySchema = z.object({
  jsonBody: z
    .object({
      id: z.string().optional(),
      name: z.string().optional(),
      email: z.string().optional(),
      data: z.any().optional(),
      metadata: z
        .record(z.string(), z.any())
        .optional(),
    })
    .passthrough()
    .describe(
      "Generated JSON body structure"
    ),

  explanation: z
    .string()
    .describe(
      "Brief explanation of the generated structure"
    ),

  suggestions: z
    .array(z.string())
    .describe(
      "Alternative field suggestions or improvements"
    ),
});

// Agent 1: Suggest Request Names
/**
 * Generates meaningful API request names
 * based on workspace context, HTTP method and URL.
 */
export async function suggestRequestName({
  workspaceName,
  method,
  url,
  description,
}: RequestSuggestionParams) {
  try {
    const prompt = `
You are an AI assistant helping developers name their API requests.

The request belongs to a workspace called "${workspaceName}".

  Context:

- HTTP Method: ${method}
- Workspace: ${workspaceName}
- URL: ${url || "Not provided"}
- Description: ${description || "Not provided"}

Generate exactly 3 concise and descriptive request names.

  Requirements:

1. Reflect the HTTP method and purpose of the request.
2. Be relevant to the workspace context.
3. Follow common REST API naming conventions.
4. Be professional and clear.
5. Keep each name between 2 and 6 words.
6. Avoid unnecessary words.
7. Make the names easy for developers to understand.
8. Prefer names such as:
- Get User Profile
  - Create New User
    - Update User Profile
      - Delete User
        - Fetch Products
          - Create Order

Consider the workspace theme and URL when generating the names.

Return exactly 3 different suggestions.
`;

    const result = await generateObject({
      model,
      schema: RequestNameSchema,
      prompt,
      temperature: 0.7,
    });

    return {
      success: true,
      data: result.object,
      error: null,
    };
  } catch (error) {
    console.error(
      "Error generating request name suggestions:",
      error
    );

    return {
      success: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred",
    };
  }
}

// Agent 2: Generate JSON Request Body
/**
 * Generates JSON request bodies based on
 * user prompts and API context.
 */
export async function generateJsonBody({
  prompt,
  method = "POST",
  endpoint,
  context,
}: JsonBodyGenerationParams) {
  try {
    const systemPrompt = `
You are an expert AI assistant that generates JSON request bodies for API calls.

API Context:
- HTTP Method: ${method}
- Endpoint: ${endpoint || "Not specified"}
- Additional Context: ${context || "None"}

User Request:
${prompt}

Guidelines:
1. Generate realistic and well - structured JSON.
2. Match the user's requested functionality.
3. Use appropriate JSON data types:
- strings
  - numbers
  - booleans
  - arrays
  - objects
4. Use realistic example values.
5. Follow common JSON and REST API conventions.
6. Consider the HTTP method.
7. Consider the endpoint.
8. Use meaningful field names.
9. Include nested objects or arrays when appropriate.
10. Keep the structure practical and ready to use.
11. Do not add unnecessary fields.
12. Return valid JSON.

IMPORTANT:
The jsonBody field MUST contain a valid JSON string.

The result must be parseable using:

JSON.parse(jsonBody)
  `;

    const result = await generateObject({
      model,
      schema: JsonBodySchema,
      prompt: systemPrompt,
      temperature: 0.3,
    });

    // Parse JSON string returned by the model
    let parsedJsonBody: unknown;

    try {
      parsedJsonBody = JSON.parse(
        result.object.jsonBody
      );
    } catch {
      // Keep original string if parsing fails
      parsedJsonBody = result.object.jsonBody;
    }

    return {
      success: true,

      data: {
        ...result.object,
        jsonBody: parsedJsonBody,
      },

      error: null,
    };
  } catch (error) {
    console.error(
      "Error generating JSON body:",
      error
    );

    return {
      success: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred",
    };
  }
}

// Agent 3: Generate Smart JSON Request Body
/**
 * Generates more detailed and production-oriented
 * JSON request bodies.
 */
export async function generateSmartJsonBody({
  prompt,
  method = "POST",
  endpoint,
  context,
  existingSchema,
}: JsonBodyGenerationParams & {
  existingSchema?: Record<string, any>;
}) {
  try {
    const enhancedPrompt = `
You are an expert API developer creating JSON request bodies.

Request Details:

- HTTP Method: ${method}
- Endpoint: ${endpoint || "Not specified"}
- User Prompt: ${prompt}
- Context: ${context || "None provided"}

${existingSchema
        ? `Reference Schema:

${JSON.stringify(existingSchema, null, 2)}`
        : ""
      }

Create a JSON request body that:

1. Matches the user's intent exactly.
2. Uses realistic example data.
3. Follows common REST API conventions.
4. Uses meaningful property names.
5. Uses appropriate data types.
6. Considers the HTTP method.
7. Considers the endpoint.
8. Uses validation - friendly values.
9. Includes nested objects when appropriate.
10. Includes arrays when appropriate.
11. Avoids unnecessary complexity.
12. Is practical for developers.

Do not create random or unrelated fields.

  IMPORTANT:

Return jsonBody as a valid JSON string that can be parsed using:

JSON.parse(jsonBody)
  `;

    const result = await generateObject({
      model,
      schema: JsonBodySchema,
      prompt: enhancedPrompt,
      temperature: 0.4,
    });

    // Parse generated JSON
    let parsedJsonBody: unknown;

    try {
      parsedJsonBody = JSON.parse(
        result.object.jsonBody
      );
    } catch {
      parsedJsonBody = result.object.jsonBody;
    }

    return {
      success: true,

      data: {
        ...result.object,
        jsonBody: parsedJsonBody,
      },

      error: null,
    };
  } catch (error) {
    console.error(
      "Error generating smart JSON body:",
      error
    );

    return {
      success: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred",
    };
  }
}

// Agent 4: Generate Structured JSON Request Body
/**
 * Generates a structured JSON object.
 *
 * Useful when you want the model to directly return
 * an object instead of a JSON string.
 */
export async function generateStructuredJsonBody({
  prompt,
  method = "POST",
  endpoint,
  context,
}: JsonBodyGenerationParams) {
  try {
    const systemPrompt = `
You are an expert AI assistant that generates JSON request bodies for API calls.

  Context:

  - HTTP Method: ${method}
- Endpoint: ${endpoint || "Not specified"}
- Additional Context: ${context || "None"}

User Request:
${prompt}

Generate a realistic JSON request body.

  Requirements:

1. Match the user's request.
2. Use meaningful property names.
3. Use realistic example values.
4. Use correct JSON data types.
5. Include nested objects when useful.
6. Include arrays when useful.
7. Consider the HTTP method.
8. Consider the endpoint.
9. Keep the result practical.
10. Do not add unnecessary fields.

You can include any properties that make sense for the request.
Do not restrict the response to predefined fields.
`;

    const result = await generateObject({
      model,
      schema: StructuredJsonBodySchema,
      prompt: systemPrompt,
      temperature: 0.3,
    });

    return {
      success: true,
      data: result.object,
      error: null,
    };
  } catch (error) {
    console.error(
      "Error generating structured JSON body:",
      error
    );

    return {
      success: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred",
    };
  }
}

// Agent 5: Validate Generated JSON
/**
 * Validates generated JSON data.
 */
export function validateGeneratedJson(
  jsonBody: Record<string, any>
): {
  isValid: boolean;
  errors: string[];
  suggestions: string[];
} {
  const errors: string[] = [];
  const suggestions: string[] = [];

  try {
    // Check whether JSON can be serialized
    JSON.stringify(jsonBody);

    // Check empty object
    if (Object.keys(jsonBody).length === 0) {
      errors.push("Generated JSON is empty");
    }

    // Check null values
    const serialized = JSON.stringify(jsonBody);

    if (serialized.includes("null")) {
      suggestions.push(
        "Consider replacing null values with appropriate defaults"
      );
    }

    // Check generic property names
    const keys = Object.keys(jsonBody);

    const hasGenericKeys = keys.some((key) =>
      ["data", "value", "item", "field"].includes(
        key.toLowerCase()
      )
    );

    if (hasGenericKeys) {
      suggestions.push(
        "Consider using more specific property names"
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      suggestions,
    };
  } catch (error) {
    errors.push("Invalid JSON structure");

    return {
      isValid: false,
      errors,
      suggestions,
    };
  }
}

// Agent 6: Batch Suggest Request Names
/**
 * Generates request name suggestions for multiple requests.
 */
export async function batchSuggestRequestNames(
  requests: RequestSuggestionParams[]
): Promise<
  Array<{
    originalRequest: RequestSuggestionParams;
    suggestions: z.infer<typeof RequestNameSchema> | null;
    error: string | null;
  }>
> {
  const results = await Promise.allSettled(
    requests.map((request) =>
      suggestRequestName(request)
    )
  );

  return results.map((result, index) => ({
    originalRequest: requests[index],

    suggestions:
      result.status === "fulfilled" &&
        result.value.success
        ? result.value.data
        : null,

    error:
      result.status === "fulfilled"
        ? result.value.error
        : result.reason?.message ||
        "Unknown error",
  }));
}
