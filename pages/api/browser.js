// API endpoint for browser agent interactions
import { executeBrowserTask, formatBrowserResult } from '../../utils/browserAgent';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { task } = req.body;
    
    if (!task) {
      return res.status(400).json({ message: 'Task is required' });
    }
    
    // Execute the browser task
    const browserResult = await executeBrowserTask(task);
    
    // Format the result into a readable response
    const formattedResponse = formatBrowserResult(browserResult);
    
    return res.status(200).json({ 
      success: browserResult.success,
      response: formattedResponse,
      rawResult: browserResult.result
    });
  } catch (error) {
    console.error('Error in browser API:', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
}