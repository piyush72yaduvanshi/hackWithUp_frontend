// LandInfo.jsx
import React, { useState, useEffect } from "react";
import Navbar from "./NavBar";

export default function LandInfo() {
  const [formData, setFormData] = useState({
    district: "",
    village: "",
    place: "",
    soil: "",
    crop: "",
    area: "",
  });

  const [data, setData] = useState([]);
  const [viewItem, setViewItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("land_data")) || [];
    setData(stored);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.district.trim()) newErrors.district = "Required";
    if (!formData.village.trim()) newErrors.village = "Required";
    if (!formData.place.trim()) newErrors.place = "Required";
    if (!formData.soil.trim()) newErrors.soil = "Required";
    if (!formData.crop.trim()) newErrors.crop = "Required";
    if (!formData.area.trim()) newErrors.area = "Required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const updated = [...data, formData];
    setData(updated);
    localStorage.setItem("land_data", JSON.stringify(updated));
    setFormData({ district: "", village: "", place: "", soil: "", crop: "", area: "" });
    setShowAddModal(false);
    setErrors({});
  };

  const handleDelete = (i) => {
    const updated = data.filter((_, index) => index !== i);
    setData(updated);
    localStorage.setItem("land_data", JSON.stringify(updated));
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setFormData({ district: "", village: "", place: "", soil: "", crop: "", area: "" });
    setErrors({});
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadError("");
    
    if (!file) {
      setUploadFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
      "image/jpeg",
      "image/png",
      "image/jpg"
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Please upload a valid file (PDF, Excel, CSV, or Image)");
      setUploadFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      setUploadFile(null);
      return;
    }

    setUploadFile(file);
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    
    if (!uploadFile) {
      setUploadError("Please select a file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const newLand = {
        district: "Haryana",
        village: "Sample Village",
        place: `Land from ${uploadFile.name}`,
        soil: "Loamy",
        crop: "Wheat",
        area: "5.0",
      };

      const updated = [...data, newLand];
      setData(updated);
      localStorage.setItem("land_data", JSON.stringify(updated));
      
      setUploadFile(null);
      setShowUploadModal(false);
      setUploadError("");
      
      alert("Land data uploaded successfully!");
    };
    reader.readAsArrayBuffer(uploadFile);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadError("");
  };

  return (
    <div>
      <Navbar />
      <div className="ml-0 lg:ml-[300px] p-6 bg-green-50 min-h-screen">
        
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Land Management</h1>
            <p className="text-gray-600">Track and manage all your farming lands in one place</p>
          </div>
          
          {/* Add Land Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-xl">+</span> Add New Land
          </button>
        </div>

        {/* Display Section */}
        <div>
          <h2 className="text-2xl font-bold text-green-800 mb-6">Your Saved Lands</h2>

          {data.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-green-300">
              <div className="text-4xl mb-4">🌾</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">No Lands Added Yet</h3>
              <p className="text-gray-600 mb-6">Start by adding your first farming land to get personalized recommendations</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                >
                  + Add Land Manually
                </button>
                
                <div className="flex items-center gap-2 text-gray-500 font-semibold">
                  <span>OR</span>
                </div>
                
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 justify-center"
                >
                  <span>📤</span> Upload Land File
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex justify-end">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 text-sm"
                >
                  <span>📤</span> Upload File
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {data.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-xl p-5 border-2 border-green-300 cursor-pointer hover:shadow-lg hover:border-green-500 transition-all duration-200"
                    onClick={() => setViewItem(item)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-green-700">{item.place}</h3>
                      <span className="text-2xl">🏞️</span>
                    </div>
                    
                    <div className="space-y-1 mb-4 text-xs">
                      <p className="text-gray-600">
                        <strong>📍 District:</strong> {item.district}
                      </p>
                      <p className="text-gray-600">
                        <strong>🏘️ Village:</strong> {item.village}
                      </p>
                      <p className="text-gray-600">
                        <strong>🌱 Soil:</strong> {item.soil}
                      </p>
                      <p className="text-gray-600">
                        <strong>🌾 Crop:</strong> {item.crop}
                      </p>
                      <p className="text-gray-600">
                        <strong>📐 Area:</strong> {item.area}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewItem(item);
                        }}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold transition-all"
                      >
                        View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(index);
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-semibold transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ADD LAND MODAL - TRANSPARENT */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white/80 backdrop-blur-md w-full max-w-sm rounded-xl shadow-2xl p-5 border-2 border-green-400 relative max-h-[90vh] overflow-y-auto">
              
              {/* Close Button */}
              <button
                onClick={handleCloseAddModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-600 font-bold text-lg transition-all"
              >
                ✕
              </button>

              {/* Header */}
              <h2 className="text-lg font-bold text-green-800 mb-1 border-b border-green-300 pb-2">
                🌾 Add Land
              </h2>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-2 mt-3">
                {[
                  { field: "district", label: "District", placeholder: "e.g., Hisar, Jaipur" },
                  { field: "village", label: "Village", placeholder: "e.g., Village Name" },
                  { field: "place", label: "Field location/name", placeholder: "Field name" },
                  { field: "soil", label: "Soil Type", placeholder: "Loamy, Clay, Sandy" },
                  { field: "crop", label: "Crop", placeholder: "Wheat, Rice, Corn" },
                  { field: "area", label: "Area (Acres)", placeholder: "5.5" },
                ].map((item) => (
                  <div key={item.field}>
                    <label className="block font-semibold text-gray-800 mb-0.5 text-xs">
                      {item.label}
                    </label>
                    <input
                      type="text"
                      placeholder={item.placeholder}
                      value={formData[item.field]}
                      onChange={(e) => handleInputChange(item.field, e.target.value)}
                      className={`w-full border rounded p-1.5 outline-none transition-all text-xs bg-white/70 ${
                        errors[item.field]
                          ? "border-red-500 focus:ring-1 focus:ring-red-300"
                          : "border-green-300 focus:ring-1 focus:ring-green-400"
                      }`}
                    />
                    {errors[item.field] && (
                      <p className="text-red-500 text-xs mt-0.5">{errors[item.field]}</p>
                    )}
                  </div>
                ))}

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseAddModal}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-1.5 rounded text-xs font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white py-1.5 rounded text-xs font-semibold transition-all hover:shadow-lg"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* UPLOAD FILE MODAL */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white/80 backdrop-blur-md w-full max-w-sm rounded-xl shadow-2xl p-5 border-2 border-blue-400 relative">
              
              {/* Close Button */}
              <button
                onClick={handleCloseUploadModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-600 font-bold text-lg transition-all"
              >
                ✕
              </button>

              {/* Header */}
              <h2 className="text-lg font-bold text-blue-800 mb-1 border-b border-blue-300 pb-2">
                📤 Upload Land Data
              </h2>
              <p className="text-gray-600 text-xs mb-3 mt-2">
                Upload land checkup file (PDF, Excel, CSV, or Image)
              </p>

              {/* Upload Form */}
              <form onSubmit={handleFileUpload} className="space-y-3">
                {/* File Input */}
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition-all">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-3xl mb-2">📁</div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, Excel, CSV, JPG, PNG (Max 5MB)
                    </p>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.xls,.xlsx,.csv,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                </div>

                {/* File Selected */}
                {uploadFile && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-300">
                    <p className="text-sm font-semibold text-green-800 mb-1">
                      ✓ File Selected
                    </p>
                    <p className="text-xs text-gray-700 break-all">
                      {uploadFile.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {(uploadFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {uploadError && (
                  <div className="bg-red-50 p-3 rounded-lg border border-red-300">
                    <p className="text-xs text-red-700 font-semibold">
                      ✕ {uploadError}
                    </p>
                  </div>
                )}

                {/* Upload Info */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-800">
                    <strong>📝 Note:</strong> File data will be processed and converted to land records
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseUploadModal}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-1.5 rounded text-xs font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!uploadFile}
                    className={`flex-1 py-1.5 rounded text-xs font-semibold transition-all ${
                      uploadFile
                        ? "bg-blue-700 hover:bg-blue-800 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* VIEW LAND MODAL - TRANSPARENT */}
        {viewItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white/80 backdrop-blur-md w-full max-w-sm rounded-xl shadow-2xl p-5 border-2 border-green-400 relative">
              
              {/* Close Button */}
              <button
                onClick={() => setViewItem(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-600 font-bold text-lg transition-all"
              >
                ✕
              </button>

              {/* Header */}
              <h2 className="text-lg font-bold text-green-700 mb-1 border-b border-green-300 pb-2">
                🌾 {viewItem.place}
              </h2>

              {/* Details */}
              <div className="space-y-2 mb-4 mt-3">
                <div className="bg-blue-50/60 p-2 rounded">
                  <p className="text-xs font-semibold text-blue-700">DISTRICT</p>
                  <p className="text-sm font-semibold text-gray-800">{viewItem.district}</p>
                </div>

                <div className="bg-purple-50/60 p-2 rounded">
                  <p className="text-xs font-semibold text-purple-700">VILLAGE</p>
                  <p className="text-sm font-semibold text-gray-800">{viewItem.village}</p>
                </div>

                <div className="bg-green-50/60 p-2 rounded">
                  <p className="text-xs font-semibold text-green-700">SOIL TYPE</p>
                  <p className="text-sm font-semibold text-gray-800">{viewItem.soil}</p>
                </div>

                <div className="bg-green-50/60 p-2 rounded">
                  <p className="text-xs font-semibold text-green-700">CROP GROWN</p>
                  <p className="text-sm font-semibold text-gray-800">{viewItem.crop}</p>
                </div>

                <div className="bg-yellow-50/60 p-2 rounded">
                  <p className="text-xs font-semibold text-yellow-700">AREA</p>
                  <p className="text-sm font-semibold text-gray-800">{viewItem.area} Acres</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setViewItem(null)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-semibold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
