let creatures = [];
let players = [];

function addCreature() {
    const name = document.getElementById('creature-name').value;
    const health = parseInt(document.getElementById('creature-health').value, 10);
    const critical = parseInt(document.getElementById('creature-critical').value, 10);
    const hideHealth = document.getElementById('hide-creature-health').checked;

    if (!name || isNaN(health) || health <= 0 || isNaN(critical) || critical <= 0 || critical > health) {
        alert("Enter valid values (Critical HP should be lower than max health).");
        return;
    }

    const creature = {
        id: Date.now(),
        name: name,
        maxHealth: health,
        criticalThreshold: critical,
        damageTaken: 0,
        hideHealth: hideHealth
    };

    creatures.push(creature);
    renderCreatures();
}

function addPlayer() {
    const name = document.getElementById('player-name').value;
    const health = parseInt(document.getElementById('player-health').value, 10);

    if (!name || isNaN(health) || health <= 0) {
        alert("Enter a valid name and health value.");
        return;
    }

    const player = {
        id: Date.now(),
        name: name,
        maxHealth: health,
        currentHealth: health
    };

    players.push(player);
    renderPlayers();
}

function modifyDamage(id, type) {
    const inputField = document.getElementById(`damage-${id}`);
    let amount = parseInt(inputField.value, 10);

    if (isNaN(amount) || amount < 0) return;

    const creature = creatures.find(c => c.id === id);
    if (creature) {
        if (type === "damage") {
            creature.damageTaken += amount;
        } else if (type === "heal") {
            creature.damageTaken = Math.max(0, creature.damageTaken - amount);
        }
        inputField.value = '';  
        renderCreatures();
    }
}

function modifyHealth(id, type) {
    const inputField = document.getElementById(`hp-${id}`);
    let amount = parseInt(inputField.value, 10);

    if (isNaN(amount) || amount < 0) return;

    const player = players.find(p => p.id === id);
    if (player) {
        if (type === "heal") {
            player.currentHealth = Math.min(player.maxHealth, player.currentHealth + amount);
        } else if (type === "damage") {
            player.currentHealth = Math.max(0, player.currentHealth - amount);
        }
        inputField.value = '';  
        renderPlayers();
    }
}

function renderCreatures() {
    const list = document.getElementById('creature-list');
    list.innerHTML = '';

    creatures.forEach(creature => {
        let statusClass = creature.damageTaken >= creature.maxHealth ? "dead" :
                          creature.damageTaken >= creature.criticalThreshold ? "critical" : "alive";
        let statusText = creature.damageTaken >= creature.maxHealth ? "☠️ Dead" :
                         creature.damageTaken >= creature.criticalThreshold ? "🟠 Critical" : "🟢 Alive";

        list.innerHTML += `
            <div class="creature">
                <strong>${creature.name}</strong> - Max HP: ${creature.hideHealth ? "???" : creature.maxHealth}
                <br>
                Damage Taken: ${creature.damageTaken} 
                <span class="status ${statusClass}">${statusText}</span>
                <br>
                <input type="number" id="damage-${creature.id}" class="hp-input" placeholder="Enter value">
                <br>
                <button onclick="modifyDamage(${creature.id}, 'damage')">Add Damage</button>
                <button onclick="modifyDamage(${creature.id}, 'heal')">Subtract Damage</button>
                <button class="remove" onclick="removeCreature(${creature.id})">✖</button>
            </div>
        `;
    });
}

function modifyPlayerHealth(id, type) {
    const inputField = document.getElementById(`player-hp-${id}`);
    let amount = parseInt(inputField.value, 10);

    if (isNaN(amount) || amount < 0) return;

    const player = players.find(p => p.id === id);
    if (player) {
        if (type === "damage") {
            player.currentHealth = Math.max(0, player.currentHealth - amount);
        } else if (type === "heal") {
            player.currentHealth = Math.min(player.maxHealth, player.currentHealth + amount);
        }
        inputField.value = '';  // Clear input after the action
        renderPlayers();
    }
}

function renderPlayers() {
    const playerList = document.getElementById('player-list');
    playerList.innerHTML = players.map(player => `
        <div class="player">
            <strong>${player.name}</strong> - HP: ${player.currentHealth}/${player.maxHealth}
            <br>
            <input type="number" id="player-hp-${player.id}" class="heal-input" placeholder="Enter value">
            <br>
            <button onclick="modifyPlayerHealth(${player.id}, 'damage')">Take Damage</button>
            <button onclick="modifyPlayerHealth(${player.id}, 'heal')">Heal</button>
            <button class="remove" onclick="removePlayer(${player.id})">✖</button>
        </div>
    `).join('');
}

function removePlayer(id) {
    players = players.filter(player => player.id !== id);
    renderPlayers();
}

function removeCreature(id) {
    creatures = creatures.filter(creature => creature.id !== id);
    renderCreatures();
}
