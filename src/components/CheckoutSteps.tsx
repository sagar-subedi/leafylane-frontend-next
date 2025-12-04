import React from "react";
import { Box, Stepper, Step, StepLabel, StepConnector, styled } from "@mui/material";
import Link from "next/link";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
  '&.Mui-active .MuiStepConnector-line': {
    background: 'linear-gradient(95deg, #2D6A4F 0%, #52B788 100%)',
  },
  '&.Mui-completed .MuiStepConnector-line': {
    background: 'linear-gradient(95deg, #2D6A4F 0%, #52B788 100%)',
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 40,
  height: 40,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    background: 'linear-gradient(136deg, #2D6A4F 0%, #52B788 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    background: 'linear-gradient(136deg, #2D6A4F 0%, #52B788 100%)',
  }),
}));

function ColorlibStepIcon(props: any) {
  const { active, completed, className } = props;

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {completed ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
    </ColorlibStepIconRoot>
  );
}

const CheckoutSteps = ({ step1, step2, step3, step4 }: any) => {
  const steps = [
    { label: 'Sign In', link: '/login', active: step1 },
    { label: 'Shipping', link: '/shipping', active: step2 },
    { label: 'Payment', link: '/payment', active: step3 },
    { label: 'Place Order', link: '/placeorder', active: step4 },
  ];

  // Calculate active step index based on props
  let activeStep = 0;
  if (step1) activeStep = 0;
  if (step2) activeStep = 1;
  if (step3) activeStep = 2;
  if (step4) activeStep = 3;

  return (
    <Box sx={{ width: '100%', mb: 6 }}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((step, index) => (
          <Step key={step.label} completed={index < activeStep || step.active}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <Link
                href={step.link}
                style={{
                  textDecoration: 'none',
                  color: index <= activeStep ? '#2D6A4F' : '#9ca3af',
                  fontWeight: index === activeStep ? 600 : 400
                }}
              >
                {step.label}
              </Link>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default CheckoutSteps;