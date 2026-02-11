import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam'; 
import { Upload, Camera, Loader2, RefreshCw, AlertCircle, CheckCircle, X, ChevronRight } from 'lucide-react';

const AnalysisHub = ({ userName }) => {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);

  // --- HANDLERS (Keep existing logic) ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          setIsCameraOpen(false);
          processFile(file);
        });
    }
  }, [webcamRef]);

  const processFile = async (file) => {
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

      if (!response.ok) throw new Error("Failed to connect to the AI server.");
      
      const data = await response.json();
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
    <div className="min-h-screen bg-[#1a1a1a] text-gray-100 p-6 font-sans flex items-center justify-center">
      <div className="w-full max-w-5xl">
        
        {/* Main Glass Card */}
        <div className="bg-[#242424]/80 backdrop-blur-md rounded-3xl shadow-2xl border border-[#556B2F]/30 overflow-hidden">
          
          {/* Header Section */}
          <div className="p-8 border-b border-[#556B2F]/20 bg-gradient-to-r from-[#556B2F]/20 to-transparent">
            <h2 className="text-4xl font-light tracking-wide text-[#E8F5E9]">
              Hello, <span className="font-bold text-[#8FBC8F]">{userName || 'User'}</span>
            </h2>
            <p className="text-gray-400 mt-2 text-sm tracking-widest uppercase">
              AI-Based Skin Health Analysis
            </p>
          </div>

          <div className="p-8 md:p-12">
            
            {/* STATE 0: CAMERA ACTIVE */}
            {isCameraOpen && (
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#556B2F] bg-black">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full max-w-2xl"
                    videoConstraints={{ facingMode: "user" }}
                  />
                  {/* Overlay Scanner Line */}
                  <div className="absolute inset-0 border-t-2 border-[#556B2F]/50 animate-[scan_2s_infinite]"></div>
                </div>
                <div className="flex gap-6 mt-8">
                  <button 
                    onClick={() => setIsCameraOpen(false)}
                    className="px-8 py-3 rounded-full font-medium text-gray-300 bg-[#333] hover:bg-[#444] transition-all flex items-center gap-2 border border-gray-600"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button 
                    onClick={capture}
                    className="px-10 py-3 rounded-full font-bold text-[#1a1a1a] bg-[#8FBC8F] hover:bg-[#7aa67a] transition-all shadow-[0_0_15px_rgba(143,188,143,0.4)] flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" /> Capture
                  </button>
                </div>
              </div>
            )}

            {/* STATE 1: IDLE (Upload / Camera Options) */}
            {!image && !isCameraOpen && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Upload Button */}
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="group h-80 relative border border-[#556B2F]/30 bg-[#2a2a2a] rounded-2xl flex flex-col items-center justify-center gap-6 hover:bg-[#556B2F]/10 hover:border-[#556B2F] transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#556B2F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="p-6 bg-[#333] rounded-full group-hover:scale-110 transition-transform shadow-lg border border-[#444]">
                    <Upload className="w-10 h-10 text-[#8FBC8F]" />
                  </div>
                  <div className="text-center z-10">
                    <h3 className="text-2xl font-light text-gray-100">Upload Image</h3>
                    <p className="text-gray-500 text-sm mt-2">JPG or PNG from device</p>
                  </div>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  accept="image/*"
                />

                {/* Live Camera Button */}
                <button 
                  onClick={() => setIsCameraOpen(true)}
                  className="group h-80 relative border border-[#556B2F]/30 bg-[#2a2a2a] rounded-2xl flex flex-col items-center justify-center gap-6 hover:bg-[#556B2F]/10 hover:border-[#556B2F] transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#556B2F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="p-6 bg-[#333] rounded-full group-hover:scale-110 transition-transform shadow-lg border border-[#444]">
                    <Camera className="w-10 h-10 text-[#8FBC8F]" />
                  </div>
                  <div className="text-center z-10">
                    <h3 className="text-2xl font-light text-gray-100">Live Camera</h3>
                    <p className="text-gray-500 text-sm mt-2">Real-time analysis</p>
                  </div>
                </button>
              </div>
            )}

            {/* STATE 2: LOADING */}
            {image && analyzing && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 border-4 border-[#333] rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-[#556B2F] rounded-full border-t-transparent animate-spin"></div>
                  <img src={image} alt="Preview" className="absolute inset-4 w-56 h-56 object-cover rounded-full opacity-50 grayscale" />
                </div>
                <p className="mt-8 text-xl font-light tracking-widest text-[#8FBC8F] animate-pulse">
                  ANALYZING BIOSIGNALS...
                </p>
              </div>
            )}

            {/* STATE 3: RESULTS */}
            {result && !analyzing && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex flex-col lg:flex-row gap-10">
                  
                  {/* Left: Image Card */}
                  <div className="w-full lg:w-5/12">
                    <div className="relative rounded-2xl overflow-hidden border border-[#556B2F]/40 shadow-2xl">
                      <img src={image} alt="Analyzed" className="w-full h-auto object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4 border-t border-[#556B2F]/30">
                         <div className="flex justify-between items-center">
                            <span className="text-gray-300 text-sm">Confidence Score</span>
                            <span className="text-[#8FBC8F] font-bold">{result.confidence}</span>
                         </div>
                         <div className="w-full bg-gray-700 h-1.5 mt-2 rounded-full overflow-hidden">
                            <div className="h-full bg-[#556B2F]" style={{ width: result.confidence }}></div>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Analysis Details */}
                  <div className="w-full lg:w-7/12 space-y-8">
                    
                    {/* Diagnosis Header */}
                    <div>
                       <h4 className="text-[#556B2F] uppercase tracking-widest text-xs font-bold mb-2">Detected Condition</h4>
                       <h3 className="text-5xl font-thin text-white mb-4">{result.prediction}</h3>
                       <p className="text-gray-400 text-justify leading-relaxed border-l-2 border-[#556B2F] pl-4">
                         {result.advice}
                       </p>
                    </div>

                    {/* Deficiency Box */}
                    <div className="bg-[#2a2a2a] p-6 rounded-xl border border-[#556B2F]/20 relative overflow-hidden group hover:border-[#556B2F]/50 transition-colors">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <AlertCircle className="w-24 h-24 text-[#556B2F]" />
                      </div>
                      <h4 className="flex items-center gap-3 text-xl text-[#E8F5E9] font-light mb-3">
                        <AlertCircle className="w-6 h-6 text-[#8FBC8F]" />
                        Potential Deficiency
                      </h4>
                      <p className="text-gray-300 text-lg font-medium relative z-10">
                        {result.deficiency}
                      </p>
                    </div>

                    {/* Food Recommendations */}
                    <div>
                      <h4 className="flex items-center gap-3 text-[#E8F5E9] font-light mb-4">
                        <CheckCircle className="w-5 h-5 text-[#8FBC8F]" />
                        Recommended Dietary Sources
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {result.foods && result.foods.map((food, idx) => (
                          <span key={idx} className="px-5 py-2 bg-[#556B2F]/10 text-[#8FBC8F] border border-[#556B2F]/30 rounded-full text-sm hover:bg-[#556B2F]/20 transition-colors">
                            {food}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button 
                      onClick={resetAnalysis}
                      className="w-full py-4 mt-4 bg-gradient-to-r from-[#556B2F] to-[#3E4E24] text-white rounded-xl font-bold tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center gap-3 shadow-lg"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Scan New Image
                    </button>
                    
                    <p className="text-xs text-gray-600 text-center text-justify mt-4">
                      Disclaimer: This analysis is generated by AI for informational purposes only. It is not a medical diagnosis. Please consult a certified dermatologist for professional advice.
                    </p>

                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
               <div className="p-4 bg-red-900/20 text-red-300 rounded-xl border border-red-800/50 mt-6 flex items-center gap-4">
                 <AlertCircle className="w-6 h-6 flex-shrink-0" />
                 <div>
                   <p className="font-bold">System Error</p>
                   <p className="text-sm">{error}</p>
                 </div>
                 <button onClick={resetAnalysis} className="ml-auto text-sm underline hover:text-white">Retry</button>
               </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHub;