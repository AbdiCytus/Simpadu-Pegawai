import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import ScheduleModal from "../components/Modals/ScheduleModal";

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
  const [tempProdi, setTempProdi] = useState(1);
  const [schedules, setSchedules] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [kelasOptions, setKelasOptions] = useState([]);
  const [matkulOptions, setMatkulOptions] = useState([]);
  const [prodiOptions, setProdiOptions] = useState([]);

  useEffect(() => {
    const fetchKelasMatkulData = async () => {
      if (formData.role !== "Dosen" || !token) return;
      try {
        const response = await axios.get(`${baseURL}/api/data/kelas-matkul`, {
          headers: { Authorization: token },
        });
        const response_2 = await axios.get(`${baseURL}/api/data/prodi`, {
          headers: { Authorization: token },
        });
        setKelasOptions(response.data.dataKelas);
        setMatkulOptions(response.data.dataMatkul);
        setProdiOptions(response_2.data.dataProdi);
      } catch (error) {
        console.error("Gagal mengambil data kelas & matkul:", error);
      }
    };
    fetchKelasMatkulData();
  }, [formData.role, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleProdiChange = (e) => {
    const convertToNumber = Number(e.target.value);
    setTempProdi(convertToNumber);
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
        id_prodi: tempProdi,
        id_mk: s.id_mk,
        id_kelas: s.id_kelas,
        hari: s.hari,
      }));
    }

    try {
      await axios.post(`${baseURL}/api/data/tambah-pegawai`, requestBody, {
        headers: { Authorization: token },
      });
      alert("Berhasil menambah data pegawai baru!");
      navigate("/data-pegawai");
    } catch (error) {
      console.log(requestBody);
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
                  <select
                    name=""
                    value={tempProdi}
                    onChange={handleProdiChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {prodiOptions.map((p, i) => {
                      return (
                        <option key={i} value={p.id_prodi}>
                          {p.nama_prodi}
                        </option>
                      );
                    })}
                  </select>
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
