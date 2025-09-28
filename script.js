// DOM Elements
const elements = {
    // Parameters
    modelSelect: document.getElementById('model-select'),
    temperatureSlider: document.getElementById('temperature'),
    temperatureValue: document.getElementById('temperature-value'),
    maxTokensSlider: document.getElementById('max-tokens'),
    maxTokensValue: document.getElementById('max-tokens-value'),
    topPSlider: document.getElementById('top-p'),
    topPValue: document.getElementById('top-p-value'),
    
    // Input/Output
    promptInput: document.getElementById('prompt-input'),
    outputDisplay: document.getElementById('output-display'),
    
    // Buttons
    generateBtn: document.getElementById('generate-btn'),
    clearBtn: document.getElementById('clear-btn'),
    copyBtn: document.getElementById('copy-btn'),
    downloadBtn: document.getElementById('download-btn'),
    themeToggle: document.getElementById('theme-toggle'),
    
    // UI Elements
    btnText: document.querySelector('.btn-text'),
    btnLoader: document.querySelector('.btn-loader'),
    
    // Token counters
    promptTokens: document.getElementById('prompt-tokens'),
    completionTokens: document.getElementById('completion-tokens'),
    totalTokens: document.getElementById('total-tokens')
};

// Application State
const state = {
    isGenerating: false,
    currentOutput: '',
    darkMode: localStorage.getItem('darkMode') === 'true' || false,
    parameters: {
        model: 'llama3-8b-8192',
        temperature: 0.7,
        maxTokens: 1000,
        topP: 1.0
    }
};

// Dark Mode Functions
function initDarkMode() {
    if (state.darkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    localStorage.setItem('darkMode', state.darkMode);
    
    if (state.darkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Initialize the application
function init() {
    initDarkMode();
    setupEventListeners();
    updateParameterDisplays();
    loadSavedState();
}

// Event Listeners
function setupEventListeners() {
    // Parameter sliders
    elements.temperatureSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        state.parameters.temperature = value;
        elements.temperatureValue.textContent = value.toFixed(1);
        saveState();
    });

    elements.maxTokensSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        state.parameters.maxTokens = value;
        elements.maxTokensValue.textContent = value;
        saveState();
    });

    elements.topPSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        state.parameters.topP = value;
        elements.topPValue.textContent = value.toFixed(2);
        saveState();
    });

    elements.modelSelect.addEventListener('change', (e) => {
        state.parameters.model = e.target.value;
        saveState();
    });

    // Buttons
    elements.generateBtn.addEventListener('click', handleGenerate);
    elements.clearBtn.addEventListener('click', handleClear);
    elements.copyBtn.addEventListener('click', handleCopy);
    elements.downloadBtn.addEventListener('click', handleDownload);
    elements.themeToggle.addEventListener('click', toggleDarkMode);

    // Prompt input
    elements.promptInput.addEventListener('input', updatePromptTokenCount);
    elements.promptInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            handleGenerate();
        }
    });

    // Prompt suggestion cards
    const promptCards = document.querySelectorAll('.prompt-suggestion-card');
    promptCards.forEach(card => {
        card.addEventListener('click', () => {
            const prompt = card.getAttribute('data-prompt');
            elements.promptInput.value = prompt;
            elements.promptInput.focus();
            updatePromptTokenCount();
            saveState();
        });
    });
}

// Update parameter displays
function updateParameterDisplays() {
    elements.temperatureValue.textContent = state.parameters.temperature.toFixed(1);
    elements.maxTokensValue.textContent = state.parameters.maxTokens;
    elements.topPValue.textContent = state.parameters.topP.toFixed(2);
    elements.modelSelect.value = state.parameters.model;
    
    elements.temperatureSlider.value = state.parameters.temperature;
    elements.maxTokensSlider.value = state.parameters.maxTokens;
    elements.topPSlider.value = state.parameters.topP;
}

