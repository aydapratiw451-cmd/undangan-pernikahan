import { supabase } from './supabase.js';

const fairyGate = document.getElementById('fairyGate');
const mainInvitation = document.getElementById('mainInvitation');
const openInvitationBtn = document.getElementById('openInvitationBtn');

const coverNames = document.getElementById('coverNames');
const coverDate = document.getElementById('coverDate');


// ==========================================
// FORMAT TANGGAL
// ==========================================

function formatDate(dateString) {

    if (!dateString) {
        return 'Tanggal Pernikahan';
    }

    const date = new Date(`${dateString}T00:00:00`);

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);
}


// ==========================================
// AMBIL DATA DARI SUPABASE
// ==========================================

async function loadWeddingData() {

    try {

        const { data, error } = await supabase
            .from('wedding')
            .select('*')
            .order('id', {
                ascending: true
            })
            .limit(1)
            .single();


        if (error) {
            throw error;
        }


        console.log('✅ Data wedding:', data);


        const groom =
            data.nama_pria || 'Groom';

        const bride =
            data.nama_wanita || 'Bride';


        // Nama di cover

        coverNames.innerHTML = `
            ${bride}
            <span>&</span>
            ${groom}
        `;


        // Tanggal

        coverDate.textContent =
            formatDate(data.tanggal);

        startCountdown(data.tanggal);


    } catch (error) {

        console.error(
            '❌ Gagal mengambil data wedding:',
            error
        );

        coverNames.innerHTML = `
            Fatihatul
            <span>&</span>
            Gilang
        `;

        coverDate.textContent =
            'Tanggal Pernikahan';
    }
}


// ==========================================
// OPENING FAIRY TALE
// ==========================================

function startFairyOpening() {

    /*
     * =====================================
     * TAHAP 1
     * Gerbang terbuka terlebih dahulu
     * =====================================
     */

    setTimeout(() => {

        fairyGate.classList.add('open');

    }, 1000);


    /*
     * =====================================
     * TAHAP 2
     * Setelah gerbang terbuka,
     * foto mulai zoom
     *
     * CSS foto mulai pada sekitar 2.7 detik
     * =====================================
     */


    /*
     * =====================================
     * TAHAP 3
     * Foto sudah memenuhi layar,
     * kemudian masuk ke cover
     * =====================================
     */

    setTimeout(() => {

        fairyGate.style.display = 'none';

        mainInvitation.classList.add('show');

        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });

    }, 6800);
}

// ==========================================
// BUKA UNDANGAN
// ==========================================

openInvitationBtn.addEventListener('click', () => {

    document.body.classList.add('invitation-open');

});

// ==========================================
// FAIRY FALLING PETALS
// ==========================================

function createFallingPetals() {

    const container =
        document.getElementById(
            'fallingPetals'
        );

    if (!container) return;


    const petalCount =
        window.innerWidth <= 600
            ? 18
            : 30;


    for (
        let i = 0;
        i < petalCount;
        i++
    ) {

        const petal =
            document.createElement('span');

        petal.classList.add(
            'falling-petal'
        );


        // Posisi horizontal random

        petal.style.left =
            Math.random() * 100 + '%';


        // Durasi random

        petal.style.animationDuration =
            (7 + Math.random() * 7) + 's';


        // Delay random

        petal.style.animationDelay =
            (-Math.random() * 12) + 's';


        // Sedikit variasi ukuran

        const scale =
            0.6 + Math.random() * 0.8;

        petal.style.transform =
            `scale(${scale})`;


        container.appendChild(petal);
    }
}

// ==========================================
// COUNTDOWN
// ==========================================

let countdownInterval;

function startCountdown(dateString) {

    if (!dateString) return;

    const targetDate =
        new Date(`${dateString}T00:00:00`).getTime();


    function updateCountdown() {

        const now = new Date().getTime();

        const distance =
            targetDate - now;


        if (distance <= 0) {

            document.getElementById('countDays').textContent = '00';
            document.getElementById('countHours').textContent = '00';
            document.getElementById('countMinutes').textContent = '00';
            document.getElementById('countSeconds').textContent = '00';

            clearInterval(countdownInterval);

            return;
        }


        const days =
            Math.floor(
                distance / (1000 * 60 * 60 * 24)
            );

        const hours =
            Math.floor(
                (distance / (1000 * 60 * 60)) % 24
            );

        const minutes =
            Math.floor(
                (distance / (1000 * 60)) % 60
            );

        const seconds =
            Math.floor(
                (distance / 1000) % 60
            );


        document.getElementById('countDays').textContent =
            String(days).padStart(2, '0');

        document.getElementById('countHours').textContent =
            String(hours).padStart(2, '0');

        document.getElementById('countMinutes').textContent =
            String(minutes).padStart(2, '0');

        document.getElementById('countSeconds').textContent =
            String(seconds).padStart(2, '0');
    }


    updateCountdown();

    countdownInterval =
        setInterval(updateCountdown, 1000);
}

// ==========================================
// COPY NOMOR REKENING
// ==========================================

document.addEventListener('click', async (event) => {

    const button =
        event.target.closest('.copy-account');

    if (!button) return;

    const account =
        button.dataset.account;

    try {

        await navigator.clipboard.writeText(account);

        const originalText =
            button.textContent;

        button.textContent =
            'TERSALIN ✓';

        setTimeout(() => {

            button.textContent =
                originalText;

        }, 1500);

    } catch (error) {

        console.error(
            'Gagal menyalin rekening:',
            error
        );

    }

});

// ==========================================
// UCAPAN - LOAD DATA
// ==========================================

