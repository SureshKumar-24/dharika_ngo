'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Section, Container } from '@/components/ui/Section';
import { GoldDivider } from '@/components/ui/GoldDivider';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { volunteerFormSchema, type VolunteerFormInput } from '@/lib/validations';
import type { VolunteerFormData } from '@/types/forms';

export interface JoinFormSectionProps {
  onSubmit?: (data: VolunteerFormData) => Promise<void>;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export const JoinFormSection: React.FC<JoinFormSectionProps> = ({ onSubmit }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [formData, setFormData] = useState<VolunteerFormInput>({
    name: '',
    phone: '',
    email: '',
    city: '',
    interest: 'both',
    availability: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field: keyof VolunteerFormInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
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
    const result = volunteerFormSchema.safeParse(formData);

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
      // Silent rejection for spam
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setFormData({
          name: '',
          phone: '',
          email: '',
          city: '',
          interest: 'both',
          availability: '',
          honeypot: '',
        });
      }, 3000);
      return;
    }

    setStatus('submitting');

    try {
      if (onSubmit) {
        await onSubmit(result.data);
      } else {
        // Default API call
        const response = await fetch('/api/volunteer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result.data),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to submit form');
        }
      }

      setStatus('success');
      // Clear form after success
      setFormData({
        name: '',
        phone: '',
        email: '',
        city: '',
        interest: 'both',
        availability: '',
        honeypot: '',
      });

      // Reset status after 5 seconds
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
      <Section id="join" className="bg-cream py-16 md:py-24">
        <Container>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            {/* Section Title */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Join Our Movement
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Be part of something bigger. Fill out the form below to volunteer with us.
              </p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <Input
                  type="text"
                  name="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={errors.name}
                />

                {/* Phone */}
                <Input
                  type="tel"
                  name="phone"
                  label="Phone Number"
                  placeholder="10-digit mobile number"
                  required
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  error={errors.phone}
                />

                {/* Email */}
                <Input
                  type="email"
                  name="email"
                  label="Email Address"
                  placeholder="your.email@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  error={errors.email}
                />

                {/* City */}
                <Input
                  type="text"
                  name="city"
                  label="City"
                  placeholder="Your city"
                  required
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  error={errors.city}
                />

                {/* Interest - Radio Buttons */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Area of Interest
                    <span className="text-maroon ml-1" aria-label="required">
                      *
                    </span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {[
                      { value: 'food', label: 'Food Drives' },
                      { value: 'teaching', label: 'Teaching Drives' },
                      { value: 'both', label: 'Both' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="interest"
                          value={option.value}
                          checked={formData.interest === option.value}
                          onChange={(e) => handleChange('interest', e.target.value)}
                          className="w-5 h-5 text-gold focus:ring-gold focus:ring-2"
                        />
                        <span className="text-base text-foreground">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.interest && (
                    <p className="mt-1.5 text-sm text-red-600" role="alert">
                      {errors.interest}
                    </p>
                  )}
                </div>

                {/* Availability */}
                <Textarea
                  name="availability"
                  label="Availability"
                  placeholder="Tell us about your availability (e.g., weekends, evenings, specific days)"
                  required
                  rows={4}
                  value={formData.availability}
                  onChange={(e) => handleChange('availability', e.target.value)}
                  error={errors.availability}
                />

                {/* Honeypot field (hidden) */}
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
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-green-800">
                      Thank you for joining! We'll be in touch soon.
                    </p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-800">{errorMessage}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={status === 'submitting'}
                  loading={status === 'submitting'}
                  className="w-full"
                >
                  {status === 'submitting' ? 'Submitting...' : 'Join as Volunteer'}
                </Button>
              </form>
            </div>
          </motion.div>
        </Container>
      </Section>
    </>
  );
};

JoinFormSection.displayName = 'JoinFormSection';
