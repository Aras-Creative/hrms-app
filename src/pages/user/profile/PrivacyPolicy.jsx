import React from "react";
import Layouts from "./Layouts";

const PrivacyPolicy = () => {
  return (
    <Layouts title={"Kebijakan Privasi"} backUrl={"/settings"}>
      <div className="container mx-auto p-6 py-14 bg-white">
        <h1 className="text-2xl font-bold mb-4 text-start">Kebijakan Privasi Aplikasi Sekantor by Aras Creative</h1>
        <p className="text-lg mb-4">
          <strong className="text-gray-600">Tanggal Berlaku:</strong>{" "}
          {new Date("2025-01-13").toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          })}
        </p>

        <p className="text-lg mb-8">
          Kami di <strong className="text-gray-600">CV ARAS CREATIVE</strong> berkomitmen untuk melindungi privasi Anda. Kebijakan Privasi ini
          menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi yang Anda berikan saat menggunakan
          aplikasi HRMS (Human Resource Management System) kami. Dengan menggunakan aplikasi kami, Anda menyetujui kebijakan ini.
        </p>

        <h3 className="text-2xl font-bold mb-2">1. Informasi yang Kami Kumpulkan</h3>
        <p className="text-lg mb-4">
          Kami mengumpulkan informasi pribadi yang Anda berikan saat mendaftar, menggunakan, atau berinteraksi dengan aplikasi kami. Jenis informasi
          yang kami kumpulkan meliputi:
        </p>
        <ul className="list-disc pl-4 mb-8">
          <li>Nama lengkap</li>
          <li>Alamat email</li>
          <li>Nomor telepon</li>
          <li>Data pekerjaan (posisi, departemen, tanggal bergabung, dll)</li>
          <li>Data penggajian (gaji, tunjangan, potongan)</li>
          <li>Riwayat pekerjaan</li>
          <li>Informasi lainnya yang relevan untuk manajemen sumber daya manusia</li>
        </ul>

        <h3 className="text-2xl font-bold mb-2">2. Penggunaan Informasi</h3>
        <p className="text-lg mb-4">Informasi yang kami kumpulkan digunakan untuk tujuan berikut:</p>
        <ul className="list-disc pl-4 mb-8">
          <li>Mengelola akun pengguna dan akses ke aplikasi</li>
          <li>Mengelola data karyawan dan administrasi HR</li>
          <li>Mengelola penggajian dan tunjangan</li>
          <li>Memberikan dukungan pelanggan dan layanan terkait</li>
          <li>Meningkatkan pengalaman pengguna dan fungsionalitas aplikasi</li>
          <li>Memenuhi kewajiban hukum atau peraturan yang berlaku</li>
        </ul>

        <h3 className="text-2xl font-bold mb-2">3. Penyimpanan dan Keamanan Data</h3>
        <p className="text-lg mb-8">
          Kami berkomitmen untuk menjaga keamanan informasi pribadi Anda. Data pribadi yang kami kumpulkan disimpan di server yang aman dan hanya
          dapat diakses oleh personel yang berwenang. Kami menggunakan teknologi enkripsi dan prosedur keamanan lainnya untuk melindungi data Anda
          dari akses yang tidak sah, perubahan, atau pengungkapan.
        </p>

        <h3 className="text-2xl font-bold mb-2">4. Pembagian Informasi</h3>
        <p className="text-lg mb-4">Kami tidak akan membagikan informasi pribadi Anda kepada pihak ketiga kecuali:</p>
        <ul className="list-disc pl-4 mb-8">
          <li>Jika diperlukan untuk memenuhi kewajiban hukum atau peraturan yang berlaku.</li>
          <li>
            Untuk memberikan layanan atau dukungan kepada Anda, melalui pihak ketiga yang telah kami pilih dan yang berkomitmen untuk menjaga
            kerahasiaan data Anda.
          </li>
          <li>Jika kami memperoleh persetujuan Anda untuk membagikan informasi tersebut.</li>
        </ul>

        <h3 className="text-2xl font-bold mb-2">5. Hak Anda</h3>
        <p className="text-lg mb-4">Sebagai pengguna, Anda memiliki hak untuk:</p>
        <ul className="list-disc pl-4 mb-8">
          <li>Mengakses, memperbaiki, atau memperbarui informasi pribadi yang kami simpan.</li>
          <li>Menghapus data pribadi Anda (dengan syarat tidak ada kewajiban hukum atau kontraktual yang menghalangi).</li>
          <li>Menghentikan penggunaan data Anda untuk tujuan tertentu dengan menghubungi kami.</li>
        </ul>
        <p className="text-lg mb-8">
          Jika Anda ingin mengakses atau mengubah informasi pribadi Anda, atau memiliki pertanyaan tentang kebijakan privasi ini, Anda dapat
          menghubungi kami di <strong>arassoftwaredev@gmail.com</strong>.
        </p>

        <h3 className="text-2xl font-bold mb-2">6. Perubahan Kebijakan Privasi</h3>
        <p className="text-lg mb-8">
          Kami berhak untuk mengubah kebijakan privasi ini dari waktu ke waktu. Setiap perubahan akan diumumkan melalui aplikasi atau situs web kami
          dengan pembaruan tanggal berlaku. Kami menyarankan Anda untuk memeriksa kebijakan privasi ini secara berkala agar Anda tetap mengetahui
          perubahan-perubahan yang terjadi.
        </p>

        <h3 className="text-2xl font-bold mb-2">7. Kontak Kami</h3>
        <p className="text-lg mb-4">
          Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini atau bagaimana kami mengelola data pribadi Anda, silakan hubungi kami di{" "}
          <strong>arassoftwaredev@gmail.com</strong>.
        </p>
      </div>
    </Layouts>
  );
};

export default PrivacyPolicy;
