import { createContext, useState, useContext, useEffect } from "react";

const ClassSessionContext = createContext();

export const ClassSessionProvider = ({ children }) => {
  const [activeSessionId, setActiveSessionId] = useState(null);
  // --- STATE BARU UNTUK TIMER ---
  const [isAttendanceClosing, setIsAttendanceClosing] = useState(false);
  const [timer, setTimer] = useState(0);

  // --- useEffect BARU UNTUK MENJALANKAN COUNTDOWN ---
  useEffect(() => {
    let countdown;
    // Jalankan timer hanya jika statusnya aktif
    if (isAttendanceClosing && activeSessionId) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            setIsAttendanceClosing(false); // Timer selesai
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    // Cleanup function untuk membersihkan interval jika komponen unmount
    return () => clearInterval(countdown);
  }, [isAttendanceClosing, activeSessionId]);

  const startSession = (classId) => {
    setActiveSessionId(classId);
    setIsAttendanceClosing(true); // Aktifkan mode timer
    setTimer(15); // Set timer ke 15 detik
    console.log(
      `Sesi untuk kelas ${classId} dimulai, presensi ditutup dalam 15 detik.`
    );
  };

  const endSession = () => {
    console.log(`Sesi untuk kelas ${activeSessionId} berakhir.`);
    setActiveSessionId(null);
    setIsAttendanceClosing(false);
    setTimer(0);
  };

  // Fungsi baru untuk skip timer
  const skipTimer = () => {
    setIsAttendanceClosing(false);
    setTimer(0);
    console.log("Timer presensi dilewati.");
  };

  const value = {
    activeSessionId,
    isAttendanceClosing,
    timer,
    startSession,
    endSession,
    skipTimer, // Sediakan fungsi baru
  };

  return (
    <ClassSessionContext.Provider value={value}>
      {children}
    </ClassSessionContext.Provider>
  );
};

export const useClassSession = () => {
  return useContext(ClassSessionContext);
};
