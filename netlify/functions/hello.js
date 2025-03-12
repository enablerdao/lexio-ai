// A simple serverless function for Netlify
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from lexio.ai serverless function!" })
  };
};