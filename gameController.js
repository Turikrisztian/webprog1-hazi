document.addEventListener('DOMContentLoaded', function() {
    // Alap GameController osztály
    class GameController {
        constructor(name, type) {
            this.name = name;
            this.type = type;
            this.isConnected = false;
            this.batteryLevel = 100;
            this.element = null;
            this.logEntries = [];
            
            this.createControllerElement();
        }
        
        createControllerElement() {
            // Controller div létrehozása
            this.element = document.createElement('div');
            this.element.className = 'controller';
            
            // Fejléc
            const header = document.createElement('h2');
            header.textContent = `${this.name} (${this.type})`;
            this.element.appendChild(header);
            
            // Állapot megjelenítése
            this.statusElement = document.createElement('div');
            this.statusElement.className = 'status';
            this.updateStatus();
            this.element.appendChild(this.statusElement);
            
            // Gombok
            const connectBtn = document.createElement('button');
            connectBtn.textContent = 'Connect';
            connectBtn.addEventListener('click', () => this.connect());
            this.element.appendChild(connectBtn);
            
            const disconnectBtn = document.createElement('button');
            disconnectBtn.textContent = 'Disconnect';
            disconnectBtn.addEventListener('click', () => this.disconnect());
            this.element.appendChild(disconnectBtn);
            
            const checkBatteryBtn = document.createElement('button');
            checkBatteryBtn.textContent = 'Check Battery';
            checkBatteryBtn.addEventListener('click', () => this.checkBattery());
            this.element.appendChild(checkBatteryBtn);
            
            // Hozzáadás a DOM-hoz
            document.getElementById('controllersContainer').appendChild(this.element);
        }
        
        connect() {
            this.isConnected = true;
            this.addLogEntry(`${this.name} connected`);
            this.updateStatus();
        }
        
        disconnect() {
            this.isConnected = false;
            this.addLogEntry(`${this.name} disconnected`);
            this.updateStatus();
        }
        
        checkBattery() {
            this.batteryLevel -= 5;
            if (this.batteryLevel < 0) this.batteryLevel = 0;
            this.addLogEntry(`Checked ${this.name} battery: ${this.batteryLevel}%`);
            this.updateStatus();
        }
        
        updateStatus() {
            this.statusElement.innerHTML = `
                <p>Status: ${this.isConnected ? 'Connected' : 'Disconnected'}</p>
                <p>Battery: ${this.batteryLevel}%</p>
            `;
        }
        
        addLogEntry(message) {
            const timestamp = new Date().toLocaleTimeString();
            this.logEntries.push(`${timestamp} - ${message}`);
            this.updateGameLog();
        }
        
        updateGameLog() {
            const logElement = document.getElementById('gameLog');
            logElement.innerHTML = '<h3>Eseménynapló:</h3>';
            
            this.logEntries.forEach(entry => {
                const entryElement = document.createElement('div');
                entryElement.className = 'log-entry';
                entryElement.textContent = entry;
                logElement.appendChild(entryElement);
            });
        }
    }
    
    // Specializált Controller osztály (öröklés)
    class AdvancedGameController extends GameController {
        constructor(name, type, hasVibration) {
            super(name, type); // Szülő osztály konstruktorának hívása
            this.hasVibration = hasVibration;
            this.vibrationLevel = 0;
            
            // Extra funkcionalitás hozzáadása
            this.addAdvancedControls();
        }
        
        addAdvancedControls() {
            // Vibráció vezérlés
            if (this.hasVibration) {
                const vibrationSlider = document.createElement('input');
                vibrationSlider.type = 'range';
                vibrationSlider.min = '0';
                vibrationSlider.max = '100';
                vibrationSlider.value = '0';
                vibrationSlider.addEventListener('input', (e) => {
                    this.vibrationLevel = e.target.value;
                    this.addLogEntry(`${this.name} vibration set to ${this.vibrationLevel}%`);
                });
                this.element.appendChild(vibrationSlider);
                
                const vibrationLabel = document.createElement('p');
                vibrationLabel.textContent = 'Vibration intensity:';
                this.element.insertBefore(vibrationLabel, vibrationSlider);
            }
            
            // Extra gomb
            const specialBtn = document.createElement('button');
            specialBtn.textContent = 'Special Action';
            specialBtn.addEventListener('click', () => this.specialAction());
            this.element.appendChild(specialBtn);
        }
        
        specialAction() {
            this.addLogEntry(`${this.name} performed special action!`);
            if (this.hasVibration) {
                this.addLogEntry(`Vibration activated at ${this.vibrationLevel}%`);
            }
        }
        
        // Felülírt metódus
        checkBattery() {
            super.checkBattery(); // Szülő osztály metódusának hívása
            if (this.hasVibration && this.vibrationLevel > 0) {
                this.batteryLevel -= 2; // Extra battery drain
                this.addLogEntry(`Vibration drains extra battery!`);
                this.updateStatus();
            }
        }
    }
    
    // Controller példányok létrehozása
    const controller1 = new GameController('Basic Controller', 'Standard');
    const controller2 = new AdvancedGameController('Pro Controller', 'Advanced', true);
    const controller3 = new AdvancedGameController('Elite Controller', 'Wireless', false);
    
    // Kezdeti események
    controller1.addLogEntry('Játékvezérlő rendszer inicializálva');
    controller2.addLogEntry('Speciális vezérlők aktiválva');
})
document.addEventListener('DOMContentLoaded', function() {
    // Az osztály definíciók maradnak változatlanok
    
    // Controller példányok létrehozása
    const controller1 = new GameController('Basic Controller', 'Standard');
    const controller2 = new AdvancedGameController('Pro Controller', 'Advanced', true);
    const controller3 = new AdvancedGameController('Elite Controller', 'Wireless', false);
    
    // Kezdeti események
    controller1.addLogEntry('Játékvezérlő rendszer inicializálva');
    controller2.addLogEntry('Speciális vezérlők aktiválva');
    
    // Az oldal tartalmának középre igazítása
    const contentDiv = document.querySelector('.content');
    contentDiv.style.textAlign = 'center';
});