import Link from 'next/link';

export default function ForBanks() {
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
              <Link href="/for-banks" className="text-gray-900 font-medium">For Banks</Link>
              <Link href="/security" className="text-gray-600 hover:text-gray-900">Security</Link>
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
              ProofPay for Financial Institutions
            </h1>
            <p className="text-2xl text-gray-700 mb-8">
              Enterprise-grade receipt management and dispute resolution 
              platform designed for banks, credit unions, and payment processors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
              >
                Schedule a Demo
              </a>
              <Link
                href="/security"
                className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                View Security Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transform Your Dispute Resolution Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ProofPay streamlines receipt management and dispute processing, 
              reducing operational costs while improving customer satisfaction.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <div className="text-4xl font-bold text-indigo-600 mb-4">60%</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Reduction in Processing Time
              </h3>
              <p className="text-gray-600">
                Automated receipt capture and item-level dispute precision 
                significantly reduce manual processing overhead.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <div className="text-4xl font-bold text-indigo-600 mb-4">99.9%</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Uptime SLA
              </h3>
              <p className="text-gray-600">
                Enterprise-grade infrastructure with redundant systems and 
                24/7 monitoring ensures maximum availability.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <div className="text-4xl font-bold text-indigo-600 mb-4">SOC 2</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Compliance Ready
              </h3>
              <p className="text-gray-600">
                Built with financial regulations in mind, including PCI DSS, 
                GDPR, and regional banking compliance requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features for Banks */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Enterprise Features
            </h2>
          </div>

          <div className="space-y-12">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                API Integration
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                Seamlessly integrate ProofPay with your existing banking systems through 
                our comprehensive RESTful API. Well-documented endpoints enable rapid 
                deployment and custom workflow integration.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>RESTful API with OpenAPI documentation</li>
                <li>Webhook support for real-time event notifications</li>
                <li>Rate limiting and authentication best practices</li>
                <li>Dedicated support for integration assistance</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Dispute Management
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                Receive structured dispute data with item-level granularity. Our platform 
                provides comprehensive dispute information including itemized details, 
                amounts, timestamps, and supporting documentation.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Item-level dispute precision</li>
                <li>Automated dispute amount calculation</li>
                <li>Structured data formats for automated processing</li>
                <li>Complete audit trails for compliance</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Security & Compliance
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                Bank-grade security with end-to-end encryption, comprehensive audit logs, 
                and compliance with financial industry regulations. Your data is protected 
                with the same standards used by leading financial institutions.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>256-bit AES encryption at rest and in transit</li>
                <li>SOC 2 Type II compliance</li>
                <li>PCI DSS Level 1 compliant infrastructure</li>
                <li>GDPR and regional banking regulation compliance</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Scalability & Reliability
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                Built on cloud-native architecture designed to scale with your institution's 
                growth. High availability, automatic failover, and global distribution ensure 
                consistent performance for your customers.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Horizontally scalable infrastructure</li>
                <li>Multi-region deployment options</li>
                <li>99.9% uptime SLA with service credits</li>
                <li>24/7 monitoring and incident response</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple Integration Process
            </h2>
            <p className="text-xl text-gray-600">
              Get started with ProofPay in weeks, not months
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Discovery</h3>
              <p className="text-gray-600">
                We work with your team to understand your requirements and integration needs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Integration</h3>
              <p className="text-gray-600">
                Our team provides API credentials, documentation, and integration support.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Testing</h3>
              <p className="text-gray-600">
                Comprehensive testing in sandbox environment with your team.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Launch</h3>
              <p className="text-gray-600">
                Production deployment with ongoing support and monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Contact our enterprise sales team to schedule a demo and discuss 
            how ProofPay can transform your receipt management and dispute resolution.
          </p>
          <div className="bg-white rounded-lg p-8 shadow-xl">
            <p className="text-gray-600 mb-4">
              <strong>Email:</strong> banks@proofpay.com
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Phone:</strong> 1-800-PROOFPAY
            </p>
            <p className="text-gray-600">
              <strong>Office Hours:</strong> Monday - Friday, 9 AM - 5 PM EST
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

