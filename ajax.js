document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'https://example.com/api/data'; // Cseréld le a valódi API URL-re
    
    // Elemek kiválasztása
    const getDataBtn = document.getElementById('getData');
    const createDataBtn = document.getElementById('createData');
    const updateDataBtn = document.getElementById('updateData');
    const deleteDataBtn = document.getElementById('deleteData');
    const getDataForIdBtn = document.getElementById('getDataForId');
    
    const dataOutput = document.getElementById('dataOutput');
    const statsOutput = document.getElementById('statsOutput');
    
    // Eseményfigyelők
    getDataBtn.addEventListener('click', getAllData);
    createDataBtn.addEventListener('click', createData);
    updateDataBtn.addEventListener('click', updateData);
    deleteDataBtn.addEventListener('click', deleteData);
    getDataForIdBtn.addEventListener('click', getDataById);
    
    // Összes adat lekérése
    function getAllData() {
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Hálózati válasz nem megfelelő');
                }
                return response.json();
            })
            .then(data => {
                displayData(data);
                calculateStats(data);
            })
            .catch(error => {
                dataOutput.innerHTML = `<p class="error">Hiba történt: ${error.message}</p>`;
                console.error('Hiba:', error);
            });
    }
    
    // Adatok megjelenítése
    function displayData(data) {
        if (!data || data.length === 0) {
            dataOutput.innerHTML = '<p>Nincsenek elérhető adatok.</p>';
            return;
        }
        
        let html = '<h3>Összes adat:</h3><ul>';
        data.forEach(item => {
            html += `
                <li>
                    ID: ${item.id}, 
                    Kód: ${item.code}, 
                    Név: ${item.name}, 
                    Magasság: ${item.height}
                </li>
            `;
        });
        html += '</ul>';
        
        dataOutput.innerHTML = html;
    }
    
    // Statisztikák számítása
    function calculateStats(data) {
        if (!data || data.length === 0) {
            statsOutput.innerHTML = '';
            return;
        }
        
        const heights = data.map(item => item.height);
        const sum = heights.reduce((a, b) => a + b, 0);
        const avg = sum / heights.length;
        const max = Math.max(...heights);
        
        statsOutput.innerHTML = `
            <h3>Magasság statisztikák:</h3>
            <p>Összeg: ${sum}</p>
            <p>Átlag: ${avg.toFixed(2)}</p>
            <p>Legnagyobb: ${max}</p>
        `;
    }
    
    // Adat létrehozása
    function createData() {
        const code = document.getElementById('createCode').value.trim();
        const name = document.getElementById('createName').value.trim();
        const height = document.getElementById('createHeight').value;
        
        // Validáció
        if (!validateInput('create', code, name, height)) {
            return;
        }
        
        const newData = {
            code,
            name,
            height: parseInt(height)
        };
        
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Hiba a létrehozás során');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('createResult').innerHTML = 
                `<p class="success">Sikeresen létrehozva! ID: ${data.id}</p>`;
            getAllData(); // Frissítjük a listát
        })
        .catch(error => {
            document.getElementById('createResult').innerHTML = 
                `<p class="error">Hiba történt: ${error.message}</p>`;
            console.error('Hiba:', error);
        });
    }
    
    // Adat lekérése ID alapján (update-hez)
    function getDataById() {
        const id = document.getElementById('updateId').value;
        
        if (!id) {
            document.getElementById('updateIdError').textContent = 'Az ID megadása kötelező';
            return;
        }
        document.getElementById('updateIdError').textContent = '';
        
        fetch(`${API_URL}/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Adat nem található');
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('updateCode').value = data.code;
                document.getElementById('updateName').value = data.name;
                document.getElementById('updateHeight').value = data.height;
                document.getElementById('updateResult').innerHTML = '';
            })
            .catch(error => {
                document.getElementById('updateResult').innerHTML = 
                    `<p class="error">Hiba történt: ${error.message}</p>`;
                console.error('Hiba:', error);
            });
    }
    
    // Adat frissítése
    function updateData() {
        const id = document.getElementById('updateId').value;
        const code = document.getElementById('updateCode').value.trim();
        const name = document.getElementById('updateName').value.trim();
        const height = document.getElementById('updateHeight').value;
        
        if (!id) {
            document.getElementById('updateIdError').textContent = 'Az ID megadása kötelező';
            return;
        }
        document.getElementById('updateIdError').textContent = '';
        
        // Validáció
        if (!validateInput('update', code, name, height)) {
            return;
        }
        
        const updatedData = {
            code,
            name,
            height: parseInt(height)
        };
        
        fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Hiba a frissítés során');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('updateResult').innerHTML = 
                `<p class="success">Sikeresen frissítve! ID: ${data.id}</p>`;
            getAllData(); // Frissítjük a listát
        })
        .catch(error => {
            document.getElementById('updateResult').innerHTML = 
                `<p class="error">Hiba történt: ${error.message}</p>`;
            console.error('Hiba:', error);
        });
    }
    
    // Adat törlése
    function deleteData() {
        const id = document.getElementById('deleteId').value;
        
        if (!id) {
            document.getElementById('deleteIdError').textContent = 'Az ID megadása kötelező';
            return;
        }
        document.getElementById('deleteIdError').textContent = '';
        
        if (!confirm(`Biztosan törölni szeretnéd az ID=${id} rekordot?`)) {
            return;
        }
        
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Hiba a törlés során');
            }
            return response.json();
        })
        .then(() => {
            document.getElementById('deleteResult').innerHTML = 
                `<p class="success">Sikeresen törölve! ID: ${id}</p>`;
            getAllData(); // Frissítjük a listát
        })
        .catch(error => {
            document.getElementById('deleteResult').innerHTML = 
                `<p class="error">Hiba történt: ${error.message}</p>`;
            console.error('Hiba:', error);
        });
    }
    
    // Validáció
    function validateInput(type, code, name, height) {
        let isValid = true;
        
        // Minden validációs hibaüzenet törlése
        document.querySelectorAll(`#${type}CodeError, #${type}NameError, #${type}HeightError`)
            .forEach(el => el.textContent = '');
        
        // Kód validáció
        if (!code) {
            document.getElementById(`${type}CodeError`).textContent = 'A kód megadása kötelező';
            isValid = false;
        } else if (code.length > 30) {
            document.getElementById(`${type}CodeError`).textContent = 'A kód maximum 30 karakter lehet';
            isValid = false;
        }
        
        // Név validáció
        if (!name) {
            document.getElementById(`${type}NameError`).textContent = 'A név megadása kötelező';
            isValid = false;
        } else if (name.length > 30) {
            document.getElementById(`${type}NameError`).textContent = 'A név maximum 30 karakter lehet';
            isValid = false;
        }
        
        // Magasság validáció
        if (!height) {
            document.getElementById(`${type}HeightError`).textContent = 'A magasság megadása kötelező';
            isValid = false;
        } else if (isNaN(height)) {
            document.getElementById(`${type}HeightError`).textContent = 'A magasságnak számnak kell lennie';
            isValid = false;
        }
        
        return isValid;
    }
});