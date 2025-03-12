import { executeAgentLoop } from '../../utils/agentLoop';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { query, history } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }
    
    // Execute the agent loop
    const result = await executeAgentLoop(query, history || []);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in agent API:', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
}