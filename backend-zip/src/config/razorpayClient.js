const Razorpay = require('razorpay');

apiKey="rzp_test_OoixyRsPGXElpb"
apiSecret="W3Uo2eteBwG17QlOkHExBmrN"

const razorpay = new Razorpay({
    key_id: apiKey,
    key_secret: apiSecret,
  });


  module.exports=razorpay;