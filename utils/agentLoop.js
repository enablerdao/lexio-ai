// Agent loop utility functions
import { performWebSearch, extractWebpageContent } from './webSearch';

/**
 * Tool definitions for the agent
 */
const TOOLS = {
  WEB_SEARCH: 'web_search',
  EXTRACT_WEBPAGE: 'extract_webpage',
  CALCULATE: 'calculate',
  GET_CURRENT_TIME: 'get_current_time',
  CODE_EXECUTION: 'code_execution',
};

/**
 * Execute the agent loop to process a user query
 * @param {string} userQuery - The user's query
 * @param {Array} conversationHistory - The conversation history
 * @returns {Promise<Object>} - The agent's response
 */
export const executeAgentLoop = async (userQuery, conversationHistory = []) => {
  try {
    // Step 1: Analyze the user query to determine required tools
    const requiredTools = analyzeQuery(userQuery);
    
    // Step 2: Execute tools in sequence and collect results
    const toolResults = await executeTools(requiredTools, userQuery);
    
    // Step 3: Generate a response based on tool results
    const response = generateResponse(userQuery, toolResults, conversationHistory);
    
    return {
      response,
      toolsUsed: requiredTools.map(tool => tool.name),
      toolResults
    };
  } catch (error) {
    console.error('Agent loop error:', error);
    return {
      response: `I encountered an error while processing your request: ${error.message}. Please try again or rephrase your question.`,
      toolsUsed: [],
      toolResults: []
    };
  }
};

/**
 * Analyze the user query to determine which tools are needed
 * @param {string} query - The user's query
 * @returns {Array} - Array of required tools with parameters
 */
const analyzeQuery = (query) => {
  const normalizedQuery = query.toLowerCase();
  const requiredTools = [];
  
  // Check for search-related keywords
  if (
    normalizedQuery.includes('search') ||
    normalizedQuery.includes('find') ||
    normalizedQuery.includes('look up') ||
    normalizedQuery.includes('information about') ||
    normalizedQuery.includes('tell me about') ||
    normalizedQuery.includes('what is') ||
    normalizedQuery.includes('who is') ||
    normalizedQuery.includes('where is') ||
    normalizedQuery.includes('when is') ||
    normalizedQuery.includes('how to') ||
    normalizedQuery.includes('latest') ||
    normalizedQuery.includes('news') ||
    normalizedQuery.includes('weather')
  ) {
    // Extract the search query by removing action words
    let searchQuery = query
      .replace(/search for|search|find|look up|information about|tell me about/gi, '')
      .trim();
    
    // If the query starts with a question word, use the whole query
    if (/^(what|who|where|when|how|why)/i.test(normalizedQuery)) {
      searchQuery = query;
    }
    
    requiredTools.push({
      name: TOOLS.WEB_SEARCH,
      parameters: { query: searchQuery }
    });
  }
  
  // Check for time-related queries
  if (
    normalizedQuery.includes('time') ||
    normalizedQuery.includes('date') ||
    normalizedQuery.includes('day') ||
    normalizedQuery.includes('today') ||
    normalizedQuery.includes('current')
  ) {
    requiredTools.push({
      name: TOOLS.GET_CURRENT_TIME,
      parameters: {}
    });
  }
  
  // Check for calculation queries
  if (
    normalizedQuery.includes('calculate') ||
    normalizedQuery.includes('compute') ||
    normalizedQuery.includes('what is') ||
    /[0-9\+\-\*\/\(\)%]/.test(normalizedQuery)
  ) {
    // Extract potential mathematical expression
    const mathExpression = extractMathExpression(normalizedQuery);
    if (mathExpression) {
      requiredTools.push({
        name: TOOLS.CALCULATE,
        parameters: { expression: mathExpression }
      });
    }
  }
  
  // If no specific tools were identified, default to web search
  if (requiredTools.length === 0) {
    requiredTools.push({
      name: TOOLS.WEB_SEARCH,
      parameters: { query }
    });
  }
  
  return requiredTools;
};

/**
 * Extract a mathematical expression from text
 * @param {string} text - The text to extract from
 * @returns {string|null} - The extracted expression or null
 */
const extractMathExpression = (text) => {
  // Simple regex to find potential math expressions
  // This is a basic implementation and could be improved
  const mathRegex = /(\d+\s*[\+\-\*\/]\s*\d+)/;
  const match = text.match(mathRegex);
  
  if (match) {
    return match[0].replace(/\s+/g, '');
  }
  
  return null;
};

