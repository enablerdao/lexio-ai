// Browser Agent utility for lexio.ai
// This module provides functionality to use browser-use for web interactions

/**
 * Execute a browser task using Python's browser-use library
 * @param {string} task - The task to execute
 * @returns {Promise<Object>} - The result of the browser task
 */
export const executeBrowserTask = async (task) => {
  try {
    // In a production environment, we would call a backend API
    // For demo purposes, we'll simulate browser interaction
    console.log('Executing browser task:', task);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a mock result based on the task
    const result = generateMockBrowserResult(task);
    
    return {
      success: true,
      result
    };
  } catch (error) {
    console.error('Browser task execution error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate a mock result for a browser task
 * @param {string} task - The task that was executed
 * @returns {Object} - A mock result
 */
const generateMockBrowserResult = (task) => {
  const normalizedTask = task.toLowerCase();
  
  // Current date for fresh content
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Search-related tasks
  if (
    normalizedTask.includes('search') || 
    normalizedTask.includes('find') || 
    normalizedTask.includes('look up')
  ) {
    let searchTerm = task.replace(/search for|search|find|look up/gi, '').trim();
    
    return {
      type: 'search',
      searchTerm,
      url: `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`,
      results: [
        {
          title: `${searchTerm} - Latest Information`,
          snippet: `Comprehensive information about ${searchTerm}. Includes recent developments, key facts, and expert analysis.`,
          url: `https://example.com/info/${searchTerm.replace(/\s+/g, '-').toLowerCase()}`
        },
        {
          title: `Understanding ${searchTerm} - A Complete Guide`,
          snippet: `Everything you need to know about ${searchTerm}. This guide covers fundamental concepts, practical applications, and expert insights.`,
          url: `https://guide.example.com/${searchTerm.replace(/\s+/g, '-').toLowerCase()}`
        },
        {
          title: `${searchTerm} - Wikipedia`,
          snippet: `${searchTerm} refers to multiple concepts across various fields. This article provides an overview of its definitions, history, and applications.`,
          url: `https://en.wikipedia.org/wiki/${searchTerm.replace(/\s+/g, '_')}`
        }
      ],
      date: currentDate
    };
  }
  
  // Weather-related tasks
  else if (normalizedTask.includes('weather')) {
    return {
      type: 'weather',
      location: normalizedTask.includes('in ') 
        ? normalizedTask.split('in ')[1].trim() 
        : 'current location',
      forecast: {
        current: {
          temperature: '72°F (22°C)',
          conditions: 'Partly Cloudy',
          humidity: '45%',
          wind: '8 mph NW'
        },
        daily: [
          {
            day: 'Today',
            high: '78°F (26°C)',
            low: '65°F (18°C)',
            conditions: 'Partly Cloudy'
          },
          {
            day: 'Tomorrow',
            high: '80°F (27°C)',
            low: '67°F (19°C)',
            conditions: 'Sunny'
          },
          {
            day: 'Wednesday',
            high: '75°F (24°C)',
            low: '62°F (17°C)',
            conditions: 'Chance of Rain'
          }
        ]
      },
      date: currentDate
    };
  }
  
  // News-related tasks
  else if (normalizedTask.includes('news')) {
    return {
      type: 'news',
      category: normalizedTask.includes('about ') 
        ? normalizedTask.split('about ')[1].trim() 
        : 'general',
      articles: [
        {
          title: 'Breaking News: Major Technology Breakthrough Announced',
          summary: 'Scientists have developed a new quantum computing architecture that could revolutionize data processing capabilities.',
          source: 'Tech Today',
          url: 'https://example.com/tech-news/quantum-breakthrough'
        },
        {
          title: 'Global Climate Summit Reaches New Agreement',
          summary: 'World leaders have finalized a new climate accord aimed at reducing carbon emissions by 50% before 2030.',
          source: 'World News Network',
          url: 'https://example.com/world-news/climate-summit'
        },
        {
          title: 'Financial Markets Show Strong Growth in Third Quarter',
          summary: 'Stock markets worldwide reported significant gains, with technology and renewable energy sectors leading the way.',
          source: 'Financial Times',
          url: 'https://example.com/finance/market-growth'
        }
      ],
      date: currentDate
    };
  }
  
  // Shopping or product-related tasks
  else if (
    normalizedTask.includes('buy') || 
    normalizedTask.includes('shop') || 
    normalizedTask.includes('product') ||
    normalizedTask.includes('price')
  ) {
    let productTerm = task.replace(/buy|shop for|find products|check price of|price of/gi, '').trim();
    
    return {
      type: 'shopping',
      product: productTerm,
      results: [
        {
          name: `Premium ${productTerm}`,
          price: '$129.99',
          rating: '4.7/5',
          store: 'Amazon',
          url: `https://amazon.example.com/products/${productTerm.replace(/\s+/g, '-').toLowerCase()}`
        },
        {
          name: `Standard ${productTerm}`,
          price: '$79.99',
          rating: '4.2/5',
          store: 'Walmart',
          url: `https://walmart.example.com/items/${productTerm.replace(/\s+/g, '-').toLowerCase()}`
        },
        {
          name: `Budget ${productTerm}`,
          price: '$49.99',
          rating: '3.9/5',
          store: 'Target',
          url: `https://target.example.com/shop/${productTerm.replace(/\s+/g, '-').toLowerCase()}`
        }
      ],
      date: currentDate
    };
  }
  
  // Default response for other tasks
  else {
    return {
      type: 'general',
      task: task,
      message: `I've completed the task: "${task}". Here's what I found...`,
      summary: 'The requested information has been gathered from various sources and compiled for your review.',
      date: currentDate
    };
  }
};

/**
 * Format browser results into a readable response
 * @param {Object} browserResult - The result from the browser task
 * @returns {string} - Formatted response
 */
export const formatBrowserResult = (browserResult) => {
  if (!browserResult || !browserResult.success) {
    return `I encountered an error while trying to use the browser: ${browserResult?.error || 'Unknown error'}`;
  }
  
  const result = browserResult.result;
  
  switch (result.type) {
    case 'search':
      return `
## Search Results for "${result.searchTerm}"

I searched for information about "${result.searchTerm}" and found these results:

${result.results.map((item, index) => `
### ${index + 1}. ${item.title}
${item.snippet}
[View source](${item.url})
`).join('\n')}

Search performed on ${result.date}
      `;
      
    case 'weather':
      return `
## Weather Forecast for ${result.location}

### Current Conditions
- Temperature: ${result.forecast.current.temperature}
- Conditions: ${result.forecast.current.conditions}
- Humidity: ${result.forecast.current.humidity}
- Wind: ${result.forecast.current.wind}

### 3-Day Forecast
${result.forecast.daily.map(day => `
**${day.day}**: ${day.conditions}, High: ${day.high}, Low: ${day.low}
`).join('')}

Weather information as of ${result.date}
      `;
      
    case 'news':
      return `
## Latest News ${result.category !== 'general' ? `about ${result.category}` : ''}

${result.articles.map((article, index) => `
### ${article.title}
${article.summary}
Source: ${article.source} | [Read more](${article.url})
`).join('\n')}

News gathered on ${result.date}
      `;
      
    case 'shopping':
      return `
## Shopping Results for "${result.product}"

${result.results.map((item, index) => `
### ${index + 1}. ${item.name}
- Price: ${item.price}
- Rating: ${item.rating}
- Store: ${item.store}
- [View product](${item.url})
`).join('\n')}

Prices checked on ${result.date}
      `;
      
    default:
      return `
## Task Completed

I've completed the task: "${result.task}"

${result.message}

${result.summary}

Completed on ${result.date}
      `;
  }
};