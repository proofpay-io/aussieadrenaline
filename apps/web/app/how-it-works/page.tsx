import Link from 'next/link';

export default function HowItWorks() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-indigo-600">ProofPay</Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/how-it-works" className="text-gray-900 font-medium">How It Works</Link>
              <Link href="/for-banks" className="text-gray-600 hover:text-gray-900">For Banks</Link>
              <Link href="/security" className="text-gray-600 hover:text-gray-900">Security</Link>
              <Link href="/receipts" className="text-indigo-600 hover:text-indigo-700 font-medium">My Receipts</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How ProofPay Works
          </h1>
          <p className="text-xl text-gray-600">
            A comprehensive overview of our receipt management and dispute resolution platform
          </p>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  1
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Payment Processing Integration
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  ProofPay integrates seamlessly with payment processors and financial institutions. 
                  When a customer makes a purchase, the transaction data is automatically captured 
                  and processed through our secure API infrastructure.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Real-time webhook integration with payment providers</li>
                  <li>Automatic receipt generation from transaction data</li>
                  <li>Secure data transmission using industry-standard encryption</li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  2
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Receipt Storage & Management
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  All receipts are securely stored in our enterprise-grade database with 
                  comprehensive metadata including item-level details, timestamps, and 
                  transaction identifiers. Customers can access their complete purchase 
                  history through our intuitive interface.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Immutable receipt records with full audit trails</li>
                  <li>Item-level granularity for precise dispute resolution</li>
                  <li>Long-term archival with compliance-ready retention policies</li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  3
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Dispute Resolution Workflow
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  When customers need to dispute a transaction, ProofPay provides 
                  item-level precision. Customers can select specific line items 
                  from their receipt, review a comprehensive summary, and initiate 
                  the dispute process with full transparency.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Granular item selection for targeted disputes</li>
                  <li>Real-time calculation of disputed amounts</li>
                  <li>Integration-ready workflow for financial institution processing</li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  4
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Financial Institution Integration
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  Dispute data is securely transmitted to your financial institution's 
                  systems through our API. Banks receive comprehensive dispute information 
                  including itemized details, amounts, and supporting documentation, 
                  enabling efficient processing and resolution.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>RESTful API for seamless integration</li>
                  <li>Structured data formats for automated processing</li>
                  <li>Comprehensive documentation and support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Key Benefits
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                For Customers
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Complete purchase history in one place</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Item-level dispute precision</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Transparent dispute process</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Secure, encrypted data storage</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                For Financial Institutions
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Reduced dispute processing time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Automated receipt management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Compliance-ready audit trails</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Scalable infrastructure</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Learn more about ProofPay for financial institutions
          </p>
          <Link
            href="/for-banks"
            className="inline-block px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          >
            View Bank Solutions
          </Link>
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

