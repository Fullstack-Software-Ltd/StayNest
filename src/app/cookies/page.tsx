import { LegalLayout } from "@/components/shared/LegalLayout";

export default function CookiesPage() {
  return (
    <LegalLayout 
      title="Cookie Policy" 
      subtitle="How we use cookies to improve your browsing experience at Urugostay."
    >
      <h2>What are Cookies?</h2>
      <p>
        Cookies are small text files that indicate how you use our website. They are stored on your device and sent back to our servers with each request.
      </p>

      <h2>1. Essential Cookies</h2>
      <p>
        These cookies are necessary for the platform to function. They allow us to remember your session and process bookings.
      </p>

      <h2>2. Performance Cookies</h2>
      <p>
        These cookies help us understand how you interact with our platform. They provide information about areas like time spent on pages and any error messages encountered.
      </p>

      <h2>3. Marketing Cookies</h2>
      <p>
        We use these cookies to tailor advertisements to your interests, both on and off our platform.
      </p>

      <h2>4. Managing Cookies</h2>
      <p>
        You can manage your cookie preferences through your browser settings. However, disabling certain cookies may limit your experience on Urugostay.
      </p>
    </LegalLayout>
  );
}
