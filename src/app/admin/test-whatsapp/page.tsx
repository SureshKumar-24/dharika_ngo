'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle, Send } from 'lucide-react';

export default function TestWhatsAppPage() {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState<any>(null);

    const handleTest = async () => {
        setStatus('sending');
        setResponse(null);

        try {
            const res = await fetch('/api/test-whatsapp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    testMessage: message || undefined,
                }),
            });

            const data = await res.json();
            setResponse(data);

            if (data.success) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
            setResponse({
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };

    return (
        <div className="min-h-screen bg-cream p-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-maroon mb-2">
                        🧪 WhatsApp Integration Test
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Test your WhatsApp Business API connection
                    </p>

                    <div className="space-y-6">
                        {/* Test Message Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Test Message (Optional)
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Enter a custom test message or leave blank for default..."
                                rows={4}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all"
                            />
                        </div>

                        {/* Send Button */}
                        <Button
                            onClick={handleTest}
                            disabled={status === 'sending'}
                            loading={status === 'sending'}
                            variant="primary"
                            size="lg"
                            className="w-full"
                        >
                            <Send className="w-5 h-5 mr-2" />
                            {status === 'sending' ? 'Sending...' : 'Send Test WhatsApp'}
                        </Button>

                        {/* Success Message */}
                        {status === 'success' && response && (
                            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-green-900 mb-2">
                                            ✅ WhatsApp Message Sent Successfully!
                                        </h3>
                                        <div className="text-sm text-green-800 space-y-1">
                                            <p>
                                                <strong>Sent to:</strong> {response.sentTo}
                                            </p>
                                            <p>
                                                <strong>Message ID:</strong> {response.messageId}
                                            </p>
                                        </div>
                                        <div className="mt-4 p-3 bg-white rounded border border-green-200">
                                            <p className="text-xs font-mono text-gray-600">
                                                {JSON.stringify(response.data, null, 2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {status === 'error' && response && (
                            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                                <div className="flex items-start gap-3">
                                    <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-red-900 mb-2">
                                            ❌ WhatsApp Test Failed
                                        </h3>
                                        <div className="text-sm text-red-800 space-y-2">
                                            <p>
                                                <strong>Error:</strong> {response.error || 'Unknown error'}
                                            </p>
                                            {response.details && (
                                                <div className="mt-3 p-3 bg-white rounded border border-red-200">
                                                    <p className="text-xs font-mono text-gray-600">
                                                        {JSON.stringify(response.details, null, 2)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Info Box */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                            <h4 className="font-bold text-blue-900 mb-3">ℹ️ How This Works</h4>
                            <ul className="text-sm text-blue-800 space-y-2">
                                <li>
                                    ✅ This sends a <strong>simple text message</strong> (no template required)
                                </li>
                                <li>
                                    ✅ Message will be sent to: <code className="bg-blue-100 px-2 py-0.5 rounded">{process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || 'WHATSAPP_ADMIN_NUMBER'}</code>
                                </li>
                                <li>
                                    ✅ Check your WhatsApp to see if the message arrives
                                </li>
                                <li>
                                    ⚠️ If it fails, check your Meta Business API credentials
                                </li>
                            </ul>
                        </div>

                        {/* Credentials Status */}
                        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
                            <h4 className="font-bold text-gray-900 mb-3">🔑 Credentials Status</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${process.env.NEXT_PUBLIC_HAS_WHATSAPP_TOKEN ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <span>Access Token</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${process.env.NEXT_PUBLIC_HAS_WHATSAPP_PHONE ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <span>Phone Number ID</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${process.env.NEXT_PUBLIC_HAS_WHATSAPP_ADMIN ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <span>Admin Number</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
