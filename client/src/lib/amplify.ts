import { Amplify } from 'aws-amplify';

// AWS Amplify v6 configuration for Cognito User Pool only
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID || '',
      userPoolClientId: import.meta.env.VITE_AWS_COGNITO_CLIENT_ID || '',
      loginWith: {
        username: true,
        email: false,
      },
    },
  },
};

// Configure Amplify if environment variables are available
export function configureAmplify() {
  const userPoolId = import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID;
  const clientId = import.meta.env.VITE_AWS_COGNITO_CLIENT_ID;

  if (userPoolId && clientId) {
    try {
      Amplify.configure(amplifyConfig);
      console.log('✅ AWS Amplify configured successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to configure AWS Amplify:', error);
      return false;
    }
  } else {
    console.warn('⚠️ AWS Amplify not configured - missing environment variables');
    console.warn('Required: VITE_AWS_COGNITO_USER_POOL_ID, VITE_AWS_COGNITO_CLIENT_ID');
    return false;
  }
}

export { amplifyConfig };