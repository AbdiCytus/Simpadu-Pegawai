import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { FaEye, FaEyeSlash, FaPlus, FaTrash } from "react-icons/fa";

// --- Komponen Modal untuk Menambah Jadwal Mengajar ---
const ScheduleModal = ({
  isOpen,
  onClose,
  schedules,
  setSchedules,
  kelasOptions,
  matkulOptions,
}) => {
  const [isShowing, setIsShowing] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState({
    id_mk: "",
    id_kelas: "",
    hari: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsShowing(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsShowing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsShowing(false);
    setTimeout(onClose, 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSchedule((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleAddSchedule = () => {
    if (
      !currentSchedule.id_mk ||
      !currentSchedule.id_kelas ||
      !currentSchedule.hari
    ) {
      setError("Semua field jadwal wajib diisi.");
      return;
    }
    if (schedules.filter((s) => s.hari === currentSchedule.hari).length >= 3) {
      setError(
        `Tidak bisa menambah lebih dari 3 kelas di hari ${currentSchedule.hari}.`
      );
      return;
    }
    if (schedules.some((s) => s.id_kelas === currentSchedule.id_kelas)) {
      setError(`Kelas ini sudah memiliki jadwal mengajar.`);
      return;
    }
    setSchedules((prev) => [...prev, currentSchedule]);
    setCurrentSchedule({ id_mk: "", id_kelas: "", hari: "" });
    setError("");
  };

  const handleRemoveSchedule = (indexToRemove) => {
    setSchedules((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm flex justify-center items-start pt-20 z-50 p-4">
      <div
        className={`bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl transform transition-all duration-300 ease-out ${
          isShowing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Tambah Jadwal Mengajar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b pb-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Mata Kuliah
            </label>
            <select
              name="id_mk"
              value={currentSchedule.id_mk}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Pilih Matkul</option>
              {matkulOptions.map((mk) => (
                <option key={mk.id_mk} value={mk.id_mk}>
                  {mk.nama_mk}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Kelas
            </label>
            <select
              name="id_kelas"
              value={currentSchedule.id_kelas}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Pilih Kelas</option>
              {kelasOptions.map((k) => (
                <option key={k.id_kelas} value={k.id_kelas}>
                  {k.nama_kelas}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Hari
            </label>
            <select
              name="hari"
              value={currentSchedule.hari}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Pilih Hari</option>
              <option>Senin</option>
              <option>Selasa</option>
              <option>Rabu</option>
              <option>Kamis</option>
              <option>Jumat</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleAddSchedule}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 h-10 text-sm"
          >
            Tambah
          </button>
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        <div className="mt-4">
          <h4 className="font-semibold text-sm">
            Jadwal Ditambahkan: {schedules.length > 0 ? "" : " (Kosong)"}
          </h4>
          <ul className="mt-2 space-y-2 max-h-40 overflow-y-auto text-sm">
            {schedules.map((schedule, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
              >
                <span>
                  {
                    matkulOptions.find((m) => m.id_mk === schedule.id_mk)
                      ?.nama_mk
                  }{" "}
                  -{" "}
                  {
                    kelasOptions.find((k) => k.id_kelas === schedule.id_kelas)
                      ?.nama_kelas
                  }{" "}
                  ({schedule.hari})
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveSchedule(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold text-sm"
          >
            Selesai & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TambahPegawai() {
  const navigate = useNavigate();
  const { token, baseURL } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "Staff",
    nama_pegawai: "",
    tgl_lahir: "",
    domisili: "",
    jenis_kelamin: "Laki-laki",
    no_telp: "",
  });

  const [jurusanOptions, setJurusanOptions] = useState([]);
  const [prodiOptions, setProdiOptions] = useState([]);
  const [filteredProdiOptions, setFilteredProdiOptions] = useState([]);
  const [selectedJurusan, setSelectedJurusan] = useState(1);
  const [selectedProdi, setSelectedProdi] = useState(1);

  const [schedules, setSchedules] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [kelasOptions, setKelasOptions] = useState([]);
  const [matkulOptions, setMatkulOptions] = useState([]);

  useEffect(() => {
    const fetchDataForDosen = async () => {
      if (formData.role !== "Dosen" || !token) return;
      try {
        const [kelasMatkulRes, prodiRes, jurusanRes] = await Promise.all([
          axios.get(`${baseURL}/api/data/kelas-matkul`, {
            headers: { Authorization: token },
          }),
          axios.get(`${baseURL}/api/data/prodi`),
          axios.get(`${baseURL}/api/data/jurusan`, {
            headers: { Authorization: token },
          }),
        ]);

        setKelasOptions(kelasMatkulRes.data.dataKelas);
        setMatkulOptions(kelasMatkulRes.data.dataMatkul);

        const fetchedJurusan = jurusanRes.data.dataJurusan;
        const fetchedProdi = prodiRes.data.data;

        setJurusanOptions(fetchedJurusan);
        setProdiOptions(fetchedProdi);

        if (fetchedJurusan.length > 0) {
          setSelectedJurusan(fetchedJurusan[0].id_jurusan);
        }
      } catch (error) {
        console.error("Gagal mengambil data untuk dosen:", error);
      }
    };
    fetchDataForDosen();
  }, [formData.role, token, baseURL]);

  useEffect(() => {
    if (selectedJurusan) {
      const filtered = prodiOptions.filter(
        (p) => p.id_jurusan === selectedJurusan
      );
      setFilteredProdiOptions(filtered);
      if (filtered.length > 0) {
        setSelectedProdi(filtered[0].id_prodi);
      } else {
        setSelectedProdi("");
      }
    }
  }, [selectedJurusan, prodiOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nama_pegawai)
      newErrors.nama_pegawai = "Nama pegawai wajib diisi.";
    if (!formData.username) newErrors.username = "Username wajib diisi.";
    if (!formData.password) newErrors.password = "Password wajib diisi.";
    if (formData.role === "Dosen" && schedules.length === 0)
      newErrors.schedules = "Dosen wajib memiliki minimal 1 jadwal mengajar.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    const requestBody = {
      add: {
        username: formData.username,
        password: formData.password,
        role: formData.role,
        nama_pegawai: formData.nama_pegawai,
        tgl_lahir: formData.tgl_lahir,
        domisili: formData.domisili,
        jenis_kelamin: formData.jenis_kelamin,
        no_telp: formData.no_telp,
      },
    };

    if (formData.role === "Dosen") {
      requestBody.schedule = schedules.map((s) => ({
        id_jurusan: selectedJurusan,
        id_prodi: selectedProdi,
        id_mk: s.id_mk,
        id_kelas: s.id_kelas,
        hari: s.hari,
      }));
    }

    console.log(requestBody);

    try {
      await axios.post(`${baseURL}/api/data/tambah-pegawai`, requestBody, {
        headers: { Authorization: token },
      });
      alert("Berhasil menambah data pegawai baru!");
      navigate("/data-pegawai");
    } catch (error) {
      console.error("Gagal menambah pegawai:", error.response?.data);
      alert(
        error.response?.data?.message || "Terjadi kesalahan saat menambah data."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Data Pegawai
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md">
        <div className="bg-primary p-3 rounded-t-lg text-white font-semibold text-base">
          Data Pegawai &gt; Tambah Pegawai
        </div>

        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-5 lg:gap-y-0">
            {/* Kolom Kiri */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-800 border-b pb-2">
                Data Pegawai
              </h3>
              <div>
                <input
                  name="nama_pegawai"
                  value={formData.nama_pegawai}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Nama Pegawai"
                />
                {errors.nama_pegawai && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nama_pegawai}
                  </p>
                )}
              </div>
              <select
                name="jenis_kelamin"
                value={formData.jenis_kelamin}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
              <input
                name="tgl_lahir"
                type="date"
                value={formData.tgl_lahir}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                name="domisili"
                value={formData.domisili}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Domisili"
              />
              <input
                name="no_telp"
                value={formData.no_telp}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="No Telepon"
              />
            </div>

            {/* Kolom Kanan */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-800 border-b pb-2">
                Akun Pegawai
              </h3>
              <div>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Username"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md pr-10"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                >
                  <FaEye />
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Staff">Staff</option>
                <option value="Dosen">Dosen</option>
                <option value="Admin">Admin</option>
              </select>

              {formData.role === "Dosen" && (
                <>
                  {/* Kedua dropdown dibungkus dalam satu div dengan grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select
                      name="jurusan"
                      value={selectedJurusan}
                      onChange={(e) =>
                        setSelectedJurusan(Number(e.target.value))
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {jurusanOptions.map((j) => (
                        <option key={j.id_jurusan} value={j.id_jurusan}>
                          Jurusan - {j.nama_jurusan}
                        </option>
                      ))}
                    </select>

                    <select
                      name="prodi"
                      value={selectedProdi}
                      onChange={(e) => setSelectedProdi(Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {filteredProdiOptions.length > 0 ? (
                        filteredProdiOptions.map((p) => (
                          <option key={p.id_prodi} value={p.id_prodi}>
                            Prodi - {p.nama_prodi}
                          </option>
                        ))
                      ) : (
                        <option disabled>Pilih Jurusan</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsScheduleModalOpen(true)}
                      className="w-full p-2 mt-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                    >
                      + Kelola Jadwal Mengajar ({schedules.length} jadwal)
                    </button>
                    {errors.schedules && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.schedules}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-6 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-md"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-md disabled:bg-gray-400"
            >
              {isSaving ? "Menyimpan..." : "Tambah"}
            </button>
          </div>
        </div>
      </form>

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        schedules={schedules}
        setSchedules={setSchedules}
        kelasOptions={kelasOptions}
        matkulOptions={matkulOptions}
      />
    </div>
  );
}
