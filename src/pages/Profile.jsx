import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import UserAvatar from "../assets/avatar.jpg";

export default function Profile() {
  // --- PERUBAHAN 1: Mengambil `user` dari AuthContext sebagai data utama ---
  const { user, token, fetchUserData: updateUserContext, baseURL } = useAuth();

  // State untuk form sekarang diinisialisasi dari `user` di context
  const [formData, setFormData] = useState({});

  // State untuk UI tetap sama
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // State untuk gambar profil tetap sama
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(UserAvatar);

  const fileInputRef = useRef(null);

  // --- PERUBAHAN 2: useEffect sekarang hanya untuk mengupdate form dan preview ---
  // Logika fetch data lokal dihapus.
  useEffect(() => {
    if (user) {
      setFormData(user); // Set data form dari context
      if (user.pfp) setProfilePicPreview(`${baseURL}/tesapi/${user.pfp}`);
      else setProfilePicPreview(UserAvatar);
    }
  }, [user]); // Jalankan efek ini setiap kali data `user` di context berubah

  // Handler untuk setiap perubahan pada input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler untuk saat pengguna memilih file gambar baru
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  // Handler untuk membatalkan proses edit
  const handleCancelEdit = () => {
    setFormData(user); // Kembalikan form ke data dari context
    setProfilePicFile(null);
    setProfilePicPreview(
      user.pfp ? `${baseURL}/tesapi/${user.pfp}` : UserAvatar
    );
    setIsEditing(false);
  };

  // Handler untuk menyimpan data (PUT)
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const dataToSubmit = new FormData();

    dataToSubmit.append("id_pegawai", user.id_pegawai); // ID diambil dari context
    // Hanya kirim data yang boleh diubah
    dataToSubmit.append("tgl_lahir", formData.tgl_lahir.split("T")[0]);
    dataToSubmit.append("domisili", formData.domisili);
    dataToSubmit.append("no_telp", formData.no_telp);

    if (profilePicFile) {
      dataToSubmit.append("pfp", profilePicFile);
      dataToSubmit.append("already_exist", user.pfp || "");
    } else dataToSubmit.append("already_exist", user.pfp || "");
    console.log(dataToSubmit);

    try {
      await axios.put(`${baseURL}/api/update-profiling`, dataToSubmit, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profil berhasil diperbarui!");
      // Update data global di context, yang akan memicu re-render di semua komponen
      if (updateUserContext) await updateUserContext(token);
      setIsEditing(false);
    } catch (error) {
      alert("Gagal menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  // Tampilan loading sekarang bergantung pada state `user` dari context
  if (!user)
    return <div className="text-center p-10">Memuat data profil...</div>;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-start sm:items-center mb-6 gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Profile
        </h2>
        <span className="text-base sm:text-lg font-semibold text-gray-600">
          {new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      <form onSubmit={handleSave} className="flex flex-col lg:flex-row gap-6">
        {/* Kolom Kiri: Kartu Profil (Read-Only), sekarang menggunakan data `user` dari context */}
        <div className="w-full lg:w-1/3 flex-shrink-0">
          <div className="bg-white p-10 rounded-xl shadow-lg text-center h-full flex flex-col justify-center">
            <div>
              <img
                src={profilePicPreview}
                alt="Profile"
                className="w-40 h-40 sm:w-50 sm:h-50 rounded-full mx-auto mb-4 border-4 border-slate-200 object-cover"
              />
              <div className="bg-primary text-white text-lg sm:text-2xl font-bold py-2 rounded-lg mt-6">
                {user?.nama_pegawai || "Nama Pegawai"}
              </div>
              <div className="text-left sm:text-lg mt-6 space-y-1 text-gray-800 sm:ml-1">
                <p>
                  <strong className="font-semibold text-gray-500">ID:</strong>{" "}
                  {user?.id_pegawai}
                </p>
                <p>
                  <strong className="font-semibold text-gray-500">Role:</strong>{" "}
                  {user?.role}
                </p>
                <p>
                  <strong className="font-semibold text-gray-500">
                    Jenis Kelamin:
                  </strong>{" "}
                  {user?.jenis_kelamin}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Form Edit Data (sumber data dari state `formData`) */}
        <div className="w-full lg:w-2/3">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              disabled={!isEditing}
              className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white font-bold py-2 px-5 rounded-lg shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Ubah Foto Profil
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />

            {isEditing ? (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-lg shadow-sm"
              >
                Batal Edit
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white font-bold py-2 px-5 rounded-lg shadow-sm"
              >
                Edit Data
              </button>
            )}
          </div>

          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="tgl_lahir"
                  className="block text-sm font-semibold text-gray-600 mb-1"
                >
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  id="tgl_lahir"
                  name="tgl_lahir"
                  value={formData.tgl_lahir?.split("T")[0] || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="domisili"
                  className="block text-sm font-semibold text-gray-600 mb-1"
                >
                  Domisili
                </label>
                <input
                  type="text"
                  id="domisili"
                  name="domisili"
                  value={formData.domisili || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Masukkan alamat tinggal & kota"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="no_telp"
                  className="block text-sm font-semibold text-gray-600 mb-1"
                >
                  No Telepon
                </label>
                <input
                  type="text"
                  id="no_telp"
                  name="no_telp"
                  value={formData.no_telp || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Masukkan no telepon"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={!isEditing || isSaving}
                  className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-lg shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
