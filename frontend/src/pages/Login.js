import authContext from '../context/AuthContext.js';
import { Toast } from '../components/common/ErrorMessage.js';
import { setButtonLoading } from '../components/common/Button.js';

/**
 * Login Page Controller
 */
export function initLoginPage() {
  const form = document.getElementById('login-form');
  if (!form) return;

  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const submitBtn = document.getElementById('login-submit-btn');
  const errBox = document.getElementById('login-error-alert');

  const showError = (msg) => {
    if (errBox) {
      errBox.textContent = msg;
      errBox.style.display = 'block';
    }
  };

  const hideError = () => {
    if (errBox) errBox.style.display = 'none';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showError('Please enter both email and password.');
      return;
    }

    setButtonLoading(submitBtn, true, 'Signing in...');

    try {
      await authContext.login(email, password);
      Toast.success('Welcome back to CampusPilot!');
      window.location.hash = '#dashboard';
    } catch (err) {
      showError(err.message || 'Invalid email or password.');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });
}
