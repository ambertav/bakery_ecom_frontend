export function handleFirebaseAuthErrors(error: any) {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Email already in use';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/invalid-login-credentials':
      return 'Invalid credentials, please try again';
    default:
      console.error(error);
      return 'Error';
  }
}
