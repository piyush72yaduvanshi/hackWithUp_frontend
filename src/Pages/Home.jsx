import Farm from '../assets/bgFarm.jpg'

export default function Home() {
  return (
    <div className="font-sans bg-white text-gray-800">

      {/* HERO */}
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
      India’s Most Intelligent Digital Farming Assistant — Weather, Crops, Market Prices, AI Advisory, Voice Support & Gov Scheme Info — Everything In One App.
    </p>

    <div className="flex gap-4 flex-wrap justify-center">
      <a
        href="/login"
        className="bg-green-700 text-white px-7 py-3 text-lg rounded-xl hover:bg-green-800 transition shadow-lg"
      >
        Start Now
      </a>
    </div>
  </div>
</section>



      {/* FEATURES */}
      <section className="py-24 px-6 bg-green-50">
        <h2 className="text-4xl font-extrabold text-center text-green-800 mb-14">
          All Farming Solutions in One Place
        </h2>

        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">

          {[
            { title: "Profile Dashboard", desc: "Personalised farming experience to your location & crop type.", link: "/profile" },
            { title: "Weather & Climate", desc: "Live rainfall / humidity / wind predictions with alerts.", link: "/weather" },
            { title: "AI Crop Advisory", desc: "Smart crop suggestions, fertilizer, pesticides, sowing timings.", link: "/advisory" },
            { title: "AI Activity Planner", desc: "Daily & weekly activities recommended based on agri data.", link: "/activity" },
            { title: "Crop Calendar", desc: "Season-wise region-wise reference calendar for crop operations.", link: "/calendar" },
            { title: "Market Prices", desc: "Live mandi bhav, future trends, wholesale pricing and charts.", link: "/prices" },
            { title: "Chat Voice Assistant", desc: "Ask anything — crop diseases, fertilizers, govt schemes.", link: "/chat" },
            { title: "Govt Benefits", desc: "PM-Kisan, Crop Insurance, Subsidies — simplified in one place.", link: "/benefits" },
          ].map((f) => (
            <a key={f.title} href={f.link}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition border border-green-200 hover:border-green-600">
              <h3 className="font-semibold text-xl text-green-800 mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </a>
          ))}

        </div>
      </section>

      {/* TESTIMONIAL / TRUST */}
      <section className="py-24 px-6 bg-white">
        <h2 className="text-4xl font-extrabold text-center text-green-800 mb-8">
          Farmers Trust Krishi Sakhi
        </h2>
        <p className="text-center max-w-3xl mx-auto text-gray-600 mb-10">
          Our AI modules are designed with agricultural experts & weather scientists.
        </p>
        <p className="text-center text-2xl font-bold text-green-700">
          1000+ Farmers Growing Smarter Everyday 🌾
        </p>
      </section>


      {/* GET STARTED CTA */}
      <section className="py-20 bg-green-700 text-center text-white">
        <h2 className="text-4xl font-bold mb-6">Ready to Grow Smarter?</h2>
        <p className="text-lg mb-10">Join Krishi Sakhi Today — It's Free</p>
        <a href="/register" className="bg-white text-green-700 font-semibold px-8 py-4 rounded-xl hover:bg-green-100 transition shadow-xl">
          Create Your Account →
        </a>
      </section>


      {/* FOOTER */}
      <footer className="py-6 bg-green-800 text-center text-white">
        © {new Date().getFullYear()} Krishi Sakhi — Empowering Farmers with Digital Intelligence
      </footer>

    </div>
  );
}
