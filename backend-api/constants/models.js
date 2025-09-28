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