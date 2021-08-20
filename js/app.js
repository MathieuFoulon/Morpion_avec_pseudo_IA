const app = {
    turn: 1, //On commence au premier tour, ceci sera incrémenté par la suite si une action effectuée est bonne
    nombreCase: 9, // il y a au début 9 cases vide, on décrémentera si une action effectuée est bonne. si cette variable atteint 0, le jeu est fini.
    caseChoisie: "", // contiendra la div où a cliqué, au démarrage du jeu, elle ne vaut rien car nous n'avons pas cliqué.
    cellsList: [ // la représentation de notre grille de jeu : c'est sur celle-ci que nous ferons les vérifications en cours de jeu, elle réagit en "temps réél" avec ce qui se passera quand nous cliquerons sur la grille html
        [
            [""],
            [""],
            [""]
        ],
        [
            [""],
            [""],
            [""]
        ],
        [
            [""],
            [""],
            [""]
        ]
    ],
    gridElement: document.querySelector(".grid"), // on selectionne la div qui contient toutes nos cases, on s'en servira pour la faire disparaitre en cas de gagnant ou de match nul
    pin: document.querySelectorAll(".innerRow"), // tableau qui stocke toutes les divs de classes innerRow, c'est à dire les divs sur lesquels nous allons jouer et afficher X ou O
    gameStatusElement: document.querySelector("#gameStatus"), //div qui contiendra un "p" et un "button" plus tard pour afficher des infos liés au jeu.
    pElement: document.createElement("p"), // on crée un paragraphe qui affichera le joueur et le tour courrant = notez qu'il n'existe pas dans le HTML pour le moment;


    //on initialise le jeu
    init: function () {
        app.pElement.textContent = "Tour du joueur X, tour numéro " + app.turn; // pour le moment : tour de X, tour numéro 1, sera remplacé dynamiquement par la suite
        app.gameStatusElement.append(app.pElement); // on colle app.pElement dans la div #gameStatus

        for (let pinIndex = 0; pinIndex < app.pin.length; pinIndex++) { //pinIndex nous servira à parcourir le tableau app.pin que nous avons crée avec toutes divs de classe .innerRow au dessus, nous allons donc boucler dans celui ci pour récuperer toutes les divs une par une

            let cell = app.pin[pinIndex]; // une div de ce tableau est donc à l'index pinIndex du tableau app.pin

            cell.addEventListener("click", app.playTurn); // nous avons donc ajouter une addEventListener unique automatiquement sur toutes les divs = chaque div a donc son propre addEventListener. Nous lui demandons maintenant d'executer la fonction app.playTurn.
        }

    },


    playTurn: function (evt) { // cette fonction va nous permettre de "jouer"

        app.caseChoisie = evt.target; // on récupere la div sur laquelle on a cliquée

        let caseChoisieContent = app.caseChoisie.textContent; // on récupère la valeur du texte contenu dans app.caseChoisie;

        if (caseChoisieContent === "") { // on checke si la div où on a cliqué est vide, si elle ne l'est pas, c'est qu'on l'a déjà jouée. Ou alors qu'on a un vieux bug dégueulasse qui traine, mais je vous rassure, ce n'est pas le cas !


            app.caseChoisie.textContent = "X"; // le texte de la case devient "X"

            app.caseChoisie.classList.add("rowX"); // on ajoute la classe "rowX" à la div cliquée

            app.pElement.textContent = "Tour du joueur X, tour numéro" + (app.turn + 2); // on écrit un nouveau texte dans app.pElement, avec le nom du futur joueur : "X" , et le futur tour. ( si on était au tour 1,  il affichera 3, partant du principe que l'IA va jouer automatiquement après nous : ce sera toujours à notre tour de jouer)

            app.gameStatusElement.append(app.pElement); // on ajoute le paragraphe pElement à la div d'id #gameStatus. La méthode append() n'affichera qu'un pElement, contrairement à appendChild() qui les affichera les uns à la suite. 


            //!ALLEZ VOIR LA FONCTION CELLFILTER PLUS BAS TOUT DE SUITE PUIS REVENEZ ICI
            let cellReturned = app.cellFilter(app.caseChoisie); // on appelle la fonction app.cellFiltrer avec en argument app.caseChoisie

            let isAlmostOneEmpty = false; //on initialise un booléen à false, on le passera à true si notre une case vide est trouvée

            //pour cela, on va parcourir notre tableau app.cellsList
            for (let i = 0; i < 3; i++) { // on cherche dans la 1ere dimension du tableau ( les rows)
                for (let j = 0; j < 3; j++) { // maintenant la 2eme ( les colonnes)
                    if (app.cellsList[i][j] == "") { // si la case du tableau parcourue est vide
                        isAlmostOneEmpty = true; // on assigne isAlmostOneEmpty à true !
                    }
                }
            }

            if (isAlmostOneEmpty) { // si il y a au moins une case vide ce sera à l'IA de joué, sinon c'est que le jeu est fini...

                //! ALLEZ VOIR LA FONCTION IATURN PLUS BAS TOUT DE SUITE PUIS REVENEZ ICI
                app.iaTurn(); // c'est au tour de l'IA de jouer ! si il n'y en a pas, l'IA ne peut pas jouer = c'est à dire en cas de victoire de X, ou de match nul


            }

            app.nombreCase -= 2; // une case a été cliquée et remplie et l'IA a joué, le nombre de cases vides disponibles doit donc diminuer de 2.

            // Le tableau cellsList a reçu une ou des valeurs, il faut vérifier si la partie est finie ou non !
            //! ALLER VOIR LA FONCTION CHECKCELL PLUS BAS TOUT DE SUITE PUIS REVENEZ ICI
            let isOver = app.checkCell(); // isOver contient la valeur de retour de la fonction checkCell() = "X", "O", ou false. 
            console.log(isOver);
            if (isOver == "X") { // si le "vrai" joueur a gagné

                app.gameStatusElement.textContent = "FINI ! joueur " + isOver + " a gagné en " + app.turn + " tours"; // le contenu de la div gameStatus est redéfini, on supprime tout ce qu'il y a dedans et on affiche ce message ( on a supprimé le pElement par la même occasion)

                app.createButton(); // on appelle cette fonction qui va créer un bouton et son addEventListener.

            } else if (isOver == "O") { // si l'IA a gagné
                app.gameStatusElement.textContent = "FINI ! joueur " + isOver + " a gagné en " + (app.turn + 1) + " tours"; // le contenu de la div gameStatus est redéfini, on supprime tout ce qu'il y a dedans et on affiche ce message ( on a supprimé le pElement par la même occasion) 
                //Vous noterez la différence : si c'est l'IA qui joue, on ajoute 1 au tour à afficher, simplement parce que l'IA est censé jouer après le joueur;

                app.createButton(); // on appelle cette fonction qui va créer un bouton et son addEventListener.

            } else if (app.nombreCase <= 0 && !isOver) { // sinon si il n'y a plus de cases à cliquer et qu'il y a aucun gagnant = match nul.

                app.gameStatusElement.textContent = "Match nul, on recommence ?"; // le contenu de la div gameStatus est redéfini, on supprime tout ce qu'il y a dedans et on affiche ce message ( on a supprimé le pElement par la même occasion) 


                app.createButton(); // on appelle cette fonction qui va créer un bouton et son addEventListener.

            }
        }

        app.turn += 2; // On a joué, l'IA aussi, 2 tours se sont donc passés ! On ajoute donc 2 au nombre de tour "app.turn"

    },


    createButton: function () { // le nom parle de lui même.

        let buttonReload = document.createElement("button"); // on crée un button qui nous servira à reload la page pour recommencer

        buttonReload.textContent = "Recommencer ?"; // plutot explicite non ? on ajoute du texte dans ce bouton

        app.gameStatusElement.appendChild(buttonReload); // on ajoute la bouton à la div, sous le texte.

        app.gridElement.style.display = "none"; // on cache la grille pour ne plus qu'elle soit cliquée ! autrement, nous pourrions encore cliquer dessus. Il y a sans doute mieux comme procédé, mais je suis un barbare. Exquis, mais barbare.

        buttonReload.addEventListener("click", app.handleButtonReload); // on écoute le click sur le bouton, qui réagira avec handleButtonReload, codé plus bas.
    },


    handleButtonReload: function (evt) {
        window.location.reload(); // on recharge la page, tout est mis à 0 !
    },


    checkCell: function () { // fonction qui vérifie si la partie est gagnée par quelqu'un ou non

        //Il va falloir boucler dans les valeurs du tableau pour trouver une suite de 3 "X" ou 3 "O"
        for (let cursor = 0; cursor < app.cellsList.length; cursor++) { //on crée donc un index qui va le faire pour nous, sur toute la longueur du tableau "cellsList"


            // petit point info : remarquez la manière dont le if est écrit. Si il n'y a pas de else et qu'elle ne contient qu'une seule ligne d'instruction, vous pouvez l'écrire comme ça ( j'ai bien dit instruction, pas condition !)


            if ((app.cellsList[cursor][0] == app.cellsList[cursor][1] && app.cellsList[cursor][0] == app.cellsList[cursor][2]) && app.cellsList[cursor][0] == "X") return "X"; // on verifie l'horizontal, si X gagne, on renvoie "X"

            if ((app.cellsList[cursor][0] == app.cellsList[cursor][1] && app.cellsList[cursor][0] == app.cellsList[cursor][2]) && app.cellsList[cursor][0] == "O") return "O"; // on verifie l'horizontal, si O gagne, on renvoie "O"

            if ((app.cellsList[0][cursor] == app.cellsList[1][cursor] && app.cellsList[0][cursor] == app.cellsList[2][cursor]) && app.cellsList[0][cursor] == "X") return "X"; // on vérifie le vertical, si X gagne, on renvoie "X"

            if ((app.cellsList[0][cursor] == app.cellsList[1][cursor] && app.cellsList[0][cursor] == app.cellsList[2][cursor]) && app.cellsList[0][cursor] == "O") return "O"; // on vérifie le vertical, si O gagne, on renvoie "O"
        }

        if ((app.cellsList[0][0] == app.cellsList[1][1] && app.cellsList[0][0] == app.cellsList[2][2]) && app.cellsList[0][0] == "X") return "X"; // on vérifie une diagonale, si X gagne, on renvoie "X"

        if ((app.cellsList[0][0] == app.cellsList[1][1] && app.cellsList[0][0] == app.cellsList[2][2]) && app.cellsList[0][0] == "O") return "O"; // on vérifie une diagonale, si O gagne, on renvoie "O"

        if ((app.cellsList[2][0] == app.cellsList[1][1] && app.cellsList[2][0] == app.cellsList[0][2]) && app.cellsList[2][0] == "X") return "X"; // on vérifie l'autre diagonale, si X gagne, on renvoie "X"

        if ((app.cellsList[2][0] == app.cellsList[1][1] && app.cellsList[2][0] == app.cellsList[0][2]) && app.cellsList[2][0] == "O") return "O"; // on vérifie l'autre diagonale, si O gagne, on renvoie "O"



        return false; // si aucun des deux a gagné = on renvoie false

    },


    cellFilter: function (cell) { // vous vous rappelez du tableau "cellsList" que j'ai crée avec des cases vides plus haut ? il doit servir à la validation du jeu plus tard pour trouver un gagnant ou si il y a match nul.
        //Ici, nous allon le remplir ! C'est un tableau à deux dimensions : il contient 3 tableaux de 3 valeurs chacuns.

        //Pour cela, nous allon nous servir de l'id de la case. Par exemple si l'id est "20", nous allons la découper en "2" et "0".
        //parseInt nous servira à transformer le "2" et le "0" en nombre 2 et 0, sinon le tableau ne comprendra pas le numéro d'index.
        let coordCol = parseInt(cell.id[0]); // on détermine grace à "cell", c'est à dire la case sur laquelle nous avons cliqué, l'index de la colonne, autrement dit, la deuxième dimension du tableau
        let coordRow = parseInt(cell.id[1]); // on détermine grace à "cell", l'index de la ligne, c'est à dire la première dimension du tableau
        app.cellsList[coordRow][coordCol] = cell.innerText; //on remplace le "" qui était dans le tableau par le texte contenu dans la case cliquée : "X" 
        console.log(app.cellsList);
        return [coordRow, coordCol];
    },


    iaTurn: function () { //cette fonction permet de faire jouer une case automatiquement, après l'action du joueur X

        let isEmpty = false; // booléen qui servira de condition de sortie pour la boucle while plus bas, on l'initialise à false (si une case est vide, la condition de sortie sera fausse)

        let randomRow = 0; //on initialise un futur nombre aléatoire ici et non dans la boucle while, pour pouvoir récuperer sa valeur après, celui ci sera le numéro de ligne
        let randomCol = 0; // comme au dessus, mais pour le numéro de case dans la ligne


        while (!isEmpty) { // tant qu'on ne trouve pas une case vide
            randomRow = app.randomNumber(); // on appelle une fonction qui crée un nombre aléatoire entre 0 et 3 ( 3 est exclu, donc réellement entre 0 et 2 inclus)

            randomCol = app.randomNumber(); // bah comme au dessus quoi

            if (app.cellsList[randomRow][randomCol] == "") { // si on case du tableau est vide

                isEmpty = true; // on passe isEmpty à true, et on sort de la boucle, sinon on recommence le processus.
            }
        }

        //premier tour pour X donc premier tour de l'IA, on joue au pif, qu'importe ce que joue X. Cette condition ne sera plus vérifiée dès le tour 3
        if (app.turn <= 2) {
            if (app.cellsList[randomRow][randomCol] == "") {
                app.cellsList[randomRow][randomCol] = "O"; // on inscrit "0" dans notre tableau
                app.writeDivAndArray(randomRow, randomCol); // on l'inscrit grace à cette fonction dans le HTML
                return; // on stoppe la fonction
            }
        }

        for (let cursor = 0; cursor < 3; cursor++) { // on va boucler dans cellsList pour trouver les cases occupées par X ou O, si une case est vide a côté ou entre, O joue. "cursor" sera l'index à boucler : row pour checker sur les 3 lignes horizontales, col pour checker les trois colonnes

            //chaque if fonctionne de la même manière : on check si 2 cases ont un X ou un O, et si une est vide : si elle est vide, on lui coller un O, pareil en html, et on stoppe la fonction pour que ce soit au tour de X;

            //POUR FAIRE GAGNER O
            //horizontal fin vide
            if (app.cellsList[cursor][0] == "O" && app.cellsList[cursor][1] == "O" && app.cellsList[cursor][2] == "") {
                app.cellsList[cursor][2] = "O"; // on valide donc la case en lui inscrivant "O"
                app.writeDivAndArray(cursor, 2); // on inscrit O dans le html

                return; // on stoppe
            }
            //horizontal milieu vide
            if (app.cellsList[cursor][0] == "O" && app.cellsList[cursor][2] == "O" && app.cellsList[cursor][1] == "") {
                app.cellsList[cursor][1] = "O";
                app.writeDivAndArray(cursor, 1);

                return;
            }
            //horizontal début vide
            if (app.cellsList[cursor][1] == "O" && app.cellsList[cursor][2] == "O" && app.cellsList[cursor][0] == "") {
                app.cellsList[cursor][0] = "O";
                app.writeDivAndArray(cursor, 0);

                return;
            }
            //vertical fin vide
            if (app.cellsList[0][cursor] == "O" && app.cellsList[1][cursor] == "O" && app.cellsList[2][cursor] == "") {
                app.cellsList[2][cursor] = "O";
                app.writeDivAndArray(2, cursor);

                return;
            }
            //horizontal milieu vide
            if (app.cellsList[0][cursor] == "O" && app.cellsList[2][cursor] == "O" && app.cellsList[1][cursor] == "") {
                app.cellsList[1][cursor] = "O";
                app.writeDivAndArray(1, cursor);

                return;
            }
            //horizontal début vide
            if (app.cellsList[1][cursor] == "O" && app.cellsList[2][cursor] == "O" && app.cellsList[0][cursor] == "") {
                app.cellsList[0][cursor] = "O";
                app.writeDivAndArray(0, cursor);

                return;
            }




            //POUR BLOQUER X DANS SON ELAN
            //horizontal fin vide
            if (app.cellsList[cursor][0] == "X" && app.cellsList[cursor][1] == "X" && app.cellsList[cursor][2] == "") {
                app.cellsList[cursor][2] = "O"; // on valide donc la case en lui inscrivant "O"
                app.writeDivAndArray(cursor, 2); // on inscrit O dans le html

                return; // on stoppe
            }
            //horizontal milieu vide
            if (app.cellsList[cursor][0] == "X" && app.cellsList[cursor][2] == "X" && app.cellsList[cursor][1] == "") {
                app.cellsList[cursor][1] = "O";
                app.writeDivAndArray(cursor, 1);

                return;
            }
            //horizontal début vide
            if (app.cellsList[cursor][1] == "X" && app.cellsList[cursor][2] == "X" && app.cellsList[cursor][0] == "") {
                app.cellsList[cursor][0] = "O";
                app.writeDivAndArray(cursor, 0);

                return;
            }
            //vertical fin vide
            if (app.cellsList[0][cursor] == "X" && app.cellsList[1][cursor] == "X" && app.cellsList[2][cursor] == "") {
                app.cellsList[2][cursor] = "O";
                app.writeDivAndArray(2, cursor);

                return;
            }
            //horizontal milieu vide
            if (app.cellsList[0][cursor] == "X" && app.cellsList[2][cursor] == "X" && app.cellsList[1][cursor] == "") {
                app.cellsList[1][cursor] = "O";
                app.writeDivAndArray(1, cursor);

                return;
            }
            //horizontal début vide
            if (app.cellsList[1][cursor] == "X" && app.cellsList[2][cursor] == "X" && app.cellsList[0][cursor] == "") {
                app.cellsList[0][cursor] = "O";
                app.writeDivAndArray(0, cursor);

                return;
            }



        }
        //Plus besoin de la boucle : on check les diagonales

        //ON FAIT GAGNER O
        // diagonale haut gauche vers bas droite, bas vide
        if ((app.cellsList[0][0] == "O" && app.cellsList[1][1] == "O") && app.cellsList[2][2] == "") {
            app.cellsList[2][2] = "O";
            row = 2;
            col = 2;
            app.writeDivAndArray(2, 2);

            return;
        }
        //diagonale haut gauche vers bas droite, haut vide
        if ((app.cellsList[1][1] == "O" && app.cellsList[2][2] == "O") && app.cellsList[0][0] == "") {
            app.cellsList[0][0] = "O";
            row = 0;
            col = 0;
            app.writeDivAndArray(0, 0);

            return;
        }
        //diagonale haut gauche vers bas droite, vide milieu
        if ((app.cellsList[0][0] == "O" && app.cellsList[2][0] == "O") && app.cellsList[1][1] == "") {
            app.cellsList[1][1] = "O";
            row = 1;
            col = 1;
            app.writeDivAndArray(1, 1);

            return;
        }
        //diagonale bas gauche vers haut droite, haut vide
        if ((app.cellsList[2][0] == "O" && app.cellsList[1][1] == "O") && app.cellsList[0][2] == "") {
            app.cellsList[0][2] = "O";
            row = 0;
            col = 2;
            app.writeDivAndArray(0, 2);

            return;

        }
        //diagonale bas gauche vers haut droite, bas vide
        if ((app.cellsList[0][2] == "O" && app.cellsList[1][1] == "O") && app.cellsList[2][0] == "") {
            app.cellsList[2][0] = "O";
            row = 2;
            col = 0;
            app.writeDivAndArray(2, 0);

            return;

        }
        //diagonale bas gauche vers haut droite, vide milieu
        if ((app.cellsList[2][0] == "O" && app.cellsList[0][2] == "O") && app.cellsList[1][1] == "") {
            app.cellsList[1][1] = "O";
            row = 1;
            col = 1;
            app.writeDivAndArray(1, 1);

            return;
        }


        // ON BLOQUE X
        // diagonale haut gauche vers bas droite, bas vide
        if ((app.cellsList[0][0] == "X" && app.cellsList[1][1] == "X") && app.cellsList[2][2] == "") {
            app.cellsList[2][2] = "O";
            row = 2;
            col = 2;
            app.writeDivAndArray(2, 2);

            return;
        }
        //diagonale haut gauche vers bas droite, haut vide
        if ((app.cellsList[1][1] == "X" && app.cellsList[2][2] == "X") && app.cellsList[0][0] == "") {
            app.cellsList[0][0] = "O";
            row = 0;
            col = 0;
            app.writeDivAndArray(0, 0);

            return;
        }
        //diagonale haut gauche vers bas droite, vide milieu
        if ((app.cellsList[0][0] == "X" && app.cellsList[2][0] == "X") && app.cellsList[1][1] == "") {
            app.cellsList[1][1] = "O";
            row = 1;
            col = 1;
            app.writeDivAndArray(1, 1);

            return;
        }
        //diagonale bas gauche vers haut droite, haut vide
        if ((app.cellsList[2][0] == "X" && app.cellsList[1][1] == "X") && app.cellsList[0][2] == "") {
            app.cellsList[0][2] = "O";
            row = 0;
            col = 2;
            app.writeDivAndArray(0, 2);

            return;

        }
        //diagonale bas gauche vers haut droite, bas vide
        if ((app.cellsList[0][2] == "X" && app.cellsList[1][1] == "X") && app.cellsList[2][0] == "") {
            app.cellsList[2][0] = "O";
            row = 2;
            col = 0;
            app.writeDivAndArray(2, 0);

            return;

        }
        //diagonale bas gauche vers haut droite, vide milieu
        if ((app.cellsList[2][0] == "X" && app.cellsList[0][2] == "X") && app.cellsList[1][1] == "") {
            app.cellsList[1][1] = "O";
            row = 1;
            col = 1;
            app.writeDivAndArray(1, 1);

            return;
        }
        // si on ne trouve rien de pertinent à jouer, on garde les valeurs aléatoire testés dans la boucle while 
        if (isEmpty) { // si une case vide est trouvée ( revoir la boucle while)
            app.cellsList[randomRow][randomCol] = "O"; // on inscrit dans le tableau à la case vide trouvée "O"
            app.writeDivAndArray(randomRow, randomCol); // pareil dans le html

            return; // on stoppe la fonction

        }

    },


    writeDivAndArray: function (row, col) {
        let divPlayedByIa = document.getElementById([col] + "" + [row]); //on choisit la div correspondante à la case du tableau, nous noterez que col et row sont inversé : notre tableau en HTML a une disposition differente que notre tableau JS;

        divPlayedByIa.textContent = "O"; // on inscrit un O dans notre div
        divPlayedByIa.classList.add("rowO"); // et on ajoute la classe "rowO" à celle-ci

        console.log("O a joué " + col, row);

    },


    randomNumber: function () { // renvoie un entier aléatoire entre 0 et 2 (le 3 est exclu)
        return Math.floor(Math.random() * 3);
    }
}



document.addEventListener("DOMContentLoaded", app.init); // on lance notre script à la fin du chargement de la page.