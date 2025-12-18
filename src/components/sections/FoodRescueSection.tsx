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
  const [liabilityAccepted, setLiabilityAccepted] = useState(false);
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

    // Validate form first
    const result = foodAlertFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      setErrorMessage(`Please fix ${Object.keys(fieldErrors).length} error(s) in the form`);
      
      // Scroll to the food-alerts section first, then to the error field
      const section = document.getElementById('food-alerts');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Wait for scroll to complete, then focus on first error field within this section
        setTimeout(() => {
          const firstErrorField = Object.keys(fieldErrors)[0];
          if (firstErrorField) {
            const element = section.querySelector(`[name="${firstErrorField}"]`);
            if (element) {
              (element as HTMLElement).focus();
            }
          }
        }, 500);
      }
      return;
    }

    // Show liability note if not already accepted
    if (!liabilityAccepted) {
      setShowLiabilityNote(true);
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
      setLiabilityAccepted(false);
      setFormKey((prev) => prev + 1); // Force re-render of form
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
      setShowLiabilityNote(false);
    }
  };

  const handleAcceptLiability = async () => {
    setShowLiabilityNote(false);
    setLiabilityAccepted(true);
    
    // Now actually submit the form
    const result = foodAlertFormSchema.safeParse(formData);
    if (!result.success) return;

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
        setLiabilityAccepted(false);
        setFormKey((prev) => prev + 1);
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
      setLiabilityAccepted(false);
      setFormKey((prev) => prev + 1);
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
      setLiabilityAccepted(false);
    }
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-0 duration-200 overflow-y-auto"
          onClick={() => setShowLiabilityNote(false)}
        >
          <div 
            className="max-w-2xl w-full bg-white rounded-xl md:rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gold rounded-t-xl md:rounded-t-2xl p-5 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-maroon" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    Important Responsibility Note
                  </h3>
                  <p className="text-white/95 text-xs md:text-sm mt-0.5">
                    Please read carefully before proceeding
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 md:p-6 lg:p-8 space-y-4 max-h-[60vh] md:max-h-none overflow-y-auto bg-cream">
              {/* English Section */}
              <div className="border-l-4 border-gold bg-white rounded-r-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                  Declaration of Truthfulness
                </h4>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed mb-2">
                  By submitting this form, you confirm that all details shared are <strong>true to the best
                  of your knowledge</strong>. Providing false information may lead to:
                </p>
                <ul className="ml-4 space-y-1 text-xs md:text-sm text-gray-700">
                  <li>• Blacklisting from the food donation program</li>
                  <li>• Reporting to relevant authorities in serious cases</li>
                </ul>
              </div>

              {/* Hindi Section */}
              <div className="border-l-4 border-maroon bg-white rounded-r-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                  सत्यता की घोषणा
                </h4>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed mb-2">
                  कृपया केवल वही भोजन दान करें जो:
                </p>
                <ul className="ml-4 space-y-1 text-xs md:text-sm text-gray-700">
                  <li>• <strong>आज तैयार हुआ हो</strong> (पुराना नहीं)</li>
                  <li>• <strong>साफ-सुथरा रखा गया हो</strong> (स्वच्छ कंटेनर में)</li>
                  <li>• <strong>खाने के लिए सुरक्षित हो</strong> (ताज़ा और स्वस्थ)</li>
                </ul>
              </div>

              {/* Important Note */}
              <div className="border-l-4 border-red-500 bg-red-50 rounded-r-lg p-4">
                <p className="text-xs md:text-sm text-red-900 leading-relaxed">
                  <strong className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    Important:
                  </strong>
                  This food will be served to children and families in need. 
                  Your honesty ensures their safety and health. Thank you for your responsibility.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-cream rounded-b-xl md:rounded-b-2xl p-5 md:p-6 border-t border-gray-200">
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  className="w-full sm:w-1/2"
                  onClick={() => setShowLiabilityNote(false)}
                >
                  Go Back
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  className="w-full sm:w-1/2"
                  onClick={handleAcceptLiability}
                >
                  I Understand & Confirm
                </Button>
              </div>
              <p className="text-[10px] md:text-xs text-gray-500 text-center mt-3">
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




