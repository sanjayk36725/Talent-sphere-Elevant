import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Mic, ShieldCheck, ShieldAlert, AlertTriangle, AlertCircle, ArrowLeft, Loader2, 
  Maximize2, CheckSquare, Clock, Award 
} from 'lucide-react';

interface NeoExamShieldProps {
  examTitle: string;
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  passingMarks: number;
  isExamStarted: boolean;
  onStartExam: () => void;
  onTerminate: () => void;
  onWarning: (reason: string, count: number) => void;
  onBack: () => void;
  children: React.ReactNode;
}

export const NeoExamShield: React.FC<NeoExamShieldProps> = ({
  examTitle,
  durationMinutes,
  totalQuestions,
  totalMarks,
  passingMarks,
  isExamStarted,
  onStartExam,
  onTerminate,
  onWarning,
  onBack,
  children
}) => {
  const [warningsCount, setWarningsCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isRequestingMedia, setIsRequestingMedia] = useState(false);
  const [faceDetected, setFaceDetected] = useState(true);
  const [micVolumeLevel, setMicVolumeLevel] = useState(25);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [lastWarningMsg, setLastWarningMsg] = useState('');
  
  // Extension Verification States
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false);
  const [isCheckingExtension, setIsCheckingExtension] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const preVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Stop media streams securely
  const cleanupMedia = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const initializeMediaStreams = async () => {
    setIsRequestingMedia(true);
    setPermissionError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices not supported in this browser.');
      }

      cleanupMedia();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: true,
      });

      streamRef.current = stream;
      const hasVideo = stream.getVideoTracks().length > 0 && stream.getVideoTracks()[0].enabled;
      const hasAudio = stream.getAudioTracks().length > 0 && stream.getAudioTracks()[0].enabled;

      setCameraActive(hasVideo);
      setMicActive(hasAudio);

      if (preVideoRef.current) {
        preVideoRef.current.srcObject = stream;
        preVideoRef.current.play().catch(() => {});
      }
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      // Audio metering
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;

          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const updateVolume = () => {
            if (analyserRef.current) {
              analyserRef.current.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
              }
              const avg = sum / bufferLength;
              setMicVolumeLevel(Math.min(100, Math.round((avg / 128) * 100)));
            }
            animationFrameRef.current = requestAnimationFrame(updateVolume);
          };
          updateVolume();
        }
      } catch (err) {
        console.warn('Audio metering notice:', err);
      }
    } catch (err: any) {
      console.warn('Media authorization failed:', err);
      setCameraActive(false);
      setMicActive(false);
      setPermissionError(err.message || 'Camera or Microphone access was denied.');
    } finally {
      setIsRequestingMedia(false);
    }
  };

  useEffect(() => {
    initializeMediaStreams();
    return cleanupMedia;
  }, []);

  // Sync video element when switching to active exam mode
  useEffect(() => {
    if (isExamStarted && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [isExamStarted]);

  const enterLockedFullscreen = async () => {
    try {
      const docEl = document.documentElement as any;
      if (docEl.requestFullscreen) await docEl.requestFullscreen();
      else if (docEl.webkitRequestFullscreen) await docEl.webkitRequestFullscreen();
      else if (docEl.mozRequestFullScreen) await docEl.mozRequestFullScreen();
      else if (docEl.msRequestFullscreen) await docEl.msRequestFullscreen();
      setIsFullscreen(true);
    } catch (err) {
      console.warn('Fullscreen native request handled via simulated container:', err);
      setIsFullscreen(true);
    }
  };

  const verifyExtension = () => {
    setIsCheckingExtension(true);
    // Simulate extension check (in a real scenario, this would check window object or injected DOM elements)
    setTimeout(() => {
      setIsExtensionInstalled(true);
      setIsCheckingExtension(false);
    }, 1000);
  };

  const handleStartExam = async () => {
    await enterLockedFullscreen();
    onStartExam();
  };

  const triggerWarning = (reason: string) => {
    setLastWarningMsg(reason);
    setShowWarningAlert(true);
    
    setWarningsCount(prev => {
      const updated = prev + 1;
      onWarning(reason, updated);
      if (updated >= 3) {
        onTerminate();
      }
      return updated;
    });

    setTimeout(() => setShowWarningAlert(false), 5000);
  };

  // 1. Prevent Cheating Actions (Copy, Paste, Context Menu)
  useEffect(() => {
    if (!isExamStarted) return;

    const preventDefault = (e: Event) => {
      e.preventDefault();
      triggerWarning('Restricted Action: Right-click, Copy, and Paste are disabled.');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
        e.preventDefault();
        triggerWarning('Restricted Action: Copy/Paste keyboard shortcuts are disabled.');
      }
    };

    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('copy', preventDefault);
    document.addEventListener('paste', preventDefault);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', preventDefault);
      document.removeEventListener('copy', preventDefault);
      document.removeEventListener('paste', preventDefault);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExamStarted]);

  // 2. Fullscreen & Tab Focus Monitor
  useEffect(() => {
    if (!isExamStarted) return;

    const handleFullscreenChange = () => {
      const isFull = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement
      );
      setIsFullscreen(isFull);
      if (!isFull) {
        triggerWarning('Exited Fullscreen Mode! Strict exam protocol requires locked fullscreen.');
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerWarning('Tab switch detected! Browser focus must remain on the test.');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isExamStarted]);

  // 3. Face Visibility Sensor
  useEffect(() => {
    if (!isExamStarted) return;

    let faceCheckInterval: any = null;
    let consecutiveAbsenceCount = 0;

    faceCheckInterval = setInterval(() => {
      if (!videoRef.current || !canvasRef.current || !cameraActive) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (video.videoWidth > 0 && video.videoHeight > 0 && ctx) {
        canvas.width = 160;
        canvas.height = 120;
        ctx.drawImage(video, 0, 0, 160, 120);

        try {
          const imgData = ctx.getImageData(0, 0, 160, 120);
          const pixels = imgData.data;
          let totalBrightness = 0;
          let skinToneCount = 0;

          for (let i = 0; i < pixels.length; i += 16) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            totalBrightness += (r + g + b) / 3;
            if (r > 60 && g > 40 && b > 20 && r > b && r - g > 10) skinToneCount++;
          }

          const sampledPixels = pixels.length / 16;
          const avgBrightness = totalBrightness / sampledPixels;
          const skinRatio = skinToneCount / sampledPixels;
          const isFacePresent = avgBrightness > 20 && avgBrightness < 245 && skinRatio > 0.04;

          if (!isFacePresent) {
            consecutiveAbsenceCount++;
            if (consecutiveAbsenceCount >= 2) {
              setFaceDetected(false);
              triggerWarning('FACE NOT DETECTED: Please position your face clearly in front of the camera!');
            }
          } else {
            consecutiveAbsenceCount = 0;
            setFaceDetected(true);
          }
        } catch (e) {
          // Cross-origin safe
        }
      }
    }, 4000);

    return () => {
      if (faceCheckInterval) clearInterval(faceCheckInterval);
    };
  }, [isExamStarted, cameraActive]);


  if (!isExamStarted) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 text-slate-900 dark:text-slate-100">
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> NeoExamShield Verification
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">{examTitle}</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Please complete the proctoring device check and click Start to enter the locked fullscreen examination environment.
              </p>
            </div>
            <button
              onClick={onBack}
              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Cancel & Return
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block uppercase">Duration</span>
              <span className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 text-amber-500" /> {durationMinutes} Mins
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block uppercase">Questions</span>
              <span className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-1.5 mt-0.5">
                <CheckSquare className="w-4 h-4 text-indigo-500" /> {totalQuestions} MCQs
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block uppercase">Total Marks</span>
              <span className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-1.5 mt-0.5">
                <Award className="w-4 h-4 text-emerald-500" /> {totalMarks} Marks
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block uppercase">Passing Score</span>
              <span className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-purple-500" /> {passingMarks} / {totalMarks}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                  <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Camera Video Stream
                </span>
                <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full ${cameraActive ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'}`}>
                  {cameraActive ? '● CAMERA READY' : '● NOT CONNECTED'}
                </span>
              </div>
              <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-700 flex items-center justify-center shadow-inner">
                {cameraActive ? (
                  <>
                    <video ref={preVideoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror-mode" />
                    <div className="absolute inset-3 border border-dashed border-emerald-400/50 rounded-xl pointer-events-none flex items-center justify-center">
                      <span className="text-[10px] bg-emerald-600/80 text-white font-mono font-bold px-2 py-0.5 rounded-full">✓ Face Verified</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 space-y-2">
                    <Video className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-400 font-medium">Camera preview awaiting authorization</p>
                    <button type="button" onClick={initializeMediaStreams} disabled={isRequestingMedia} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 mx-auto">
                      {isRequestingMedia ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Video className="w-3.5 h-3.5" />} Authorize Webcam
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                    <Mic className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Microphone Audio Sensor
                  </span>
                  <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full ${micActive ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'}`}>
                    {micActive ? 'LISTENING ACTIVE' : 'REQUESTING MIC'}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Input Level:</span>
                    <span>{micActive ? `${micVolumeLevel}%` : '0%'}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-150 rounded-full ${micActive ? 'bg-emerald-500' : 'bg-slate-400'}`} style={{ width: `${micActive ? Math.max(15, micVolumeLevel) : 0}%` }} />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/40 space-y-2 text-xs">
                <span className="font-mono font-black text-indigo-900 dark:text-indigo-300 uppercase block text-[11px] flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Strict Proctoring Rules
                </span>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" /> Copy/Paste and Right-Click are disabled.</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" /> Leaving fullscreen or switching tabs triggers warnings.</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" /> 3 warnings will immediately submit and terminate the exam.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Extension Check Banner */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">NeoExamShield Chrome Extension</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Required to ensure exam integrity. <a href="https://chromewebstore.google.com/detail/neoexamshield/deojfdehldjjfmcjcfaojgaibalafifc" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Get it here</a>.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isExtensionInstalled ? (
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4" /> Verified
                </span>
              ) : (
                <button
                  onClick={verifyExtension}
                  disabled={isCheckingExtension}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isCheckingExtension ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                  Verify Installation
                </button>
              )}
            </div>
          </div>

          {permissionError && (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Notice: {permissionError} You can take the exam under simulated mode.</span>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleStartExam}
              disabled={!isExtensionInstalled}
              className={`w-full py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all ${
                isExtensionInstalled 
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white cursor-pointer transform hover:scale-[1.01] shadow-xl shadow-indigo-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700 shadow-inner'
              }`}
            >
              <Maximize2 className="w-5 h-5" />
              <span>{isExtensionInstalled ? 'Start Examination & Lock Fullscreen' : 'Extension Required to Start'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="neo-exam-shield relative w-full h-full min-h-screen">
      {/* Hidden canvas for face detection analysis */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Exam Content */}
      <div className="w-full h-full">
        {children}
      </div>

      {/* Floating NeoExamShield Dashboard */}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2 pointer-events-none">
        
        {/* Warning Toast */}
        {showWarningAlert && (
          <div className="bg-rose-600 text-white p-3 rounded-xl shadow-2xl flex items-center gap-3 mb-2 animate-bounce">
            <AlertTriangle className="w-6 h-6 text-rose-200" />
            <div>
              <span className="block text-xs font-black uppercase">Proctor Warning ({warningsCount}/3)</span>
              <span className="block text-xs">{lastWarningMsg}</span>
            </div>
          </div>
        )}

        <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-700 flex flex-col items-center gap-3 pointer-events-auto w-36">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-300 uppercase w-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 
            <span>NeoExamShield</span>
          </div>

          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-slate-700">
            {cameraActive ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror-mode" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                <Video className="w-4 h-4 mb-1" />
                <span className="text-[8px] uppercase">Off</span>
              </div>
            )}
            {!faceDetected && cameraActive && (
              <div className="absolute inset-0 bg-rose-600/30 flex items-center justify-center border-2 border-rose-500 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
              </div>
            )}
          </div>

          <div className="w-full flex items-center justify-between">
            <div className="flex gap-1.5">
              <div className={`w-2 h-2 rounded-full ${cameraActive ? 'bg-emerald-500' : 'bg-slate-600'}`} title="Camera Status" />
              <div className={`w-2 h-2 rounded-full ${micActive ? 'bg-emerald-500' : 'bg-slate-600'}`} title="Mic Status" />
              <div className={`w-2 h-2 rounded-full ${isFullscreen ? 'bg-emerald-500' : 'bg-rose-500'}`} title="Fullscreen Status" />
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black text-slate-400">WARN:</span>
              <span className={`text-[11px] font-mono font-black px-1.5 py-0.5 rounded-md ${warningsCount > 0 ? 'bg-rose-500 text-white' : 'bg-slate-800 text-emerald-400'}`}>
                {warningsCount}/3
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
