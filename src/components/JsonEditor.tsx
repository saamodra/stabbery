import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface JsonEditorProps {
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  className?: string;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  placeholder = '{}',
  className = ''
}) => {
  const [textValue, setTextValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      setTextValue(JSON.stringify(value, null, 2));
      setIsValid(true);
      setError('');
    } catch (err) {
      setTextValue(String(value));
      setIsValid(false);
      setError('Invalid JSON');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTextValue(newValue);

    try {
      if (newValue.trim() === '') {
        onChange({});
        setIsValid(true);
        setError('');
      } else {
        const parsed = JSON.parse(newValue);
        onChange(parsed);
        setIsValid(true);
        setError('');
      }
    } catch (err: any) {
      setIsValid(false);
      setError(err.message);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        <textarea
          value={textValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full h-32 px-3 py-2 border rounded-lg font-mono text-sm resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            isValid 
              ? 'border-slate-300' 
              : 'border-red-300 bg-red-50'
          }`}
        />
        <div className="absolute top-2 right-2">
          {isValid ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
        </div>
      </div>
      {!isValid && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};