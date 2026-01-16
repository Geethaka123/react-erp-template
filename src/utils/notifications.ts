import { toast } from 'sonner';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, Loader2 } from 'lucide-react';
import React from 'react';

/**
 * Notification service to provide a unified way to show messages throughout the application.
 * Built on top of Sonner with a premium custom design.
 */
export const notificationService = {
  /**
   * Show a success notification
   */
  success: (title: string, message?: string) => {
    toast.success(title, {
      description: message,
      icon: React.createElement(CheckCircle2, { className: "text-green-500 w-5 h-5" }),
    });
  },

  /**
   * Show an error notification
   */
  error: (title: string, message?: string) => {
    toast.error(title, {
      description: message,
      icon: React.createElement(AlertCircle, { className: "text-red-500 w-5 h-5" }),
    });
  },

  /**
   * Show an info notification
   */
  info: (title: string, message?: string) => {
    toast.info(title, {
      description: message,
      icon: React.createElement(Info, { className: "text-blue-500 w-5 h-5" }),
    });
  },

  /**
   * Show a warning notification
   */
  warning: (title: string, message?: string) => {
    toast.warning(title, {
      description: message,
      icon: React.createElement(AlertTriangle, { className: "text-orange-500 w-5 h-5" }),
    });
  },

  /**
   * Show a loading notification
   * @returns The toast id to be used for dismissal or updating
   */
  loading: (title: string, message?: string) => {
    return toast.loading(title, {
      description: message,
      icon: React.createElement(Loader2, { className: "text-primary animate-spin w-5 h-5" }),
    });
  },

  /**
   * Handle an async promise with loading, success, and error states
   */
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: (data: T) => string;
      error: (error: any) => string;
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },

  /**
   * Dismiss a specific notification or all notifications
   */
  dismiss: (id?: string | number) => {
    toast.dismiss(id);
  },
};
