/**
 * useRazorpay - Shared hook to launch Razorpay checkout for event payments.
 *
 * Usage:
 *   const pay = useRazorpay();
 *   pay({ amount: 500, name: 'Event Title', user, onSuccess });
 *
 * NOTE: This uses a TEST key (rzp_test_...). Replace with your live key in production.
 */
const RAZORPAY_KEY = 'rzp_test_1DP5mmOlF5G5ag'; // ← replace with your actual Razorpay key

const useRazorpay = () => {
  const openCheckout = ({ amount, eventTitle, description, user, onSuccess, onFailure }) => {
    if (typeof window.Razorpay === 'undefined') {
      alert('Razorpay SDK failed to load. Please check your internet connection and try again.');
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: amount * 100,          // Razorpay expects paise
      currency: 'INR',
      name: 'Transcend Alumni Portal',
      description: description || eventTitle,
      image: '/logo.png',
      handler: function (response) {
        // Called when payment is successful
        if (onSuccess) onSuccess(response);
      },
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },
      notes: {
        event: eventTitle,
      },
      theme: {
        color: '#1d4ed8',
      },
      modal: {
        ondismiss: function () {
          if (onFailure) onFailure('Payment cancelled by user.');
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response) {
      if (onFailure) onFailure(response.error.description);
    });

    rzp.open();
  };

  return openCheckout;
};

export default useRazorpay;
