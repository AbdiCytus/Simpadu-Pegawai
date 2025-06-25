import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useClassSession } from "../../context/ClassSessionContext";
import { useNavigate } from "react-router-dom";
import StartLectureModal from "../Modals/StartLectureModal";

function DashDosen() {
  const { jadwal } = useAuth();

  const { activeSessionId, startSession } = useClassSession();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const getDayName = (day) => {
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    return days.indexOf(day);
  };

  const today = new Date().getDay();

  const openConfirmationModal = (kelas) => {
    setSelectedClass(kelas);
    setIsModalOpen(true);
  };

  const handleConfirmStart = () => {
    startSession(selectedClass.id_kelas);
    navigate(`/perkuliahan/${selectedClass.id_kelas}`);
  };
  
  return (
    <>
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h4 className="text-lg font-bold text-gray-800 border-b pb-3 mb-3">
          Daftar Jadwal Mengajar Anda
        </h4>
        {jadwal.length > 0 ? (
          <ul className="space-y-2">
            {jadwal.map((item, index) => {
              const isToday = getDayName(item.hari) === today;
              const isSessionActiveForThisClass =
                activeSessionId === item.id_kelas;
              const isAnotherSessionActive =
                activeSessionId !== null && !isSessionActiveForThisClass;

              return (
                <li
                  key={index}
                  className="p-3 bg-slate-100 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.nama_mk}</p>
                    <p className="text-sm text-gray-600">
                      {item.nama_kelas} - Semester {item.semester} ({item.hari})
                    </p>
                  </div>

                  {isSessionActiveForThisClass ? (
                    <button
                      onClick={() => navigate(`/perkuliahan/${item.id_kelas}`)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-3 rounded-md text-sm sm:text-md">
                      Sedang Berlangsung
                    </button>
                  ) : (
                    <button
                      onClick={() => openConfirmationModal(item)}
                      disabled={!isToday || isAnotherSessionActive}
                      className="bg-primary text-white font-bold py-1.5 px-3 rounded-md text-sm sm:text-md hover:bg-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed">
                      Buka Kelas
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500">Tidak ada jadwal mengajar.</p>
        )}
      </div>
      {isModalOpen && (
        <StartLectureModal
          classData={{
            kelas: selectedClass.nama_kelas,
            mataKuliah: selectedClass.nama_mk,
            pertemuan: "Baru",
          }}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmStart}
        />
      )}
    </>
  );
}

export default DashDosen;
