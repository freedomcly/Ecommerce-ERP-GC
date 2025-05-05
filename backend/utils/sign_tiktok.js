const crypto = require('crypto')
const URL = require('url')
const excludeKeys = ["access_token", "sign"];  

function generateSign (requestOption, app_secret) {  
  console.log(requestOption)
  console.log(requestOption.uri)
  let signString = "";  
  // step1: Extract all query parameters excluding sign and access_token. Reorder the parameter keys in alphabetical order:  
  const params = requestOption.qs || {};  
  const sortedParams = Object.keys(params)  
    .filter((key) => !excludeKeys.includes(key))  
    .sort()  
    .map((key) => ({ key, value: params[key] }));  
  //step2: Concatenate all the parameters in the format {key}{value}:  
  const paramString = sortedParams  
    .map(({ key, value }) => `${key}${value}`)  
    .join("");  
  
  signString += paramString;  
  
  //step3: Append the string from Step 2 to the API request path:  
// @ts-ignore  
  const pathname = URL.parse(requestOption.uri).pathname;  
  
  signString = `${pathname}${paramString}`;  
  
  //step4: If the request header content-type is not multipart/form-data, append the API request body to the string from Step 3:  
  if (  
    requestOption.headers["content-type"] !== "multipart/form-data" &&  
    requestOption.body &&  
    Object.keys(requestOption.body).length  
  ) {  
    const body = JSON.stringify(requestOption.body);  
    signString += body;  
  }  
  
  //step5: Wrap the string generated in Step 4 with the app_secret:  
  signString = `${app_secret}${signString}${app_secret}`;  
  
  //step6: Encode your wrapped string using HMAC-SHA256:  
  const hmac = crypto.createHmac("sha256", app_secret);  
  hmac.update(signString);  
  const sign = hmac.digest("hex");  
  
  return sign;
}
module.exports = {
  generateSign
}