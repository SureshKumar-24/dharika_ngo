import * as React from 'react';

interface VolunteerWelcomeEmailProps {
  name: string;
  interest: string;
  city: string;
}

export const VolunteerWelcomeEmail: React.FC<VolunteerWelcomeEmailProps> = ({
  name,
  interest,
  city,
}) => {
  const interestText =
    interest === 'food'
      ? 'Food Drives'
      : interest === 'teaching'
      ? 'Teaching Drives'
      : 'Food & Teaching Drives';

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={styles.body}>
        <table style={styles.container} cellPadding="0" cellSpacing="0">
          {/* Header with Gradient */}
          {/* Header with Gradient and Logo */}
          <tr>
            <td style={styles.header}>
              <img 
                src="https://res.cloudinary.com/dsr89dej0/image/upload/v1763573431/Dharika/gallery/lwmwyjpwq7palbz94s2c.png" 
                alt="Dharika Logo" 
                style={styles.logo}
              />
              <h1 style={styles.logoText}>DHARIKA</h1>
            </td>
          </tr>

          {/* Main Content */}
          <tr>
            <td style={styles.content}>
              <h2 style={styles.heading}>Welcome to Dharika! 🎉</h2>
              
              <p style={styles.text}>Dear {name},</p>
              
              <p style={styles.text}>
                Thank you for joining our mission to make a difference! We're thrilled to have you as part of the Dharika family.
              </p>

              <div style={styles.infoBox}>
                <p style={styles.infoTitle}>Your Registration Details:</p>
                <table style={styles.infoTable}>
                  <tr>
                    <td style={styles.infoLabel}>Area of Interest:</td>
                    <td style={styles.infoValue}>{interestText}</td>
                  </tr>
                  <tr>
                    <td style={styles.infoLabel}>Location:</td>
                    <td style={styles.infoValue}>{city}</td>
                  </tr>
                </table>
              </div>

              <p style={styles.text}>
                Our team will review your application and reach out to you soon with more information about upcoming drives and volunteer opportunities in your area.
              </p>

              <div style={styles.ctaContainer}>
                <a href="https://dharika.org" style={styles.button}>
                  Visit Our Website
                </a>
              </div>

              <p style={styles.text}>
                In the meantime, feel free to follow us on social media to stay updated on our latest activities and impact stories.
              </p>

              <p style={styles.signature}>
                With gratitude,<br />
                <strong>The Dharika Team</strong>
              </p>
            </td>
          </tr>

          {/* Footer */}
          <tr>
            <td style={styles.footer}>
              <p style={styles.footerText}>
                © {new Date().getFullYear()} Dharika. All rights reserved.
              </p>
              <p style={styles.footerText}>
                Making a difference, one drive at a time.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
};

const styles = {
  body: {
    margin: '0',
    padding: '40px 20px',
    background: 'linear-gradient(to bottom right, #FFF8DC, #FFFFFF, #FFE4E1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  container: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
  },
  header: {
    backgroundColor: '#8B0000',
    padding: '40px 20px',
    textAlign: 'center' as const,
  },
  logoContainer: {
    display: 'inline-block',
  },
  logo: {
    width: '80px',
    height: '80px',
    margin: '0 auto',
    display: 'block',
    borderRadius: '50%',
  },
  logoText: {
    margin: '12px 0 0 0',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: '3px',
  },
  content: {
    padding: '40px 30px',
  },
  heading: {
    margin: '0 0 24px 0',
    fontSize: '26px',
    fontWeight: '600',
    color: '#8B0000',
    textAlign: 'center' as const,
  },
  text: {
    margin: '0 0 16px 0',
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#333333',
  },
  infoBox: {
    backgroundColor: '#FFF8DC',
    border: '2px solid #D4AF37',
    borderRadius: '8px',
    padding: '20px',
    margin: '24px 0',
  },
  infoTitle: {
    margin: '0 0 12px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#8B0000',
  },
  infoTable: {
    width: '100%',
  },
  infoLabel: {
    padding: '8px 0',
    fontSize: '15px',
    fontWeight: '600',
    color: '#666666',
    width: '40%',
  },
  infoValue: {
    padding: '8px 0',
    fontSize: '15px',
    color: '#333333',
  },
  ctaContainer: {
    textAlign: 'center' as const,
    margin: '32px 0',
  },
  button: {
    display: 'inline-block',
    padding: '14px 32px',
    backgroundColor: '#8B0000',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
  },
  signature: {
    margin: '32px 0 0 0',
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#333333',
  },
  footer: {
    backgroundColor: '#8B0000',
    padding: '24px 20px',
    textAlign: 'center' as const,
  },
  footerText: {
    margin: '4px 0',
    fontSize: '14px',
    color: '#ffffff',
  },
};

