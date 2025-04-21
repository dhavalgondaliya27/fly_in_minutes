import { OAuth2Client } from 'google-auth-library';
import appConfig from '../config/appConfig.js';
const client = new OAuth2Client(appConfig.googleClientId);

const verifyGoogleToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: appConfig.googleClientId,
    });
    return ticket.getPayload();
  } catch (error) {
    return null;
  }
};

export default verifyGoogleToken;