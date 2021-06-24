var express = require("express");
var router = express.Router();
let ebay = require("../component/oauthToken");
var url = require("url");

/* GET users Token. */
router.post("/auth/token", async (req, res, next) => {
  let token = await ebay.applicationRequest();
  let data = {
    token: `Bearer ${token.access_token}`,
  };
  console.log(token);
  res.send(data);
});

router.post("/auth/url", async (req, res, next) => {
  let token = await ebay.generateURL();
  let finalObject = {
    data: token,
  };
  res.send(finalObject);
});

router.post("/auth/ouAtuh/token", async (req, res, next) => {
  let token = await ebay.generateUserAccessToken(req.body.code);
  let finalData = JSON.parse(token);
  let code = `Bearer ${finalData.access_token}`;
  console.log("Code: ", code);
  finalData.access_token = code;
  res.send(finalData);
});

router.post("/orders", async (req, res, next) => {
  let orders = await ebay.getOrders(
    req.body.token,
    req.body.limit,
    req.body.date
  );

  console.log("Orders: = ", orders);
  let finalObject;
  if (orders != undefined) {
    finalObject = {
      status: true,
      data: orders,
    };
  } else {
    finalObject = {
      status: false,
      data: [],
    };
  }

  res.send(finalObject);
});

module.exports = router;
