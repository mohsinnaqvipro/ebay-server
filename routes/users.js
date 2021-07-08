var express = require("express");
var router = express.Router();
let ebay = require("../component/oauthToken");
const dbHandler = require("../database/dbHandler");
const { response } = require("../helpers/response");

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

router.post("/order/dispatch", async (req, res) => {
  let orderDispatch = await ebay.ordersDispatched(
    req.body.token,
    req.body.lineItemId,
    req.body.quantity,
    req.body.shippedDate,
    req.body.shippingCarrierCode,
    req.body.trackingNumber,
    req.body.orderId
  );

  res.send(orderDispatch);
});

router.post("/login", async (req, res) => {
  console.log("Hello i am in getUser Function");
  let result;
  try {
    let data = req.body;
    result = await dbHandler.getItem("users", {
      where: {
        username: data.username,
        password: data.password,
      },
    });
    if (result) {
      return response(true, "Successfully Retrieved", result, res);
    } else {
      return response(false, "User Not Exist", result, res);
    }
  } catch (error) {
    console.log("Error = ", error);
    return response(false, "Failed to retrieved", error, res);
  }
});

router.post("/register", async (req, res) => {
  console.log("Hello i am in register Function");
  let result;
  try {
    let data = req.body;
    result = await dbHandler.getItem("users", {
      where: {
        id: data.id,
      },
    });
    console.log("Result asdasdasd =====", result);
    if (result) {
      if (result.isAdmin) {
        saveUser = await dbHandler.addItem("users", {
          email: data.email,
          username: data.username,
          password: data.password,
        });
        return response(true, "Successfully Added", saveUser, res);
      } else {
        return response(false, "You have no access", result, res);
      }
    } else {
      return response(false, "User Not Exist", result, res);
    }
  } catch (error) {
    console.log("Error = ", error);
    return response(false, "Faild to retrieved", error, res);
  }
});

router.get("/count", async (req, res) => {
  console.log("Hello i am in register Function");
  let result;
  try {
    result = await dbHandler.getItems("users");
    console.log("Result asdasdasd =====", result);
    if (result) {
      return response(true, "Successfully Added", result.length, res);
    } else {
      return response(false, "User Not Exist", result, res);
    }
  } catch (error) {
    console.log("Error = ", error);
    return response(false, "Faild to retrieved", error, res);
  }
});

module.exports = router;
