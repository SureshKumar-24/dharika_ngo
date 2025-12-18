'use client';

import React from 'react';
import { ExternalLink, FileSpreadsheet, MessageCircle, Video, Camera, ArrowLeft, TestTube } from 'lucide-react';
import Link from 'next/link';

const studentQueriesSheetUrl = process.env.NEXT_PUBLIC_STUDENT_QUERIES_SHEET_URL;
const foodAlertsSheetUrl = process.env.NEXT_PUBLIC_FOOD_ALERTS_SHEET_URL;
const studentSupportGroupUrl = process.env.NEXT_PUBLIC_VOLUNTEER_GROUP_STUDENT_SUPPORT_URL;
const foodRescueGroupUrl = process.env.NEXT_PUBLIC_VOLUNTEER_GROUP_FOOD_RESCUE_URL;

export default function AdminResourcesPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-maroon hover:text-maroon/80 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-maroon mb-3">
            Admin Resources
          </h1>
          <p className="text-gray-700 text-lg">
            Central links for coordinators and core team members.{' '}
            <span className="text-red-600 font-semibold">⚠️ Do not share this page publicly.</span>
          </p>
        </div>


        <div className="space-y-6">
          {/* Student Support Section */}
          <section className="bg-white rounded-2xl border-2 border-gold/20 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-pastel-blue to-pastel-blue/80 p-6">
              <h2 className="text-2xl font-bold text-maroon flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  📚
                </div>
                Student Support – Sheets & Resources
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {/* Student Queries Sheet */}
              <div className="flex items-start gap-4 p-4 bg-cream/50 rounded-lg hover:bg-cream transition-colors">
                <FileSpreadsheet className="w-6 h-6 text-maroon shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">Student Queries Sheet</div>
                  {studentQueriesSheetUrl ? (
                    <a
                      href={studentQueriesSheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-maroon hover:text-maroon/80 font-medium transition-colors"
                    >
                      Open Sheet
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="text-gray-500 italic">URL not configured</span>
                  )}
                </div>
              </div>

              {/* WhatsApp Group */}
              <div className="flex items-start gap-4 p-4 bg-cream/50 rounded-lg hover:bg-cream transition-colors">
                <MessageCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">Teacher Volunteers WhatsApp Group</div>
                  {studentSupportGroupUrl ? (
                    <a
                      href={studentSupportGroupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                      Open Group
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="text-gray-500 italic">Link not configured</span>
                  )}
                </div>
              </div>

              {/* Video Instructions */}
              <div className="flex items-start gap-4 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                <Video className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-2">📹 Video Upload Instructions for Teachers</div>
                  <ul className="text-sm text-gray-700 space-y-1.5 list-disc list-inside">
                    <li>Upload as <strong className="text-amber-700">Unlisted</strong> on YouTube</li>
                    <li>Avoid sharing student faces without consent</li>
                    <li>Include topic name + class/subject in the title</li>
                    <li>Example: <em>"Class 8 Maths - Quadratic Equations"</em></li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Food Rescue Section */}
          <section className="bg-white rounded-2xl border-2 border-gold/20 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-pastel-yellow to-pastel-yellow/80 p-6">
              <h2 className="text-2xl font-bold text-maroon flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  🍽️
                </div>
                Food Rescue – Sheets & Resources
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {/* Food Alerts Sheet */}
              <div className="flex items-start gap-4 p-4 bg-cream/50 rounded-lg hover:bg-cream transition-colors">
                <FileSpreadsheet className="w-6 h-6 text-maroon shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">Food Rescue Alerts Sheet</div>
                  {foodAlertsSheetUrl ? (
                    <a
                      href={foodAlertsSheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-maroon hover:text-maroon/80 font-medium transition-colors"
                    >
                      Open Sheet
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="text-gray-500 italic">URL not configured</span>
                  )}
                </div>
              </div>

              {/* WhatsApp Group */}
              <div className="flex items-start gap-4 p-4 bg-cream/50 rounded-lg hover:bg-cream transition-colors">
                <MessageCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">City Volunteer Group (e.g., Ambala)</div>
                  {foodRescueGroupUrl ? (
                    <a
                      href={foodRescueGroupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                      Open Group
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="text-gray-500 italic">Link not configured</span>
                  )}
                </div>
              </div>

              {/* Pickup Instructions */}
              <div className="flex items-start gap-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <Camera className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-2">📸 Pickup & Delivery Proof (Mandatory)</div>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>Volunteers <strong className="text-red-700">must send TWO geo-tagged photos</strong> on WhatsApp:</p>
                    <ul className="list-decimal list-inside space-y-1 ml-2">
                      <li><strong>Photo 1:</strong> At pickup point (with food)</li>
                      <li><strong>Photo 2:</strong> At delivery point (with recipients)</li>
                    </ul>
                    <p className="text-red-700 font-semibold mt-2">
                      ⚠️ Status can only be marked as "Completed" after both photos are received.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Configuration Help */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-xl">ℹ️</span>
              How to Configure URLs
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              To add Google Sheets and WhatsApp Group links, add these to your <code className="bg-blue-100 px-2 py-0.5 rounded">.env.local</code> file:
            </p>
            <pre className="bg-blue-900 text-blue-50 p-4 rounded-lg text-xs overflow-x-auto">
              {`NEXT_PUBLIC_STUDENT_QUERIES_SHEET_URL=https://docs.google.com/spreadsheets/d/...
NEXT_PUBLIC_FOOD_ALERTS_SHEET_URL=https://docs.google.com/spreadsheets/d/...
NEXT_PUBLIC_VOLUNTEER_GROUP_STUDENT_SUPPORT_URL=https://chat.whatsapp.com/...
NEXT_PUBLIC_VOLUNTEER_GROUP_FOOD_RESCUE_URL=https://chat.whatsapp.com/...`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}





