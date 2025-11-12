/**
 * Password Strength Indicator Component
 */
import React from 'react';
import { Box, Typography, LinearProgress, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Check, X } from 'lucide-react';
import { usePasswordStrength } from '../../hooks/usePasswordStrength';

const PasswordStrengthIndicator = ({ password }) => {
  const { score, label, color, checks } = usePasswordStrength(password);

  if (!password) return null;

  const requirements = [
    { key: 'length', label: 'At least 12 characters', met: checks.length },
    { key: 'uppercase', label: 'One uppercase letter', met: checks.uppercase },
    { key: 'lowercase', label: 'One lowercase letter', met: checks.lowercase },
    { key: 'number', label: 'One number', met: checks.number },
    { key: 'special', label: 'One special character', met: checks.special },
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <LinearProgress
          variant="determinate"
          value={(score / 5) * 100}
          color={color}
          sx={{ flex: 1, height: 8, borderRadius: 4 }}
        />
        <Typography variant="body2" color={`${color}.main`} fontWeight="medium">
          {label}
        </Typography>
      </Box>
      
      <List dense sx={{ mt: 1 }}>
        {requirements.map((req) => (
          <ListItem key={req.key} sx={{ py: 0.5, px: 0 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              {req.met ? (
                <Check size={16} color="#4caf50" />
              ) : (
                <X size={16} color="#f44336" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={req.label}
              primaryTypographyProps={{
                variant: 'body2',
                color: req.met ? 'success.main' : 'text.secondary',
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PasswordStrengthIndicator;
