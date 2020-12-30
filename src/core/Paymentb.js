import React, { useState, useEffect } from "react";
// import { loadCart, cartEmpty } from './helper/cartHelper'
// import { Link } from "react-router-dom";
import { getmeToken, processPayment } from "./helper/paymentbhelper";
// import { createOrder } from "./helper/orderHelper";

import { loadCart } from "./helper/cartHelper";
import DropIn from "braintree-web-drop-in-react";
import { isAutheticated } from "../auth/helper";

const Paymentb = () => {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {}
  });
const [products, setProducts] = useState([])
  const userId = isAutheticated() && isAutheticated().user._id;
  const token = isAutheticated() && isAutheticated().token;

  const getToken = (userId, token) => {
    return getmeToken(userId, token).then(info => {
      const clientToken = info.clientToken;
        setInfo({ clientToken });
      // console.log("INFORMATION", info);

    })
    .catch(info => console.log(info.error))
  };

  const showbtdropIn = () => {
    return (
      <div>
        {info.clientToken !== null && products.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={instance => (info.instance = instance)}
            />
            <button className="btn btn-block btn-success" onClick={onPurchase}>
              Buy
            </button>
          </div>
        ) : (
          <h3>Please login or add something to cart</h3>
        )}
      </div>
    );
  };

  useEffect(() => {
    getToken(userId, token);
    setProducts(loadCart())

  }, []);

  const onPurchase = () => {
    setInfo({ loading: true });
    let nonce;
    let getNonce ;
    getNonce = info?.instance?.requestPaymentMethod().then(data => {
      nonce = data?.nonce;
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getAmount()
      };
      processPayment(userId, token, paymentData)
        .then(response => {
          setInfo({ ...info, success: response.success, loading: false });
          console.log("PAYMENT SUCCESS");
          //TODO: empty the cart
          //TODO: force reload
        })
        .catch(error => {
          setInfo({ loading: false, success: false });
          console.log("PAYMENT FAILED");
        });
    });
  };

  const getAmount = () => {
    let amount = 0;
    products.map(p => {
      amount = amount + p.price;
    });
    return amount;
  };

  return (
    <div>

      <h3>Your bill is Rs. {getAmount()} </h3>
      {showbtdropIn()}
    </div>
  );
};

export default Paymentb;
