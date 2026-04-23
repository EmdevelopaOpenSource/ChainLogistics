'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { invoiceSchema, type InvoiceValues } from '@/lib/validation/schemas';

export function InvoiceForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      amount: '',
      due_date: '',
    },
  });

  const onSubmit = async (data: InvoiceValues) => {
    try {
      const response = await fetch('/api/v1/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create invoice');
      toast.success('Invoice created successfully');
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create Invoice</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1">Amount</label>
          <Input
            {...register('amount')}
            id="amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            aria-invalid={!!errors.amount}
            aria-describedby={errors.amount ? 'amount-error' : undefined}
          />
          {errors.amount && (
            <p id="amount-error" role="alert" className="text-xs text-red-500 mt-1">
              {errors.amount.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="due_date" className="block text-sm font-medium mb-1">Due Date</label>
          <Input
            {...register('due_date')}
            id="due_date"
            type="date"
            aria-invalid={!!errors.due_date}
            aria-describedby={errors.due_date ? 'due-date-error' : undefined}
          />
          {errors.due_date && (
            <p id="due-date-error" role="alert" className="text-xs text-red-500 mt-1">
              {errors.due_date.message}
            </p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creating...' : 'Create Invoice'}
        </Button>
      </form>
    </Card>
  );
}
