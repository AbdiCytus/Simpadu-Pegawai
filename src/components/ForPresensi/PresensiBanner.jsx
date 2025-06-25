const PresensiBanner = ({
  handleCheckIn,
  isCheckingIn,
  presensiData,
  currentTime,
}) => {
  const currentHour = currentTime.getHours();

  if (presensiData.present) {
    const todayString = new Date().toISOString().split("T")[0];
    const todaysRecord = presensiData.presensi.find(
      (p) => p.tgl === todayString
    );

    if (todaysRecord && todaysRecord.status === "Alfa") {
      return (
        <h1 className="bg-red-700 text-white p-4 rounded-lg text-center text-md lg:text-xl font-bold shadow-lg">
          Anda tidak melakukan presensi hari ini
        </h1>
      );
    }
    return (
      <h1 className="bg-green-700 text-white p-4 rounded-lg text-center text-md lg:text-xl font-bold shadow-lg">
        Anda sudah melakukan presensi hari ini
      </h1>
    );
  }

  if (currentHour < 8) {
    return (
      <button
        disabled
        className="w-full bg-gray-400 text-white p-4 rounded-lg text-center text-2xl font-bold shadow-lg cursor-not-allowed">
        Presensi Masuk
      </button>
    );
  }

  return (
    <button
      onClick={handleCheckIn}
      disabled={isCheckingIn}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center text-2xl font-bold shadow-lg transition-colors">
      {isCheckingIn ? "Memproses..." : "Presensi Masuk"}
    </button>
  );
};

export default PresensiBanner;
