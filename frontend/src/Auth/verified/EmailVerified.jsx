import './EmailVerified.css';
import { useSearchParams } from 'react-router-dom';

export default function EmailVerified() {
  const [params] = useSearchParams();
  const status = params.get('status')?.toLowerCase();

  const data = {
    success: {
      title: '🎉 Email Verified!',
      message: 'You can now log in and use your account.',
      color: 'green',
    },
    already_verified: {
      title: '✔️ Already Verified',
      message: 'This email has already been verified.',
      color: 'yellow',
    },
    error: {
      title: '❌ Verification Failed',
      message: 'The link is invalid or expired. Try again.',
      color: 'red',
    },
  };

  const { title, message, color } = data[status] || data.error;

  document.documentElement.style.setProperty('--status-color', `var(--${color}-color)`);

  return (
    <div className="email-verified-wrapper">
      <div className="email-verified-card">
        <h1 className="email-verified-title">{title}</h1>
        <p className="email-verified-message">{message}</p>
        <a href="/" className="email-verified-button">
          Go to Login
        </a>
      </div>
    </div>
  );
}
