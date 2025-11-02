import Farm from '../assets/bgFarm.jpg'

export default function Home() {
  return (
    <div className="font-sans bg-white text-gray-800">

      {/* HERO SECTION */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${Farm})` }}
      >
        {/* overlay with opacity */}
        <div className="absolute inset-0 bg-white opacity-40"></div>

        {/* actual content above overlay */}
        <div className="relative z-10">
          <h1 className="text-6xl font-black text-green-800 mb-6">
            Krishi Sakhi
          </h1>

          <p className="text-2xl font-bold max-w-3xl text-black mb-10">
            India's Most Intelligent Digital Farming Assistant — Weather, Crops, Market Prices, AI Advisory, Voice Support & Gov Scheme Info — Everything In One App.
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            <a
              href="/login"
              className="bg-green-700 text-white px-7 py-3 text-lg rounded-xl hover:bg-green-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Start Now
            </a>
            <a
              href="/register"
              className="bg-white text-green-700 px-7 py-3 text-lg rounded-xl hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 font-semibold"
            >
              Register Free
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-6 bg-green-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-green-800 mb-14">
            All Farming Solutions in One Place
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Profile Dashboard",
                desc: "Personalised farming experience to your location & crop type.",
                link: "/profile",
                icon: "👤"
              },
              {
                title: "Weather & Climate",
                desc: "Live rainfall / humidity / wind predictions with alerts.",
                link: "/weather",
                icon: "🌤️"
              },
              {
                title: "AI Crop Advisory",
                desc: "Smart crop suggestions, fertilizer, pesticides, sowing timings.",
                link: "/advisory",
                icon: "🌾"
              },
              
              {
                title: "Crop Calendar",
                desc: "Season-wise region-wise reference calendar for crop operations.",
                link: "/calendar",
                icon: "🗓️"
              },
              {
                title: "Market Prices",
                desc: "Live mandi bhav, future trends, wholesale pricing and charts.",
                link: "/prices",
                icon: "📊"
              },
              {
                title: "Chat Voice Assistant",
                desc: "Ask anything — crop diseases, fertilizers, govt schemes.",
                link: "/chat",
                icon: "🎤"
              },
              {
                title: "Govt Benefits",
                desc: "PM-Kisan, Crop Insurance, Subsidies — simplified in one place.",
                link: "/benefits",
                icon: "🏛️"
              },
            ].map((f) => (
              <a
                key={f.title}
                href={f.link}
                className="group p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-green-200 hover:border-green-600 hover:-translate-y-1"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-xl text-green-800 mb-2 group-hover:text-green-700">
                  {f.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL / TRUST SECTION */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-green-800 mb-8">
            Farmers Trust Krishi Sakhi
          </h2>
          <p className="text-center max-w-3xl mx-auto text-gray-600 mb-10 text-lg">
            Our AI modules are designed with agricultural experts & weather scientists.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-xl text-center border border-green-200">
              <p className="text-3xl font-bold text-green-700 mb-2">1000+</p>
              <p className="text-gray-600 font-semibold">Active Farmers</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl text-center border border-green-200">
              <p className="text-3xl font-bold text-green-700 mb-2">50+</p>
              <p className="text-gray-600 font-semibold">Crop Types</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl text-center border border-green-200">
              <p className="text-3xl font-bold text-green-700 mb-2">24/7</p>
              <p className="text-gray-600 font-semibold">AI Support</p>
            </div>
          </div>

          <p className="text-center text-xl font-bold text-green-700">
            1000+ Farmers Growing Smarter Everyday 🌾
          </p>
        </div>
      </section>

      {/* FEATURES HIGHLIGHTS */}
      <section className="py-20 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
            Why Choose Krishi Sakhi?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Real-Time Insights",
                desc: "Get live weather updates, market prices, and crop health monitoring in real-time."
              },
              {
                title: "AI-Powered Advisory",
                desc: "Personalized recommendations based on your crop, soil type, and location."
              },
              {
                title: "Voice & Chat Support",
                desc: "Ask questions in Hindi or English. Get instant answers from our AI assistant."
              },
              {
                title: "Government Schemes",
                desc: "Discover and apply for PM-Kisan, crop insurance, and other govt benefits easily."
              },
              {
                title: "Market Intelligence",
                desc: "Track mandi prices, predict trends, and maximize your profit margins."
              },
              {
                title: "Zero Subscription",
                desc: "Completely free to use. No hidden charges or subscription fees."
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-green-100 hover:border-green-400"
              >
                <h3 className="font-semibold text-lg text-green-800 mb-2">
                  ✓ {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GET STARTED CTA */}
      <section className="py-20 bg-gradient-to-r from-green-700 to-green-800 text-center text-white">
        <h2 className="text-4xl font-bold mb-6">Ready to Grow Smarter?</h2>
        <p className="text-lg mb-10">Join Krishi Sakhi Today — It's Free & Easy</p>
        <div className="flex gap-4 flex-wrap justify-center">
          <a
            href="/register"
            className="bg-white text-green-700 font-semibold px-8 py-4 rounded-xl hover:bg-green-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Create Your Account →
          </a>
          <a
            href="/login"
            className="bg-green-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-green-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 border-2 border-white"
          >
            Sign In
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-green-900 text-center text-white border-t-4 border-green-700">
        <p className="mb-2 font-semibold">© {new Date().getFullYear()} Krishi Sakhi</p>
        <p className="text-green-100 text-sm">
          Empowering Farmers with Digital Intelligence 🌾
        </p>
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <a href="#" className="hover:text-green-300 transition">Privacy Policy</a>
          <a href="#" className="hover:text-green-300 transition">Terms of Service</a>
          <a href="#" className="hover:text-green-300 transition">Contact Us</a>
        </div>
      </footer>

    </div>
  );
}
