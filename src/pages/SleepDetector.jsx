import { useEffect, useRef, useState } from "react";

const SleepDetector = ({ onStatusChange }) => {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState("Waiting");

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

    let closedFrames = 0;

    faceMesh.onResults((results) => {
      if (
        !results.multiFaceLandmarks ||
        results.multiFaceLandmarks.length === 0
      ) {
        setStatus("No Face");
        return;
      }

      const lm = results.multiFaceLandmarks[0];

      // ✅ VERY IMPORTANT CHECK
      if (!lm || lm.length < 468) {
        return;
      }

      const safe = (i) => lm[i] ?? null;

      const leftEyeIdx = [33, 160, 158, 133, 153, 144];
      const rightEyeIdx = [362, 385, 387, 263, 373, 380];

      const leftEye = leftEyeIdx.map(safe);
      const rightEye = rightEyeIdx.map(safe);

      // If any landmark missing → skip frame
      if ([...leftEye, ...rightEye].some((p) => p === null)) return;

      const dist = (a, b) =>
        Math.hypot(a.x - b.x, a.y - b.y);

      const EAR = (eye) =>
        (dist(eye[1], eye[5]) + dist(eye[2], eye[4])) /
        (2 * dist(eye[0], eye[3]));

      const ear = (EAR(leftEye) + EAR(rightEye)) / 2;

      if (ear < 0.21) {
        closedFrames++;
        setStatus("Eyes Closed");

        if (closedFrames > 18) {
          onStatusChange("Drowsy");

          speechSynthesis.cancel();
          speechSynthesis.speak(
            new SpeechSynthesisUtterance(
              "Wake up! You are feeling sleepy!"
            )
          );
        }
      } else {
        closedFrames = 0;
        setStatus("Eyes Open");
        onStatusChange("Alert");
      }
    });

    const camera = new window.Camera(videoRef.current, {
      onFrame: async () => {
        await faceMesh.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => camera.stop();
  }, [started, onStatusChange]);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-yellow-400 font-bold">
        Detection Status: {status}
      </p>

      <button
        onClick={() => setStarted(true)}
        className="bg-green-500 px-4 py-2 rounded"
      >
        Start Detection
      </button>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-64 bg-black rounded"
      />
    </div>
  );
};

export default SleepDetector;
