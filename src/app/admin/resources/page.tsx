'use client';

import React from 'react';

const studentQueriesSheetUrl = process.env.NEXT_PUBLIC_STUDENT_QUERIES_SHEET_URL;
const foodAlertsSheetUrl = process.env.NEXT_PUBLIC_FOOD_ALERTS_SHEET_URL;
const studentSupportGroupUrl = process.env.NEXT_PUBLIC_VOLUNTEER_GROUP_STUDENT_SUPPORT_URL;
const foodRescueGroupUrl = process.env.NEXT_PUBLIC_VOLUNTEER_GROUP_FOOD_RESCUE_URL;

export default function AdminResourcesPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-maroon mb-6">Admin Resources</h1>
        <p className="text-gray-700 mb-8">
          Central links for coordinators and core team members. Please do not share this page
          publicly.
        </p>

        <div className="space-y-8">
          <section className="bg-white rounded-xl border border-gold/20 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-maroon mb-3">
              Student Support – Sheets & Resources
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-800">
              <li>
                <span className="font-medium">Student Queries Sheet:</span>{' '}
                {studentQueriesSheetUrl ? (
                  <a
                    href={studentQueriesSheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-maroon underline"
                  >
                    Open Sheet
                  </a>
                ) : (
                  <span className="text-gray-500">URL not configured</span>
                )}
              </li>
              <li>
                <span className="font-medium">Teacher Volunteers WhatsApp Group:</span>{' '}
                {studentSupportGroupUrl ? (
                  <a
                    href={studentSupportGroupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-maroon underline"
                  >
                    Open Group
                  </a>
                ) : (
                  <span className="text-gray-500">Link not configured</span>
                )}
              </li>
              <li>
                <span className="font-medium">Video Upload Instructions for Teachers:</span>{' '}
                <span className="text-gray-700">
                  Upload as <span className="font-semibold">Unlisted</span> on YouTube, avoid
                  sharing student faces without consent, and include the topic name +
                  class/subject in the title.
                </span>
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-xl border border-gold/20 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-maroon mb-3">
              Food Rescue – Sheets & Resources
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-800">
              <li>
                <span className="font-medium">Food Rescue Alerts Sheet:</span>{' '}
                {foodAlertsSheetUrl ? (
                  <a
                    href={foodAlertsSheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-maroon underline"
                  >
                    Open Sheet
                  </a>
                ) : (
                  <span className="text-gray-500">URL not configured</span>
                )}
              </li>
              <li>
                <span className="font-medium">City Volunteer Group (e.g., Ambala):</span>{' '}
                {foodRescueGroupUrl ? (
                  <a
                    href={foodRescueGroupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-maroon underline"
                  >
                    Open Group
                  </a>
                ) : (
                  <span className="text-gray-500">Link not configured</span>
                )}
              </li>
              <li>
                <span className="font-medium">Pickup & Delivery Proof:</span>{' '}
                <span className="text-gray-700">
                  Volunteers must send two geo-tagged photos on WhatsApp – one at pickup point and
                  one at delivery – for every alert before marking status as completed in the
                  sheet.
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}




