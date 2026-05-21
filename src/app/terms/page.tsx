import { LegalLayout } from "@/components/shared/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout 
      title="Terms of Service" 
      subtitle="The rules of the nest. By using Urugostay, you agree to these terms."
    >
      <h2>1. Your Agreement</h2>
      <p>
        By using the Urugostay platform, you agree to comply with and be bound by these terms. If you disagree with any part of these terms, please do not use our services.
      </p>

      <h2>2. User Accounts</h2>
      <p>
        To access certain features of the Urugostay platform, you must create an account. You're responsible for maintaining the confidentiality of your account credentials.
      </p>

      <h3>2.1. Account Security</h3>
      <p>
        You must notify us immediately of any unauthorized use of your account.
      </p>

      <h2>3. Bookings and Payments</h2>
      <p>
        Hosts are solely responsible for the properties they list. Guests are responsible for making payments as agreed through the platform.
      </p>

      <h3>3.1. Service Fees</h3>
      <p>
        We charge a small service fee to cover payment processing and platform maintenance.
      </p>

      <h2>4. Prohibited Activities</h2>
      <p>
        You may not use the platform for any illegal activities, harmful content, or to harass other users.
      </p>

      <h2>5. Termination</h2>
      <p>
        We reserve the right to suspend or terminate accounts that violate our terms or for any other reason at our discretion.
      </p>
    </LegalLayout>
  );
}
