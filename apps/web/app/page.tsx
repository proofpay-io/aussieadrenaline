import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">ProofPay</h1>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 font-medium">Home</Link>
              <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</Link>
              <Link href="/for-banks" className="text-gray-600 hover:text-gray-900">For Banks</Link>
              <Link href="/security" className="text-gray-600 hover:text-gray-900">Security</Link>
              <Link href="/receipts" className="text-indigo-600 hover:text-indigo-700 font-medium">My Receipts</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              ProofPay
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-light">
              Turns Payments Into Proofs Of Purchase
            </p>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Enterprise-grade receipt management and dispute resolution platform 
              designed for financial institutions and their customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/receipts"
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                View My Receipts
              </Link>
              <Link
                href="/for-banks"
                className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg border-2 border-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Learn More for Banks
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Receipt Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with financial institutions in mind, ProofPay delivers secure, 
              compliant, and scalable receipt management solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <div className="text-indigo-600 text-4xl font-bold mb-4">01</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Automated Receipt Capture
              </h3>
              <p className="text-gray-600">
                Seamlessly capture and store purchase receipts automatically from 
                payment transactions. Every payment becomes a verifiable proof of purchase.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <div className="text-indigo-600 text-4xl font-bold mb-4">02</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Item-Level Dispute Resolution
              </h3>
              <p className="text-gray-600">
                Customers can dispute specific line items with precision. Our platform 
                provides granular dispute management with full transaction transparency.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <div className="text-indigo-600 text-4xl font-bold mb-4">03</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Bank-Grade Security
              </h3>
              <p className="text-gray-600">
                Enterprise security standards with end-to-end encryption, compliance 
                with financial regulations, and comprehensive audit trails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Trusted by Financial Institutions
            </h2>
            <div className="grid md:grid-cols-4 gap-8 text-gray-600">
              <div>
                <p className="text-4xl font-bold text-indigo-600 mb-2">256-bit</p>
                <p className="text-sm">Encryption Standard</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-indigo-600 mb-2">SOC 2</p>
                <p className="text-sm">Compliance Ready</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-indigo-600 mb-2">99.9%</p>
                <p className="text-sm">Uptime SLA</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-indigo-600 mb-2">24/7</p>
                <p className="text-sm">Monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Receipt Management?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join leading financial institutions using ProofPay to streamline 
            receipt management and enhance customer dispute resolution.
          </p>
          <Link
            href="/for-banks"
            className="inline-block px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition-colors"
          >
            Contact Us for Banks
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
