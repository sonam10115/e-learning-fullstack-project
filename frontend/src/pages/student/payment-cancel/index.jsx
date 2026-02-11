import { Card, CardHeader, CardTitle } from "@/components/ui/card";

function PaypalPaymentCancelPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Cancelled</CardTitle>
      </CardHeader>
      <p>Your payment was cancelled. Please try again.</p>
    </Card>
  );
}

export default PaypalPaymentCancelPage;
