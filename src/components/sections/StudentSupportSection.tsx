'use client';

import React, { useState } from 'react';
import { Section, Container } from '@/components/ui/Section';
import { GoldDivider } from '@/components/ui/GoldDivider';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import {
  studentQueryFormSchema,
  type StudentQueryFormInput,
} from '@/lib/validations';
import type { StudentQueryFormData } from '@/types/forms';
import { CheckCircle, XCircle } from 'lucide-react';

export interface StudentSupportSectionProps {
  onSubmit?: (data: StudentQueryFormData) => Promise<void>;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export const StudentSupportSection: React.FC<StudentSupportSectionProps> = ({
  onSubmit,
}) => {
  const [formData, setFormData] = useState<StudentQueryFormInput>({
    name: '',
    age: '',
    city: '',
    locality: '',
    studentClass: '6',
    subject: 'maths',
    topic: '',
    phone: '',
    email: '',
    attendingOfflineClasses: 'no',
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field: keyof StudentQueryFormInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setErrorMessage('');

    const result = studentQueryFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (formData.honeypot) {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setFormData({
          name: '',
          age: '',
          city: '',
          locality: '',
          studentClass: '6',
          subject: 'maths',
          topic: '',
          phone: '',
          email: '',
          attendingOfflineClasses: 'no',
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
        const response = await fetch('/api/student-support', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result.data),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => null);
          throw new Error(error?.error || error?.message || 'Failed to submit query');
        }
      }

      setStatus('success');
      setFormData({
        name: '',
        age: '',
        city: '',
        locality: '',
        studentClass: '6',
        subject: 'maths',
        topic: '',
        phone: '',
        email: '',
        attendingOfflineClasses: 'no',
        honeypot: '',
      });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <>
      <GoldDivider className="my-0" />
      <Section
        id="student-support"
        className="bg-cream py-16 md:py-24 scroll-mt-20"
      >
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                Student Support – Free Learning Help
              </h2>
              <p className="text-lg text-gray-700 mb-2">
                Ask a doubt, get a personalised video solution.
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">
                  डिजिटल सीखने में सहायता (हिंदी + English)
                </span>{' '}
                – यहां अपना सवाल लिखें, हम आपको वीडियो के रूप में समाधान भेजेंगे।
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-10 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    type="text"
                    name="name"
                    label="Student Name"
                    placeholder="Enter full name"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    error={errors.name}
                  />
                  <Input
                    type="text"
                    name="age"
                    label="Age (Optional)"
                    placeholder="e.g., 13"
                    value={formData.age || ''}
                    onChange={(e) => handleChange('age', e.target.value)}
                    error={errors.age}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    type="text"
                    name="city"
                    label="City"
                    placeholder="e.g., Ambala"
                    required
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    error={errors.city}
                  />
                  <Input
                    type="text"
                    name="locality"
                    label="Locality / Area"
                    placeholder="e.g., Housing Board, Old Town"
                    required
                    value={formData.locality}
                    onChange={(e) => handleChange('locality', e.target.value)}
                    error={errors.locality}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Select
                    name="studentClass"
                    label="Class"
                    required
                    value={formData.studentClass}
                    onChange={(value) => handleChange('studentClass', value)}
                    error={errors.studentClass}
                    options={Array.from({ length: 12 }, (_, i) => {
                      const cls = (i + 1).toString();
                      return { value: cls, label: `Class ${cls}` };
                    })}
                  />
                  <Select
                    name="subject"
                    label="Subject"
                    required
                    value={formData.subject}
                    onChange={(value) => handleChange('subject', value)}
                    error={errors.subject}
                    options={[
                      { value: 'maths', label: 'Maths' },
                      { value: 'english', label: 'English' },
                      { value: 'hindi', label: 'Hindi' },
                      { value: 'science', label: 'Science' },
                      { value: 'other', label: 'Other' },
                    ]}
                  />
                </div>

                <Textarea
                  name="topic"
                  label="Specific Topic / Question"
                  placeholder="Write your doubt here – you can also paste the question from your book."
                  required
                  rows={4}
                  value={formData.topic}
                  onChange={(e) => handleChange('topic', e.target.value)}
                  error={errors.topic}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    type="tel"
                    name="phone"
                    label="Phone Number (WhatsApp preferred)"
                    placeholder="10-digit mobile number"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    error={errors.phone}
                  />
                  <Input
                    type="email"
                    name="email"
                    label="Email ID"
                    placeholder="your.email@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={errors.email}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Are you attending any of our offline classes? / क्या आप हमारी
                    ऑफलाइन क्लास में आते हैं?
                    <span className="text-maroon ml-1" aria-label="required">
                      *
                    </span>
                  </p>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="attendingOfflineClasses"
                        value="yes"
                        checked={formData.attendingOfflineClasses === 'yes'}
                        onChange={(e) =>
                          handleChange(
                            'attendingOfflineClasses',
                            e.target.value
                          )
                        }
                        className="h-4 w-4 text-maroon border-gray-300"
                      />
                      <span>Yes / हां</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="attendingOfflineClasses"
                        value="no"
                        checked={formData.attendingOfflineClasses === 'no'}
                        onChange={(e) =>
                          handleChange(
                            'attendingOfflineClasses',
                            e.target.value
                          )
                        }
                        className="h-4 w-4 text-maroon border-gray-300"
                      />
                      <span>No / नहीं</span>
                    </label>
                  </div>
                  {errors.attendingOfflineClasses && (
                    <p className="mt-1.5 text-sm text-red-600" role="alert">
                      {errors.attendingOfflineClasses}
                    </p>
                  )}
                </div>

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

                {status === 'success' && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                    <p className="text-green-800">
                      Thank you! Your question has been submitted. You&apos;ll
                      receive a video within 12 hours.
                    </p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <p className="text-red-800">{errorMessage}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={status === 'submitting'}
                  loading={status === 'submitting'}
                  className="w-full"
                >
                  {status === 'submitting'
                    ? 'Submitting...'
                    : 'Submit Learning Query'}
                </Button>

                <p className="text-xs text-gray-500 mt-2">
                  We only use your contact details to share learning support.
                  We do not collect financial donations through this form.
                </p>
              </form>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};

StudentSupportSection.displayName = 'StudentSupportSection';




