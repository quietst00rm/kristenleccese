import React from 'react';

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  situation: string;
  source: string;
  sourceDetail?: string;
}

export enum FormStatus {
  IDLE = 'IDLE',
  SUBMITTING = 'SUBMITTING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}