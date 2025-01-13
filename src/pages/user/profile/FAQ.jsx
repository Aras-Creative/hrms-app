import React from "react";
import Layouts from "./Layouts";
import { NavLink } from "react-router-dom";

const FAQ = () => {
  return (
    <Layouts title={"FAQ"} backUrl={"/settings"}>
      <div className="container mx-auto p-6 py-14 bg-white">
        <h1 className="text-2xl font-bold mb-4 text-start">FAQ - Pertanyaan yang Sering Diajukan</h1>

        <h3 className="text-xl font-bold mb-2">1. Apa itu aplikasi Sekantor?</h3>
        <p className="text-lg mb-4">
          Aplikasi Sekantor adalah HRMS (Human Resource Management System) atau sistem manajemen yang digunakan oleh perusahaan untuk mengelola data
          karyawan, penggajian, absensi, dan berbagai fungsi administrasi sumber daya manusia lainnya secara efisien.
        </p>

        <h3 className="text-xl font-bold mb-2">2. Bagaimana cara mendaftar di aplikasi Sekantor?</h3>
        <p className="text-lg mb-4">
          Untuk mendaftar, Anda akan menerima undangan pendaftaran dari perusahaan atau HRD. Ikuti langkah-langkah yang diberikan untuk membuat akun
          dan mulai mengakses aplikasi.
        </p>

        <h3 className="text-xl font-bold mb-2">3. Apakah saya bisa mengubah informasi profil saya setelah mendaftar?</h3>
        <p className="text-lg mb-4">
          Ya, Anda dapat mengubah informasi profil Anda (seperti alamat, nomor telepon, dan lainnya) melalui menu pengaturan profil di aplikasi
          Sekantor.
        </p>

        <h3 className="text-xl font-bold mb-2">4. Bagaimana cara melihat slip gaji saya?</h3>
        <p className="text-lg mb-4">
          Slip gaji Anda akan dikirimkan melalui email yang terdaftar. Pastikan untuk memilih periode gaji yang ingin Anda lihat untuk mendapatkan
          detail lengkap.
        </p>
        <p className="text-lg mb-8">
          Oleh karena itu, pastikan Anda telah melengkapi alamat email Anda dengan benar dan selalu menjaga agar email Anda tetap aktif agar tidak
          ketinggalan informasi penting.
        </p>

        <h3 className="text-xl font-bold mb-2">5. Apakah data saya aman di aplikasi Sekantor?</h3>
        <p className="text-lg mb-4">
          Kami sangat mengutamakan keamanan data Anda. Aplikasi Sekantor dilengkapi dengan sistem enkripsi dan perlindungan keamanan lainnya untuk
          menjaga informasi pribadi Anda tetap aman.
        </p>

        <h3 className="text-xl font-bold mb-2">6. Bagaimana cara mengajukan izin atau cuti melalui aplikasi?</h3>
        <p className="text-lg mb-4">
          Untuk mengajukan izin atau cuti, di halaman utama klik button "Cuti", pilih jenis izin atau cuti yang akan diambil, dan lengkapi formulir
          yang tersedia.
        </p>

        <h3 className="text-xl font-bold mb-2">7. Apakah aplikasi HRMS dapat diakses melalui perangkat mobile?</h3>
        <p className="text-lg mb-4">
          Saat ini, aplikasi HRMS hanya dapat diakses melalui perangkat Android. Pastikan Anda mengunduh aplikasi resmi melalui{" "}
          <NavLink to="https://github.com/aras-creative" target="_blank" className="text-blue-500">
            GitHub Official Aras Creative
          </NavLink>{" "}
          untuk mendapatkan pembaruan terbaru.
        </p>

        <h3 className="text-xl font-bold mb-2">9. Apa yang harus saya lakukan jika menemukan masalah teknis dalam aplikasi?</h3>
        <p className="text-lg mb-4">
          Jika Anda menghadapi masalah teknis, pastikan aplikasi Anda sudah diperbarui ke versi terbaru. Jika masalah masih berlanjut, silakan hubungi
          tim dukungan kami di <strong>arassoftwaredev@gmail.com</strong> untuk bantuan lebih lanjut.
        </p>

        <h3 className="text-xl font-bold mb-2">10. Bagaimana cara menghubungi tim dukungan jika saya membutuhkan bantuan lebih lanjut?</h3>
        <p className="text-lg mb-8">
          Anda dapat menghubungi tim dukungan kami melalui email di <strong>arassoftwaredev@gmail.com</strong> atau menghubungi kami di{" "}
          <strong>+6289660219639</strong> pada jam kerja.
        </p>

        <h2 className="text-2xl font-bold mb-4">Bantuan dan Dukungan</h2>
        <p className="text-lg mb-4">
          Jika Anda membutuhkan bantuan lebih lanjut atau memiliki pertanyaan yang tidak tercakup dalam FAQ ini, berikut adalah beberapa cara untuk
          mendapatkan dukungan:
        </p>

        <ul className="list-inside mb-8">
          <li>
            <strong>Email Dukungan:</strong> arassoftwaredev@gmail.com
          </li>
          <li>
            <strong>Nomor Telepon Dukungan:</strong> +6289660219639
          </li>
        </ul>
      </div>
    </Layouts>
  );
};

export default FAQ;