// Admin notification email
interface AdminNotificationEmailProps {
  volunteerName: string;
  phone: string;
  email: string;
  city: string;
  interest: string;
  availability: string;
}

export const AdminNotificationEmail: React.FC<AdminNotificationEmailProps> = ({
  volunteerName,
  phone,
  email,
  city,
  interest,
  availability,
}) => {
  const interestText =
    interest === 'food'
      ? 'Food Drives'
      : interest === 'teaching'
      ? 'Teaching Drives'
      : 'Food & Teaching Drives';

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={adminStyles.body}>
        <table style={adminStyles.container} cellPadding="0" cellSpacing="0">
          {/* Header with Gradient and Logo */}
          <tr>
            <td style={adminStyles.header}>
              <img 
                src="https://res.cloudinary.com/dsr89dej0/image/upload/v1763573431/Dharika/gallery/lwmwyjpwq7palbz94s2c.png" 
                alt="Dharika Logo" 
                style={adminStyles.logo}
              />
              <h1 style={adminStyles.logoText}>DHARIKA</h1>
            </td>
          </tr>

          {/* Main Content */}
          <tr>
            <td style={adminStyles.content}>
              <h2 style={adminStyles.heading}>New Volunteer Registration 🎉</h2>
              
              <p style={adminStyles.text}>
                A new volunteer has registered on the website!
              </p>

              {/* Info Box */}
              <div style={adminStyles.infoBox}>
                <table style={adminStyles.infoTable}>
                  <tr>
                    <td style={adminStyles.infoLabel}>Name:</td>
                    <td style={adminStyles.infoValue}>{volunteerName}</td>
                  </tr>
                  <tr>
                    <td style={adminStyles.infoLabel}>Phone:</td>
                    <td style={adminStyles.infoValue}>{phone}</td>
                  </tr>
                  <tr>
                    <td style={adminStyles.infoLabel}>Email:</td>
                    <td style={adminStyles.infoValue}>
                      <a href={`mailto:${email}`} style={adminStyles.link}>{email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style={adminStyles.infoLabel}>City:</td>
                    <td style={adminStyles.infoValue}>{city}</td>
                  </tr>
                  <tr>
                    <td style={adminStyles.infoLabel}>Interest:</td>
                    <td style={adminStyles.infoValue}>{interestText}</td>
                  </tr>
                  <tr>
                    <td style={adminStyles.infoLabel}>Availability:</td>
                    <td style={adminStyles.infoValue}>{availability}</td>
                  </tr>
                </table>
              </div>

              <p style={adminStyles.text}>
                Please reach out to them soon to discuss volunteer opportunities.
              </p>
            </td>
          </tr>

          {/* Footer */}
          <tr>
            <td style={adminStyles.footer}>
              <p style={adminStyles.footerText}>
                © {new Date().getFullYear()} Dharika Admin System
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
};

// Admin email styles matching the admin dashboard aesthetic
const adminStyles = {
  body: {
    margin: '0',
    padding: '40px 20px',
    background: 'linear-gradient(to bottom right, #FFF8DC, #FFFFFF, #FFE4E1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  container: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
  },
  header: {
    backgroundColor: '#8B0000',
    padding: '40px 20px',
    textAlign: 'center' as const,
  },
  logo: {
    width: '80px',
    height: '80px',
    margin: '0 auto',
    display: 'block',
    borderRadius: '50%',
  },
  logoText: {
    margin: '12px 0 0 0',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: '3px',
  },
  content: {
    padding: '40px 30px',
  },
  heading: {
    margin: '0 0 20px 0',
    fontSize: '24px',
    fontWeight: '600',
    color: '#8B0000',
    textAlign: 'center' as const,
  },
  text: {
    margin: '0 0 20px 0',
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#333333',
  },
  infoBox: {
    backgroundColor: '#FFF8DC',
    border: '2px solid #D4AF37',
    borderRadius: '8px',
    padding: '24px',
    margin: '24px 0',
  },
  infoTitle: {
    margin: '0 0 12px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#8B0000',
  },
  infoTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  infoLabel: {
    padding: '10px 0',
    fontSize: '15px',
    fontWeight: '600',
    color: '#666666',
    width: '35%',
    verticalAlign: 'top' as const,
  },
  infoValue: {
    padding: '10px 0',
    fontSize: '15px',
    color: '#333333',
    verticalAlign: 'top' as const,
  },
  link: {
    color: '#8B0000',
    textDecoration: 'none',
  },
  footer: {
    backgroundColor: '#8B0000',
    padding: '20px',
    textAlign: 'center' as const,
  },
  footerText: {
    margin: '0',
    fontSize: '14px',
    color: '#ffffff',
  },
};

// Student Support – acknowledgement email to student
interface StudentQueryReceivedEmailProps {
  name: string;
  subjectLabel: string;
  topic: string;
}

export const StudentQueryReceivedEmail: React.FC<StudentQueryReceivedEmailProps> = ({
  name,
  subjectLabel,
  topic,
}) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={styles.body}>
        <table style={styles.container} cellPadding="0" cellSpacing="0">
          <tr>
            <td style={styles.header}>
              <img
                src="https://res.cloudinary.com/dsr89dej0/image/upload/v1763573431/Dharika/gallery/lwmwyjpwq7palbz94s2c.png"
                alt="Dharika Logo"
                style={styles.logo}
              />
              <h1 style={styles.logoText}>DHARIKA</h1>
            </td>
          </tr>

          <tr>
            <td style={styles.content}>
              <h2 style={styles.heading}>We’ve received your learning question 🎓</h2>

              <p style={styles.text}>Dear {name},</p>

              <p style={styles.text}>
                Thank you for reaching out to Dharika&apos;s Student Support. We&apos;ve received
                your query on <strong>{subjectLabel}</strong>:
              </p>

              <div style={styles.infoBox}>
                <p style={styles.infoTitle}>Your Question:</p>
                <p style={styles.text}>{topic}</p>
              </div>

              <p style={styles.text}>
                Our volunteer teachers will now review your query. You will receive a video solution
                within <strong>12 hours</strong>.
              </p>

              <p style={styles.text}>
                If this topic already exists on our YouTube channel, you may receive a video link
                much sooner.
              </p>

              <p style={styles.text}>
                Please keep an eye on your email and WhatsApp for the video link. Thank you for
                choosing to learn with us. 🌱
              </p>

              <p style={styles.signature}>
                With warmth,<br />
                <strong>Dharika Student Support Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style={styles.footer}>
              <p style={styles.footerText}>
                © {new Date().getFullYear()} Dharika. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
};

