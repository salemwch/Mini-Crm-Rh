import { google } from 'googleapis';

export async function getGmailAccessToken() {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.MAIL_CLIENT_ID,
        process.env.MAIL_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
    );

    oAuth2Client.setCredentials({
        refresh_token: process.env.MAIL_REFRESH_TOKEN,
    });

    const accessToken = await oAuth2Client.getAccessToken();
    return accessToken.token;
}
