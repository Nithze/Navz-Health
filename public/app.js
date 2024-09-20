// Fungsi untuk login
async function handleLogin() {
    const name = document.getElementById('name').value;
    const nik = document.getElementById('nik').value;

    const response = await fetch('/users');
    const users = await response.json();
    const user = users.find(user => user.name === name && user.nik === nik);

    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        alert('Nama atau NIK salah!');
    }
}

// Fungsi untuk pengguna baru
async function handleNewUser() {
    const name = document.getElementById('name').value;
    const nik = document.getElementById('nik').value;

    // Memeriksa apakah NIK sudah digunakan
    const response = await fetch('/users');
    const users = await response.json();
    const userExists = users.some(user => user.nik === nik);

    if (userExists) {
        alert('NIK sudah pernah digunakan!');
        return;
    }

    const newUser = { name, nik, notes: [] };

    const createResponse = await fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    });

    if (createResponse.ok) {
        localStorage.setItem('loggedInUser', JSON.stringify(newUser));
        window.location.href = 'dashboard.html';
    } else {
        alert('Error creating new user!');
    }
}




async function addNote() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const temperature = document.getElementById('temperature').value;
    const location = document.getElementById('location').value;

    // Validasi: periksa apakah ada nilai yang kosong
    if (!date || !time || !temperature || !location) {
        alert('Semua field harus diisi!');
        return; // Hentikan eksekusi jika ada field yang kosong
    }

    // Extract AM/PM from the time input
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

    const newNote = { date, time: formattedTime, temperature, location };

    const response = await fetch(`/users/${loggedInUser.nik}/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newNote)
    });

    if (response.ok) {
        loggedInUser.notes.push(newNote);
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        displayNotes();
        resetForm();
        toggleForm();
    } else {
        alert('Error adding note!');
    }
}


// async function addNote() {
//     const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
//     const date = document.getElementById('date').value;
//     const time = document.getElementById('time').value;
//     const ampm = document.getElementById('ampm').value;
//     const temperature = document.getElementById('temperature').value;
//     const location = document.getElementById('location').value;
//
//     // Validasi: periksa apakah ada nilai yang kosong
//     if (!date || !time || !ampm || !temperature || !location) {
//         alert('Semua field harus diisi!');
//         return; // Hentikan eksekusi jika ada field yang kosong
//     }
//
//     const newNote = { date, time, ampm, temperature, location };
//
//     const response = await fetch(`/users/${loggedInUser.nik}/notes`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(newNote)
//     });
//
//     if (response.ok) {
//         loggedInUser.notes.push(newNote);
//         localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
//         displayNotes();
//         resetForm();
//         toggleForm();
//     } else {
//         alert('Error adding note!');
//     }
// }

// Fungsi untuk mereset form setelah catatan ditambahkan
function resetForm() {
    document.getElementById('noteForm').reset();
}




// function displayNotes() {
//     const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
//     const notesDiv = document.getElementById('notes');
//     notesDiv.innerHTML = '';
//     loggedInUser.notes.forEach(note => {
//         const noteDiv = document.createElement('div');
//         noteDiv.className = 'note-card';
//
//         let temperatureColor = '#00ff00'; // Green for normal temperature
//         if (note.temperature >= 37 && note.temperature < 38) {
//             temperatureColor = '#ffff00'; // Yellow for warm temperature
//         } else if (note.temperature >= 38 && note.temperature < 39) {
//             temperatureColor = '#ff8000'; // Orange for hot temperature
//         } else if (note.temperature >= 39) {
//             temperatureColor = '#ff0000'; // Red for very hot temperature
//         }
//
//         noteDiv.innerHTML = `
//             <div class="note-item date">${note.date}</div>
//             <div class="note-item time">${note.time} ${note.ampm}</div>
//             <div class="note-item location">${note.location}</div>
//             <div class="note-item temperature" style="color: ${temperatureColor}">${note.temperature}°C</div>
//         `;
//         notesDiv.appendChild(noteDiv);
//     });
// }

let filterActive = false; // Track the filter state

function toggleFilter() {
    console.log("Filter button clicked"); // Debugging line
    const filterButton = document.querySelector('.filter-btn');
    const filterDate = document.querySelector('.filter-date input').value;

    filterActive = !filterActive;
    filterButton.classList.toggle('active', filterActive);
    filterButton.classList.toggle('inactive', !filterActive);

    if (filterActive) {
        displayNotes(filterDate); // Pass the selected date to displayNotes function
    } else {
        displayNotes(); // Show all notes if filter is inactive
    }
}

async function displayNotes(filterDate = null) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const notesDiv = document.getElementById('notes');
    notesDiv.innerHTML = '';

    const filteredNotes = loggedInUser.notes.filter(note => {
        return !filterDate || note.date === filterDate;
    });

    filteredNotes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note-card';

        let temperatureColor = '#00ff00'; // Green for normal temperature
        if (note.temperature >= 37 && note.temperature < 38) {
            temperatureColor = '#ffff00'; // Yellow for warm temperature
        } else if (note.temperature >= 38 && note.temperature < 39) {
            temperatureColor = '#ff8000'; // Orange for hot temperature
        } else if (note.temperature >= 39) {
            temperatureColor = '#ff0000'; // Red for very hot temperature
        }

        noteDiv.innerHTML = `
            <div class="note-item date">${note.date}</div>
            <div class="note-item time">${note.time}</div>
            <div class="note-item location">${note.location}</div>
            <div class="note-item temperature" style="color: ${temperatureColor}">${note.temperature}°C</div>
        `;
        notesDiv.appendChild(noteDiv);
    });
}

// Attach event listener to the filter button
document.querySelector('.filter-btn').addEventListener('click', toggleFilter);
// Fungsi untuk menampilkan informasi pengguna
function displayUserInfo() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const userInfoDiv = document.getElementById('user-info');
    userInfoDiv.innerHTML = `Nama: ${loggedInUser.name}, NIK: ${loggedInUser.nik}`;
}

// Fungsi untuk menampilkan atau menyembunyikan formulir
function toggleForm() {
    const formContainer = document.getElementById('noteFormContainer');
    formContainer.classList.toggle('hidden');
    if (formContainer.classList.contains('hidden')) {
        resetForm(); // Mereset form jika disembunyikan
    }
}


// Menampilkan informasi pengguna dan catatan saat halaman dashboard dimuat
if (window.location.pathname.endsWith('dashboard.html')) {
    displayUserInfo();
    displayNotes();
}

