import React, { useState } from "react";
import axios from "axios";
import Navbar from "../Pages/NavBar";

const Advisory = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Validate file type
    if (selectedFile) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Only JPG and PNG files are allowed");
        event.target.value = null; // Reset input
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        alert("File size exceeds 5 MB");
        event.target.value = null;
        return;
      }

      setFile(selectedFile);
      setError(null); // Clear previous errors
    }
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload a file first");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      setError(null);
      setResult(null); // Clear previous result

      const res = await axios.post(
        "https://hackwithupbackend-main-production.up.railway.app/uploads/photos",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000, // 60 second timeout for AI processing
        }
      );

      console.log("Upload Response:", res.data);
      console.log("Full Analysis:", res.data.fullAnalysis);
      console.log("Plant Name:", res.data.plantName);
      console.log("Disease:", res.data.disease);
      console.log("Severity:", res.data.severity);
      console.log("Treatment:", res.data.treatment);

      setResult(res.data);
      setFile(null); // Reset file after successful upload

      // Reset form input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = null;
    } catch (error) {
      console.error("Upload error:", error);

      if (error.code === "ECONNABORTED") {
        setError("Upload timeout. Please try again.");
      } else if (error.response) {
        setError(
          `Server error: ${error.response.status}. ${
            error.response.data?.message || "Check backend"
          }`
        );
      } else if (error.request) {
        setError("No response from server. Check if backend is running.");
      } else {
        setError("Failed to upload. Please try again.");
      }

      alert(error.message || "Failed to upload. Check backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="ml-0 lg:ml-[300px] min-h-screen bg-gradient-to-b from-green-100 to-white font-[Poppins] text-green-800 px-6 py-10">
        <h1 className="text-center text-3xl font-bold text-green-900 mb-10">
          🌱 Detect crop diseases instantly by uploading a leaf image
        </h1>

        {/* 2 Column section */}
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {/* Instruction Box */}
          <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-6 max-w-xl shadow-md">
            <h3 className="text-lg font-semibold mb-3">
              🍃 Upload a clear image of your crop leaf and let AI detect
              diseases 🌾
            </h3>
            <h2 className="text-xl font-bold mb-2">Instructions</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>✅ Leaf must be clearly visible</li>
              <li>✅ Upload only one leaf per image</li>
              <li>✅ Supported: JPG, PNG</li>
              <li>✅ Avoid blur / dark images</li>
              <li>✅ Maximum file size: 5MB</li>
            </ul>
          </div>

          {/* Upload Card */}
          <form
            onSubmit={onHandleSubmit}
            className="bg-white border shadow-xl rounded-2xl p-6 w-full max-w-sm text-center"
          >
            <span className="text-2xl font-semibold">Upload your file</span>
            <p className="text-gray-500 text-sm mt-1">
              File should be an image
            </p>

            <label className="mt-6 border-2 border-dashed border-blue-300 rounded-lg p-6 cursor-pointer flex flex-col gap-2 items-center hover:bg-blue-50">
              <span className="font-semibold">
                Drop files here or click to browse
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                required
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={handleFileChange}
              />
            </label>

            {file && (
              <p className="text-sm text-green-600 mt-2">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}

            {error && (
              <p className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className={`px-7 py-3 rounded-lg mt-5 font-semibold transition ${
                loading || !file
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-br from-green-500 to-green-700 text-white hover:opacity-90"
              }`}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>

        {/* Result Section */}
        <div className="bg-green-50 border border-green-300 rounded-xl p-6 max-w-3xl mx-auto mt-10 shadow-lg">
          <h2 className="text-xl font-semibold mb-3 text-green-900">Result</h2>

          {loading ? (
            <div className="text-center">
              <p>⏳ Analyzing your leaf image...</p>
              <div className="mt-4 animate-pulse">
                <div className="h-4 bg-green-200 rounded w-3/4 mx-auto"></div>
              </div>
            </div>
          ) : result ? (
            <>
              <p className="text-green-700 font-semibold">
                ✅ Uploaded successfully!
              </p>
              {result._id && (
                <p className="text-sm text-gray-600">
                  <strong>Analysis ID:</strong> {result._id}
                </p>
              )}

              <div className="mt-4 bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-green-800">
                  🧾 AI Diagnosis Report
                </h3>

                {/* Quick Summary */}
                {(result.plantName || result.disease || result.severity) && (
                  <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {result.plantName && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-semibold">
                          Plant
                        </p>
                        <p className="text-sm font-bold text-blue-800">
                          {result.plantName}
                        </p>
                      </div>
                    )}
                    {result.disease && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-semibold">
                          Disease
                        </p>
                        <p className="text-sm font-bold text-yellow-800">
                          {result.disease}
                        </p>
                      </div>
                    )}
                    {result.severity && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 font-semibold">
                          Severity
                        </p>
                        <p className="text-sm font-bold text-red-800">
                          {result.severity}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Treatment Summary */}
                {result.treatment && (
                  <div className="mb-4 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <p className="text-xs text-gray-600 font-semibold mb-1">
                      💊 Quick Treatment
                    </p>
                    <p className="text-sm text-green-900">{result.treatment}</p>
                  </div>
                )}

                {/* Full Analysis */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold mb-2">
                    📋 Complete Analysis
                  </p>
                  <pre className="text-sm whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {result.fullAnalysis ||
                      "No detailed analysis provided by AI."}
                  </pre>
                </div>

                {/* Timestamp */}
                {result.analyzedAt && (
                  <p className="text-xs text-gray-500 mt-3">
                    Analyzed at: {new Date(result.analyzedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-600">
              No result yet. Upload an image to get started.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Advisory;
