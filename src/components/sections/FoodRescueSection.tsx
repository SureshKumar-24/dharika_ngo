'use client';

import React, { useState } from 'react';
import { Section, Container } from '@/components/ui/Section';
import { GoldDivider } from '@/components/ui/GoldDivider';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Button } from '@/components/ui/Button';
import { foodAlertFormSchema, type FoodAlertFormInput } from '@/lib/validations';
import type { FoodAlertFormData } from '@/types/forms';
import { scrollToFirstError } from '@/lib/form-utils';
import { CheckCircle, XCircle, AlertTriangle, AlertCircle } from 'lucide-react';

export interface FoodRescueSectionProps {
  onSubmit?: (data: FoodAlertFormData) => Promise<void>;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export const FoodRescueSection: React.FC<FoodRescueSectionProps> = ({
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FoodAlertFormInput>({
    donorType: '',
    establishmentName: '',
    contactPersonName: '',
    phone: '',
    address: '',
    city: '',
    quantity: '',
    preparedAt: '',
    expiryEstimate: '',
    photoUrl: '',
    declarationTodayPrepared: false,
    declarationHygienic: false,
    declarationSafe: false,
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showLiabilityNote, setShowLiabilityNote] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleChange = (field: keyof FoodAlertFormInput, value: any) => {
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

    // Show liability note first if not already accepted
    if (!showLiabilityNote) {
      setShowLiabilityNote(true);
      return;
    }

    const result = foodAlertFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      setErrorMessage(`Please fix ${Object.keys(fieldErrors).length} error(s) in the form`);
      scrollToFirstError(fieldErrors);
      setShowLiabilityNote(false); // Close modal if validation fails
      return;
    }

    if (formData.honeypot) {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setFormData({
          donorType: '',
          establishmentName: '',
          contactPersonName: '',
          phone: '',
          address: '',
          city: '',
          quantity: '',
          preparedAt: '',
          expiryEstimate: '',
          photoUrl: '',
          declarationTodayPrepared: false,
          declarationHygienic: false,
          declarationSafe: false,
          honeypot: '',
        });
        setShowLiabilityNote(false);
      }, 3000);
      return;
    }

    setStatus('submitting');

    try {
      if (onSubmit) {
        await onSubmit(result.data);
      } else {
        const response = await fetch('/api/food-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result.data),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => null);
          throw new Error(error?.error || error?.message || 'Failed to submit food alert');
        }
      }

      setStatus('success');
      setErrors({});
      setErrorMessage('');
      setFormData({
        donorType: '',
        establishmentName: '',
        contactPersonName: '',
        phone: '',
        address: '',
        city: '',
        quantity: '',
        preparedAt: '',
        expiryEstimate: '',
        photoUrl: '',
        declarationTodayPrepared: false,
        declarationHygienic: false,
        declarationSafe: false,
        honeypot: '',
      });
      setShowLiabilityNote(false);
      setFormKey((prev) => prev + 1); // Force re-render of form
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

  const handleAcceptLiability = () => {
    setShowLiabilityNote(false);
  };

  return (
    <>
      <GoldDivider className="my-0" />
      <Section
        id="food-alerts"
        className="bg-cream py-16 md:py-24 scroll-mt-20"
      >
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                Donate Surplus Food
              </h2>
              <p className="text-lg text-gray-700 mb-2">
                Redirect today&apos;s safe surplus meals to children and families who need them.
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">
                  अतिरिक्त भोजन दान करें – आज बना हुआ, सुरक्षित और ताज़ा भोजन
                </span>
                .
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-10 shadow-lg">
              <form key={formKey} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <CustomSelect
                    name="donorType"
                    label="Donor Type"
                    required
                    value={formData.donorType}
                    onChange={(e) =>
                      handleChange('donorType', e.target.value as FoodAlertFormInput['donorType'])
                    }
                    error={errors.donorType}
                    options={[
                      { value: '', label: 'Select donor type' },
                      { value: 'restaurant', label: 'Restaurant' },
                      { value: 'cafe', label: 'Café' },
                      { value: 'caterer', label: 'Caterer' },
                      { value: 'individual', label: 'Individual' },
                    ]}
                  />
                  <Input
                    type="text"
                    name="establishmentName"
                    label="Establishment Name"
                    placeholder="Name of restaurant/café/home kitchen"
                    required
                    value={formData.establishmentName}
                    onChange={(e) =>
                      handleChange('establishmentName', e.target.value)
                    }
                    error={errors.establishmentName}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    type="text"
                    name="contactPersonName"
                    label="Contact Person Name"
                    placeholder="Primary person to coordinate with"
                    required
                    value={formData.contactPersonName}
                    onChange={(e) =>
                      handleChange('contactPersonName', e.target.value)
                    }
                    error={errors.contactPersonName}
                  />
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
                </div>

                <Textarea
                  name="address"
                  label="Pickup Address (Locality + City mandatory)"
                  placeholder="Full pickup address with landmarks"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  error={errors.address}
                />

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
                    name="quantity"
                    label="Approx. Quantity (Number of people it can feed)"
                    placeholder="e.g., 25 people"
                    required
                    value={formData.quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                    error={errors.quantity}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    type="text"
                    name="preparedAt"
                    label="Time of Preparation (same-day only)"
                    placeholder="e.g., 1:30 PM today"
                    required
                    value={formData.preparedAt}
                    onChange={(e) => handleChange('preparedAt', e.target.value)}
                    error={errors.preparedAt}
                  />
                  <CustomSelect
                    name="expiryEstimate"
                    label="Safe Consumption Window"
                    required
                    value={formData.expiryEstimate}
                    onChange={(e) =>
                      handleChange(
                        'expiryEstimate',
                        e.target.value as FoodAlertFormInput['expiryEstimate']
                      )
                    }
                    error={errors.expiryEstimate}
                    options={[
                      { value: '', label: 'Select consumption window' },
                      { value: '2_hours', label: '2 hours' },
                      { value: '4_hours', label: '4 hours' },
                      { value: '6_hours', label: '6 hours' },
                      { value: '8_hours', label: '8 hours' },
                      { value: 'same_day', label: 'Same day (until night)' },
                    ]}
                  />
                </div>

                <Input
                  type="url"
                  name="photoUrl"
                  label="Food Photo (Optional – link from WhatsApp/Drive)"
                  placeholder="Paste a photo link if available"
                  value={formData.photoUrl || ''}
                  onChange={(e) => handleChange('photoUrl', e.target.value)}
                  error={errors.photoUrl}
                />

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Declaration Checklist
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={formData.declarationTodayPrepared}
                        onChange={(e) =>
                          handleChange('declarationTodayPrepared', e.target.checked)
                        }
                        className="mt-1 h-4 w-4 text-maroon border-gray-300"
                      />
                      <span className="text-sm text-gray-800">
                        Food was prepared today and is not leftover from a previous day.
                      </span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={formData.declarationHygienic}
                        onChange={(e) =>
                          handleChange('declarationHygienic', e.target.checked)
                        }
                        className="mt-1 h-4 w-4 text-maroon border-gray-300"
                      />
                      <span className="text-sm text-gray-800">
                        Food has been stored hygienically (covered, clean containers, safe area).
                      </span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={formData.declarationSafe}
                        onChange={(e) =>
                          handleChange('declarationSafe', e.target.checked)
                        }
                        className="mt-1 h-4 w-4 text-maroon border-gray-300"
                      />
                      <span className="text-sm text-gray-800">
                        To the best of my knowledge, this food is safe for consumption.
                      </span>
                    </label>
                  </div>
                  {(errors.declarationTodayPrepared ||
                    errors.declarationHygienic ||
                    errors.declarationSafe) && (
                    <p className="mt-1.5 text-sm text-red-600" role="alert">
                      Please confirm all declarations before submitting.
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
                      Thank you for your kindness. Our volunteer team will contact you shortly to
                      coordinate the pickup.
                    </p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <p className="text-red-800">{errorMessage}</p>
                  </div>
                )}

                {Object.keys(errors).length > 0 && status !== 'error' && (
                  <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <p className="text-amber-800">
                      Please fix {Object.keys(errors).length} error(s) in the form above
                    </p>
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
                    : 'Create Food Alert'}
                </Button>

                <p className="text-xs text-gray-500 mt-2">
                  We only coordinate food pickups and do not collect monetary donations through this
                  form.
                </p>
              </form>
            </div>
          </div>
        </Container>
      </Section>

      {showLiabilityNote && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in-0 duration-200"
          onClick={() => setShowLiabilityNote(false)}
        >
          <div 
            className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-2xl p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    Important Responsibility Note
                  </h3>
                  <p className="text-amber-50 text-sm">
                    Please read carefully before proceeding
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 space-y-6">
              {/* English Section */}
              <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  Declaration of Truthfulness
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  By submitting this form, you confirm that all details shared are <strong>true to the best
                  of your knowledge</strong>. Providing false information may lead to:
                </p>
                <ul className="mt-2 ml-4 space-y-1 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>Blacklisting from the food donation program</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>Reporting to relevant authorities in serious cases</span>
                  </li>
                </ul>
              </div>

              {/* Hindi Section */}
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  सत्यता की घोषणा
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  कृपया केवल वही भोजन दान करें जो:
                </p>
                <ul className="mt-2 ml-4 space-y-1 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>आज तैयार हुआ हो</strong> (पुराना नहीं)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>साफ-सुथरा रखा गया हो</strong> (स्वच्छ कंटेनर में)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span><strong>खाने के लिए सुरक्षित हो</strong> (ताज़ा और स्वस्थ)</span>
                  </li>
                </ul>
              </div>

              {/* Important Note */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-xs text-red-800 leading-relaxed">
                  <strong>⚠️ Note:</strong> This food will be served to children and families in need. 
                  Your honesty ensures their safety and health. Thank you for your responsibility.
                </p>
              </div>
            </div>

            {/* Footer with buttons */}
            <div className="bg-gray-50 rounded-b-2xl p-6 md:p-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-1/2 border-2"
                  onClick={() => setShowLiabilityNote(false)}
                >
                  Go Back
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-1/2 shadow-lg hover:shadow-xl"
                  onClick={handleAcceptLiability}
                >
                  I Understand & Confirm
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                By clicking confirm, you agree to the terms stated above
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

FoodRescueSection.displayName = 'FoodRescueSection';