async function loadWishes() {

    const wishList =
        document.getElementById('wishList');

    if (!wishList) return;


    try {

        const {
            data,
            error
        } = await supabase
            .from('ucapan')
            .select(
                'id, nama, kehadiran, ucapan, created_at'
            )
            .order(
                'created_at',
                {
                    ascending: false
                }
            );


        if (error) {
            throw error;
        }


        wishList.innerHTML = '';


        // Belum ada ucapan

        if (!data || data.length === 0) {

            wishList.innerHTML = `
                <div class="wish-empty">
                    <div>✦</div>
                    <p>
                        Belum ada ucapan.
                        Jadilah yang pertama
                        memberikan doa ✨
                    </p>
                </div>
            `;

            return;
        }


        // Tampilkan semua ucapan

        data.forEach(wish => {

            const item =
                document.createElement('article');

            item.className =
                'wish-item';


            item.innerHTML = `
                
                <div class="wish-header">

                    <strong>
                        ${escapeHTML(wish.nama)}
                    </strong>

                    <span class="wish-attendance">
                        ${escapeHTML(
                            wish.kehadiran
                        )}
                    </span>

                </div>

                <p>
                    ${escapeHTML(wish.ucapan)}
                </p>

            `;


            wishList.appendChild(item);

        });


    } catch (error) {

        console.error(
            '❌ Gagal mengambil ucapan:',
            error
        );


        wishList.innerHTML = `
            <div class="wish-error">
                <p>
                    Ucapan belum dapat dimuat.
                </p>
            </div>
        `;

    }

}

// ==========================================
// AMANKAN TEXT UCAPAN
// ==========================================

function escapeHTML(value) {

    const div =
        document.createElement('div');

    div.textContent =
        value ?? '';

    return div.innerHTML;

}

// ==========================================
// UCAPAN - KIRIM
// ==========================================

const wishForm =
    document.getElementById('wishForm');


if (wishForm) {

    wishForm.addEventListener(
        'submit',
        async (event) => {

            event.preventDefault();


            // Ambil input dari form

            const nama =
                document
                    .getElementById('guestName')
                    .value
                    .trim();


            const kehadiran =
                document
                    .getElementById('attendance')
                    .value;


            const ucapan =
                document
                    .getElementById('guestMessage')
                    .value
                    .trim();


            // Validasi

            if (
                !nama ||
                !kehadiran ||
                !ucapan
            ) {

                alert(
                    'Mohon lengkapi semua data.'
                );

                return;
            }


            const button =
                wishForm.querySelector(
                    'button[type="submit"]'
                );


            button.disabled = true;

            button.innerHTML =
                'MENGIRIM...';


            try {

                const {
                    error
                } = await supabase
                    .from('ucapan')
                    .insert({

                        nama: nama,

                        kehadiran:
                            kehadiran,

                        ucapan:
                            ucapan

                    });


                if (error) {
                    throw error;
                }


                // Bersihkan form

                wishForm.reset();


                alert(
                    'Ucapan berhasil dikirim ✨'
                );


                // Muat ulang daftar ucapan

                await loadWishes();


            } catch (error) {

                console.error(
                    '❌ Gagal mengirim ucapan:',
                    error
                );


                alert(
                    'Ucapan gagal dikirim. Cek Console.'
                );


            } finally {

                button.disabled = false;

                button.innerHTML = `
                    <span>✦</span>
                    KIRIM UCAPAN
                    <span>✦</span>
                `;

            }

        }
    );

}

// ==========================================
// GALERI - LIGHTBOX
// ==========================================

const galleryLightbox =
    document.getElementById('galleryLightbox');

const lightboxImage =
    document.getElementById('lightboxImage');

const closeGallery =
    document.getElementById('closeGallery');


document.querySelectorAll('.gallery-photo')
    .forEach(photo => {

        photo.addEventListener('click', () => {

            const image =
                photo.dataset.image;

            lightboxImage.src = image;

            galleryLightbox.classList.add(
                'active'
            );

            document.body.style.overflow =
                'hidden';

        });

    });


function closeLightbox() {

    galleryLightbox.classList.remove(
        'active'
    );

    document.body.style.overflow = '';

}


closeGallery.addEventListener(
    'click',
    closeLightbox
);


galleryLightbox.addEventListener(
    'click',
    event => {

        if (
            event.target ===
            galleryLightbox
        ) {
            closeLightbox();
        }

    }
);


document.addEventListener(
    'keydown',
    event => {

        if (
            event.key === 'Escape'
        ) {
            closeLightbox();
        }

    }
);

// ==========================================
// LIKE GALERI
// ==========================================

document.querySelectorAll('.gallery-item')
    .forEach((item, index) => {

        const button =
            item.querySelector('.gallery-like');

        if (!button) return;


        const countElement =
            button.querySelector('span');


        const storageKey =
            `gallery-like-${index}`;


        let likeData =
            JSON.parse(
                localStorage.getItem(storageKey)
            ) || {
                count: 0,
                liked: false
            };


        function renderLike() {

            countElement.textContent =
                likeData.count;

            button.classList.toggle(
                'liked',
                likeData.liked
            );

            button.firstChild.textContent =
                likeData.liked
                    ? '♥ '
                    : '♡ ';
        }


        renderLike();


        button.addEventListener(
            'click',
            event => {

                event.stopPropagation();


                if (likeData.liked) {

                    likeData.count =
                        Math.max(
                            0,
                            likeData.count - 1
                        );

                    likeData.liked = false;

                } else {

                    likeData.count++;

                    likeData.liked = true;

                }


                localStorage.setItem(
                    storageKey,
                    JSON.stringify(likeData)
                );


                renderLike();

            }
        );

    });

// ==========================================
// START
// ==========================================

async function init() {

    await loadWeddingData();

    createFallingPetals();

    await loadWishes();

    startFairyOpening();

}

init();