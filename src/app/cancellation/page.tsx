import { LegalLayout } from "@/components/shared/LegalLayout";

export default function CancellationPage() {
  return (
    <LegalLayout 
      title="Cancellation Options" 
      subtitle="Life happens. Here's how cancellations work at Urugostay."
    >
      <h2>Working with Your Host</h2>
      <p>
        Cancellation policies vary by host. Check the specific cancellation policy listed on the property page before booking.
      </p>

      <h2>Communication is Key</h2>
      <p>
        If you need to cancel, communicate with your host as early as possible. This will help them manage their property.
      </p>

      <h2>Cancellation Timeframes</h2>
      <p>
        Most properties have a 48-hour or 72-hour cancellation window. Check each property's terms for specific details.
      </p>

      <h2>Refunds</h2>
      <p>
        Refunds are generally processed through the original payment method. The timeframe for refunds varies by bank.
      </p>
    </LegalLayout>
  );
}
