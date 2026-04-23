"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import EventTypeSelector from './EventTypeSelector';
import { LocationInput } from "./LocationInput";
import { 
    apiRateLimiter, 
    eventTrackingSchema, 
    type EventTrackingValues,
    EVENT_NOTE_MAX_LEN 
} from "@/lib/validation";
import { EVENT_TRACKING_SUBMIT_DELAY_MS } from "@/lib/constants";
import { Loader2, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EventTrackingForm() {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const products = [
        { id: 'PRD-1001-XYZ', name: 'Premium Arabica Coffee Beans' },
        { id: 'PRD-2034-ABC', name: 'Organic Cotton T-Shirt' },
        { id: 'PRD-5099-LMN', name: 'Fair Trade Chocolate' },
    ];

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<EventTrackingValues>({
        resolver: zodResolver(eventTrackingSchema),
        defaultValues: {
            productId: '',
            eventType: undefined,
            location: '',
            note: '',
        },
    });

    const watchedFields = watch();
    const isFormValid = watchedFields.productId && watchedFields.eventType && watchedFields.location;

    const onSubmit = async (data: EventTrackingValues) => {
        if (!apiRateLimiter.check("trackEvent")) {
            setError('Too many requests. Please wait before trying again.');
            return;
        }

        setError('');

        try {
            // Dummy transaction delay mirroring freighter confirm
            await new Promise((resolve) => setTimeout(resolve, EVENT_TRACKING_SUBMIT_DELAY_MS));
            setSuccess(true);
        } catch (err) {
            setError((err as Error).message || 'Failed to submit transaction');
        }
    };

    if (success) {
        return (
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow border border-gray-100 max-w-2xl mx-auto text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Event Recorded!</h2>
                <p className="text-gray-600 text-lg mb-8">The tracking event has been immutably recorded.</p>

                <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8 font-mono text-sm max-w-sm mx-auto space-y-3 border border-gray-200 shadow-inner">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                        <span className="text-gray-500 uppercase text-xs tracking-wider">Product ID</span>
                        <span className="text-gray-900 font-bold bg-white px-2 py-1 rounded shadow-sm">{watchedFields.productId}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                        <span className="text-gray-500 uppercase text-xs tracking-wider">Event Action</span>
                        <span className="text-indigo-700 font-bold bg-indigo-50 px-2 py-1 rounded shadow-sm">{watchedFields.eventType}</span>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setSuccess(false);
                        reset();
                    }}
                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-md hover:shadow-lg w-full sm:w-auto"
                >
                    Track Another Event
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow border border-gray-100 w-full max-w-5xl mx-auto">
            <div className="mb-8 border-b border-gray-100 pb-6">
                <h2 className="text-2xl font-bold text-gray-900">Log Tracking Event</h2>
                <p className="text-gray-500 mt-2">Record a new step in the product&apos;s journey. Submit to ledger via wallet signature.</p>
            </div>

            {error && (
                <div role="alert" className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex gap-3 items-center">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                <div className="space-y-3">
                    <label htmlFor="product" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">1. Select Product *</label>
                    <select
                        {...register('productId')}
                        id="product"
                        aria-invalid={!!errors.productId}
                        aria-describedby={errors.productId ? "product-error" : undefined}
                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 border p-4 text-base"
                    >
                        <option value="">-- Choose a product acting on --</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                        ))}
                    </select>
                    {errors.productId && <p id="product-error" className="text-xs text-red-500 mt-1">{errors.productId.message}</p>}
                </div>

                <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">2. Select Operation</span>
                    </div>
                    <Controller
                        name="eventType"
                        control={control}
                        render={({ field }) => (
                            <EventTypeSelector
                                value={field.value || ''}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    {errors.eventType && <p className="text-xs text-red-500 mt-1">{errors.eventType.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <Controller
                            name="location"
                            control={control}
                            render={({ field }) => (
                                <LocationInput
                                    id="location"
                                    label="3. Location Info"
                                    required
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.location?.message}
                                />
                            )}
                        />
                    </div>

                    <div className="space-y-3">
                        <label htmlFor="note" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">4. Remarks (Optional)</label>
                        <input
                            {...register('note')}
                            type="text"
                            id="note"
                            maxLength={EVENT_NOTE_MAX_LEN}
                            placeholder="e.g. Temperature checked at 4°C"
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 border p-4"
                        />
                        <div className="flex justify-between items-center mt-1">
                            <p className="text-sm text-gray-500">Additional conditions or remarks during operation.</p>
                            <p className="text-xs text-gray-400">({watchedFields.note?.length || 0}/{EVENT_NOTE_MAX_LEN})</p>
                        </div>
                        {errors.note && <p className="text-xs text-red-500 mt-1">{errors.note.message}</p>}
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-200 mt-10 flex flex-col sm:flex-row items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="px-8 py-4 w-full sm:w-auto text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition"
                    >
                        Clear Form
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || !isFormValid}
                        className="px-8 py-4 w-full sm:w-auto bg-gray-900 border border-transparent text-white font-bold rounded-xl hover:bg-black transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing Transaction...
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="w-5 h-5 text-indigo-300" />
                                Sign & Submit Event
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
