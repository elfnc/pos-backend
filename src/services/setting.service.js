import prisma from "../lib/prisma.js";

// Fungsi untuk mendapatkan setting (Singleton)
export const getSetting = async () => {
  // 1. Coba cari setting pertama
  let setting = await prisma.setting.findFirst();

  // 2. Jika belum ada (pertama kali install), buat default
  if (!setting) {
    setting = await prisma.setting.create({
      data: {
        storeName: 'Toko Saya',
        storeAddress: 'Jl. Contoh No. 1',
        printerWidth: 58
      }
    });
  }

  return setting;
};

// Fungsi update setting
export const updateSetting = async (data) => {
  // Pastikan data setting sudah ada
  const setting = await getSetting();

  // Update data berdasarkan ID yang ditemukan
  return await prisma.setting.update({
    where: { id: setting.id },
    data: data
  });
};