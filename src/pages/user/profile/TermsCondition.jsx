import React from "react";
import Layouts from "./Layouts";

const TermsCondition = () => {
  return (
    <Layouts title={"Syarat dan Ketentuan"} backUrl={"/settings"}>
      <div className="container mx-auto p-6 py-14 bg-white">
        <h1 className="text-2xl font-bold mb-4 text-start">Syarat dan Ketentuan Aplikasi HRMS Sekantor by Aras Creative</h1>
        <p className="text-lg mb-4">
          <strong className="text-gray-600">Tanggal Berlaku:</strong>{" "}
          {new Date("2025-01-13").toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          })}
        </p>

        <p className="text-lg mb-8">
          Selamat datang di aplikasi HRMS <strong className="text-gray-600">Sekantor by Aras Creative</strong>. Dengan mengakses atau menggunakan
          aplikasi ini, Anda setuju untuk mematuhi syarat dan ketentuan berikut. Harap baca dengan seksama.
        </p>

        <h3 className="text-2xl font-bold mb-2">1. Penerimaan Syarat dan Ketentuan</h3>
        <p className="text-lg mb-8">
          Dengan menggunakan aplikasi HRMS ini (selanjutnya disebut "Aplikasi"), Anda menyetujui dan terikat oleh syarat dan ketentuan ini. Jika Anda
          tidak setuju dengan syarat dan ketentuan ini, harap hentikan penggunaan aplikasi kami.
        </p>

        <h3 className="text-2xl font-bold mb-2">2. Penggunaan Aplikasi</h3>
        <p className="text-lg mb-4">
          Aplikasi ini disediakan untuk penggunaan internal perusahaan dalam rangka pengelolaan sumber daya manusia, termasuk namun tidak terbatas
          pada data karyawan, penggajian, absensi, dan manajemen lainnya.
        </p>
        <ul className="list-disc pl-4 mb-8">
          <li>Anda hanya diperbolehkan menggunakan Aplikasi untuk tujuan yang sah dan sesuai dengan peraturan yang berlaku.</li>
          <li>
            Anda setuju untuk tidak menggunakan Aplikasi untuk kegiatan yang dapat merusak, mengganggu, atau merusak integritas sistem Aplikasi.
          </li>
          <li>
            Anda bertanggung jawab untuk menjaga kerahasiaan akun dan informasi login Anda serta untuk melaporkan segera jika ada aktivitas yang
            mencurigakan pada akun Anda.
          </li>
        </ul>

        <h3 className="text-2xl font-bold mb-2">3. Pendaftaran dan Akun Pengguna</h3>
        <ul className="list-disc pl-4 mb-8">
          <li>Untuk menggunakan Aplikasi, Anda harus mendaftar dengan informasi yang akurat dan lengkap.</li>
          <li>Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda, termasuk nama pengguna dan kata sandi.</li>
          <li>Anda setuju untuk memberi tahu kami segera jika terjadi pelanggaran keamanan atau penggunaan yang tidak sah terhadap akun Anda.</li>
        </ul>

        <h3 className="text-2xl font-bold mb-2">4. Kewajiban Pengguna</h3>
        <ul className="list-disc pl-4 mb-8">
          <li>Anda wajib memastikan bahwa semua data yang Anda masukkan dalam Aplikasi adalah akurat dan terkini.</li>
          <li>
            Anda tidak diperbolehkan untuk:
            <ul className="list-inside">
              <li>Menyalahgunakan Aplikasi untuk tujuan yang melanggar hukum atau melanggar hak orang lain.</li>
              <li>
                Mendistribusikan, menyalin, menduplikasi, menjual, atau mengeksploitasi bagian mana pun dari Aplikasi tanpa izin tertulis dari [Nama
                Perusahaan].
              </li>
              <li>Menggunakan Aplikasi untuk tujuan yang tidak sah atau tidak sah secara hukum.</li>
            </ul>
          </li>
        </ul>

        <h3 className="text-2xl font-bold mb-2">5. Pembaruan Aplikasi</h3>
        <p className="text-lg mb-8">
          Kami berhak untuk mengubah atau memperbarui Aplikasi dan fitur-fiturnya kapan saja, tanpa pemberitahuan terlebih dahulu. Kami tidak
          bertanggung jawab atas gangguan atau ketidaktersediaan sementara atau permanen dari Aplikasi.
        </p>

        <h3 className="text-2xl font-bold mb-2">6. Pembatasan Tanggung Jawab</h3>
        <ul className="list-disc pl-4 mb-8">
          <li>
            Aplikasi ini disediakan "sebagaimana adanya" dan "sebagaimana tersedia". Kami tidak memberikan jaminan atau pernyataan apapun mengenai
            ketersediaan, keamanan, atau kualitas aplikasi ini.
          </li>
          <li>
            Kami tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, khusus, atau konsekuensial yang timbul akibat penggunaan
            atau ketidakmampuan untuk menggunakan Aplikasi.
          </li>
        </ul>

        <h3 className="text-2xl font-bold mb-2">7. Hak Kekayaan Intelektual</h3>
        <p className="text-lg mb-8">
          Semua hak cipta, merek dagang, dan hak kekayaan intelektual lainnya yang terkait dengan Aplikasi dan konten yang ada di dalamnya adalah
          milik CV ARAS CREATIVE atau pemegang hak yang sah. Anda tidak diperbolehkan untuk menggunakan, menyalin, mendistribusikan, atau memodifikasi
          materi dari Aplikasi tanpa izin tertulis dari kami.
        </p>

        <h3 className="text-2xl font-bold mb-2">8. Pengakhiran</h3>
        <p className="text-lg mb-8">
          Kami berhak untuk menangguhkan atau menghentikan akses Anda ke Aplikasi jika Anda melanggar syarat dan ketentuan ini, atau jika kami merasa
          perlu untuk melakukannya demi kepentingan sistem kami atau pengguna lainnya.
        </p>

        <h3 className="text-2xl font-bold mb-2">9. Perubahan Syarat dan Ketentuan</h3>
        <p className="text-lg mb-8">
          Kami berhak untuk mengubah, memodifikasi, atau memperbarui syarat dan ketentuan ini kapan saja. Setiap perubahan akan diumumkan melalui
          Aplikasi atau situs web kami dengan pembaruan tanggal berlaku. Penggunaan Anda yang berkelanjutan atas Aplikasi setelah perubahan syarat dan
          ketentuan ini berarti Anda menerima perubahan tersebut.
        </p>

        <h3 className="text-2xl font-bold mb-2">10. Hukum yang Berlaku</h3>
        <p className="text-lg mb-8">
          Syarat dan ketentuan ini diatur oleh dan akan ditafsirkan sesuai dengan hukum yang berlaku di Indonesia. Setiap perselisihan yang timbul
          dari penggunaan Aplikasi akan diselesaikan di pengadilan yang memiliki yurisdiksi di wilayah tersebut.
        </p>
      </div>
    </Layouts>
  );
};

export default TermsCondition;
