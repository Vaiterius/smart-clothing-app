import {HEXO_CLIENT_ID} from '@env'
import {HEXO_CLIENT_SECRET} from '@env'
import CryptoJS from "crypto-js";

async function connectToHexoskin() {
  // Replace these with your own API Key details
  const publicKey = HEXO_CLIENT_ID;
  const privateKey = HEXO_CLIENT_SECRET;

  const timestamp = Math.floor(Date.now() / 1000); // Current UTC timestamp in seconds
  const url = 'https://api.hexoskin.com/api/user/'; // URL of the API endpoint you want to access

  // Generate the signature
  const signatureString = `${privateKey}${timestamp}${url}`;

  // Calculate SHA1 hash
  const hash = CryptoJS.SHA1(signatureString);
  const signature = hash.toString(CryptoJS.enc.Hex);

  // Make the GET request
  fetch(url, {
    headers: {
      'X-HEXOTIMESTAMP': timestamp.toString(),
      'X-HEXOAPIKEY': publicKey,
      'X-HEXOAPISIGNATURE': signature,
    },
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => {
        throw new Error(`Failed to connect to Hexoskin: ${text}`);
      });
    }
    return response.json();
  })
  .then(data => {
    if (data.error) {
      console.error('Failed to connect to Hexoskin: ', data.error);
    } else {
      console.log('Successfully connected to Hexoskin:', data);
    }
  })
  .catch(error => {
    console.error(error);
  });
}

export default connectToHexoskin;