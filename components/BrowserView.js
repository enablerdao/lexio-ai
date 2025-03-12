import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BrowserView({ url, task, result }) {
  const [loading, setLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url || 'https://www.google.com');
  const [browserContent, setBrowserContent] = useState(null);
  const [browserHistory, setBrowserHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (url && url !== currentUrl) {
      setCurrentUrl(url);
    }
  }, [url]);

  useEffect(() => {
    if (result && result.steps) {
      setBrowserHistory(result.steps);
      setCurrentStep(0);
      simulateBrowserNavigation(result.steps);
    }
  }, [result]);

  const simulateBrowserNavigation = (steps) => {
    if (!steps || steps.length === 0) return;
    
    setLoading(true);
    let currentStepIndex = 0;
    
    const processStep = () => {
      if (currentStepIndex >= steps.length) {
        setLoading(false);
        return;
      }
      
      const step = steps[currentStepIndex];
      setCurrentStep(currentStepIndex);
      
      if (step.url) {
        setCurrentUrl(step.url);
      }
      
      setBrowserContent(step);
      
      currentStepIndex++;
      setTimeout(processStep, 1500); // Simulate delay between steps
    };
    
    processStep();
  };

  const handleUrlChange = (e) => {
    setCurrentUrl(e.target.value);
  };

  const handleUrlSubmit = (e) => {
    if (e.key === 'Enter') {
      let url = currentUrl;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      setCurrentUrl(url);
      setLoading(true);
      
      // Simulate page loading
      setTimeout(() => {
        setBrowserContent({
          type: 'navigation',
          url: url,
          title: url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0],
          content: `Simulated content for ${url}`
        });
        setLoading(false);
      }, 1000);
    }
  };

  const renderBrowserContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      );
    }
    
    if (!browserContent) {
      return (
        <div className="text-center text-gray-500 p-4">
          <p className="mb-2">Enter a URL or use the AI to browse the web</p>
          <p className="text-sm mt-4">
            Try asking the AI:
          </p>
          <ul className="text-sm mt-2 space-y-1 text-left max-w-md mx-auto">
            <li>• "Search for the latest AI research"</li>
            <li>• "Go to github.com"</li>
            <li>• "Find information about climate change"</li>
          </ul>
        </div>
      );
    }
    
    switch (browserContent.type) {
      case 'navigation':
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">{browserContent.title || 'Web Page'}</h2>
            <div className="border border-gray-200 rounded p-3 bg-gray-50">
              <p className="text-gray-700">{browserContent.content || `Content for ${browserContent.url}`}</p>
            </div>
          </div>
        );
        
      case 'search':
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Search Results: {browserContent.query}</h2>
            <div className="space-y-4">
              {(browserContent.results || []).map((result, index) => (
                <div key={index} className="border border-gray-200 rounded p-3 bg-gray-50">
                  <h3 className="text-blue-600 hover:underline font-medium">{result.title}</h3>
                  <p className="text-green-700 text-sm">{result.url}</p>
                  <p className="text-gray-700 text-sm mt-1">{result.snippet}</p>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'form':
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">{browserContent.title || 'Form Interaction'}</h2>
            <div className="border border-gray-200 rounded p-3 bg-gray-50">
              <p className="text-gray-700 mb-2">{browserContent.description || 'Filling out a form'}</p>
              <div className="space-y-2 border-t border-gray-200 pt-2">
                {(browserContent.fields || []).map((field, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-gray-500 w-1/3">{field.name}:</span>
                    <span className="text-gray-700 font-medium">{field.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'click':
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">{browserContent.title || 'Click Interaction'}</h2>
            <div className="border border-gray-200 rounded p-3 bg-gray-50">
              <p className="text-gray-700">Clicked on: <span className="font-medium">{browserContent.element}</span></p>
              {browserContent.description && (
                <p className="text-gray-600 mt-2">{browserContent.description}</p>
              )}
            </div>
          </div>
        );
        
      default:
        return (
          <div className="p-4 text-gray-700">
            <p>Browser content would be displayed here</p>
            <p className="text-primary-600 font-mono text-sm break-all mt-2">{currentUrl}</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Browser chrome */}
      <div className="bg-gray-100 p-2 border-b border-gray-200 flex items-center">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 flex items-center bg-white rounded border border-gray-300 px-2">
          {loading && (
            <div className="animate-spin h-4 w-4 border-t-2 border-blue-500 rounded-full mr-2"></div>
          )}
          <input
            type="text"
            value={currentUrl}
            onChange={handleUrlChange}
            onKeyDown={handleUrlSubmit}
            className="flex-1 py-1 text-sm focus:outline-none"
          />
        </div>
      </div>
      
      {/* Browser content */}
      <div className="flex-1 overflow-y-auto">
        {renderBrowserContent()}
      </div>
      
      {/* Browser steps navigation (only shown when there are steps) */}
      {browserHistory.length > 0 && (
        <div className="bg-gray-100 p-2 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                if (currentStep > 0) {
                  setCurrentStep(currentStep - 1);
                  setBrowserContent(browserHistory[currentStep - 1]);
                }
              }}
              disabled={currentStep === 0}
              className={`px-2 py-1 rounded ${
                currentStep === 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {browserHistory.length}
            </span>
            
            <button
              onClick={() => {
                if (currentStep < browserHistory.length - 1) {
                  setCurrentStep(currentStep + 1);
                  setBrowserContent(browserHistory[currentStep + 1]);
                }
              }}
              disabled={currentStep === browserHistory.length - 1}
              className={`px-2 py-1 rounded ${
                currentStep === browserHistory.length - 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}