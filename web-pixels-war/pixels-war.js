const PIXEL_URL = "https://pixels-war.oie-lab.net"
const MAP_ID = "0000"
const grid = document.getElementById('grid')

document.addEventListener("DOMContentLoaded", () => {

    const PREFIX = `${PIXEL_URL}/api/v1/${MAP_ID}`

    fetch(`${PREFIX}/preinit`, {credentials: "include"})
        .then((response) => response.json())
        .then((json) => {
            console.log(json)
            const key = json.key //notre clé
              //notre clé 
            //TODO: maintenant que j'ai le json de preinit, je peux initialiser ma grille
        fetch(`${PREFIX}/init?key=${key}`, {credentials: "include"})
                .then((response) => response.json())
                .then((json) => {
                    console.log(json)
                    grille = json.data
                    nx=json.nx
                    ny=json.ny
                    id = json.id;
                    document.getElementById("refresh").addEventListener("click", () => refresh(id))
                    console.log("init", id);
                    grid.style.gridTemplateColumns=`repeat( ${json.nx},1fr)`
            //TODO: maintenant que j'ai le JSON, afficher la grille, et récupérer l'id
                    for (let y = 0; y < ny; y++) { 
                        for (let x = 0; x < nx; x++) {
                            const element = document.createElement('div');
                            element.className = 'cell';
                            element.id = `${x}_${y}`;
                            element.addEventListener('click', () => changecolor (getPickedColorInRGB(), id, x, y))
                            //element.position = (i,j)
                            element.style.backgroundColor = `rgb(${grille[y][x]})`
                            grid.appendChild(element);
                        }
                    }
                })
            //TODO: maintenant que j'ai l'id, attacher la fonction refresh(id), à compléter, au clic du bouton refresh
            

            //TODO: attacher au clic de chaque pixel une fonction qui demande au serveur de colorer le pixel sous là forme :
            // http://pixels-war.oie-lab.net/api/v1/0000/set/id/x/y/r/g/b
            // la fonction getPickedColorInRGB ci-dessous peut aider

            //TODO: pourquoi pas rafraichir la grille toutes les 3 sec ?
            // voire même rafraichir la grille après avoir cliqué sur un pixel ?

            // cosmétique / commodité / bonus:

            // TODO: pour être efficace, il serait utile d'afficher quelque part
            // les coordonnées du pixel survolé par la souris

            //TODO: pour les rapides: afficher quelque part combien de temps
            // il faut attendre avant de pouvoir poster à nouveau

            //TODO: pour les avancés: ça pourrait être utile de pouvoir
            // choisir la couleur à partir d'un pixel ?

            });


    //TODO: pour les élèves avancés, comment transformer les "then" ci-dessus en "async / await" ?

    // À compléter puis à attacher au bouton refresh en passant mon id une fois récupéré
    function refresh(id) {
        fetch(`${PREFIX}/deltas?id=${id}`, {credentials: "include"})
            .then((response) => response.json())
            .then((json) => {
                deltas = json.deltas
                deltas.forEach(element => {
                    const [y, x, c, d, e] = element;
                    const cellule = document.getElementById(`${x}_${y}`);
                    cellule.style.backgroundColor = `rgb(${c}, ${d}, ${e})`
                    
                })
            })
        }


                //TODO: maintenant que j'ai le json des deltas, mettre à jour les pixels qui ont changé.
                // "Here be dragons" : comment récupérer le bon div ?



    // Petite fonction facilitatrice pour récupérer la couleur cliquée en RGB
    function getPickedColorInRGB() {
        const colorHexa = document.getElementById("colorpicker").value

        const r = parseInt(colorHexa.substring(1, 3), 16)
        const g = parseInt(colorHexa.substring(3, 5), 16)
        const b = parseInt(colorHexa.substring(5, 7), 16)

        return [r, g, b]
    }

    function changecolor(color, id, x, y) {
        fetch(`${PREFIX}/set/${id}/${y}/${x}/${color[0]}/${color[1]}/${color[2]}`, {credentials: "include"})
            .then((response) => response.json())
            .then((json) => {
            refresh(id)
        })
    }
    


    // dans l'autre sens, pour mettre la couleur d'un pixel dans le color picker
    // (le color picker insiste pour avoir une couleur en hexadécimal...)
    function pickColorFrom(div) {
        // plutôt que de prendre div.style.backgroundColor
        // dont on ne connait pas forcément le format
        // on utilise ceci qui retourne un 'rbg(r, g, b)'
        const bg = window.getComputedStyle(div).backgroundColor
        // on garde les 3 nombres dans un tableau de chaines
        const [r, g, b] = bg.match(/\d+/g)
        // on les convertit en hexadécimal
        const rh = parseInt(r).toString(16).padStart(2, '0')
        const gh = parseInt(g).toString(16).padStart(2, '0')
        const bh = parseInt(b).toString(16).padStart(2, '0')
        const hex = `#${rh}${gh}${bh}`
        // on met la couleur dans le color picker
        document.getElementById("colorpicker").value = hex
    }


});