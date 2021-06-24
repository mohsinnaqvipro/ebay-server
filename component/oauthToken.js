let { clientId, clientSecret, token } = require("../config/keys");
const EbayAuthToken = require("ebay-oauth-nodejs-client");
const axios = require("axios").default;
// let btoa = require("btoa");
// let qs = require("qs");

exports.generateURL = async () => {
  let res;
  try {
    const ebayAuthToken = new EbayAuthToken({
      clientId: clientId,
      clientSecret: clientSecret,
      // contentType: application / json,
      redirectUri: "Muhammad_Rohail-Muhammad-FIrst--oqcqa",
      // redirectUri: "https://www.google.com/",
      grant_type: "authorization_code",
    });
    const options = { prompt: "login" };
    let scopes = [
      "https://api.ebay.com/oauth/api_scope",
      "https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly",
      "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
    ];
    const authUrl = ebayAuthToken.generateUserAuthorizationUrl(
      "PRODUCTION",
      scopes
      //  options
    );

    console.log("Auth URL: === ", authUrl);

    const response = await axios.get(authUrl);
    res = authUrl;
  } catch (err) {
    console.log(`Error = ${err}`);
    res = response.data;
  }
  return res;
};

exports.generateUserAccessToken = async (code) => {
  let res;
  try {
    const ebayAuthToken = new EbayAuthToken({
      clientId: clientId,
      clientSecret: clientSecret,
      // contentType: application / json,
      redirectUri: "Muhammad_Rohail-Muhammad-FIrst--oqcqa",
      grant_type: "authorization_code",
    });

    const accessToken = await ebayAuthToken.exchangeCodeForAccessToken(
      "PRODUCTION",
      code
    );
    res = accessToken;
  } catch (err) {
    console.log(`Error = ${err}`);
  }
  return res;
};

// exports.applicationRequest = async () => {
//   let res;
//   try {
//     const ebayAuthToken = new EbayAuthToken({
//       clientId: clientId,
//       clientSecret: clientSecret,
//       grant_type: "authorization_code",
//       // redirectUri: "https://api.ebay.com/oauth/api_scope",
//     });
//     const token = await ebayAuthToken.getApplicationToken("PRODUCTION");
//     res = JSON.parse(token);
//   } catch (err) {
//     console.log(`Error = ${err}`);
//     res = token;
//   }
//   return res;
// };

exports.getOrders = async (token, limit, date) => {
  let res;
  try {
    let url;
    if (date) {
      console.log("Hellow i am in ", date);
      // date = "2021-06-14T23:20:08.000Z";
      url = `https://api.ebay.com/sell/fulfillment/v1/order?limit=${limit}&filter=creationdate:%5B${date}T08:25:43.511Z..%5D`;
    } else {
      url = `https://api.ebay.com/sell/fulfillment/v1/order?limit=${limit}`;
    }
    let response = await axios.get(url, {
      method: "get",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: token,
      },
    });
    res = response.data;
  } catch (err) {
    console.log(`Error = ${err}`);
  }
  return res;
};
