import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam'; // Must run: npm install react-webcam
import { Upload, Camera, Loader2, RefreshCw, AlertCircle, CheckCircle, X } from 'lucide-react';

const AnalysisHub = ({ userName }) => {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);

  // --- 1. HANDLE FILE UPLOAD ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  // --- 2. HANDLE LIVE CAMERA CAPTURE ---
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert Base64 (Webcam format) to a File object (Backend format)
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          setIsCameraOpen(false); // Close camera
          processFile(file);      // Send to backend
        });
    }
  }, [webcamRef]);

  // --- 3. SEND TO PYTHON BACKEND ---
  const processFile = async (file) => {
    // Show preview immediately
    setImage(URL.createObjectURL(file));
    setAnalyzing(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to connect to the AI server.");
      }

      const data = await response.json();
      console.log("Backend Response:", data); 
      setResult(data);
    
    } catch (err) {
      console.error(err);
      setError("Could not analyze image. Is the backend terminal running?");
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setIsCameraOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-[#556B2F]/10">
        
        {/* Header */}
        <div className="p-8 border-b border-[#556B2F]/10 bg-[#556B2F]/5">
          <h2 className="text-3xl font-bold text-[#2F3E1B]">
            Hello, {userName || 'User'}
          </h2>
          <p className="text-[#556B2F] mt-2">
            Ready to scan. Please verify results with a doctor.
          </p>
        </div>

        <div className="p-8">
          
          {/* STATE 0: LIVE CAMERA OPEN */}
          {isCameraOpen && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-black">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full max-w-lg"
                  videoConstraints={{ facingMode: "user" }}
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button 
                  onClick={() => setIsCameraOpen(false)}
                  className="px-6 py-2 rounded-full font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button 
                  onClick={capture}
                  className="px-8 py-2 rounded-full font-semibold text-white bg-[#556B2F] hover:bg-[#435624] transition-colors shadow-lg flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" /> Capture
                </button>
              </div>
            </div>
          )}

          {/* STATE 1: No Image & Camera Closed */}
          {!image && !isCameraOpen && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Upload Button */}
              <button 
                onClick={() => fileInputRef.current.click()}
                className="group h-64 border-2 border-dashed border-[#556B2F]/30 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-[#556B2F]/5 transition-all cursor-pointer"
              >
                <div className="p-4 bg-[#556B2F]/10 rounded-full group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-[#556B2F]" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-[#2F3E1B]">Upload Photo</h3>
                  <p className="text-gray-500 text-sm mt-1">Select from your device</p>
                </div>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />

              {/* Live Camera Button (Now Active!) */}
              <button 
                onClick={() => setIsCameraOpen(true)}
                className="group h-64 border-2 border-dashed border-[#556B2F]/30 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-[#556B2F]/5 transition-all cursor-pointer"
              >
                <div className="p-4 bg-[#556B2F]/10 rounded-full group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8 text-[#556B2F]" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-[#2F3E1B]">Live Camera</h3>
                  <p className="text-gray-500 text-sm mt-1">Scan via webcam</p>
                </div>
              </button>
            </div>
          )}

          {/* STATE 2: Analyzing */}
          {image && analyzing && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <img src={image} alt="Preview" className="w-48 h-48 object-cover rounded-2xl opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-[#556B2F] animate-spin" />
                </div>
              </div>
              <p className="mt-6 text-lg font-medium text-[#2F3E1B] animate-pulse">
                Analyzing skin patterns...
              </p>
            </div>
          )}

          {/* STATE 3: Results Display */}
          {result && !analyzing && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left: Image */}
                <div className="w-full md:w-1/3">
                  <img src={image} alt="Analyzed" className="w-full h-64 object-cover rounded-2xl shadow-md" />
                </div>

                {/* Right: Analysis */}
                <div className="w-full md:w-2/3 space-y-6">
                  {/* Diagnosis Card */}
                  <div className={`p-6 rounded-2xl border-l-8 shadow-sm ${
                    result.prediction.includes("Unknown") ? 'bg-gray-50 border-gray-400' : 
                    result.prediction.includes("Healthy") ? 'bg-green-50 border-green-500' : 'bg-amber-50 border-amber-500'
                  }`}>
                    <div className="flex items-start gap-4">
                      <AlertCircle className="w-6 h-6 text-[#556B2F] mt-1" />
                      <div>
                        <h4 className="text-sm font-bold tracking-wider uppercase opacity-70 mb-1">Detected Condition</h4>
                        <h3 className="text-3xl font-bold text-[#2F3E1B]">{result.prediction}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#556B2F]" 
                              style={{ width: result.confidence }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{result.confidence} Match</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deficiency Info */}
                  <div>
                    <h4 className="font-semibold text-[#2F3E1B] mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-[#556B2F]" />
                      Potential Deficiency Link
                    </h4>
                    <p className="text-gray-700 bg-white p-4 rounded-xl border border-gray-100">
                      {result.deficiency}
                    </p>
                  </div>

                  {/* Food Recommendations */}
                  <div>
                    <h4 className="font-semibold text-[#2F3E1B] mb-3">Recommended Foods</h4>
                    <div className="flex flex-wrap gap-3">
                      {result.foods && result.foods.map((food, idx) => (
                        <span key={idx} className="px-4 py-2 bg-[#556B2F]/10 text-[#2F3E1B] rounded-full text-sm font-medium">
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Advice */}
                   <div className="text-sm text-gray-500 italic border-t pt-4">
                      Note: {result.advice}
                   </div>

                  <button 
                    onClick={resetAnalysis}
                    className="w-full py-3 mt-4 bg-[#556B2F] text-white rounded-xl font-semibold hover:bg-[#435624] transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Scan Another Image
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
             <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 mt-4 flex items-center gap-3">
               <AlertCircle className="w-6 h-6" />
               <div>
                 <p className="font-bold">Connection Error</p>
                 <p className="text-sm">{error}</p>
                 <p className="text-xs mt-1">Make sure the backend terminal is running!</p>
               </div>
               <button onClick={resetAnalysis} className="ml-auto underline">Try Again</button>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AnalysisHub;