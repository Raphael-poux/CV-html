const play = document.getElementById('play');
let cases;
let mines;
let nbcases = 480;
let nbmines = 99;
let rowLength = 30;
let Lvoisins = getVoisins(rowLength, nbcases);
let game = false;
let flag = false;
const flagim = 'flag.png'
const bombim = 'bomb.webp'

const colors = ['none', 'blue', 'green', 'orange', 'red', 'purple', 'yellow', 'brown', 'black']

play.addEventListener('click', handleplay);


document.addEventListener('keydown', function(event) {
    if (event.key === 'CapsLock') {
        flag = !flag;
    }
});


function genererCases(nbcases) {
    var conteneur = document.getElementById("container");
    conteneur.innerHTML = "";
    var listeCases = [];
    for (var i = 0; i < nbcases; i++) {
        var caseElement = document.createElement("div");
        caseElement.className = "case";
        caseElement.textContent = "";
        caseElement.id = "case_" + i;
        caseElement.numero = i
        caseElement.valeur = 0
        conteneur.appendChild(caseElement);
        listeCases.push(caseElement);
        caseElement.addEventListener("click", function() {
            handleCaseClick(this); 
        });
    }
    return listeCases
}

function handleCaseClick(caseElement) {
    if (flag) {
        if (caseElement.style.backgroundColor == "lightblue") {
            caseElement.style.backgroundColor = "#ccc"
            caseElement.textContent = ""
            return
        }
        var img = document.createElement('img');
        img.src = flagim;
        caseElement.innerHTML = '';
        caseElement.appendChild(img);
        img.classList.add('image-style');
        caseElement.style.backgroundColor = "lightblue";
        return
    }
    if (caseElement.style.backgroundColor == "white" || caseElement.style.backgroundColor == "lightblue") {
        return
    }
    if (!game) {
        game = true
        mines = genererMines(nbcases, nbmines, caseElement)
        number(Lvoisins, mines)
    }
    if (caseElement.valeur !== 0 ) {
        caseElement.textContent = caseElement.valeur;
        caseElement.style.color = colors[caseElement.valeur];
    }
    if (mines.has(caseElement.numero)) {
        cases.forEach(function(caseElement) {
            caseElement.style.backgroundColor = "white";
            caseElement.textContent = '';
            if (caseElement.valeur !== 0 ) {
                caseElement.textContent = caseElement.valeur;
                caseElement.style.color = colors[caseElement.valeur];
            }
            if (mines.has(caseElement.numero)) {
                var img = document.createElement('img');
                img.src = bombim;
                caseElement.innerHTML = '';
                caseElement.appendChild(img);
                img.classList.add('image-style');
                caseElement.style.backgroundColor = "darkred";
            }
        })
        alert("You lost");
        return
    }
    if (caseElement.valeur == 0 ) {
        caseElement.style.backgroundColor = "white";
        Lvoisins[caseElement.numero].forEach(function(numeroVoisin) {
            const caseVoisine = document.getElementById("case_" + numeroVoisin);
            handleCaseClick(caseVoisine);
        }); 
    }
    caseElement.style.backgroundColor = "white";

} 

function genererMines(nbcases, nbmines, caseElement) {
    var numerosMines = new Set(); 

    while (numerosMines.size < nbmines) {
        var numero = Math.floor(Math.random() * nbcases);
        if (!numerosMines.has(numero)) {
            if (!Lvoisins[caseElement.numero].has(numero) && caseElement.numero !== numero ) {
                numerosMines.add(numero);
            }             
        }
    }

    return numerosMines;
}


function getVoisins(rowLength, totalCases) {
    const voisinsListe = [];

    for (let i = 0; i < totalCases; i++) {
        const row = Math.floor(i / rowLength); 
        const col = i % rowLength;

        const voisins = new Set();
        const offsets = [
            { x: -1, y: -1 }, 
            { x: -1, y: 0 },  
            { x: -1, y: 1 },  
            { x: 0, y: -1 },  
            { x: 0, y: 1 },   
            { x: 1, y: -1 },  
            { x: 1, y: 0 },   
            { x: 1, y: 1 }    
        ];

        offsets.forEach(offset => {
            const newRow = row + offset.x;
            const newCol = col + offset.y;
            if (newRow >= 0 && newRow < totalCases/rowLength && newCol >= 0 && newCol < rowLength) {
                voisins.add(newRow * rowLength + newCol);
            }
        });

        voisinsListe.push(voisins);
    }

    return voisinsListe;
}

function number(Lvoisins, mines) {
    mines.forEach(function(numero) {
        const voisins = Lvoisins[numero];
        voisins.forEach(function(numeroVoisin) {
            if (!mines.has(numeroVoisin)) {
                const caseVoisine = document.getElementById("case_" + numeroVoisin);
                caseVoisine.valeur = (caseVoisine.valeur) + 1;
            }
        });
    });
}


function handleplay(e) {
    cases = genererCases(nbcases, mines)
    if (game) {
        game = false
    }
}

