import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
        <p className="text-slate-500 text-sm mb-12">Last updated: March 11, 2026</p>

        <div className="prose prose-slate max-w-none space-y-10 text-slate-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing <strong>trydenttcleaning.ca</strong> or booking services with Trydentt
              Cleaning Services ("Trydentt", "we", "us", or "our"), you agree to be bound by
              these Terms of Service. If you do not agree, please do not use our website or
              services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Services</h2>
            <p>
              Trydentt provides professional residential and commercial cleaning services across
              Ontario, Canada. All services are subject to availability and scheduling confirmation.
              We reserve the right to decline any service request at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Bookings & Quotes</h2>
            <p>
              Quotes provided through our website or by phone are estimates based on the
              information provided. Final pricing may vary based on actual conditions observed
              upon arrival. We will communicate any adjustments before commencing work whenever
              possible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Cancellations & Rescheduling</h2>
            <p>
              We ask for at least <strong>24 hours' notice</strong> for cancellations or
              rescheduling. Cancellations with less than 24 hours' notice may be subject to a
              cancellation fee. We reserve the right to reschedule appointments due to unforeseen
              circumstances, and will notify you as soon as possible in such cases.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Satisfaction Guarantee</h2>
            <p>
              We stand behind the quality of our work. If you are not satisfied with any aspect
              of your clean, contact us within <strong>24 hours</strong> of service completion
              and we will return to address the issue at no additional cost. This guarantee does
              not apply to pre-existing damage or conditions beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Access to Property</h2>
            <p>
              You are responsible for ensuring our team has safe and appropriate access to the
              property at the scheduled time. If we are unable to access the property, the
              appointment may be considered a late cancellation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Liability</h2>
            <p>
              Trydentt is fully insured. In the event of damage caused by our team, please
              notify us within <strong>48 hours</strong> of service. We will investigate and
              work with you toward a fair resolution. We are not liable for pre-existing damage,
              fragile or improperly secured items, or damage resulting from conditions not
              disclosed at the time of booking.
            </p>
            <p className="mt-3">
              Our total liability for any claim shall not exceed the cost of the service in
              question.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Payment</h2>
            <p>
              Payment is due upon completion of services unless otherwise agreed in writing.
              We accept major credit cards, e-transfer, and other payment methods as communicated
              at the time of booking. Overdue payments may be subject to late fees.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Website Use</h2>
            <p>
              You may use this website for lawful purposes only. You must not use our website in
              any way that causes, or may cause, damage to the website or impairment of its
              availability. Unauthorized use of this website may give rise to a claim for damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. Intellectual Property</h2>
            <p>
              All content on this website — including text, graphics, logos, and images — is the
              property of Trydentt Cleaning Services and is protected by Canadian copyright law.
              You may not reproduce or distribute any content without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">11. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the Province of Ontario and the federal
              laws of Canada applicable therein. Any disputes shall be subject to the exclusive
              jurisdiction of the courts of Ontario.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">12. Changes to These Terms</h2>
            <p>
              We reserve the right to update these Terms at any time. Changes will be posted on
              this page with an updated "Last updated" date. Continued use of our services
              following any changes constitutes your acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">13. Contact</h2>
            <p>Questions about these Terms? Reach us at:</p>
            <div className="mt-3 space-y-1">
              <p><strong>Trydentt Cleaning Services</strong></p>
              <p>Ontario, Canada</p>
              <p>
                Email:{' '}
                <a href="mailto:homes@trydenttbuildingservices.com" className="text-indigo-600 hover:underline">
                  homes@trydenttbuildingservices.com
                </a>
              </p>
              <p>
                Phone:{' '}
                <a href="tel:+15198713368" className="text-indigo-600 hover:underline">
                  +1 519-871-3368
                </a>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Terms;
