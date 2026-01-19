import { useEffect, useRef, useState } from "react";

const SleepDetector = ({ onStatusChange }) => {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState("Waiting");
  const closedFramesRef = useRef(0);
  const alertPlayedRef = useRef(false);

  useEffect(() => {
    if (!started) return;

    if (!window.FaceMesh || !window.Camera) {
      alert("MediaPipe not loaded. Refresh the page.");
      return;
    }

    const faceMesh = new window.FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    const EAR = (eye) => (dist(eye[1], eye[5]) + dist(eye[2], eye[4])) / (2 * dist(eye[0], eye[3]));

    faceMesh.onResults((results) => {
      const landmarks = results.multiFaceLandmarks?.[0];

      if (!landmarks || landmarks.length < 468) {
        setStatus("No Face");
        closedFramesRef.current = 0;
        alertPlayedRef.current = false;
        onStatusChange("Alert");
        return;
      }

      const safe = (i) => landmarks[i] ?? null;

      const leftEyeIdx = [33, 160, 158, 133, 153, 144];
      const rightEyeIdx = [362, 385, 387, 263, 373, 380];

      const leftEye = leftEyeIdx.map(safe);
      const rightEye = rightEyeIdx.map(safe);

      if ([...leftEye, ...rightEye].some((p) => p === null)) return;

      const ear = (EAR(leftEye) + EAR(rightEye)) / 2;

      if (ear < 0.21) {
        closedFramesRef.current += 1;
        setStatus("Eyes Closed");

        if (closedFramesRef.current > 15 && !alertPlayedRef.current) {
          alertPlayedRef.current = true;
          onStatusChange("Drowsy");

          const utter = new SpeechSynthesisUtterance(
            "Wake up! You are feeling sleepy!"
          );
          speechSynthesis.cancel();
          speechSynthesis.speak(utter);
        }
      } else {
        closedFramesRef.current = 0;
        alertPlayedRef.current = false;
        setStatus("Eyes Open");
        onStatusChange("Alert");
      }
    });

    const camera = new window.Camera(videoRef.current, {
      onFrame: async () => await faceMesh.send({ image: videoRef.current }),
      width: 640,
      height: 480,
    });

    camera.start();
    return () => camera.stop();
  }, [started, onStatusChange]);

  return (
    <div className="flex flex-col items-center gap-4 w-full px-2 md:px-0">
      <p className="text-yellow-400 font-bold text-center text-lg md:text-xl">
        Detection Status: {status}
      </p>

      <button
        onClick={() => setStarted(true)}
        disabled={started}
        className={`bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600 transition ${
          started ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {started ? "Detection Started" : "Start Detection"}
      </button>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full max-w-xl h-64 md:h-96 bg-black rounded shadow-lg object-cover"
      />
    </div>
  );
};

export default SleepDetector;
