export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: March 23, 2026</p>

      <div className="mt-10 space-y-8 text-muted leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground">
            1. Information We Collect
          </h2>
          <p className="mt-3">
            ChessLens does not collect, store, or process any personal
            information. All chess data is fetched directly from the public
            Lichess API at the time of your request and is not retained on our
            servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            2. Lichess API Data
          </h2>
          <p className="mt-3">
            When you enter a Lichess username, we make requests to the Lichess
            API on your behalf to retrieve publicly available game data,
            ratings, and profile information. This data is processed in real-time
            and is not stored after your session ends.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            3. Cookies & Tracking
          </h2>
          <p className="mt-3">
            We do not use tracking cookies, analytics scripts, or any
            third-party tracking services. We may use essential cookies for
            basic site functionality (such as theme preferences) if applicable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            4. Third-Party Services
          </h2>
          <p className="mt-3">
            ChessLens relies on the Lichess API for chess data. Your use of
            this service is also subject to{" "}
            <a
              href="https://lichess.org/privacy"
              target="_blank"
              className="text-accent hover:underline"
            >
              Lichess&apos;s Privacy Policy
            </a>
            . We are not affiliated with Lichess.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            5. Data Security
          </h2>
          <p className="mt-3">
            Since we do not store user data, there is minimal risk of data
            breaches. All communications with the Lichess API are conducted
            over HTTPS.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            6. Children&apos;s Privacy
          </h2>
          <p className="mt-3">
            ChessLens does not knowingly collect information from children
            under 13. Since we do not collect any personal information, this
            policy applies equally to users of all ages.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            7. Changes to This Policy
          </h2>
          <p className="mt-3">
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            8. Contact Us
          </h2>
          <p className="mt-3">
            If you have questions about this Privacy Policy, please contact us
            at{" "}
            <a
              href="mailto:privacy@chesslens.dev"
              className="text-accent hover:underline"
            >
              privacy@chesslens.dev
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
