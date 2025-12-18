/**
 * CloverVille Website Script
 * Handles loading village data from JSON and updating the UI dynamically.
 * Manages mobile navigation and shared components like progress bars.
 */

// Global variable to store the loaded village data
let villageData = null;

/**
 * Fetches village data from the local 'village.json' file.
 * Returns the parsed JSON object or null if an error occurs.
 */
async function loadVillageData() {
  try {
    const response = await fetch('../village.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    villageData = await response.json();
    console.log('Village data loaded successfully:', villageData);
    return villageData;
  } catch (error) {
    console.error('Error loading village data:', error);
    return null;
  }
}


/**
 * Renders the list of Green Actions into the #green-actions-container.
 * Creates HTML elements for each action dynamically based on loaded data.
 */
function displayGreenActions() {
  const container = document.getElementById('green-actions-container');
  // Check if the container exists and data is available
  if (!container || !villageData || !villageData.greenActions) return;

  // Handle case where array is empty
  if (villageData.greenActions.length === 0) {
    container.innerHTML = '<p class="no-data">No green actions recorded yet.</p>';
    return;
  }

  // Iterate through actions and generate HTML cards
  const actionsHTML = villageData.greenActions.map(action => `
    <div class="green-action-card">
      <div class="action-icon">🌱</div>
      <h3>${action.name || 'Unnamed Action'}</h3>
      <p class="description">${action.description || 'No description'}</p>
      <div class="action-points">
        <span class="points-badge">+${action.points || 0} points</span>
      </div>
    </div>
  `).join('');

  container.innerHTML = actionsHTML;
}

/**
 * Renders the list of Trade Offers into the #trade-offers-container.
 */
function displayTradeOffers() {
  const container = document.getElementById('trade-offers-container');
  if (!container || !villageData || !villageData.tradeOffers) return;

  if (villageData.tradeOffers.length === 0) {
    container.innerHTML = '<p class="no-data">No trade offers available at the moment.</p>';
    return;
  }

  // Create markup for each trade offer
  const offersHTML = villageData.tradeOffers.map(offer => `
    <div class="trade-offer-card">
      <h3>${offer.name || 'Unnamed Offer'}</h3>
      <p class="description">${offer.description || 'No description'}</p>
      <div class="offer-details">
        <p><strong>Points:</strong> ${offer.points || 0}</p>
        <p><strong>Seller:</strong> ${offer.seller || 'N/A'}</p>
      </div>
    </div>
  `).join('');

  container.innerHTML = offersHTML;
}

/**
 * Renders the list of Communal Tasks into the #communal-tasks-container.
 */
function displayCommunalTasks() {
  const container = document.getElementById('communal-tasks-container');
  if (!container || !villageData || !villageData.tasks) return;

  if (villageData.tasks.length === 0) {
    container.innerHTML = '<p class="no-data">No communal tasks available at the moment.</p>';
    return;
  }

  const tasksHTML = villageData.tasks.map(task => `
    <div class="task-card">
      <h3>${task.name || 'Unnamed Task'}</h3>
      <p class="description">${task.description || 'No description'}</p>
      <div class="task-details">
        <p><strong>Points:</strong> ${task.points || 0}</p>
      </div>
    </div>
  `).join('');

  container.innerHTML = tasksHTML;
}

// ---------------------------------------------------------
// Main Initialization
// ---------------------------------------------------------

document.addEventListener("DOMContentLoaded", async () => {
  // Mobile Navigation Toggle Logic
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  // If mobile menu elements exist, attach click listeners
  if (menuToggle && navLinks) {
    // Toggle menu open/close on button click
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      menuToggle.classList.toggle("open");
    });

    // Close menu when any link is clicked
    navLinks.querySelectorAll("a, span").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.classList.remove("open");
      });
    });
  }

  // Attempt to load data from server/file
  await loadVillageData();

  // Update UI elements if data was loaded successfully
  if (villageData) {

    // 1. Update Community Points Progress Bar
    const points = villageData.communityPoints || 0;
    const pointsMax = 5000;
    // Calculate percentage, ensuring it doesn't exceed 100% implicitly dealing with overflow UI
    const progressPercent = Math.min((points / pointsMax) * 100, 100);

    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    if (progressBar && progressText) {
      progressBar.style.width = progressPercent + "%";
      progressText.innerText = `${points} / ${pointsMax} points`;
    }

    // 2. Update CO₂ Savings Pie Chart (Static Example Data)
    const co2Saved = 80; // Example value: 80% saved
    const co2Max = 100;
    const co2Percent = co2Saved / co2Max;
    const co2Degrees = co2Percent * 360; // Convert percentage to degrees for gradient

    const co2Pie = document.querySelector(".co2-pie");
    if (co2Pie) {
      // Use a conic gradient to visually create a pie chart
      co2Pie.style.background = `conic-gradient(
            #00ff37 0deg ${co2Degrees}deg, 
            rgba(10, 57, 2, 0.7) ${co2Degrees}deg 360deg
        )`;
    }

    const co2Text = document.getElementById("co2-text");
    if (co2Text) {
      co2Text.innerText = `${co2Saved}%`;
    }

    // 3. Render Dynamic Content Sections
    displayGreenActions();
    displayTradeOffers();
    displayCommunalTasks();
  }
});
