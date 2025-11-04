// Utility functions for Profile Page

/**
 * Format user's full name with fallback
 */
export function formatFullName(
  firstName?: string | null,
  lastName?: string | null,
  fallback = 'User'
): string {
  const name = `${firstName || ''} ${lastName || ''}`.trim();
  return name || fallback;
}

/**
 * Get user initials from name
 */
export function getUserInitials(
  firstName?: string | null,
  lastName?: string | null,
  fallback = 'U'
): string {
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  return initials || fallback;
}

/**
 * Format join date from timestamp
 */
export function formatJoinDate(timestamp?: number | Date | null): string {
  if (!timestamp) return 'Unknown';
  
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image size must be less than 10MB'
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
    };
  }

  return { valid: true };
}

/**
 * Export profile data as JSON
 */
export function exportProfileData(data: any, filename?: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `profile-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Get time ago string
 */
export function getTimeAgo(timestamp: Date | number | string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
}

/**
 * Calculate profile completion percentage
 */
export function calculateProfileCompletion(user: {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  imageUrl?: string | null;
  primaryEmailAddress?: { emailAddress?: string };
  phoneNumbers?: Array<{ phoneNumber?: string }>;
  unsafeMetadata?: {
    bio?: string;
    address?: string;
  };
}): number {
  const fields = [
    user.firstName,
    user.lastName,
    user.username,
    user.imageUrl,
    user.primaryEmailAddress?.emailAddress,
    user.phoneNumbers?.[0]?.phoneNumber,
    user.unsafeMetadata?.bio,
    user.unsafeMetadata?.address,
  ];

  const completed = fields.filter(field => field && field.trim() !== '').length;
  return Math.round((completed / fields.length) * 100);
}

/**
 * Generate random avatar gradient
 */
export function generateAvatarGradient(seed: string): string {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-red-400 to-red-600',
    'from-orange-400 to-orange-600',
    'from-yellow-400 to-yellow-600',
    'from-green-400 to-green-600',
    'from-teal-400 to-teal-600',
    'from-cyan-400 to-cyan-600',
    'from-indigo-400 to-indigo-600',
  ];

  return colors[Math.abs(hash) % colors.length];
}

/**
 * Validate username
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || username.trim() === '') {
    return { valid: false, error: 'Username is required' };
  }

  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (username.length > 20) {
    return { valid: false, error: 'Username must be less than 20 characters' };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }

  return { valid: true };
}

/**
 * Get account age in days
 */
export function getAccountAge(createdAt: Date | number | string): number {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format account age
 */
export function formatAccountAge(createdAt: Date | number | string): string {
  const days = getAccountAge(createdAt);
  
  if (days < 30) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
  
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? 's' : ''}`;
}
