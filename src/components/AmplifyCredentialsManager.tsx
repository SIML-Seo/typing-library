/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession, signOut as amplifySignOut  } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
// import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
// import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import outputs from '../../amplify_outputs.json';

// Amplify 기본 설정
try {
  Amplify.configure(outputs,{ ssr: true });
  console.log("Amplify configured successfully in CredentialsManager.");
} catch (error) {
  if ((error as Error).name !== 'AmplifyAlreadyConfiguredError') {
    console.error("Error configuring Amplify:", error);
  } else {
    console.log("Amplify already configured.");
  }
}

/**
 * NextAuth.js와 Amplify 인증 시스템을 연결하는 컴포넌트
 * 
 * NextAuth.js 세션의 ID 토큰을 Cognito Identity Pool에 전달하여
 * Amplify Storage가 S3에 인증된 접근을 할 수 있도록 합니다.
 */
export function AmplifyCredentialsManager() {
  const { data: session, status } = useSession();

  useEffect(() => {
    const hubListenerCancel = Hub.listen('auth', (data) => {
      const { event, message } = data.payload;
      console.log(`Amplify Auth event: ${event} =>`, message);
      if (event === 'signedOut') {
        console.log("Amplify signedOut event received.");
      }
    });

    return () => {
      hubListenerCancel(); // 컴포넌트 언마운트 시 리스너 정리
    };
  }, []);

  useEffect(() => {
    const configureAmplifyCredentials = async () => {
      // 필요한 설정값 가져오기
      const identityPoolId = outputs.auth.identity_pool_id;
      const userPoolId = outputs.auth.user_pool_id;
      const region = outputs.auth.aws_region;

      if (!identityPoolId || !userPoolId || !region) {
        console.error("Missing configuration values from amplify_outputs.json");
        return;
      }

      // Cognito User Pool Provider ID 형식
      // const providerId = `cognito-idp.${region}.amazonaws.com/${userPoolId}`;

      if (status === 'authenticated' && session?.idToken) {
        console.log('NextAuth status: authenticated. Setting up Cognito credentials...');
        try {
          // // AWS SDK v3의 Cognito Identity 클라이언트 생성
          // const cognitoIdentityClient = new CognitoIdentityClient({
          //   region,
          //   credentials: fromCognitoIdentityPool({
          //     identityPoolId,
          //     clientConfig: { region },
          //     logins: {
          //       [providerId]: session.idToken
          //     }
          //   })
          // });

          // console.log('Successfully set up Cognito Identity credentials with NextAuth token');
          console.log('session.idToken', session.idToken);
          
          // Amplify 내부적으로도 사용할 수 있게 세션 설정 (새로운 API 형태)
          try {
            // const authSession = await fetchAuthSession();
            // console.log('Current Amplify auth session:', authSession.tokens ? 'Active' : 'Inactive');
            const currentSession = await fetchAuthSession({ forceRefresh: true });
            console.log('Amplify session fetched successfully:', currentSession);
          } catch (error) {
            console.log('No active Amplify session yet => ' + error);
          }
          
          // // 글로벌 변수로 설정하여 다른 컴포넌트에서 접근 가능하게 함
          // (window as any).cognitoIdentityClient = cognitoIdentityClient;
          
        } catch (error) {
          console.error("Error setting up Cognito Identity credentials:", error);
        }
      } else if (status === 'unauthenticated') {
        console.log('NextAuth status: unauthenticated. Clearing Cognito credentials...');
        try {
          // Amplify 인증 세션 제거
          await amplifySignOut({ global: true });
          
          // 글로벌 변수 제거
          if ((window as any).cognitoIdentityClient) {
            delete (window as any).cognitoIdentityClient;
          }
          
          console.log('Cognito credentials cleared for unauthenticated user.');
        } catch (error) {
          console.error("Error clearing credentials:", error);
        }
      }
    };

    if (status !== 'loading') {
      configureAmplifyCredentials();
    }

  }, [status, session?.idToken]);

  return null;
}

export default AmplifyCredentialsManager; 