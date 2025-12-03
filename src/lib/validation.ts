// Input validation utilities
import { z } from 'zod';

// Validation schemas
export const BuildRequestSchema = z.object({
    prompt: z.string()
        .min(10, 'Prompt must be at least 10 characters')
        .max(5000, 'Prompt must not exceed 5000 characters'),
    userId: z.string().uuid('Invalid user ID'),
    stream: z.boolean().optional(),
    files: z.array(z.object({
        name: z.string(),
        content: z.string().max(100000, 'File too large')
    })).max(10, 'Too many files').optional(),
    useSearch: z.boolean().optional()
});

export const AgentMessageSchema = z.object({
    messages: z.array(z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().max(10000, 'Message too long')
    })).min(1, 'At least one message required').max(50, 'Too many messages')
});

// Sanitization
export function sanitizePrompt(prompt: string): string {
    // Remove potentially dangerous characters
    return prompt
        .replace(/[<>]/g, '') // Remove HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
}

export function sanitizeError(error: unknown): string {
    if (error instanceof Error) {
        // Don't expose internal error details
        if (error.message.includes('ECONNREFUSED')) {
            return 'Service temporarily unavailable';
        }
        if (error.message.includes('timeout')) {
            return 'Request timeout - please try again';
        }
        if (error.message.includes('API key')) {
            return 'Configuration error - please contact support';
        }
        // Generic message for unknown errors
        return 'An error occurred processing your request';
    }
    return 'An unexpected error occurred';
}

// Rate limiting (simple in-memory implementation)
interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function checkRateLimit(
    identifier: string,
    maxRequests: number = 10,
    windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    if (!entry || now > entry.resetAt) {
        // New window
        const resetAt = now + windowMs;
        rateLimitStore.set(identifier, { count: 1, resetAt });
        return { allowed: true, remaining: maxRequests - 1, resetAt };
    }

    if (entry.count >= maxRequests) {
        return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }

    entry.count++;
    return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetAt) {
            rateLimitStore.delete(key);
        }
    }
}, 60000); // Clean up every minute
