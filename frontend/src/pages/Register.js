import authContext from '../context/AuthContext.js';
import { Toast } from '../components/common/ErrorMessage.js';
import { setButtonLoading } from '../components/common/Button.js';

/**
 * Register Page Controller
 */
export function initRegisterPage() {
  const form = document.getElementById('register-form');
  if (!form) return;

  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const passwordInput = document.getElementById('reg-password');
  const deptInput = document.getElementById('reg-department');
  const semInput = document.getElementById('reg-semester');
  const enrollInput = document.getElementById('reg-enrollment');
  const submitBtn = document.getElementById('register-submit-btn');
  const errBox = document.getElementById('register-error-alert');

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

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const department = deptInput.value.trim();
    const semester = semInput.value.trim() || null;
    const enrollment_id = enrollInput.value.trim() ? parseInt(enrollInput.value.trim(), 10) : null;

    if (!name || !email || !password || !department) {
      showError('Please complete all required fields (Name, Email, Password, Department).');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters long.');
      return;
    }

    setButtonLoading(submitBtn, true, 'Creating Account...');

    try {
      await authContext.register({
        name,
        email,
        password,
        department,
        semester,
        enrollment_id,
      });

      Toast.success('Account created successfully! Logging you in...');
      // Automatic login
      try {
        await authContext.login(email, password);
        window.location.hash = '#dashboard';
      } catch {
        window.location.hash = '#login';
      }
    } catch (err) {
      showError(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });
}