/**
 * Execute the required tools and collect results
 * @param {Array} tools - Array of tools to execute
 * @param {string} originalQuery - The original user query
 * @returns {Promise<Array>} - Array of tool results
 */
const executeTools = async (tools, originalQuery) => {
  const results = [];
  
  for (const tool of tools) {
    try {
      let result;
      
      switch (tool.name) {
        case TOOLS.WEB_SEARCH:
          result = await performWebSearch(tool.parameters.query);
          
          // If we got search results and there's a relevant result,
          // automatically extract content from the first result
          if (result.organic && result.organic.length > 0) {
            const firstResult = result.organic[0];
            const extractionResult = await extractWebpageContent(firstResult.link);
            
            results.push({
              tool: TOOLS.EXTRACT_WEBPAGE,
              result: extractionResult
            });
          }
          break;
          
        case TOOLS.EXTRACT_WEBPAGE:
          result = await extractWebpageContent(tool.parameters.url);
          break;
          
        case TOOLS.CALCULATE:
          result = calculateExpression(tool.parameters.expression);
          break;
          
        case TOOLS.GET_CURRENT_TIME:
          result = getCurrentTime();
          break;
          
        case TOOLS.CODE_EXECUTION:
          // In a real implementation, this would execute code safely
          // For demo purposes, we'll just return the code
          result = {
            code: tool.parameters.code,
            output: "Code execution is simulated in this demo version."
          };
          break;
          
        default:
          result = { error: `Unknown tool: ${tool.name}` };
      }
      
      results.push({
        tool: tool.name,
        result
      });
    } catch (error) {
      console.error(`Error executing tool ${tool.name}:`, error);
      results.push({
        tool: tool.name,
        error: error.message
      });
    }
  }
  
  return results;
};

/**
 * Calculate a mathematical expression
 * @param {string} expression - The expression to calculate
 * @returns {Object} - The calculation result
 */
const calculateExpression = (expression) => {
  try {
    // Using Function constructor to evaluate the expression
    // Note: In a production environment, you would want to use a safer method
    // or a dedicated math library to prevent security issues
    const result = new Function(`return ${expression}`)();
    
    return {
      expression,
      result: result.toString()
    };
  } catch (error) {
    return {
      expression,
      error: "Could not calculate this expression."
    };
  }
};

/**
 * Get the current time and date
 * @returns {Object} - Current time information
 */
const getCurrentTime = () => {
  const now = new Date();
  
  return {
    iso: now.toISOString(),
    formatted: now.toLocaleString(),
    time: now.toLocaleTimeString(),
    date: now.toLocaleDateString(),
    timestamp: now.getTime()
  };
};

/**
 * Generate a response based on tool results
 * @param {string} query - The original user query
 * @param {Array} toolResults - Results from executed tools
 * @param {Array} conversationHistory - The conversation history
 * @returns {string} - The generated response
 */
const generateResponse = (query, toolResults, conversationHistory) => {
  // In a production environment, this would use an LLM to generate a response
  // For demo purposes, we'll create a template-based response
  
  let response = '';
  
  // Handle web search results
  const searchResults = toolResults.find(r => r.tool === TOOLS.WEB_SEARCH);
  const extractionResults = toolResults.find(r => r.tool === TOOLS.EXTRACT_WEBPAGE);
  const calculationResults = toolResults.find(r => r.tool === TOOLS.CALCULATE);
  const timeResults = toolResults.find(r => r.tool === TOOLS.GET_CURRENT_TIME);
  
  if (searchResults && extractionResults) {
    const webContent = extractionResults.result;
    
    response += `Based on my search about "${searchResults.result.searchQuery}", I found the following information:\n\n`;
    response += `## ${webContent.title}\n\n`;
    response += webContent.text;
    
    // Add source attribution
    response += `\n\nSource: [${webContent.url}](${webContent.url})`;
  } else if (calculationResults) {
    const calc = calculationResults.result;
    
    if (calc.error) {
      response += `I tried to calculate "${calc.expression}" but encountered an error: ${calc.error}`;
    } else {
      response += `The result of ${calc.expression} is ${calc.result}.`;
    }
  } else if (timeResults) {
    const time = timeResults.result;
    
    if (query.toLowerCase().includes('time')) {
      response += `The current time is ${time.time}.`;
    } else if (query.toLowerCase().includes('date')) {
      response += `Today's date is ${time.date}.`;
    } else {
      response += `The current date and time is ${time.formatted}.`;
    }
  } else {
    // Fallback response if no tool results are available
    response += `I'm sorry, I couldn't find specific information about "${query}". Please try rephrasing your question or asking something else.`;
  }
  
  return response;
};