// Student Support – resolution email with YouTube link
interface StudentQueryResolvedEmailProps {
  name: string;
  topic: string;
  videoUrl: string;
}

export const StudentQueryResolvedEmail: React.FC<StudentQueryResolvedEmailProps> = ({
  name,
  topic,
  videoUrl,
}) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={styles.body}>
        <table style={styles.container} cellPadding="0" cellSpacing="0">
          <tr>
            <td style={styles.header}>
              <img
                src="https://res.cloudinary.com/dsr89dej0/image/upload/v1763573431/Dharika/gallery/lwmwyjpwq7palbz94s2c.png"
                alt="Dharika Logo"
                style={styles.logo}
              />
              <h1 style={styles.logoText}>DHARIKA</h1>
            </td>
          </tr>

          <tr>
            <td style={styles.content}>
              <h2 style={styles.heading}>Your learning video is ready! 📽️</h2>

              <p style={styles.text}>Dear {name},</p>

              <p style={styles.text}>
                Our teacher volunteers have created a video to help you with the following topic:
              </p>

              <div style={styles.infoBox}>
                <p style={styles.infoTitle}>Topic Solved:</p>
                <p style={styles.text}>{topic}</p>
              </div>

              <p style={styles.text}>You can watch your video lesson here:</p>

              <div style={styles.ctaContainer}>
                <a href={videoUrl} style={styles.button}>
                  Watch Video on YouTube
                </a>
              </div>

              <p style={styles.text}>
                Feel free to pause, rewind, and rewatch as many times as you like. If you still have
                doubts after watching, you can always submit a follow-up question.
              </p>

              <p style={styles.signature}>
                With care,<br />
                <strong>Dharika Student Support Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style={styles.footer}>
              <p style={styles.footerText}>
                © {new Date().getFullYear()} Dharika. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
};

