import { RecruitmentStage } from '@/types';

export const colors = {
  // Primary Colors
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // Secondary Colors
  secondary: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  // Neutral Colors
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Status Colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Stage Colors
  stages: {
    [RecruitmentStage.OUTREACHED]: '#6B7280',
    [RecruitmentStage.APPLIED]: '#3B82F6',
    [RecruitmentStage.SHORTLISTED]: '#10B981',
    [RecruitmentStage.INTERVIEWED]: '#8B5CF6',
    [RecruitmentStage.REJECTED]: '#EF4444',
    [RecruitmentStage.OFFER_EXTENDED]: '#F59E0B',
    [RecruitmentStage.OFFER_REJECTED]: '#F97316',
    [RecruitmentStage.HIRED]: '#22C55E'
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
  },

  // Text Colors
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    tertiary: '#6B7280',
    inverse: '#FFFFFF',
  },
} as const;

// Type for the colors object
export type Colors = typeof colors; 