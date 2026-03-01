import React from 'react';

export interface ServiceInfo {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

export interface QuoteRequest {
  serviceType: 'Residential' | 'Commercial' | 'Deep Clean' | 'Move In/Out';
  squareFootage: string;
  additionalDetails: string;
}

export interface GeminiResponse {
  estimate: string;
  recommendations: string[];
}
