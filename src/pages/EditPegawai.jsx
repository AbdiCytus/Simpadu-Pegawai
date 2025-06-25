import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import FormField from "../components/ForDataPegawai/FormField";

export default function EditPegawai() {
  const { pegawaiId } = useParams();
  const navigate = useNavigate();
  const { token, baseURL } = useAuth();

  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPegawaiDetail = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${baseURL}/api/data/pegawai/${pegawaiId}`,
          {
            headers: { Authorization: token },
          }
        );
        setFormData(response.data);
      } catch (error) {
        console.error("Gagal mengambil detail pegawai:", error);
        alert("Gagal memuat data pegawai.");
      } finally {
        setIsLoading(false);
      }
    };

    if (token && pegawaiId) fetchPegawaiDetail();
  }, [pegawaiId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const requestBody = {
      nama_pegawai: formData.nama_pegawai,
      tgl_lahir: formData.tgl_lahir.split("T")[0],
      domisili: formData.domisili,
      no_telp: formData.no_telp,
    };

    try {
      await axios.put(
        `${baseURL}/api/data/edit-pegawai/${pegawaiId}`,
        requestBody,
        {
          headers: { Authorization: token },
        }
      );
      alert("Data pegawai berhasil diperbarui!");
      navigate("/data-pegawai");
    } catch (error) {
      console.error("Gagal menyimpan perubahan:", error.response?.data);
      alert("Gagal menyimpan perubahan. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return <div className="p-10 text-center">Memuat data pegawai...</div>;
  if (!formData)
    return (
      <div className="p-10 text-center">Data pegawai tidak ditemukan.</div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Data Pegawai
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="bg-primary p-4 rounded-t-lg text-white font-semibold">
          Data Pegawai &gt; Edit Pegawai
        </div>

        <form onSubmit={handleSave} className="p-4 sm:p-6">
          <h4 className="text-lg font-bold text-gray-700 mb-6">
            Edit Pegawai ({formData.nama_pegawai})
          </h4>

          {/* --- TATA LETAK DIKEMBALIKAN SEPERTI SEMULA --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <FormField label="ID Pegawai">
              <input
                type="text"
                value={formData.id_pegawai || ""}
                readOnly
                className="w-full px-3 py-2 bg-gray-100 cursor-not-allowed"
              />
            </FormField>

            <FormField label="Nama Pegawai">
              <input
                type="text"
                name="nama_pegawai"
                value={formData.nama_pegawai || ""}
                onChange={handleChange}
                placeholder="Nama Pegawai"
                required
                className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </FormField>

            <FormField label="Jenis Kelamin">
              <input
                type="text"
                value={formData.jenis_kelamin || ""}
                readOnly
                className="w-full px-3 py-2 bg-gray-100 cursor-not-allowed"
              />
            </FormField>

            <FormField label="Tanggal Lahir">
              <input
                type="date"
                name="tgl_lahir"
                value={formData.tgl_lahir?.split("T")[0] || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </FormField>

            <FormField label="Domisili">
              <input
                type="text"
                name="domisili"
                value={formData.domisili || ""}
                onChange={handleChange}
                placeholder="Domisili Pegawai"
                className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </FormField>

            <FormField label="No Telepon">
              <input
                type="text"
                name="no_telp"
                value={formData.no_telp || ""}
                onChange={handleChange}
                placeholder="No Telepon Pegawai"
                className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </FormField>

            <FormField label="Role">
              <input
                type="text"
                value={formData.role || ""}
                readOnly
                className="w-full px-3 py-2 bg-gray-100 cursor-not-allowed"
              />
            </FormField>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-8 pt-6 border-t border-gray-300">
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
              className="w-full sm:w-auto px-6 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
