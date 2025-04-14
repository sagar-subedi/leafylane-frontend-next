"use client";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, ListGroup, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation"; // ✅ Replace history with useRouter
import { savePaymentMethodId } from "@/store/slices/orderSlice";
import { fetchPaymentMethods, savePaymentMethod } from "@/store/slices/paymentSlice";
import CheckoutSteps from "@/components/CheckoutSteps";
import Loader from "@/components/Loader";
import Message from "@/components/Message";

const PaymentScreen = () => {
  const router = useRouter(); // ✅ Next.js Router
  const dispatch = useDispatch();

  const order = useSelector((state) => state.order);
  const { shippingAddressId } = order;

  useEffect(() => {
    if (!shippingAddressId) {
      router.push("/shipping"); // ✅ Redirect properly
    }
  }, [shippingAddressId, router]);

  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [cardNumber, setCardNumber] = useState("4242424242424242"); // ✅ Removed spaces
  const [expirationMonth, setExpirationMonth] = useState("10");
  const [expirationYear, setExpirationYear] = useState("26");
  const [cvv, setCvv] = useState("123");
  const [message, setMessage] = useState(null);

  const { success, loading: saveLoading, error: saveError } = useSelector((state) => state.payment.savePayment);
  const { paymentMethods, loading: listLoading, error: listError } = useSelector((state) => state.payment.listPaymentMethods);

  useEffect(() => {
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  const proceedToPlaceOrder = () => {
    dispatch(savePaymentMethodId(paymentMethodId));
    router.push("/placeorder"); // ✅ Use Next.js router
  };

  const saveCard =  async () => {
    const cardRequestBody = {
      card: { cardNumber, expirationMonth, expirationYear, cvv },
    };
    await dispatch(savePaymentMethod(cardRequestBody));
    dispatch(fetchPaymentMethods());
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      <Row className="mx-5 justify-content-md-center">
        <h1 className="mx-5 justify-content-md-center">Payment Method</h1>
      </Row>
      <hr />
      {(saveError || listError) && <Message variant="danger">{saveError || listError}</Message>}
      {message && <Message variant="danger">{message}</Message>}

      <Row>
        <Col xs={12} md={6}>
          {listLoading ? (
            <Loader />
          ) : (
            <>
              <h2>Select Payment Method</h2>
              {paymentMethods.map((a) => (
                <ListGroup.Item key={a.paymentMethodId} variant="flush">
                  <InputGroup>
                    <Col md={1}>
                      <Form.Check
                        type="radio"
                        id={a.paymentMethodId}
                        value={a.paymentMethodId} // ✅ Fix value
                        name="paymentMethod"
                        checked={a.paymentMethodId === paymentMethodId}
                        onChange={() => setPaymentMethodId(a.paymentMethodId)}
                      />
                    </Col>
                    <Col>
                      <div
                        className="p-2"
                        style={{ whiteSpace: "pre-wrap", backgroundColor: "#eeeeee" }}
                        onClick={() => setPaymentMethodId(a.paymentMethodId)}
                      >
                        <p className="m-0" style={{ textTransform: "uppercase" }}>
                          {a.cardType}
                        </p>
                        <p className="m-0">
                          **** **** **** {a.cardLast4Digits} - {a.cardExpirationMonth} / {a.cardExpirationYear}
                        </p>
                      </div>
                    </Col>
                  </InputGroup>
                </ListGroup.Item>
              ))}
            </>
          )}
        </Col>

        <Col xs={12} md={6}>
          <h2>Add New Card</h2>
          <Form>
            <Form.Group controlId="cardNumber">
              <Form.Label>Card Number</Form.Label>
              <Form.Control type="text" value={cardNumber} required onChange={(e) => setCardNumber(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="expirationMonth">
              <Form.Label>Expiration Month</Form.Label>
              <Form.Control type="text" value={expirationMonth} required onChange={(e) => setExpirationMonth(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="expirationYear">
              <Form.Label>Expiration Year</Form.Label>
              <Form.Control type="text" value={expirationYear} required onChange={(e) => setExpirationYear(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="cvv">
              <Form.Label>Cvv</Form.Label>
              <Form.Control type="password" value={cvv} required onChange={(e) => setCvv(e.target.value)} />
            </Form.Group>

            <Button type="button" variant="primary" onClick={saveCard} disabled={saveLoading}>
              {saveLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Add Card"}
            </Button>
          </Form>
        </Col>
      </Row>

      <hr />
      <Row className="mx-5 justify-content-md-center">
        <Button type="button" variant="primary" onClick={proceedToPlaceOrder} className="mt-3" disabled={!paymentMethodId}>
          Proceed to Place Order
        </Button>
      </Row>
    </>
  );
};

export default PaymentScreen;