// Admin notification for student query
interface AdminStudentQueryNotificationProps {
  studentName: string;
  age: string;
  city: string;
  locality: string;
  studentClass: string;
  subject: string;
  topic: string;
  phone: string;
  email: string;
  attendingOfflineClasses: string;
}

export const AdminStudentQueryNotification: React.FC<AdminStudentQueryNotificationProps> = ({
  studentName,
  age,
  city,
  locality,
  studentClass,
  subject,
  topic,
  phone,
  email,
  attendingOfflineClasses,
}) => {
  const subjectLabels: Record<string, string> = {
    maths: 'Mathematics',
    english: 'English',
    hindi: 'Hindi',
    science: 'Science',
    other: 'Other',
  };

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={adminStyles.body}>
        <table style={adminStyles.container} cellPadding="0" cellSpacing="0">
          <tr>
            <td style={adminStyles.header}>
              <img
                src="https://res.cloudinary.com/dsr89dej0/image/upload/v1763573431/Dharika/gallery/lwmwyjpwq7palbz94s2c.png"
                alt="Dharika Logo"
                style={adminStyles.logo}
              />
              <h1 style={adminStyles.logoText}>DHARIKA</h1>
            </td>
          </tr>

          <tr>
            <td style={adminStyles.content}>
              <h2 style={adminStyles.heading}>New Student Query Received 📚</h2>

              <p style={adminStyles.text}>
                A student has submitted a learning query that needs attention.
              </p>

              <div style={adminStyles.infoBox}>
                <p style={adminStyles.infoTitle}>Student Details:</p>
                <table style={adminStyles.infoTable}>
                  <tr>
                    <td style={adminStyles.infoLabel}>Name:</td>
                    <td style={adminStyles.infoValue}>{studentName}</td>
                  </tr>
                  <tr>
                    <td style={adminStyles.infoLabel}>Age:</td>
                    <td style={adminStyles.infoValue}>{age} years</td>
                  </tr>
                  <tr>
                    <td style={adminStyles.infoLabel}>Class:</td>
                    <td style={adminStyles.infoValue}>Class {studentClass}</td>
                  </tr>
                  <tr>
                    <td style={adminStyles.infoLabel}>Location:</td>
                    <td style={adminStyles.infoValue}>{locality}, {city}</td>
                  </tr>
                  <tr>
                    <td style={adminStyles.infoLabel}>Phone:</td>
                    <td style={adminStyles.infoValue}>
                      <a href={`tel:${phone}`} style={adminStyles.link}>{phone}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style={adminStyles.infoLabel}>Email:</td>
                    <td style={adminStyles.infoValue}>
                      <a href={`mailto:${email}`} style={adminStyles.link}>{email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style={adminStyles.infoLabel}>Attending Offline:</td>
                    <td style={adminStyles.infoValue}>{attendingOfflineClasses === 'yes' ? 'Yes' : 'No'}</td>
                  </tr>
                </table>
              </div>

              <div style={adminStyles.infoBox}>
                <p style={adminStyles.infoTitle}>Query Details:</p>
                <table style={adminStyles.infoTable}>
                  <tr>
                    <td style={adminStyles.infoLabel}>Subject:</td>
                    <td style={adminStyles.infoValue}>{subjectLabels[subject] || subject}</td>
                  </tr>
                  <tr>
                    <td style={adminStyles.infoLabel}>Topic:</td>
                    <td style={adminStyles.infoValue}><strong>{topic}</strong></td>
                  </tr>
                </table>
              </div>

              <p style={adminStyles.text}>
                <strong>Action Required:</strong> Please assign a volunteer teacher to create a video solution within 12 hours.
              </p>
            </td>
          </tr>

          <tr>
            <td style={adminStyles.footer}>
              <p style={adminStyles.footerText}>
                © {new Date().getFullYear()} Dharika Admin System
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
};

// Admin notification for food alert
interface AdminFoodAlertNotificationProps {
  donorType: string;
  establishmentName: string;
  contactPersonName: string;
  phone: string;
  address: string;
  city: string;
  quantity: string;
  preparedAt: string;
  expiryEstimate: string;
  photoUrl?: string;
}

export const AdminFoodAlertNotification: React.FC<AdminFoodAlertNotificationProps> = ({
  donorType,
  establishmentName,
  contactPersonName,
  phone,
  address,
  city,
  quantity,
  preparedAt,
  expiryEstimate,
  photoUrl,
}) => {
  const donorTypeLabels: Record<string, string> = {
    restaurant: 'Restaurant',
    cafe: 'Café',
    caterer: 'Caterer',
    individual: 'Individual',
  };

  const expiryLabels: Record<string, string> = {
    '2_hours': '2 hours',
    '4_hours': '4 hours',
    '6_hours': '6 hours',
    '8_hours': '8 hours',
    'same_day': 'Same day (until night)',
  };

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={adminStyles.body}>
        <table style={adminStyles.container} cellPadding="0" cellSpacing="0">
          <tr>
            <td style={adminStyles.header}>
              <img
                src="https://res.cloudinary.com/dsr89dej0/image/upload/v1763573431/Dharika/gallery/lwmwyjpwq7palbz94s2c.png"
                alt="Dharika Logo"
                style={adminStyles.logo}
              />
              <h1 style={adminStyles.logoText}>DHARIKA</h1>
            </td>
          </tr>

          <tr>
            <td style={adminStyles.content}>
              <h2 style={adminStyles.heading}>🚨 URGENT: New Food Donation Alert</h2>

              <p style={adminStyles.text}>
                <strong style={{ color: '#8B0000' }}>Immediate action required!</strong> A food donor has surplus food ready for pickup.
              </p>

              <div style={adminStyles.infoBox}>
                <p style={adminStyles.infoTitle}>Donor Information:</p>
                <table style={adminStyles.infoTable}>
                  <tr>
                    <td style={adminStyles.infoLabel}>Donor Type:</td>
                    <td style={adminStyles.infoValue}>{donorTypeLabels[donorType] || donorType}</td>
                  </tr>
                  <tr>
                    <td style={adminStyles.infoLabel}>Establishment:</td>
                    <td style={adminStyles.infoValue}><strong>{establishmentName}</strong></td>
                  </tr>
                  <tr>
                    <td style={adminStyles.infoLabel}>Contact Person:</td>
                    <td style={adminStyles.infoValue}>{contactPersonName}</td>
                  </tr>
                  <tr>
                    <td style={adminStyles.infoLabel}>Phone:</td>
                    <td style={adminStyles.infoValue}>
                      <a href={`tel:${phone}`} style={adminStyles.link}><strong>{phone}</strong></a>
                    </td>
                  </tr>
                  <tr>
                    <td style={adminStyles.infoLabel}>Address:</td>
                    <td style={adminStyles.infoValue}>{address}, {city}</td>
                  </tr>
                </table>
              </div>

              <div style={adminStyles.infoBox}>
                <p style={adminStyles.infoTitle}>Food Details:</p>
                <table style={adminStyles.infoTable}>
                  <tr>
                    <td style={adminStyles.infoLabel}>Quantity:</td>
                    <td style={adminStyles.infoValue}><strong>{quantity}</strong></td>
                  </tr>
                  <tr>
                    <td style={adminStyles.infoLabel}>Prepared At:</td>
                    <td style={adminStyles.infoValue}>{preparedAt}</td>
                  </tr>
                  <tr>
                    <td style={adminStyles.infoLabel}>Safe Until:</td>
                    <td style={adminStyles.infoValue}>
                      <strong style={{ color: '#8B0000' }}>{expiryLabels[expiryEstimate] || expiryEstimate}</strong>
                    </td>
                  </tr>
                  {photoUrl && (
                    <tr>
                      <td style={adminStyles.infoLabel}>Photo:</td>
                      <td style={adminStyles.infoValue}>
                        <a href={photoUrl} style={adminStyles.link}>View Food Photo</a>
                      </td>
                    </tr>
                  )}
                </table>
              </div>

              <div style={{ ...adminStyles.infoBox, backgroundColor: '#FFE4E1', borderColor: '#8B0000' }}>
                <p style={{ ...adminStyles.infoTitle, color: '#8B0000' }}>⏰ Action Required:</p>
                <p style={adminStyles.text}>
                  1. <strong>Immediately</strong> assign a volunteer for pickup<br />
                  2. Contact the donor at <a href={`tel:${phone}`} style={adminStyles.link}>{phone}</a><br />
                  3. Coordinate pickup within the safe consumption window<br />
                  4. Update the status in the admin dashboard after pickup
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style={adminStyles.footer}>
              <p style={adminStyles.footerText}>
                © {new Date().getFullYear()} Dharika Admin System
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
};
