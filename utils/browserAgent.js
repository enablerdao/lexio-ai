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
    
    const searchResults = [
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
    ];
    
    return {
      type: 'search',
      task: task,
      searchTerm,
      url: `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`,
      results: searchResults,
      date: currentDate,
      summary: `I searched for information about "${searchTerm}" and found several relevant results.`,
      details: {
        query: searchTerm,
        resultsCount: searchResults.length,
        topResult: searchResults[0].title
      },
      steps: [
        {
          type: 'navigation',
          url: 'https://www.google.com',
          title: 'Google',
          description: 'Navigated to Google search page'
        },
        {
          type: 'form',
          url: 'https://www.google.com',
          title: 'Search Input',
          description: `Entered search query: "${searchTerm}"`,
          fields: [
            { name: 'Search', value: searchTerm }
          ]
        },
        {
          type: 'click',
          url: 'https://www.google.com',
          title: 'Search Execution',
          description: 'Clicked search button',
          element: 'Search Button'
        },
        {
          type: 'search',
          url: `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`,
          title: `Search Results for "${searchTerm}"`,
          description: 'Viewing search results',
          query: searchTerm,
          results: searchResults
        }
      ],
      screenshots: [
        {
          url: '/placeholder-screenshot.png',
          description: 'Google Search Page'
        },
        {
          url: '/placeholder-screenshot.png',
          description: `Search Results for "${searchTerm}"`
        }
      ]
    };
  }
  
  // Weather-related tasks
  else if (normalizedTask.includes('weather')) {
    const location = normalizedTask.includes('in ') 
      ? normalizedTask.split('in ')[1].trim() 
      : 'current location';
    
    const forecast = {
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
    };
    
    return {
      type: 'weather',
      task: task,
      location: location,
      forecast: forecast,
      date: currentDate,
      summary: `I checked the weather for ${location}. Currently it's ${forecast.current.temperature} and ${forecast.current.conditions.toLowerCase()}.`,
      details: {
        location: location,
        currentTemp: forecast.current.temperature,
        conditions: forecast.current.conditions,
        humidity: forecast.current.humidity,
        forecast: `${forecast.daily[0].high} / ${forecast.daily[0].low}`
      },
      steps: [
        {
          type: 'navigation',
          url: 'https://www.weather.com',
          title: 'Weather.com',
          description: 'Navigated to Weather.com'
        },
        {
          type: 'form',
          url: 'https://www.weather.com',
          title: 'Location Search',
          description: `Searched for location: "${location}"`,
          fields: [
            { name: 'Location', value: location }
          ]
        },
        {
          type: 'click',
          url: 'https://www.weather.com',
          title: 'Search Execution',
          description: 'Clicked search button',
          element: 'Search Button'
        },
        {
          type: 'navigation',
          url: `https://www.weather.com/weather/today/l/${location.replace(/\s+/g, '-').toLowerCase()}`,
          title: `Weather for ${location}`,
          description: `Viewing weather information for ${location}`,
          content: `Current conditions: ${forecast.current.temperature}, ${forecast.current.conditions}`
        }
      ],
      screenshots: [
        {
          url: '/placeholder-screenshot.png',
          description: 'Weather.com Homepage'
        },
        {
          url: '/placeholder-screenshot.png',
          description: `Weather Forecast for ${location}`
        }
      ]
    };
  }
  
  // News-related tasks
  else if (normalizedTask.includes('news')) {
    const category = normalizedTask.includes('about ') 
      ? normalizedTask.split('about ')[1].trim() 
      : 'general';
    
    const articles = [
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
    ];
    
    return {
      type: 'news',
      task: task,
      category: category,
      articles: articles,
      date: currentDate,
      summary: `I found the latest ${category !== 'general' ? category + ' ' : ''}news articles from reliable sources.`,
      details: {
        category: category,
        articleCount: articles.length,
        sources: articles.map(a => a.source).join(', '),
        topHeadline: articles[0].title
      },
      steps: [
        {
          type: 'navigation',
          url: 'https://news.google.com',
          title: 'Google News',
          description: 'Navigated to Google News'
        },
        {
          type: 'form',
          url: 'https://news.google.com',
          title: 'News Search',
          description: category !== 'general' ? `Searched for news about: "${category}"` : 'Browsed top headlines',
          fields: category !== 'general' ? [
            { name: 'Search', value: category }
          ] : []
        },
        {
          type: 'navigation',
          url: category !== 'general' 
            ? `https://news.google.com/search?q=${encodeURIComponent(category)}` 
            : 'https://news.google.com',
          title: category !== 'general' ? `News about ${category}` : 'Top Headlines',
          description: 'Viewing news articles',
          content: 'List of news articles from various sources'
        }
      ],
      screenshots: [
        {
          url: '/placeholder-screenshot.png',
          description: 'Google News Homepage'
        },
        {
          url: '/placeholder-screenshot.png',
          description: category !== 'general' ? `News Search Results for "${category}"` : 'Top Headlines'
        }
      ]
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
    
    const products = [
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
    ];
    
    return {
      type: 'shopping',
      task: task,
      product: productTerm,
      results: products,
      date: currentDate,
      summary: `I found several options for ${productTerm} at different price points from various retailers.`,
      details: {
        product: productTerm,
        priceRange: `$${products[2].price.replace('$', '')} - $${products[0].price.replace('$', '')}`,
        bestRated: products.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))[0].name,
        stores: products.map(p => p.store).join(', ')
      },
      steps: [
        {
          type: 'navigation',
          url: 'https://www.google.com',
          title: 'Google',
          description: 'Navigated to Google search page'
        },
        {
          type: 'form',
          url: 'https://www.google.com',
          title: 'Product Search',
          description: `Searched for: "${productTerm} price comparison"`,
          fields: [
            { name: 'Search', value: `${productTerm} price comparison` }
          ]
        },
        {
          type: 'navigation',
          url: `https://www.google.com/search?q=${encodeURIComponent(productTerm + ' price comparison')}`,
          title: 'Search Results',
          description: 'Viewing search results for product',
          content: 'List of product search results'
        },
        {
          type: 'navigation',
          url: 'https://www.amazon.com',
          title: 'Amazon',
          description: 'Navigated to Amazon'
        },
        {
          type: 'form',
          url: 'https://www.amazon.com',
          title: 'Amazon Search',
          description: `Searched for: "${productTerm}"`,
          fields: [
            { name: 'Search', value: productTerm }
          ]
        },
        {
          type: 'navigation',
          url: `https://www.amazon.com/s?k=${encodeURIComponent(productTerm)}`,
          title: 'Amazon Search Results',
          description: `Viewing Amazon results for "${productTerm}"`,
          content: 'List of products on Amazon'
        }
      ],
      screenshots: [
        {
          url: '/placeholder-screenshot.png',
          description: 'Google Search Results'
        },
        {
          url: '/placeholder-screenshot.png',
          description: 'Amazon Product Listings'
        },
        {
          url: '/placeholder-screenshot.png',
          description: 'Price Comparison Results'
        }
      ]
    };
  }
  
  // Website navigation tasks
  else if (
    normalizedTask.includes('go to') || 
    normalizedTask.includes('visit') || 
    normalizedTask.includes('open') ||
    normalizedTask.includes('navigate to')
  ) {
    let website = task.replace(/go to|visit|open|navigate to/gi, '').trim();
    
    // Extract domain if it's a URL
    if (website.includes('.')) {
      website = website.replace(/https?:\/\//i, '').split('/')[0];
    } else {
      website = website + '.com';
    }
    
    const url = website.startsWith('http') ? website : `https://${website}`;
    
    return {
      type: 'navigation',
      task: task,
      website: website,
      url: url,
      date: currentDate,
      summary: `I navigated to ${website} and explored the website.`,
      details: {
        website: website,
        url: url,
        title: website.charAt(0).toUpperCase() + website.slice(1).split('.')[0] + ' Homepage'
      },
      steps: [
        {
          type: 'navigation',
          url: url,
          title: website.charAt(0).toUpperCase() + website.slice(1).split('.')[0] + ' Homepage',
          description: `Navigated to ${website}`,
          content: `Main content of ${website}`
        }
      ],
      screenshots: [
        {
          url: '/placeholder-screenshot.png',
          description: `${website} Homepage`
        }
      ]
    };
  }
  
  // Default response for other tasks
  else {
    return {
      type: 'general',
      task: task,
      message: `I've completed the task: "${task}". Here's what I found...`,
      summary: 'The requested information has been gathered from various sources and compiled for your review.',
      date: currentDate,
      details: {
        task: task,
        completionTime: new Date().toLocaleTimeString()
      },
      steps: [
        {
          type: 'navigation',
          url: 'https://www.google.com',
          title: 'Google',
          description: 'Started research at Google'
        },
        {
          type: 'form',
          url: 'https://www.google.com',
          title: 'Search',
          description: `Searched for information related to: "${task}"`,
          fields: [
            { name: 'Search', value: task }
          ]
        },
        {
          type: 'navigation',
          url: `https://www.google.com/search?q=${encodeURIComponent(task)}`,
          title: 'Search Results',
          description: 'Analyzed search results',
          content: 'List of search results'
        }
      ],
      screenshots: [
        {
          url: '/placeholder-screenshot.png',
          description: 'Research Process'
        }
      ]
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