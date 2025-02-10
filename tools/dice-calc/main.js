let tableRows = [];

/**
 * Recursively consumes tableRows and adds rows to the table.
 * Uses requestAnimationFrame to avoid blocking the UI.
 * @param {HTMLTableElement} table - The table element to update.
 */
function consumeTable(table) {
    // If there are no rows to process, schedule the function to run again
    if(tableRows.length == 0) {
        requestAnimationFrame(()=>consumeTable(table));
        return;
    }

    // Get the last row data from the array
    let data = tableRows.pop();
    // Insert a new row into the table
    let row = table.insertRow();
    // Create 5 cells in the row and populate them with data
    let cells = Array(5).fill(0).map((_, i) => row.insertCell(i));
    cells.forEach((c, i)=>{
        c.innerHTML = data[i];
    });
    // Schedule the next row insertion to avoid blocking the UI
    requestAnimationFrame(()=>consumeTable(table));
}

/**
 * Updates the probability table based on form inputs.
 * Calculates probabilities for different dice combinations.
 */
function update() {
    let form = document.forms[0];
    if(!form.checkValidity()) return;

    // Define available dice sizes
    let sizes = [2, 4, 6, 8, 10, 12, 20, 100];
    // Store dice input values
    let dice = [];
    for (let s of sizes) {
        dice.push({ count: +form["d" + s].value, faces: +s });
    }

    // Get selected probability calculation mode
    let mode = form.querySelector("[name='mode']:checked").id;

    // Probability distribution, initialized with a single outcome (sum of 0)
    let probs = { 0: 1 };

    // Iterate through each dice type
    for (let d of dice) {
        // Roll the dice the specified number of times
        for (let _ = 0; _ < d.count; _++) {
            let newProbs = {};

            // Update probability distribution
            for (let [n, p] of Object.entries(probs)) {
                n = +n;
                for (let f = 1; f <= d.faces; f++) {
                    let v = f;
                    // If "count ones" mode is selected, only count 1s
                    if(mode == "countones" && f != 1) v = 0;
                    // Define a probability of zero for the new value if it doesn't exist
                    newProbs[n + v] ??= 0;
                    // Increase the probability of the current value plus the roll
                    newProbs[n + v] += p / d.faces;
                }
            }
            probs = newProbs;
        }
    }

    console.log(probs);

    // Ensure total probability is close to 1 (sanity check)
    let totalProb = Object.values(probs).reduce((a, x) => a + x, 0)
    console.log("This should be close to one: " + totalProb);

    // Determine probability summation mode
    let roll = form.querySelector("[name='sum']:checked").id;
    let sum = null;
    if(roll == "atleast") sum = 1;
    else if(roll == "atmost") sum = 0;

    // Adjust probabilities based on selected summation mode
    if(sum != null) {
        for (let [n, p] of Object.entries(probs)) {
            if(roll == "atleast") {
                probs[n] = sum;
                sum -= p;
            }
            else if(roll == "atmost") {
                sum += p;
                probs[n] = sum;
            }
        }
    }

    // Update table content
    let table = form["result"].querySelector("tbody");
    table.innerHTML = '';  // Clear existing rows
    // Convert probability data into table row format
    tableRows = Object.entries(probs).map(x=>{
        n = x[0];
        p = x[1];
        return [
            +n, // Dice sum
            p.toFixed(2), // Probability
            (p * 100).toFixed(2) + "%", // Percentage
            (1 / p).toFixed(2), // Expected rolls
            `<meter min="0" max="1" value="${p}"/>` // Visual bar
        ];
    }).reverse();
}

document.addEventListener("DOMContentLoaded", ()=>{
    update(); // Initialize probability calculations
    let table = document.querySelector("tbody");
    consumeTable(table); // Start table rendering process
});