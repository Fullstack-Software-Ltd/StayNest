import { LegalLayout } from "@/components/shared/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout 
      title="Privacy Policy" 
      subtitle="Your privacy is important to us. We're transparent about how we collect, use, and share your data."
    >
      <h2>1. Information We Collect</h2>
      <p>
        When you use Urugostay, we collect information that you provide directly to us, such as your name, email address, phone number, and payment information.
      </p>
      
      <h3>1.1. Personal Data</h3>
      <p>
        Identification info (name, date of birth, nationality).
        Contact info (email, phone number, address).
      </p>

      <h2>2. How We Use Yours Data</h2>
      <p>
        We use your information to facilitate bookings, process payments, and provide customer support. We also use data to improve our services and ensure safety across the platform.
      </p>

      <h3>2.1. Service Improvement</h3>
      <p>
        Analyzing patterns to improve search results and recommend properties that fit your style.
      </p>

      <h2>3. Sharing of Information</h2>
      <p>
        We only share your information with hosts (to facilitate bookings) and third-party service providers (like payment processors) as necessary to provide our services.
      </p>

      <h2>4. Your Rights</h2>
      <p>
        You have the right to access, correct, or delete your personal information at any time through your account settings.
      </p>

      <h2>5. Updates to this Policy</h2>
      <p>
        We may update this policy from time to time. We will notify you of any significant changes by posting the new policy on this page.
      </p>
    </LegalLayout>
  );
}
