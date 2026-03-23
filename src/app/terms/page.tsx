export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted">Last updated: March 23, 2026</p>

      <div className="mt-10 space-y-8 text-muted leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground">
            1. Acceptance of Terms
          </h2>
          <p className="mt-3">
            By accessing and using ChessLens, you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not
            use the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            2. Description of Service
          </h2>
          <p className="mt-3">
            ChessLens is a chess analytics platform that retrieves and analyzes
            publicly available game data from the Lichess API. We provide
            statistical analysis, rating tracking, opening analysis, and
            improvement suggestions based on this data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            3. Use of the Service
          </h2>
          <p className="mt-3">You agree to use ChessLens only for lawful purposes and in accordance with these Terms. You agree not to:</p>
          <ul className="mt-2 ml-4 list-disc space-y-1">
            <li>Abuse the Lichess API through excessive requests via our service</li>
            <li>Attempt to scrape, reverse-engineer, or interfere with the platform</li>
            <li>Use the service for harassment or to stalk other players</li>
            <li>Misrepresent the data or analysis provided by ChessLens</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            4. Intellectual Property
          </h2>
          <p className="mt-3">
            The ChessLens interface, design, and analysis algorithms are the
            property of ChessLens. Chess game data is provided by Lichess under
            their terms of service and is publicly available.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            5. Disclaimer of Warranties
          </h2>
          <p className="mt-3">
            ChessLens is provided &ldquo;as is&rdquo; without warranties of any kind.
            We do not guarantee the accuracy of the analysis, improvement
            suggestions, or any data presented. Chess improvement depends on
            many factors beyond data analysis.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            6. Limitation of Liability
          </h2>
          <p className="mt-3">
            ChessLens shall not be liable for any indirect, incidental, or
            consequential damages arising from your use of the service. Our
            total liability shall not exceed the amount you have paid for the
            service in the past 12 months.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            7. Third-Party Services
          </h2>
          <p className="mt-3">
            ChessLens relies on the Lichess API and is not affiliated with
            Lichess. We are not responsible for any changes, downtime, or data
            availability issues from Lichess.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            8. Changes to Terms
          </h2>
          <p className="mt-3">
            We reserve the right to modify these terms at any time. Continued
            use of ChessLens after changes constitutes acceptance of the new
            terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            9. Contact
          </h2>
          <p className="mt-3">
            For questions about these Terms, contact us at{" "}
            <a
              href="mailto:legal@chesslens.dev"
              className="text-accent hover:underline"
            >
              legal@chesslens.dev
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
