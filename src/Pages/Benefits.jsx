import React from "react";
import Navbar from "../Pages/NavBar";

const schemes = [
  {
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description:
      "An insurance service for farmers for their yields. It covers losses due to natural calamities, pests, and diseases.",
    button: "Learn More",
    link: "https://pmfby.gov.in/"
  },
  {
    title: "Kisan Credit Card (KCC) Scheme",
    description:
      "Provides farmers with timely access to credit for their cultivation and other needs.",
    button: "Learn More",
    link: "https://pmkisan.gov.in/Documents/Kisan_Credit_Card.pdf"
  },
  {
    title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    description:
      "Central sector scheme providing income support to all landholding farmer families.",
    button: "Learn More",
    link: "https://pmkisan.gov.in/"
  },
  {
    title: "Soil Health Card Scheme",
    description:
      "Provides farmers with soil health cards to promote balanced use of fertilizers.",
    button: "Learn More",
    link: "https://soilhealth.dac.gov.in/"
  },
  {
    title: "National Mission on Sustainable Agriculture (NMSA)",
    description:
      "Aims to make agriculture more sustainable & climate-resilient through soil/water conservation.",
    button: "Learn More",
    link: "https://nmsa.dac.gov.in/"
  },
  {
    title: "Pradhan Mantri Krishi Sinchai Yojana (PMKSY)",
    description:
      "Focused on water irrigation facilities & improving water efficiency — Per Drop More Crop.",
    button: "Learn More",
    link: "https://pmksy.gov.in/"
  }
];

export default function Benefits() {
  return (
    <div>
      <Navbar />

      {/* main content area with left margin for navbar */}
      <div className="ml-0 lg:ml-[300px] h-[100vh]">
        <section className="py-12 px-4 bg-green-100 text-center max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-green-900 mb-2">
            Government Benefits & Schemes
          </h1>

          <p className="text-lg text-green-700 mb-10 max-w-2xl mx-auto">
            Explore schemes and benefits available for farmers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {schemes.map((scheme, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 max-w-sm w-full text-left hover:shadow-2xl hover:-translate-y-2 transition-all"
              >
                <h3 className="text-lg font-bold text-green-900 mb-3">
                  {scheme.title}
                </h3>

                <p className="text-sm text-green-700 mb-6">
                  {scheme.description}
                </p>

                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-800 transition w-fit"
                >
                  {scheme.button}
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}