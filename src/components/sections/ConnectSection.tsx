'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Instagram, Linkedin, MessageSquare, Send } from 'lucide-react';
import { Section, Container } from '@/components/ui/Section';
import { GoldDivider } from '@/components/ui/GoldDivider';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { suggestionFormSchema, type SuggestionFormInput } from '@/lib/validations';
import type { SuggestionFormData } from '@/types/forms';

export interface ConnectSectionProps {
  emails: readonly string[] | string[];
  location: string;
  socialLinks: {
    instagram: string;
    linkedin: string;
    whatsapp: string;
    telegram: string;
  };
  onSuggestionSubmit?: (data: SuggestionFormData) => Promise<void>;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export const ConnectSection: React.FC<ConnectSectionProps> = ({
  emails,
  location,
  socialLinks,
  onSuggestionSubmit,
}) => {
  const [formData, setFormData] = useState<SuggestionFormInput>({
    name: '',
    email: '',
    message: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field: keyof SuggestionFormInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setErrorMessage('');

    // Validate form data
    const result = suggestionFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Check honeypot
    if (formData.honeypot) {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setFormData({ name: '', email: '', message: '', honeypot: '' });
      }, 3000);
      return;
    }

    setStatus('submitting');

    try {
      if (onSuggestionSubmit) {
        await onSuggestionSubmit(result.data);
      } else {
        const response = await fetch('/api/suggestion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result.data),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to submit suggestion');
        }
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '', honeypot: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <>
      <GoldDivider className="my-0" />
      <Section id="connect" className="bg-maroon text-white py-16 md:py-24">
        <Container>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">Get in Touch</h2>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-gold shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <div className="space-y-1">
                      {emails.map((email, index) => (
                        <a
                          key={index}
                          href={`mailto:${email}`}
                          className="text-white/90 hover:text-gold transition-colors block"
                        >
                          {email}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-gold shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Location</h3>
                    <p className="text-white/90">{location}</p>
                  </div>
                </div>

                {/* Social Media */}
                <div className="flex items-start gap-4">
                  <MessageSquare
                    className="w-6 h-6 text-gold shrink-0 mt-1"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Follow Us</h3>
                    <div className="flex gap-3">
                      <a
                        href={socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                      <a
                        href={socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggestion Form */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Send a Suggestion</h2>
              <p className="text-white/90 mb-6">
                Have ideas on how we can improve? We'd love to hear from you!
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name (Optional) */}
                <Input
                  type="text"
                  name="name"
                  label="Name (Optional)"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={errors.name}
                  labelClassName="text-white"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />

                {/* Email (Optional) */}
                <Input
                  type="email"
                  name="email"
                  label="Email (Optional)"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  error={errors.email}
                  labelClassName="text-white"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />

                {/* Message */}
                <Textarea
                  name="message"
                  label="Message"
                  placeholder="Share your thoughts or suggestions..."
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  error={errors.message}
                  labelClassName="text-white"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />

                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  value={formData.honeypot}
                  onChange={(e) => handleChange('honeypot', e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                {/* Status Messages */}
                {status === 'success' && (
                  <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-sm">
                    Thank you for your suggestion!
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm">
                    {errorMessage}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={status === 'submitting'}
                  loading={status === 'submitting'}
                  className="w-full"
                >
                  <Send className="w-4 h-4" />
                  {status === 'submitting' ? 'Sending...' : 'Send Suggestion'}
                </Button>
              </form>
            </div>
          </div>

          {/* Footer Links */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-white/80 text-sm text-center sm:text-left">
                © {new Date().getFullYear()} Dharika. All rights reserved.
              </p>
              <div className="flex gap-4 sm:gap-6 text-sm">
                <a
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-gold transition-colors"
                >
                  WhatsApp
                </a>
                <a
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-gold transition-colors"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};

ConnectSection.displayName = 'ConnectSection';
