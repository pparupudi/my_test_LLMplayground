/**
 * Valid Anthropic Claude Model IDs
 * 
 * This array contains all currently supported Claude models.
 * 
 * HOW TO UPDATE WHEN ANTHROPIC RELEASES NEW MODELS:
 * 1. Add the new model ID to the VALID_CLAUDE_MODELS array below
 * 2. Update the model descriptions in CLAUDE_MODEL_INFO if needed
 * 3. Test the new model with a sample request
 * 4. Update frontend dropdown options if desired
 * 
 * Model naming convention: claude-{version}-{variant}-{release-date}
 * Examples: claude-3-opus-20240229, claude-3-5-sonnet-20240620
 */

export const VALID_CLAUDE_MODELS = [
  "claude-3-opus-20240229",
  "claude-3-sonnet-20240229", 
  "claude-3-haiku-20240307",
  "claude-3-5-sonnet-20240620",
  "claude-3-5-haiku-20241022"
];

/**
 * Claude Model Information
 * Provides human-readable names and descriptions for each model
 */
export const CLAUDE_MODEL_INFO = {
  "claude-3-opus-20240229": {
    name: "Claude 3 Opus",
    description: "Most capable model, best for complex tasks"
  },
  "claude-3-sonnet-20240229": {
    name: "Claude 3 Sonnet", 
    description: "Balanced performance and speed"
  },
  "claude-3-haiku-20240307": {
    name: "Claude 3 Haiku",
    description: "Fastest model, good for simple tasks"
  },
  "claude-3-5-sonnet-20240620": {
    name: "Claude 3.5 Sonnet",
    description: "Enhanced version with improved capabilities"
  },
  "claude-3-5-haiku-20241022": {
    name: "Claude 3.5 Haiku", 
    description: "Latest fast model with improved performance"
  }
};

/**
 * Default model to use when none is specified
 */
export const DEFAULT_CLAUDE_MODEL = "claude-3-haiku-20240307";

/**
 * Validates if a model ID is supported
 * @param {string} modelId - The model ID to validate
 * @returns {boolean} - True if model is valid, false otherwise
 */
export function isValidClaudeModel(modelId) {
  return VALID_CLAUDE_MODELS.includes(modelId);
}

/**
 * Gets formatted model list for API responses
 * @returns {Array} - Array of model objects with id, name, and description
 */
export function getClaudeModelList() {
  return VALID_CLAUDE_MODELS.map(modelId => ({
    id: modelId,
    name: CLAUDE_MODEL_INFO[modelId]?.name || modelId,
    description: CLAUDE_MODEL_INFO[modelId]?.description || "Claude model"
  }));
}

/**
 * Valid Google Gemini Model IDs
 * 
 * This array contains all currently supported Gemini models.
 * 
 * HOW TO UPDATE WHEN GOOGLE RELEASES NEW MODELS:
 * 1. Add the new model ID to the VALID_GEMINI_MODELS array below
 * 2. Update the model descriptions in GEMINI_MODEL_INFO if needed
 * 3. Test the new model with a sample request
 * 4. Update frontend dropdown options if desired
 * 
 * Model naming convention: gemini-{version}-{variant}
 * Examples: gemini-1.5-pro, gemini-1.5-flash
 */

export const VALID_GEMINI_MODELS = [
  "gemini-2.5-pro",
  "gemini-2.5-flash",
  "gemini-2.0-flash"
];

/**
 * Gemini Model Information
 * Provides human-readable names and descriptions for each model
 */
export const GEMINI_MODEL_INFO = {
  "gemini-2.5-pro": {
    name: "Gemini 2.5 Pro",
    description: "Most capable thinking model with complex reasoning capabilities"
  },
  "gemini-2.5-flash": {
    name: "Gemini 2.5 Flash",
    description: "Balanced model with 1 million token context window"
  },
  "gemini-2.0-flash": {
    name: "Gemini 2.0 Flash",
    description: "Fast and efficient model for quick responses"
  }
};

/**
 * Default model to use when none is specified
 */
export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

/**
 * Validates if a model ID is supported
 * @param {string} modelId - The model ID to validate
 * @returns {boolean} - True if model is valid, false otherwise
 */
export function isValidGeminiModel(modelId) {
  return VALID_GEMINI_MODELS.includes(modelId);
}

/**
 * Gets formatted model list for API responses
 * @returns {Array} - Array of model objects with id, name, and description
 */
export function getGeminiModelList() {
  return VALID_GEMINI_MODELS.map(modelId => ({
    id: modelId,
    name: GEMINI_MODEL_INFO[modelId]?.name || modelId,
    description: GEMINI_MODEL_INFO[modelId]?.description || "Gemini model"
  }));
}