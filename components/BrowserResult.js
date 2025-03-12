import { useState } from 'react';
import { motion } from 'framer-motion';
import BrowserView from './BrowserView';

export default function BrowserResult({ result }) {
  const [activeTab, setActiveTab] = useState('summary');
  
  if (!result) return null;
  
  return (
    <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'summary'
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab('browser')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'browser'
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Browser View
        </button>
        {result.screenshots && result.screenshots.length > 0 && (
          <button
            onClick={() => setActiveTab('screenshots')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'screenshots'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Screenshots
          </button>
        )}
      </div>
      
      {/* Tab content */}
      <div className="p-4 bg-white dark:bg-gray-900">
        {activeTab === 'summary' && (
          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-lg font-semibold mb-2">Task Summary</h3>
            <p className="text-gray-700 dark:text-gray-300">{result.summary || 'Task completed successfully.'}</p>
            
            {result.details && (
              <div className="mt-4">
                <h4 className="text-md font-semibold mb-2">Details</h4>
                <div className="space-y-2">
                  {Object.entries(result.details).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="font-medium text-gray-600 dark:text-gray-400 w-1/4">{key}:</span>
                      <span className="text-gray-800 dark:text-gray-200">{
                        typeof value === 'object' 
                          ? JSON.stringify(value, null, 2) 
                          : value
                      }</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {result.steps && result.steps.length > 0 && (
              <div className="mt-4">
                <h4 className="text-md font-semibold mb-2">Steps Performed</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  {result.steps.map((step, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">
                      {step.description || `Step ${index + 1}`}
                      {step.url && (
                        <span className="text-primary-600 dark:text-primary-400 text-sm ml-2">
                          ({step.url})
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'browser' && (
          <div className="h-96">
            <BrowserView 
              url={result.url} 
              task={result.task}
              result={result}
            />
          </div>
        )}
        
        {activeTab === 'screenshots' && result.screenshots && (
          <div className="space-y-4">
            {result.screenshots.map((screenshot, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">
                    Screenshot {index + 1}: {screenshot.description || `Step ${index + 1}`}
                  </h4>
                </div>
                <div className="p-2">
                  <img 
                    src={screenshot.url || '/placeholder-screenshot.png'} 
                    alt={screenshot.description || `Screenshot ${index + 1}`}
                    className="max-w-full h-auto rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}