// Handle generation (real API call with fallback)
async function handleGenerate() {
    const prompt = elements.promptInput.value.trim();
    
    if (!prompt) {
        showNotification('Please enter a prompt', 'error');
        return;
    }

    if (state.isGenerating) {
        return;
    }

    setGeneratingState(true);
    
    try {
        // Try to make actual API call to backend
        const response = await callLLMAPI(prompt);
        displayOutput(response.content);
        updateTokenCounts(prompt, response.content, response.usage);
        showNotification('Generation completed!', 'success');
    } catch (error) {
        console.warn('API call failed, falling back to simulation:', error.message);
        
        // Check if it's an API key error
        if (error.message.includes('API key') || error.message.includes('Unauthorized') || error.message.includes('401')) {
            showNotification('API key not configured. Using demo mode...', 'warning');
            
            // Fallback to simulation
            try {
                const simulatedResponse = await simulateGeneration(prompt);
                displayOutput(simulatedResponse.content);
                updateTokenCounts(prompt, simulatedResponse.content, simulatedResponse.usage);
                showNotification('Demo generation completed! Configure API keys for real AI responses.', 'info');
            } catch (simError) {
                showNotification(`Generation failed: ${simError.message}`, 'error');
                console.error('Simulation error:', simError);
            }
        } else {
            showNotification(`Generation failed: ${error.message}`, 'error');
            console.error('Generation error:', error);
        }
    } finally {
        setGeneratingState(false);
    }
}

// Make API call to backend
async function callLLMAPI(prompt) {
    const apiEndpoint = getAPIEndpoint();
    const requestBody = {
        prompt: prompt,
        temperature: state.parameters.temperature,
        max_tokens: state.parameters.maxTokens,
        top_p: state.parameters.topP,
        model: state.parameters.model
    };

    const response = await fetch(`${apiEndpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
        content: data.data.content,
        usage: data.data.usage || {}
    };
}

// Simulation function for demo mode
async function simulateGeneration(prompt) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = [
        `Thank you for your question about "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}". This is a simulated response to demonstrate the interface. To get real AI responses, please configure your API keys in the backend .env file.

Here's what you can do:
1. Get API keys from OpenAI, Anthropic, Groq, or Hugging Face
2. Add them to backend-api/.env file
3. Restart the backend server
4. Try generating again!

The interface supports multiple AI providers and models, with real-time token counting and response streaming.`,
        
        `I understand you're asking about "${prompt.substring(0, 30)}${prompt.length > 30 ? '...' : ''}". This is a demo response since no API keys are configured.

To enable real AI responses:
• Visit the provider websites to get API keys
• Update the .env file in the backend-api directory
• Choose from 15+ available AI models
• Experience real AI-powered text generation

This playground supports OpenAI GPT models, Anthropic Claude, Groq's fast inference, and Hugging Face models.`,
        
        `Your prompt "${prompt.substring(0, 40)}${prompt.length > 40 ? '...' : ''}" would generate an AI response if API keys were configured.

Demo Mode Features:
✓ Full interface functionality
✓ Parameter controls (temperature, tokens, top-p)
✓ Token counting simulation
✓ Copy and download capabilities
✓ Dark/light mode themes

Ready for real AI? Add your API keys to backend-api/.env and restart the server!`
    ];
    
    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
    const promptTokens = Math.ceil(prompt.length / 4);
    const completionTokens = Math.ceil(selectedResponse.length / 4);
    
    return {
        content: selectedResponse,
        usage: {
            prompt_tokens: promptTokens,
            completion_tokens: completionTokens,
            total_tokens: promptTokens + completionTokens
        }
    };
}

// Get API endpoint based on selected model
function getAPIEndpoint() {
    const model = state.parameters.model.toLowerCase();
    
    if (model.includes('gpt') || model.includes('openai')) {
        return '/api/openai';
    } else if (model.includes('claude') || model.includes('anthropic')) {
        return '/api/anthropic';
    } else if (model.includes('llama') || model.includes('mixtral') || model.includes('gemma')) {
        return '/api/groq';
    } else {
        return '/api/huggingface';
    }
}

// Display output
function displayOutput(text) {
    state.currentOutput = text;
    elements.outputDisplay.innerHTML = `<div class="font-mono text-sm text-slate-900 dark:text-white whitespace-pre-wrap leading-relaxed">${text}</div>`;
    elements.outputDisplay.scrollTop = 0;
}

