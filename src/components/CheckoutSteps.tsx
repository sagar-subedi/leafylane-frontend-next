import React from "react";
import { Box, Button } from "@mui/material";
import Link from "next/link";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Box className="flex justify-center items-center gap-4 mb-6">
      {/* Step 1: Sign In */}
      <Link href="/login" passHref>
        <Button
          variant="contained"
          color={step1 ? "success" : "inherit"}
          disabled={!step1}
          className={`${
            step1 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          Sign In →
        </Button>
      </Link>

      {/* Step 2: Shipping */}
      <Link href="/shipping" passHref>
        <Button
          variant="contained"
          color={step2 ? "success" : "inherit"}
          disabled={!step2}
          className={`${
            step2 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          Shipping →
        </Button>
      </Link>

      {/* Step 3: Payment */}
      <Link href="/payment" passHref>
        <Button
          variant="contained"
          color={step3 ? "success" : "inherit"}
          disabled={!step3}
          className={`${
            step3 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          Payment →
        </Button>
      </Link>

      {/* Step 4: Place Order */}
      <Link href="/placeorder" passHref>
        <Button
          variant="contained"
          color={step4 ? "success" : "inherit"}
          disabled={!step4}
          className={`${
            step4 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          Place Order
        </Button>
      </Link>
    </Box>
  );
};

export default CheckoutSteps;