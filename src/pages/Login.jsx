import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/logo.png";
import bg from "../assets/kampus_poliban.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // State untuk mengelola input form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // State untuk fitur tambahan
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- 1. State untuk menyimpan pesan error ---
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Hapus error sebelumnya setiap kali mencoba login

    try {
      // Memanggil fungsi login dari AuthContext
      await login(username, password);
      // Jika berhasil (tidak ada error yang dilempar), navigasi ke dashboard
      navigate("/dashboard");
    } catch (err) {
      // --- 2. Jika login gagal, error akan ditangkap di sini ---
      // Pesan error dari API (misal: "User tidak ditemukan") disimpan ke state
      setError(err.message);
    } finally {
      // Hentikan status loading, baik berhasil maupun gagal
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div
        className="hidden lg:flex lg:w-3/5 items-center justify-center p-12 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bg})` }}>
        <div className="absolute inset-0 bg-indigo-900 opacity-70"></div>
        <div className="max-w-md text-center lg:text-left relative z-10">
          <h1 className="text-sm font-bold tracking-widest text-blue-200">
            POLIBAN
          </h1>
          <h2 className="text-5xl font-bold mt-4 leading-tight text-white">
            Selamat Datang
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Sistem Informasi Terpadu (SIMPADU) <br /> Politeknik Negeri
            Banjarmasin
          </p>
        </div>
      </div>

      <div className="w-full lg:w-2/5 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img
              src={Logo}
              alt="Logo Poliban"
              className="w-32 h-32 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800">Masukkan Akun</h2>
            <p className="text-gray-500">Silakan login untuk melanjutkan</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaUser className="text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaLock className="text-gray-400" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember-me"
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="remember-me" className="text-gray-600">
                  Ingat Saya
                </label>
              </div>
              <a
                href="#"
                className="font-semibold text-indigo-600 hover:underline">
                Lupa Password?
              </a>
            </div> */}

            {/* --- 3. Pesan Error Ditampilkan di Sini (di atas tombol login) --- */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-100 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300
                         ${isLoading ? "cursor-not-allowed opacity-75" : ""}`}>
              {isLoading ? "Memproses..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
