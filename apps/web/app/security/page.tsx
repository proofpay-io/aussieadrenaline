import Link from 'next/link';

export default function Security() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-indigo-600">ProofPay</Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</Link>
              <Link href="/for-banks" className="text-gray-600 hover:text-gray-900">For Banks</Link>
              <Link href="/security" className="text-gray-900 font-medium">Security</Link>
              <Link href="/receipts" className="text-indigo-600 hover:text-indigo-700 font-medium">My Receipts</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Security & Compliance
            </h1>
            <p className="text-2xl text-gray-700">
              Bank-grade security standards protecting your financial data
            </p>
          </div>
        </div>
      </section>

      {/* Security Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Enterprise Security Standards
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ProofPay implements comprehensive security measures designed to meet 
              and exceed the stringent requirements of financial institutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Data Encryption
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span><strong>256-bit AES encryption</strong> for data at rest</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span><strong>TLS 1.3</strong> encryption for data in transit</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span><strong>End-to-end encryption</strong> for sensitive financial data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span><strong>Key management</strong> using industry-standard HSM solutions</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Access Control
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span><strong>Multi-factor authentication</strong> (MFA) required</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span><strong>Role-based access control</strong> (RBAC) with least privilege</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span><strong>API key management</strong> with rotation policies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span><strong>Session management</strong> with automatic timeout</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Regulatory Compliance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ProofPay maintains compliance with major financial industry regulations 
              and security standards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="text-3xl font-bold text-indigo-600 mb-4">SOC 2</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Type II Certified
              </h3>
              <p className="text-gray-600">
                Annual independent audits verify our security, availability, 
                processing integrity, confidentiality, and privacy controls.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="text-3xl font-bold text-indigo-600 mb-4">PCI DSS</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Level 1 Compliant
              </h3>
              <p className="text-gray-600">
                Payment Card Industry Data Security Standard compliance ensures 
                secure handling of payment card information.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="text-3xl font-bold text-indigo-600 mb-4">GDPR</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Data Protection
              </h3>
              <p className="text-gray-600">
                General Data Protection Regulation compliance with data subject 
                rights, privacy by design, and breach notification procedures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure Security */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Infrastructure Security
            </h2>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Network Security
              </h3>
              <ul className="grid md:grid-cols-2 gap-4 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>DDoS protection and mitigation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Web Application Firewall (WAF)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Intrusion detection and prevention</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Network segmentation and isolation</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Application Security
              </h3>
              <ul className="grid md:grid-cols-2 gap-4 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Regular security code reviews</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Automated vulnerability scanning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Penetration testing by third parties</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Dependency vulnerability management</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Monitoring & Incident Response
              </h3>
              <ul className="grid md:grid-cols-2 gap-4 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>24/7 security monitoring and alerting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Security Information and Event Management (SIEM)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Incident response procedures and team</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Regular security audits and assessments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Data Protection */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Data Protection & Privacy
            </h2>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 max-w-4xl mx-auto">
            <div className="space-y-6 text-gray-600">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Data Retention
                </h3>
                <p>
                  Receipt data is retained according to regulatory requirements and 
                  your institution's policies. Configurable retention periods ensure 
                  compliance while maintaining data availability for dispute resolution.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Data Backup & Recovery
                </h3>
                <p>
                  Automated daily backups with point-in-time recovery capabilities. 
                  Data is replicated across multiple geographic regions for disaster 
                  recovery and business continuity.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Audit Trails
                </h3>
                <p>
                  Comprehensive audit logging of all system access, data modifications, 
                  and administrative actions. Immutable logs provide complete traceability 
                  for compliance and security investigations.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Privacy Controls
                </h3>
                <p>
                  Data minimization principles, purpose limitation, and user consent 
                  management. Customers have full control over their data with rights 
                  to access, correction, and deletion as required by regulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Contact */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Security Questions?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Our security team is available to discuss our security practices, 
            compliance certifications, and answer any questions.
          </p>
          <div className="bg-white rounded-lg p-8 shadow-xl">
            <p className="text-gray-600 mb-4">
              <strong>Security Team:</strong> security@proofpay.com
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Compliance:</strong> compliance@proofpay.com
            </p>
            <p className="text-gray-600">
              <strong>Security Documentation:</strong> Available upon request with NDA
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">ProofPay</h3>
              <p className="text-sm">
                Enterprise receipt management and dispute resolution platform.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
                <li><Link href="/for-banks" className="hover:text-white">For Banks</Link></li>
                <li><Link href="/security" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/receipts" className="hover:text-white">My Receipts</Link></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} ProofPay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

