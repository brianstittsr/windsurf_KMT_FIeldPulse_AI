'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { initializeFirebaseSchema } from '@/lib/firebase-schema';
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function SchemaInitializer() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [initializationStatus, setInitializationStatus] = useState<{
    [key: string]: 'pending' | 'success' | 'error';
  }>({});

  const initializationSteps = [
    'customers',
    'jobs', 
    'estimates',
    'invoices',
    'webhooks',
    'apiKeys',
    'aiAutomations'
  ];

  const handleInitialize = async () => {
    setIsInitializing(true);
    setInitializationStatus({});

    try {
      // Reset status
      const initialStatus = initializationSteps.reduce((acc, step) => {
        acc[step] = 'pending';
        return acc;
      }, {} as { [key: string]: 'pending' | 'success' | 'error' });
      
      setInitializationStatus(initialStatus);

      // Initialize schema with progress tracking
      await initializeFirebaseSchema();

      // Mark all as success
      const successStatus = initializationSteps.reduce((acc, step) => {
        acc[step] = 'success';
        return acc;
      }, {} as { [key: string]: 'pending' | 'success' | 'error' });
      
      setInitializationStatus(successStatus);
      toast.success('Firebase schema initialized successfully!');
    } catch (error) {
      console.error('Schema initialization failed:', error);
      toast.error('Failed to initialize Firebase schema');
      
      // Mark current step as error
      setInitializationStatus(prev => ({
        ...prev,
        error: 'error'
      }));
    } finally {
      setIsInitializing(false);
    }
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Firebase Schema Initializer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-gray-600">
          <p className="mb-4">
            This tool will initialize your Firebase Firestore database with sample data 
            based on the FieldPulse application structure. This includes:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Customer records</li>
            <li>Job entries with various statuses</li>
            <li>Estimates and invoices</li>
            <li>Webhook configurations</li>
            <li>API key management</li>
            <li>AI automation configurations</li>
          </ul>
          <p className="text-amber-600 font-medium">
            ⚠️ Warning: This will add sample data to your Firestore database. 
            Only run this on development or test environments.
          </p>
        </div>

        {Object.keys(initializationStatus).length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Initialization Progress:</h4>
            <div className="space-y-2">
              {initializationSteps.map((step) => (
                <div key={step} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                  {isInitializing && initializationStatus[step] === 'pending' ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  ) : (
                    getStatusIcon(initializationStatus[step])
                  )}
                  <span className="text-sm capitalize">
                    {step.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleInitialize}
            disabled={isInitializing}
            className="flex items-center gap-2"
          >
            {isInitializing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                Initialize Schema
              </>
            )}
          </Button>
          
          {Object.keys(initializationStatus).length > 0 && (
            <Button
              variant="outline"
              onClick={() => setInitializationStatus({})}
              disabled={isInitializing}
            >
              Clear Status
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <strong>Technical Details:</strong>
          <br />
          • Creates Firestore collections with proper indexing
          <br />
          • Implements security rules for data access
          <br />
          • Adds sample data for immediate testing
          <br />
          • Configures real-time synchronization
        </div>
      </CardContent>
    </Card>
  );
}
