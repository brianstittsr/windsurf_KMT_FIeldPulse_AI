'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function LoginForm() {
  const [apiKey, setApiKey] = useState('');
  const { login, error, isLoading, enableDemoMode } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      await login(apiKey.trim());
    }
  };

  const handleDemoMode = () => {
    enableDemoMode();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            FieldPulse Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your API key to access the dashboard
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="API Key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your FieldPulse API key"
                error={error || undefined}
                required
              />
              
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                disabled={!apiKey.trim()}
              >
                Login
              </Button>
            </form>

            <div className="mt-4 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleDemoMode}
              >
                Try Demo Mode
              </Button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Need an API key? Contact{' '}
                <a 
                  href="mailto:support@fieldpulse.com" 
                  className="text-primary-600 hover:text-primary-500"
                >
                  support@fieldpulse.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