// Clear everything
function handleClear() {
    elements.promptInput.value = '';
    elements.outputDisplay.innerHTML = `
        <div class="output-placeholder flex flex-col items-center justify-center h-full text-center py-12">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-slate-400 dark:text-slate-500 mb-4">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
            </svg>
            <p class="text-slate-500 dark:text-slate-400 text-sm">Your generated content will appear here</p>
        </div>
    `;
    state.currentOutput = '';
    updateTokenCounts('', '');
    elements.promptInput.focus();
}

// Copy to clipboard
async function handleCopy() {
    if (!state.currentOutput) {
        showNotification('No content to copy', 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(state.currentOutput);
        showNotification('Copied to clipboard!', 'success');
    } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = state.currentOutput;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Copied to clipboard!', 'success');
    }
}

// Download as text file
function handleDownload() {
    if (!state.currentOutput) {
        showNotification('No content to download', 'error');
        return;
    }

    const blob = new Blob([state.currentOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `llm-output-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('File downloaded!', 'success');
}

// Set generating state
function setGeneratingState(isGenerating) {
    state.isGenerating = isGenerating;
    elements.generateBtn.disabled = isGenerating;
    
    if (isGenerating) {
        elements.btnText.style.display = 'none';
        elements.btnLoader.classList.remove('hidden');
    } else {
        elements.btnText.style.display = 'block';
        elements.btnLoader.classList.add('hidden');
    }
}

// Update token counts (from API response or estimated)
function updateTokenCounts(prompt, completion, usage = {}) {
    let promptTokens, completionTokens, totalTokens;
    
    if (usage && (usage.prompt_tokens || usage.input_tokens)) {
        // Use actual token counts from API
        promptTokens = usage.prompt_tokens || usage.input_tokens || 0;
        completionTokens = usage.completion_tokens || usage.output_tokens || 0;
        totalTokens = usage.total_tokens || (promptTokens + completionTokens);
    } else {
        // Fallback to estimation
        promptTokens = Math.ceil(prompt.length / 4);
        completionTokens = Math.ceil(completion.length / 4);
        totalTokens = promptTokens + completionTokens;
    }
    
    elements.promptTokens.textContent = promptTokens;
    elements.completionTokens.textContent = completionTokens;
    elements.totalTokens.textContent = totalTokens;
}

// Update prompt token count
function updatePromptTokenCount() {
    const prompt = elements.promptInput.value;
    const promptTokens = Math.ceil(prompt.length / 4);
    elements.promptTokens.textContent = promptTokens;
    
    // Reset completion tokens when prompt changes
    if (!state.currentOutput) {
        elements.completionTokens.textContent = '0';
        elements.totalTokens.textContent = promptTokens;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        fontSize: '0.9rem',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'
    });

    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('llm-playground-state', JSON.stringify(state.parameters));
}

// Load saved state
function loadSavedState() {
    try {
        const saved = localStorage.getItem('llm-playground-state');
        if (saved) {
            const savedParams = JSON.parse(saved);
            state.parameters = { ...state.parameters, ...savedParams };
            updateParameterDisplays();
        }
    } catch (error) {
        console.warn('Failed to load saved state:', error);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                if (!state.isGenerating) {
                    handleGenerate();
                }
                break;
            case 'k':
                e.preventDefault();
                handleClear();
                break;
            case 'c':
                if (e.shiftKey) {
                    e.preventDefault();
                    handleCopy();
                }
                break;
        }
    }
});

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Add some sample prompts for demonstration
const samplePrompts = [
    "Explain quantum computing in simple terms",
    "Write a creative story about a time-traveling scientist",
    "What are the benefits of renewable energy?",
    "Create a recipe for a healthy breakfast",
    "Explain the concept of machine learning"
];

// Add sample prompt functionality
function addSamplePromptButton() {
    const sampleBtn = document.createElement('button');
    sampleBtn.textContent = 'Try Sample Prompt';
    sampleBtn.className = 'btn btn-secondary';
    sampleBtn.style.marginTop = '8px';
    
    sampleBtn.addEventListener('click', () => {
        const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
        elements.promptInput.value = randomPrompt;
        updatePromptTokenCount();
        elements.promptInput.focus();
    });
    
    elements.promptInput.parentNode.appendChild(sampleBtn);
}

// Add sample prompt button after initialization
setTimeout(addSamplePromptButton, 100);