'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  format?: 'currency' | 'number' | 'percentage';
}

export function StatsCard({ title, value, change, icon: Icon, format = 'number' }: StatsCardProps) {
  const formatValue = (val: string | number) => {
    if (format === 'currency' && typeof val === 'number') {
      return formatCurrency(val);
    }
    if (format === 'percentage' && typeof val === 'number') {
      return `${val}%`;
    }
    return val.toString();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
            {change && (
              <p className={`text-sm ${
                change.type === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
                <span className="text-gray-500 ml-1">from last month</span>
              </p>
            )}
          </div>
          <div className="ml-4">
            <div className="bg-primary-50 p-3 rounded-lg">
              <Icon className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
