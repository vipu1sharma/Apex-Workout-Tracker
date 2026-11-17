// Haptic feedback utility using the Navigator Vibration API

export function triggerHaptic(type = 'light') {
  if (typeof window === 'undefined' || !navigator.vibrate) return;
  try {
    switch (type) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(25);
        break;
      case 'heavy':
        navigator.vibrate(50);
        break;
      case 'success':
        navigator.vibrate([15, 40, 20]);
        break;
      case 'alert':
        navigator.vibrate([40, 60, 40, 60]);
        break;
      default:
        navigator.vibrate(15);
    }
  } catch (e) {
    // Ignore haptic errors on unsupported hardware
  }
}
