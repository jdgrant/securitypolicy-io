import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  console.log('Home component rendering')
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10px] opacity-50">
            <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(115,115,115,0.18),rgba(0,0,0,0))]"></div>
          </div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-8">
              Assess Your Security Posture
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Get a free assessment of your organization's security practices. Identify risks, 
              receive recommendations, and learn how to better protect your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/assessment')}
                className="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                Get Started
              </button>
              <button className="w-full sm:w-auto bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-medium border border-gray-200 hover:border-gray-300 transition-all duration-200 transform hover:scale-105 hover:shadow-md">
                Schedule Demo
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-20 animate-fade-in">
            <p className="text-sm text-gray-500 mb-6">Trusted by forward-thinking companies</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              <div className="h-8 flex items-center justify-center">
                <div className="h-full w-32 bg-gray-300 rounded-md"></div>
              </div>
              <div className="h-8 flex items-center justify-center">
                <div className="h-full w-32 bg-gray-300 rounded-md"></div>
              </div>
              <div className="h-8 flex items-center justify-center">
                <div className="h-full w-32 bg-gray-300 rounded-md"></div>
              </div>
              <div className="h-8 flex items-center justify-center">
                <div className="h-full w-32 bg-gray-300 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Security compliance made simple
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your security program up and running in minutes, not months.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Non-Technical Interview
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Answer 10–15 easy questions to assess your risk. No technical expertise required.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Instant Action Plan
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  AI generates your personalized mitigation plan with clear, actionable steps.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Professional Reports
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Upgrade to unlock comprehensive security reports and continuous compliance tracking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How it Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your security documentation in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-4">
                  Complete Assessment
                </h3>
                <p className="text-gray-600">
                  Answer simple questions about your business and technology stack.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-4">
                  Review AI Analysis
                </h3>
                <p className="text-gray-600">
                  Get instant insights and recommendations for your security program.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-4">
                  Generate Documentation
                </h3>
                <p className="text-gray-600">
                  Export professional security documentation ready for auditors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by Security Teams
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">Lisa Martinez</h4>
                  <p className="text-gray-600">CEO at CloudSecure</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Perfect for startups. We got our security documentation in order without hiring a dedicated team."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to secure your business?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join hundreds of companies using SecurityPolicy.io to strengthen their security posture.
          </p>
          <button className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-all duration-200 transform hover:scale-105">
            Start Free Trial
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home 