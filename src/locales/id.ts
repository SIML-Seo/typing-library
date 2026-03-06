import { defineMessages } from './messages';
import { resultsMessagesEn } from './shared-results';
import { typingMessagesEn } from './shared-typing';

export default defineMessages({
  common: {
    language: 'Bahasa',
    brandName: 'Typing Library',
    brandTagline: 'Mengetik dengan cara menyalin teks apa adanya',
  },
  landing: {
    nav: {
      library: 'Perpustakaan',
      preview: 'Pratinjau',
      principles: 'Prinsip',
      faq: 'FAQ',
    },
    hero: {
      eyebrow: 'Public-domain literature · typing as transcription',
      title: 'Baca karya sastra domain publik lalu ketik ulang persis seperti aslinya.',
      description:
        'Typing Library adalah aplikasi mengetik bergaya penyalinan, tempat ritme membaca dan ritme mengetik bertemu di satu layar. Teks asli tetap terlihat dalam warna abu-abu, input pengguna menimpanya, dan salah ketik langsung terlihat tanpa menghentikan proses.',
      primaryAction: 'Jelajahi karya',
      secondaryAction: 'Lihat prinsip biaya nol',
    },
    facts: {
      principleLabel: 'Prinsip MVP',
      principleValue: 'Tanpa login · simpan lokal',
      worksLabel: 'Karya publik',
      worksValue: 'works origin terpisah',
      typoLabel: 'Umpan balik typo',
      typoValue: 'Sorot langsung · tidak menghambat',
    },
    preview: {
      eyebrow: 'Typing Preview',
      title: 'Input muncul langsung di atas teks asli',
      chunkBadge: 'Per paragraf',
      paragraphLabel: 'paragraph 03',
      ghostText:
        'Seiring waktu, kesedihan akan menjadi lebih tumpul. Suatu hari nanti, saat rasa sedih itu berlalu, mungkin kamu akan senang pernah mengenalku.',
      typedPrefix: 'Seiring waktu, kesedihan akan menjadi',
      typedError: ' le',
      typedSuffix:
        'bih keras. Suatu hari nanti, saat rasa sedih itu berlalu, mungkin kamu akan senang pernah mengenalku.',
      accuracyLabel: 'Akurasi',
      accuracyValue: '97.4%',
      speedLabel: 'Kecepatan',
      speedValue: '312 CPM',
      typoCountLabel: 'Typo',
      typoCountValue: '1 di paragraf ini',
      noteRuleLabel: 'Aturan input',
      noteRuleBody: 'Spasi, jeda baris, tanda baca, dan huruf besar mengikuti teks asli',
      noteResumeLabel: 'Lanjutkan sesi',
      noteResumeBody: 'Pulihkan posisi dan input yang sama setelah refresh',
    },
    principles: {
      eyebrow: 'MVP principles',
      title: 'Tetapkan pengalaman menyalin dan aturan operasi secara bersamaan',
      description:
        'Proyek ini memberi prioritas yang sama pada kualitas UX mengetik dan kemampuan untuk beroperasi sepenuhnya gratis.',
      item1Title: 'Menilai persis berdasarkan teks asli',
      item1Body:
        'Spasi, jeda baris, dan tanda baca dibandingkan dengan sumber, dan typo hanya ditampilkan dengan warna merah.',
      item2Title: 'Jangan menghentikan progres',
      item2Body:
        'Meski ada typo, pengguna tetap bisa lanjut mengetik. Saat paragraf selesai, kesalahan pada paragraf itu bisa ditinjau kembali.',
      item3Title: 'Tanpa login · simpan lokal',
      item3Body:
        'Hasil, karya pribadi, dan draft lanjutkan sesi tetap tersimpan di perangkat ini. MVP tidak membuat penulisan ke server.',
      item4Title: 'Karya publik + karya pribadi',
      item4Body:
        'Pengguna dapat menyalin karya sastra domain publik atau teks sendiri yang ditambahkan lewat tempel atau upload `.txt` dengan mesin yang sama.',
    },
    flow: {
      eyebrow: 'Flow',
      title: 'Pengguna hanya melewati alur yang singkat dan jelas',
      description: 'Dari memilih karya sampai menyimpan hasil, tidak ada login wajib maupun penyimpanan server di tengah jalan.',
      step1: 'Pilih karya',
      step2: 'Ketik langsung di atas teks abu-abu',
      step3: 'Tinjau typo per paragraf lalu lanjutkan',
      step4: 'Simpan akurasi, WPM, dan waktu secara lokal saat selesai',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Aturan yang sudah dikunci sebelum implementasi',
      description: 'Jawaban utama ditetapkan lebih awal agar arah produk tidak berubah saat dibangun.',
      item1Question: 'Mengapa mulai tanpa login?',
      item1Answer:
        'Karena MVP memprioritaskan operasi gratis dan akses cepat. Catatan serta karya pribadi disimpan lokal terlebih dahulu agar tidak menimbulkan biaya server.',
      item2Question: 'Apakah mengetik berhenti saat saya salah?',
      item2Answer:
        'Tidak. Karakter yang salah hanya ditandai merah, tetapi input tetap berjalan. Di akhir paragraf, ringkasan typo ditampilkan lagi.',
      item3Question: 'Apakah spasi dan jeda baris juga harus sama?',
      item3Answer:
        'Ya. Inti produk ini adalah menyalin teks persis, jadi spasi, jeda baris, dan tanda baca harus cocok dengan aslinya.',
      item4Question: 'Dari mana karya publik diambil?',
      item4Answer:
        'Karya dibaca sebagai file statis dari works origin yang terpisah, sehingga katalog bisa diperbarui tanpa redeploy aplikasi.',
      item5Question: 'Bagaimana biaya operasi tetap nol?',
      item5Answer:
        'Hosting statis, penyimpanan lokal, deploy karya yang dipisah, cache yang ketat, dan tanpa penulisan server adalah aturan intinya.',
    },
    footer: {
      eyebrow: 'Typing Library',
      title: 'Alat transkripsi yang tidak memisahkan membaca dan mengetik',
      description:
        'Karya publik hanya menyajikan teks yang sudah domain publik, dan data pengguna tetap lokal. Tautan kontak dan kebijakan akan dihubungkan saat peluncuran.',
      library: 'Perpustakaan',
      preview: 'Pratinjau',
      principles: 'Prinsip',
      faq: 'FAQ',
    },
  },
  library: {
    badge: {
      preview: 'Katalog pratinjau',
      worksOrigin: 'Works origin terhubung',
    },
    header: {
      eyebrow: 'Works Library',
      title: 'Titik masuk untuk karya publik dan karya lokal',
      back: 'Kembali ke landing',
    },
    metrics: {
      publicWorksLabel: 'Karya publik',
      publicWorksDescription: 'Berdasarkan katalog publik yang dimuat dari works origin',
      myWorksLabel: 'Karya saya',
      myWorksPending: 'Memeriksa',
      myWorksError: 'Galat',
      myWorksDescription: 'Jumlah karya pribadi yang tersimpan di IndexedDB perangkat ini',
      modeLabel: 'Mode saat ini',
      liveMode: 'Data nyata',
      previewMode: 'Pratinjau',
      liveDescription: 'Terhubung ke works origin yang terpisah',
      previewDescription: 'Menggunakan katalog contoh saat works origin belum dikonfigurasi',
    },
    catalog: {
      eyebrow: 'Public domain catalog',
      title: 'Pilih karya dulu, lalu masuk ke layar mengetik',
      description:
        'Pada tahap ini koneksi works origin dan lapisan data lokal dipasang lebih dulu. Langkah berikutnya adalah menghubungkan karya terpilih ke layar mengetik per paragraf.',
      searchLabel: 'Search',
      searchPlaceholder: 'Cari berdasarkan judul, penulis, atau bahasa',
      previewWarning:
        'NEXT_PUBLIC_WORKS_BASE_URL belum disetel, jadi layar ini menampilkan katalog contoh. Gunakan untuk memeriksa UI dan alur sebelum menghubungkan karya nyata.',
      unknownLanguage: 'unknown',
      multipart: 'Karya multi-bagian',
      singleFile: 'File tunggal',
      authorFallback: 'Tidak ada info penulis',
      sourcePending: 'source pending',
      select: 'Pilih',
      noResults: 'Tidak ada karya yang cocok. Periksa kembali judul atau nama penulis.',
      partsSuffix: 'parts',
      singleBadge: 'single',
    },
    selection: {
      eyebrow: 'Selection',
      noSelection: 'Pilih satu karya dari daftar di kiri untuk melihat detailnya di sini.',
      languageLabel: 'Bahasa',
      languageFallback: 'Tidak disebutkan',
      pathLabel: 'Path teks',
      sourceLabel: 'Sumber',
      sourceFallback: 'Akan ditambahkan ke works catalog',
      nextLabel: 'Koneksi berikutnya',
      nextDescription:
        'Langkah berikutnya adalah menghubungkan karya terpilih ke rute mengetik per paragraf /typing/[workId]. Untuk saat ini, yang dikunci lebih dulu adalah alur pemilihan dan batas data.',
    },
    side: {
      worksOriginLabel: 'Works origin',
      worksOriginUnset:
        'Belum terhubung. Atur NEXT_PUBLIC_WORKS_BASE_URL untuk membaca katalog yang sebenarnya.',
      worksOriginCurrent: 'Endpoint saat ini: {url}',
      localFirstLabel: 'Local first',
      localFirstDescription:
        'Karya pribadi, hasil, dan draft menggunakan IndexedDB sebagai sumber kebenaran. Store di memori hanya dipakai untuk status UI sementara.',
    },
  },
  results: resultsMessagesEn,
  typing: typingMessagesEn,
} as const);
