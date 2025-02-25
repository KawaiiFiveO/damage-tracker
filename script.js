let creatures = [];
let players = [];

function addCreature() {
    const name = document.getElementById('creature-name').value;
    const health = parseInt(document.getElementById('creature-health').value, 10);
    const critical = parseInt(document.getElementById('creature-critical').value, 10);
    const hideHealth = document.getElementById('hide-creature-health').checked;

    if (!name || isNaN(health) || health <= 0 || isNaN(critical) || critical <= 0 || critical > health) {
        alert("Enter valid values (Critical Threshold should be lower than Death Threshold).");
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
        currentHealth: health,
        tempHealth: 0
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

function modifyCreatureHealth(id, type) {
    const inputField = document.getElementById(`damage-${id}`);
    let amount = parseInt(inputField.value, 10);

    if (isNaN(amount) || amount < 0) return;

    const creature = creatures.find(c => c.id === id);
    if (creature) {
        if (type === "increase") {
            creature.maxHealth += amount;
            creature.criticalThreshold += amount;
        } else if (type === "decrease") {
            creature.maxHealth = Math.max(0, creature.maxHealth - amount);
            creature.criticalThreshold = Math.max(0, creature.criticalThreshold - amount);
        }
        inputField.value = '';  
        renderCreatures();
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
                <strong>${creature.name}</strong> - <span class="status ${statusClass}">${statusText}</span>
                <br>
                DT: ${creature.hideHealth ? "???" : creature.maxHealth} - 
                Total Damage: ${creature.damageTaken}
                <br>
                <input type="number" id="damage-${creature.id}" class="hp-input" placeholder="Enter value">
                <br>
                <button onclick="modifyDamage(${creature.id}, 'damage')">Add Damage</button>
                <button onclick="modifyCreatureHealth(${creature.id}, 'increase')">Increase DT/CT (Heal)</button>
                <button class="remove" onclick="removeCreature(${creature.id})">✖</button>
            </div>
        `;
    });
    renderSummary();
}

function modifyPlayerHealth(id, type) {
    const inputField = document.getElementById(`player-hp-${id}`);
    let amount = parseInt(inputField.value, 10);

    if (isNaN(amount) || amount < 0) return;

    const player = players.find(p => p.id === id);
    if (player) {
        if (type === "damage") {
            let temp = player.tempHealth;
            player.tempHealth = Math.max(0, player.tempHealth - amount);
            amount = Math.max(0, amount - temp);
            player.currentHealth = player.currentHealth - amount;
        } else if (type === "heal") {
            player.currentHealth = Math.min(player.maxHealth, player.currentHealth + amount);
        } else if (type === "addtemp") {
            player.tempHealth += amount;
        }
        inputField.value = '';
        renderPlayers();
    }
}

function renderPlayers() {
    const playerList = document.getElementById('player-list');
    playerList.innerHTML = players.map(player => {
        let hpClass = player.currentHealth < 0 ? "negative-hp" : "";
        let tempHPDisplay = player.tempHealth > 0 ? ` + ${player.tempHealth}` : "";
        return `
            <div class="player">
                <strong>${player.name}</strong> - HP: 
                <span class="${hpClass}">${player.currentHealth}</span>/${player.maxHealth}${tempHPDisplay}
                <br>
                <input type="number" id="player-hp-${player.id}" class="heal-input" placeholder="Enter value">
                <br>
                <button class="player" onclick="modifyPlayerHealth(${player.id}, 'damage')">Take Damage</button>
                <button class="player" onclick="modifyPlayerHealth(${player.id}, 'heal')">Add HP (Heal)</button>
                <button class="player" onclick="modifyPlayerHealth(${player.id}, 'addtemp')">Add Temp HP</button>
                <button class="remove" onclick="removePlayer(${player.id})">✖</button>
            </div>
        `;
    }).join('');
    renderSummary();
}


function removePlayer(id) {
    players = players.filter(player => player.id !== id);
    renderPlayers();
}

function removeCreature(id) {
    creatures = creatures.filter(creature => creature.id !== id);
    renderCreatures();
}

function renderSummary() {
    const summaryList = document.getElementById('summary-list');

    let creatureSummary = creatures.map(creature => {
        let statusClass = creature.damageTaken >= creature.maxHealth ? "dead" :
                          creature.damageTaken >= creature.criticalThreshold ? "critical" : "alive";

        let statusText = creature.damageTaken >= creature.maxHealth ? "☠️ Dead" :
                         creature.damageTaken >= creature.criticalThreshold ? "🟠 Critical" : "🟢 Alive";

        return `
            <div class="summary-item">
                <strong>${creature.name}</strong> - <span class="status ${statusClass}">${statusText}</span>
                <br>
				DT: ${creature.hideHealth ? "???" : creature.maxHealth} - 
                Total Damage: ${creature.damageTaken}
            </div>
        `;
    }).join('');

    let playerSummary = players.map(player => {
        let hpClass = player.currentHealth < 0 ? "negative-hp" : "";
        let tempHPDisplay = player.tempHealth > 0 ? ` + ${player.tempHealth}` : "";

        return `
            <div class="summary-item">
                <strong>${player.name}</strong> - HP: 
                <span class="${hpClass}">${player.currentHealth}</span>/${player.maxHealth}${tempHPDisplay}
            </div>
        `;
    }).join('');

    summaryList.innerHTML = `
        <h4>Creatures</h4>
        ${creatures.length ? creatureSummary : "<em>No creatures added.</em>"}
        <h4>Players</h4>
        ${players.length ? playerSummary : "<em>No players added.</em>"}
    `;
}

function toggleSummary() {
    const summaryList = document.getElementById('summary-list');
    const summaryHeader = document.getElementById('summary-header');

    if (summaryList.classList.contains("collapsed")) {
        summaryList.classList.remove("collapsed");
        summaryHeader.innerHTML = "Summary ▲";
    } else {
        summaryList.classList.add("collapsed");
        summaryHeader.innerHTML = "Summary ▼";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    renderSummary();
});

