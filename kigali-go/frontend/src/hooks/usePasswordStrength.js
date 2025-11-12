/**
 * Custom hook for password strength validation
 */
import { useMemo } from 'react';

export const usePasswordStrength = (password) => {
  const strength = useMemo(() => {
    if (!password) {
      return {
        score: 0,
        label: '',
        color: 'error',
        checks: {
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false,
        },
      };
    }

    const checks = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;

    let label = '';
    let color = 'error';

    if (score === 5) {
      label = 'Strong';
      color = 'success';
    } else if (score >= 3) {
      label = 'Medium';
      color = 'warning';
    } else if (score > 0) {
      label = 'Weak';
      color = 'error';
    }

    return { score, label, color, checks };
  }, [password]);

  return strength;
};

export default usePasswordStrength;
