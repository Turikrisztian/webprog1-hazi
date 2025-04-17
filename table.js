document.addEventListener('DOMContentLoaded', function() {
    // Kezdeti adatok
    let data = [
        { id: 1, name: "Kovács János", email: "kovacs.janos@example.com", age: 32, status: "Aktív" },
        { id: 2, name: "Nagy Eszter", email: "eszter.nagy@example.com", age: 28, status: "Aktív" },
        { id: 3, name: "Tóth Béla", email: "toth.bela@example.com", age: 45, status: "Inaktív" },
        { id: 4, name: "Szabó Anna", email: "szabo.anna@example.com", age: 22, status: "Felfüggesztve" }
    ];

    // DOM elemek
    const tableBody = document.getElementById('tableBody');
    const dataForm = document.getElementById('dataForm');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resetBtn = document.getElementById('resetBtn');
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const editId = document.getElementById('editId');
    const sortableHeaders = document.querySelectorAll('.sortable');

    // Változók
    let currentSortColumn = null;
    let sortDirection = 1; // 1: növekvő, -1: csökkenő
    let filteredData = [...data];

    // Táblázat feltöltése
    function renderTable(dataToRender) {
        tableBody.innerHTML = '';
        
        dataToRender.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.age}</td>
                <td>${item.status}</td>
                <td class="action-buttons">
                    <button class="edit-btn" data-id="${item.id}">Szerkesztés</button>
                    <button class="delete-btn" data-id="${item.id}">Törlés</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Eseményfigyelők hozzáadása
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEdit);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
    }

    // Űrlap reset
    function resetForm() {
        dataForm.reset();
        editId.value = '';
        formTitle.textContent = 'Új elem hozzáadása';
        submitBtn.textContent = 'Mentés';
        clearErrors();
    }

    // Validációs hibák törlése
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
    }

    // Validáció
    function validateForm() {
        let isValid = true;
        clearErrors();

        // Név validáció
        const name = document.getElementById('name').value.trim();
        if (!name) {
            document.getElementById('nameError').textContent = 'A név megadása kötelező';
            isValid = false;
        } else if (name.length < 2) {
            document.getElementById('nameError').textContent = 'A névnek legalább 2 karakter hosszúnak kell lennie';
            isValid = false;
        }

        // Email validáció
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            document.getElementById('emailError').textContent = 'Az email megadása kötelező';
            isValid = false;
        } else if (!emailRegex.test(email)) {
            document.getElementById('emailError').textContent = 'Érvényes email címet adjon meg';
            isValid = false;
        }

        // Életkor validáció
        const age = document.getElementById('age').value;
        if (!age) {
            document.getElementById('ageError').textContent = 'Az életkor megadása kötelező';
            isValid = false;
        } else if (age < 18 || age > 120) {
            document.getElementById('ageError').textContent = 'Az életkornak 18 és 120 között kell lennie';
            isValid = false;
        }

        return isValid;
    }

    // Új elem létrehozása vagy meglévő frissítése
    function handleSubmit(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const formData = {
            id: editId.value ? parseInt(editId.value) : Date.now(),
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            age: parseInt(document.getElementById('age').value),
            status: document.getElementById('status').value
        };

        if (editId.value) {
            // Frissítés
            const index = data.findIndex(item => item.id === parseInt(editId.value));
            if (index !== -1) {
                data[index] = formData;
            }
        } else {
            // Új elem
            data.push(formData);
        }

        // Szűrés frissítése és táblázat újrarajzolása
        applyFilters();
        resetForm();
    }

    // Szerkesztés
    function handleEdit(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        const item = data.find(item => item.id === id);
        
        if (item) {
            document.getElementById('name').value = item.name;
            document.getElementById('email').value = item.email;
            document.getElementById('age').value = item.age;
            document.getElementById('status').value = item.status;
            editId.value = item.id;
            
            formTitle.textContent = 'Elem szerkesztése';
            submitBtn.textContent = 'Frissítés';
        }
    }

    // Törlés
    function handleDelete(e) {
        if (confirm('Biztosan törölni szeretné ezt az elemet?')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            data = data.filter(item => item.id !== id);
            applyFilters();
            
            if (editId.value && parseInt(editId.value) === id) {
                resetForm();
            }
        }
    }

    // Szűrés alkalmazása
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        
        if (searchTerm) {
            filteredData = data.filter(item => 
                item.name.toLowerCase().includes(searchTerm) ||
                item.email.toLowerCase().includes(searchTerm) ||
                item.age.toString().includes(searchTerm) ||
                item.status.toLowerCase().includes(searchTerm)
            );
        } else {
            filteredData = [...data];
        }
        
        // Rendezés alkalmazása, ha van
        if (currentSortColumn) {
            sortData(currentSortColumn, sortDirection);
        } else {
            renderTable(filteredData);
        }
    }

    // Rendezés
    function sortData(column, direction) {
        filteredData.sort((a, b) => {
            let valueA = a[column];
            let valueB = b[column];
            
            // Számok esetén
            if (column === 'age') {
                return (valueA - valueB) * direction;
            }
            
            // Szöveg esetén
            if (typeof valueA === 'string') valueA = valueA.toLowerCase();
            if (typeof valueB === 'string') valueB = valueB.toLowerCase();
            
            if (valueA < valueB) return -1 * direction;
            if (valueA > valueB) return 1 * direction;
            return 0;
        });
        
        renderTable(filteredData);
        updateSortIcons(column, direction);
    }

    // Rendezés ikonok frissítése
    function updateSortIcons(column, direction) {
        sortableHeaders.forEach(header => {
            const icon = header.querySelector('.sort-icon');
            if (header.getAttribute('data-column') === column) {
                icon.textContent = direction === 1 ? '↑' : '↓';
            } else {
                icon.textContent = '↑↓';
            }
        });
    }

    // Eseményfigyelők
    dataForm.addEventListener('submit', handleSubmit);
    cancelBtn.addEventListener('click', resetForm);
    searchBtn.addEventListener('click', applyFilters);
    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        applyFilters();
    });
    
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });

    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-column');
            
            if (currentSortColumn === column) {
                sortDirection *= -1; // Megfordítjuk a rendezési irányt
            } else {
                currentSortColumn = column;
                sortDirection = 1; // Alapértelmezett növekvő rendezés
            }
            
            sortData(column, sortDirection);
        });
    });

    // Kezdeti renderelés
    renderTable(data);
});