import React from 'react';
import ReactDOM from 'react-dom';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import SetupForm from '@/components/ui/PaymentElement';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51RAqOoCN0nFaOvzFOZEPFnHVcRimq63Xbuumkk9shyBL0J8of8SnsCBKANyuxNADviXNXnmKJgbeBekxOtAJHAnp00Ovk1bsII');

function App() {
  const options = {
    // passing the SetupIntent's client secret
    clientSecret: '{{CLIENT_SECRET}}',
    // Fully customizable with appearance API.
    appearance: {/*...*/},
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <SetupForm />
    </Elements>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));