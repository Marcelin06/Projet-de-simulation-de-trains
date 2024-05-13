/************************************************************/
/**
 * Université Sorbonne Paris Nord, Programmation Web
 * Auteurs                       : Étienne André
 * Création                      : 2023/12/11
 * Dernière modification         : 2024/04/02
 * Augmenté par 				 : Amazigh ALOUNE & Dieunel MARCELIN
 */
/************************************************************/

'use strict'

/************************************************************/
/* Constantes */
/************************************************************/

/*------------------------------------------------------------*/
// Dimensions du plateau
/*------------------------------------------------------------*/

// Nombre de cases par défaut du simulateur
const LARGEUR_PLATEAU	= 30;
const HAUTEUR_PLATEAU	= 15;

// Dimensions des cases par défaut en pixels
const LARGEUR_CASE	= 35;
const HAUTEUR_CASE	= 40;



/*------------------------------------------------------------*/
// Types des cases
/*------------------------------------------------------------*/
class Type_de_case{
	static Foret						= new Type_de_case('foret');

	static Eau							= new Type_de_case('eau');

	static Sable 						= new Type_de_case('sable');

	static Palmier						= new Type_de_case('palmier');

	static Cactus						= new Type_de_case('cactus');

	static Bateau 						= new Type_de_case('bateau');

	static Chameau						= new Type_de_case('chameau');
	
	static Maison 						= new Type_de_case('maison');

	static Rail_horizontal				= new Type_de_case('rail horizontal');

	static Rail_vertical				= new Type_de_case('rail vertical');

	// NOTE: faisant la jonction de horizontal à vertical en allant vers la droite puis vers le haut (ou de vertical vers horizontal en allant de bas vers gauche)
	static Rail_droite_vers_haut		= new Type_de_case('rail droite vers haut');

	// NOTE: faisant la jonction de vertical à horizontal en allant vers le haut puis vers la droite (ou de horizontal à vertical en allant de gauche vers le bas)
	static Rail_haut_vers_droite		= new Type_de_case('rail haut vers droite');

	// NOTE: faisant la jonction de horizontal à vertical en allant vers la droite puis vers le bas (ou de vertical vers horizontal en allant de haut vers gauche)
	static Rail_droite_vers_bas		= new Type_de_case('rail droite vers bas');

	// NOTE: faisant la jonction de vertical à horizontal en allant vers le bas puis vers la droite (ou de horizontal à vertical en allant de gauche vers le haut)
	static Rail_bas_vers_droite		= new Type_de_case('rail bas vers droite');

	constructor(nom) {
		this.nom = nom;
	}
}

/**
 * Classe pour specifier les types de trains
 * Locomotive : la locomotive
 * Wagon: un wagon
 
 */
class Type_de_train{
	static Locomotive_bas	= new Type_de_train('locomotive_bas');

	static Locomotive_gauche= new Type_de_train('locomotive_gauche');

	static Locomotive_haut	= new Type_de_train('locomotive_haut');

	static Locomotive_droite= new Type_de_train('locomotive_droite');

	static Wagon			= new Type_de_train('wagon');

	static Train1			= new Type_de_train('Train1');

	static Train2			= new Type_de_train('Train2');

	static Train4			= new Type_de_train('Train4');

	static Train6			= new Type_de_train('Train6')
	

	constructor(nom){
		this.nom = nom;
	}
}

class Direction{
	static Haut 	= new Direction('Haut');

	static Droite 	= new Direction('Droite');

	static Bas 		= new Direction('Bas');

	static Gauche 	= new Direction ('Gauche');

	constructor(nom){
		this.nom	= nom;
	}

	getDirectionOppose(){
		switch (this.nom) {
			case "Haut":
				return Direction.Bas;
			case "Bas":
				return Direction.Haut;
			case "Droite":
				return Direction.Gauche;
			case "Gauche":
				return Direction.Droite;
		}
	}
}





/*------------------------------------------------------------*/
// Images
/*------------------------------------------------------------*/
const IMAGE_EAU = new Image();
IMAGE_EAU.src = 'images/eau.png';

const IMAGE_FORET = new Image();
IMAGE_FORET.src = 'images/foret.png';

const IMAGE_LOCO_BAS = new Image();
IMAGE_LOCO_BAS.src = 'images/locomotive_bas.png';

const IMAGE_LOCO_GAUCHE = new Image();
IMAGE_LOCO_GAUCHE.src = 'images/locomotive_gauche.png';

const IMAGE_LOCO_HAUT = new Image();
IMAGE_LOCO_HAUT.src = 'images/locomotive_haut.png';

const IMAGE_LOCO_DROITE = new Image();
IMAGE_LOCO_DROITE.src = 'images/locomotive_droite.png';

const IMAGE_RAIL_HORIZONTAL = new Image();
IMAGE_RAIL_HORIZONTAL.src = 'images/rail-horizontal.png';

const IMAGE_RAIL_VERTICAL = new Image();
IMAGE_RAIL_VERTICAL.src = 'images/rail-vertical.png';

const IMAGE_RAIL_BAS_VERS_DROITE = new Image();
IMAGE_RAIL_BAS_VERS_DROITE.src = 'images/rail-bas-vers-droite.png';

const IMAGE_RAIL_DROITE_VERS_BAS = new Image();
IMAGE_RAIL_DROITE_VERS_BAS.src = 'images/rail-droite-vers-bas.png';

const IMAGE_RAIL_DROITE_VERS_HAUT = new Image();
IMAGE_RAIL_DROITE_VERS_HAUT.src = 'images/rail-droite-vers-haut.png';

const IMAGE_RAIL_HAUT_VERS_DROITE = new Image();
IMAGE_RAIL_HAUT_VERS_DROITE.src = 'images/rail-haut-vers-droite.png';

const IMAGE_WAGON = new Image();
IMAGE_WAGON.src = 'images/wagon.png';

const IMAGE_CACTUS = new Image();
IMAGE_CACTUS.src = 'images/cactus.png';

const IMAGE_SABLE = new Image();
IMAGE_SABLE.src = 'images/sable.png';

const IMAGE_CHAMEAU = new Image();
IMAGE_CHAMEAU.src = 'images/chameau.png';

const IMAGE_PALMIER = new Image();
IMAGE_PALMIER.src = 'images/palmier.png';

const IMAGE_BATEAU = new Image();
IMAGE_BATEAU.src = 'images/bateau.png';

const IMAGE_MAISON = new Image();
IMAGE_MAISON.src = 'images/maison.png';


/************************************************************/
// Variables globales
/************************************************************/

// TODO



/*Variable globale qui contient le dernier bouton clique 
*et qui n'est pas un train
*contient null si un autre click a ete fait ailleurs
*/
let dernier_case_clique = null;

/**
 * Variable globale qui contient le dernier train clique
 * contient nul si le dernier click n'etait pas sur un bouton train
 */
let dernier_train_clique = null;

/**
 * variable pour savoir si les trains sont en marche ou pas
 * vrai si le train est en marche
 * faux sinon
 */
let en_marche = false;

/**
 * Variable globole qui contiendra tous les trains
 * chaque case contient un train
 * chaque  train etant un tableau qui contient des voitures(ou du moins les positions x et y des voitures)
 */
let mes_trains = [];
mes_trains.bloque = false

let change_direction_active = false;

/************************************************************/
/* Classes */
/************************************************************/

/*------------------------------------------------------------*/
// Plateau
/*------------------------------------------------------------*/

class Plateau{
	/* Constructeur d'un plateau vierge */
	constructor(case_voulu){
		this.largeur = LARGEUR_PLATEAU;
		this.hauteur = HAUTEUR_PLATEAU;

		// NOTE: à compléter…

		// État des cases du plateau
		// NOTE: tableau de colonnes, chaque colonne étant elle-même un tableau de cases (beaucoup plus simple à gérer avec la syntaxe case[x][y] pour une coordonnée (x,y))
		this.cases = [];
		for (let x = 0; x < this.largeur; x++) {
			this.cases[x] = [];
			for (let y = 0; y < this.hauteur; y++) {
				this.cases[x][y] = case_voulu;
			}
		}
	}

	// NOTE: à compléter…

}

/*un train est un tableau d'objet 
	*chaque objet etant la position d'une voiture du rain
	*l'objet se situant a l'indice 0 est la tete du train (locomotive)
	*et ainsi de de suite
	*la taille de tableau est le nombre de voitures
	
	let un_train = [];
*/
class UnTrain{
	constructor(){
		this.tableau = [];
		this.tableau_type_de_rails_sous_les_roues = [];
		this.direction = Direction.Droite;
		this.presence_de_train_derriere = false;
		this.a_eliminer = false;
		this.est_en_marche = false;
		this.bloque = false;
		this.vient_de_changer_sens = false
	}

	addVoiture(voiture){
		this.tableau.push(voiture);
	}

	initialiserTableauRails(qte){
		switch (qte){
			case 1:
				this.tableau_type_de_rails_sous_les_roues.push(Type_de_case.Rail_horizontal);
				break;
			case 2:
				this.tableau_type_de_rails_sous_les_roues.push(Type_de_case.Rail_horizontal, Type_de_case.Rail_horizontal);
				break;
			case 4:
				this.tableau_type_de_rails_sous_les_roues.push(Type_de_case.Rail_horizontal, Type_de_case.Rail_horizontal, Type_de_case.Rail_horizontal, Type_de_case.Rail_horizontal);
				break;
			case 6:
				this.tableau_type_de_rails_sous_les_roues.push(Type_de_case.Rail_horizontal, Type_de_case.Rail_horizontal, Type_de_case.Rail_horizontal, Type_de_case.Rail_horizontal, Type_de_case.Rail_horizontal, Type_de_case.Rail_horizontal);
				break;
		}
	}

	//renvoie le rail a placer apres un pas du train
	modifierTableauRails(arg, taille){
		//let taille = this.tableau_type_de_rails_sous_les_roues.length;
		let result = this.tableau_type_de_rails_sous_les_roues[taille-1];
		let i;
		for(i = taille - 2; i >= 0; i--){
			this.tableau_type_de_rails_sous_les_roues[i+1] = this.tableau_type_de_rails_sous_les_roues[i];
		}
		this.tableau_type_de_rails_sous_les_roues[0] = arg;
		return result;
	}

	setDirection(dir){
		this.direction = dir;
	}

	getDirection(){
		return this.direction;
	}

	
}

class Parcous{


}

/*un train est un tableau d'objet 
	*chaque objet etant la position d'une voiture du rain
	*l'objet se situant a l'indice 0 est la tete du train (locomotive)
	*et ainsi de de suite
	*la taille de tableau est le nombre de voitures
	*/
	


/************************************************************/
// Méthodes
/************************************************************/

function image_of_case(type_de_case){
	switch(type_de_case){
		case Type_de_case.Foret					: return IMAGE_FORET;
		case Type_de_case.Eau					: return IMAGE_EAU;
		case Type_de_case.Rail_horizontal		: return IMAGE_RAIL_HORIZONTAL;
		case Type_de_case.Rail_vertical			: return IMAGE_RAIL_VERTICAL;
		case Type_de_case.Rail_droite_vers_haut	: return IMAGE_RAIL_DROITE_VERS_HAUT;
		case Type_de_case.Rail_haut_vers_droite	: return IMAGE_RAIL_HAUT_VERS_DROITE;
		case Type_de_case.Rail_droite_vers_bas	: return IMAGE_RAIL_DROITE_VERS_BAS;
		case Type_de_case.Rail_bas_vers_droite	: return IMAGE_RAIL_BAS_VERS_DROITE;
		case Type_de_train.Locomotive_bas		: return IMAGE_LOCO_BAS;
		case Type_de_train.Locomotive_gauche	: return IMAGE_LOCO_GAUCHE;
		case Type_de_train.Locomotive_haut		: return IMAGE_LOCO_HAUT;
		case Type_de_train.Locomotive_droite	: return IMAGE_LOCO_DROITE;
		case Type_de_train.Wagon				: return IMAGE_WAGON;
		case Type_de_case.Cactus				: return IMAGE_CACTUS;
		case Type_de_case.Chameau				: return IMAGE_CHAMEAU;
		case Type_de_case.Bateau				: return IMAGE_BATEAU;
		case Type_de_case.Palmier				: return IMAGE_PALMIER;
		case Type_de_case.Maison				: return IMAGE_MAISON;
		case Type_de_case.Sable 				: return IMAGE_SABLE
    }
}


function dessine_case(contexte, plateau, x, y){
	const la_case = plateau.cases[x][y];

	if(!contexte || !la_case){
		return;
	}
	
		
	// NOTE: à améliorer

	let image_a_afficher = image_of_case(la_case);
	// Affiche l'image concernée
	if(la_case === Type_de_case.Rail_horizontal ||
		la_case === Type_de_case.Rail_bas_vers_droite ||
		la_case === Type_de_case.Rail_droite_vers_bas ||
		la_case === Type_de_case.Rail_droite_vers_haut ||
		la_case === Type_de_case.Rail_haut_vers_droite ||
		la_case === Type_de_case.Rail_vertical){

		contexte.fillStyle = 'gray';
		contexte.fillRect(x * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);

	}
	contexte.drawImage(image_a_afficher, x * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
}

function dessine_plateau(page, plateau){
	// Dessin du plateau avec paysages et rails
	for (let x = 0; x < plateau.largeur; x++) {
		for (let y = 0; y < plateau.hauteur; y++) {
			dessine_case(page, plateau, x, y);
		}
	}

	// NOTE: à compléter…
}

/*fonction qui permet de tester si un boutton qui n'est pas un train est clique
*prend en parametre une variable de type Type_de_case\
*renvoie true si la variable est clique et false sinon
 */
function is_buton_clicked(arg){
	switch (arg){
		case Type_de_case.Foret					: return tab_bool_bouton[0];
		case Type_de_case.Eau					: return tab_bool_bouton[1];
		case Type_de_case.Rail_horizontal		: return tab_bool_bouton[2];
		case Type_de_case.Rail_vertical			: return tab_bool_bouton[3];
		case Type_de_case.Rail_droite_vers_haut	: return tab_bool_bouton[4];
		case Type_de_case.Rail_haut_vers_droite	: return tab_bool_bouton[5];
		case Type_de_case.Rail_droite_vers_bas	: return tab_bool_bouton[6];
		case Type_de_case.Rail_bas_vers_droite	: return tab_bool_bouton[7];
	}
}

/*renvoie l'indice d'une case qui n'est pas un train dans train dans la variable globale tab_bool_bouton
*voir la table pour plus d'informations sur les indices
*/
function indice_of_button(arg){
	switch (arg){
		case Type_de_case.Foret					: return 0;
		case Type_de_case.Eau					: return 1;
		case Type_de_case.Rail_horizontal		: return 2;
		case Type_de_case.Rail_vertical			: return 3;
		case Type_de_case.Rail_droite_vers_haut	: return 4;
		case Type_de_case.Rail_haut_vers_droite	: return 5;
		case Type_de_case.Rail_droite_vers_bas	: return 6;
		case Type_de_case.Rail_bas_vers_droite	: return 7;
	}
}

function get_Type_of_case_by_indice(j){
	switch(j){
		case 0 : return Type_de_case.Foret;
		case 1 : return Type_de_case.Eau;
		case 2 : return Type_de_case.Rail_horizontal;
		case 3 : return Type_de_case.Rail_vertical;
		case 4 : return Type_de_case.Rail_droite_vers_haut;
		case 5 : return Type_de_case.Rail_haut_vers_droite;
		case 6 : return Type_de_case.Rail_droite_vers_bas;
		case 7 : return Type_de_case.Rail_bas_vers_droite;
	}
}


function getIdOfCase(arg){
	switch (arg){
		case Type_de_case.Foret					: return "bouton_foret";
		case Type_de_case.Eau					: return "bouton_eau";
		case Type_de_case.Rail_horizontal		: return "bouton_rail_horizontal";
		case Type_de_case.Rail_vertical			: return "bouton_rail_vertical";
		case Type_de_case.Rail_droite_vers_haut	: return "bouton_rail_droite_vers_haut";
		case Type_de_case.Rail_haut_vers_droite	: return "bouton_rail_haut_vers_droite";
		case Type_de_case.Rail_droite_vers_bas	: return "bouton_rail_droite_vers_bas";
		case Type_de_case.Rail_bas_vers_droite	: return "bouton_rail_bas_vers_droite";
		case Type_de_train.Train1				: return "bouton_train_1";
		case Type_de_train.Train2				: return "bouton_train_2";
		case Type_de_train.Train4				: return "bouton_train_4";
		case Type_de_train.Train6				: return "bouton_train_6";
		default									: return "";
	}
}


function updateDernierBoutonClique(arg){
	let id_buton_clicked = getIdOfCase(arg);
	let buton_clicked = document.getElementById(id_buton_clicked);
	
	if (dernier_case_clique === null && dernier_train_clique === null){
		
		dernier_case_clique = arg;
		buton_clicked.style.opacity="30%";
	}
	else if(null !== dernier_case_clique && null === dernier_train_clique){
		if(dernier_case_clique === arg){
			buton_clicked.style.opacity="100%";
			dernier_case_clique = null;
			
		}
		else{
			let id_dernier_bouton_clique = getIdOfCase(dernier_case_clique);
			let elem_dernier_bouton_clique = document.getElementById(id_dernier_bouton_clique);
			elem_dernier_bouton_clique.style.opacity="100%";
			dernier_case_clique = arg;
			buton_clicked.style.opacity="30%";
		}
		
	}
	else if(null === dernier_case_clique && null !== dernier_train_clique){
		let id_dernier_train_clique = getIdOfCase(dernier_train_clique);
		let elem_dernier_train_clique = document.getElementById(id_dernier_train_clique);
		elem_dernier_train_clique.style.opacity = "100%";
		dernier_case_clique = arg;
		buton_clicked.style.opacity = "30%";
		dernier_train_clique = null;
	}
	else{}
	
}

function updateDernierTrainClique(arg){
	let id_buton_clicked = getIdOfCase(arg);
	let buton_clicked = document.getElementById(id_buton_clicked);

	if(null === dernier_case_clique && null === dernier_train_clique){
		dernier_train_clique = arg;
		buton_clicked.style.opacity="30%";
	}
	else if(null === dernier_case_clique && null !== dernier_train_clique){
		if(dernier_train_clique === arg){
			buton_clicked.style.opacity = "100%";
			dernier_train_clique = null;
		}
		else{
			let id_dernier_train_clique = getIdOfCase(dernier_train_clique);
			let elem_dernier_train_clique = document.getElementById(id_dernier_train_clique);
			elem_dernier_train_clique.style.opacity = "100%";
			dernier_train_clique = arg;
			buton_clicked.style.opacity = "30%";
		}
	}
	else if(null !== dernier_case_clique && null === dernier_train_clique){
		let id_dernier_case_clique = getIdOfCase(dernier_case_clique);
		let elem_dernier_case_clique = document.getElementById(id_dernier_case_clique);
		elem_dernier_case_clique.style.opacity = "100%";
		dernier_train_clique = arg;
		buton_clicked.style.opacity = "30%";
		dernier_case_clique = null;
	}
	else{}


}

function updateBoutonPause(){
	if(dernier_case_clique){
		let id_dernier_bouton_clique = getIdOfCase(dernier_case_clique);
		let elem_dernier_bouton_clique = document.getElementById(id_dernier_bouton_clique);
		elem_dernier_bouton_clique.style.opacity="100%";
		dernier_case_clique = null;
	}
	if(dernier_train_clique){
		let id_dernier_train_clique = getIdOfCase(dernier_train_clique);
		let elem_dernier_train_clique = document.getElementById(id_dernier_train_clique);
		elem_dernier_train_clique.style.opacity="100%";
		dernier_train_clique = null;
	}
	
}

/**
 * verifie si la case de gauche peut recevoir une locomotive
 * @param {*} plateau 
 * @param {*} x 
 * @param {*} y 
 * @returns vrai et les coordonnes de cette case si c'est possibl
 * et faux sinon
 */
function placementVersLaGauchePossible(plateau, x, y){
	
	let result = {
		est_possible: false,
		x: -1,
		y: -1,
	};

	//Si on est sur la premiere colonne
	if(y <= 0){
		return result;
	}

	if( plateau.cases[y - 1][x] === Type_de_case.Rail_horizontal ){
		result.est_possible = true;
		result.x = x;
		result.y = y-1;
		return result;
	}

	return result;
}



//ajout d'un trai dans notre collection de train
function ajouterTrainDansCollection(ligne_case, colone_case, type_train){
	/*un train est un tableau d'objet 
	*chaque objet etant la position d'une voiture du rain
	*l'objet se situant a l'indice 0 est la tete du train (locomotive)
	*et ainsi de de suite
	*la taille de tableau est le nombre de voitures
	*/
	let un_train = new UnTrain();

	//variables pour contenir les positions x et y des voitures
	let voiture1;
	let voiture2;
	let voiture3;
	let voiture4;
	let voiture5;
	let voiture6;

	switch (type_train) {
		case Type_de_train.Train1:
			voiture1 = {
				x: colone_case,
				y: ligne_case,
				type_: Type_de_train.Locomotive_droite
			};
			un_train.initialiserTableauRails(1);
			un_train.addVoiture(voiture1);
			mes_trains.push(un_train);
			break;
		case Type_de_train.Train2:
			voiture1 = {
				x: colone_case,
				y: ligne_case,
				type_: Type_de_train.Locomotive_droite
			};
			voiture2 = {
				x: colone_case - 1,
				y: ligne_case,
				type_: Type_de_train.Wagon
			};
			un_train.initialiserTableauRails(2);
			un_train.addVoiture(voiture1);
			un_train.addVoiture(voiture2);
			mes_trains.push(un_train);
			break;
		case Type_de_train.Train4:
			voiture1 = {
				x: colone_case,
				y: ligne_case,
				type_: Type_de_train.Locomotive_droite
			};
			voiture2 = {
				x: colone_case - 1,
				y: ligne_case,
				type_: Type_de_train.Wagon
			};
			voiture3 = {
				x: colone_case - 2,
				y: ligne_case,
				type_: Type_de_train.Wagon
			};
			voiture4 = {
				x: colone_case - 3,
				y: ligne_case,
				type_: Type_de_train.Wagon
			};
			un_train.initialiserTableauRails(4);
			un_train.addVoiture(voiture1);
			un_train.addVoiture(voiture2);
			un_train.addVoiture(voiture3);
			un_train.addVoiture(voiture4);
			mes_trains.push(un_train);
			break;
		case Type_de_train.Train6:
			voiture1 = {
				x: colone_case,
				y: ligne_case,
				type_: Type_de_train.Locomotive_droite
			};
			voiture2 = {
				x: colone_case - 1,
				y: ligne_case,
				type_: Type_de_train.Wagon
			};
			voiture3 = {
				x: colone_case - 2,
				y: ligne_case,
				type_: Type_de_train.Wagon
			};
			voiture4 = {
				x: colone_case - 3,
				y: ligne_case,
				type_: Type_de_train.Wagon
			};
			voiture5 = {
				x: colone_case - 4,
				y: ligne_case,
				type_: Type_de_train.Wagon
			};
			voiture6 = {
				x: colone_case - 5,
				y: ligne_case,
				type_: Type_de_train.Wagon
			};
			un_train.initialiserTableauRails(6);
			un_train.addVoiture(voiture1);
			un_train.addVoiture(voiture2);
			un_train.addVoiture(voiture3);
			un_train.addVoiture(voiture4);
			un_train.addVoiture(voiture5);
			un_train.addVoiture(voiture6);
			mes_trains.push(un_train);
			break;
	
	}
	
}

//Placement d'une case du plateau (Eau, Foret, Rail) sur le paleau aux coordonnees indiquees et dessin de la dite case
function placerCasePlateau(plateau, ligne_case, colone_case, contexte, lacase){
	/*if(!contexte || !lacase || !colone_case || !ligne_case){
		return;
	}*/
	plateau.cases[colone_case][ligne_case] = lacase;
	dessine_case(contexte, plateau, colone_case, ligne_case);
}

//Placement d'une locomotive ou d'un wagon sur le plateau aux coordonnees indiquees et dessin de la locomotive ou du wagon
function placerVoitureSurPlateau(plateau, ligne_case, colone_case, contexte, wagon_ou_locomotive){
	
	plateau.cases[colone_case][ligne_case] = wagon_ou_locomotive;
	
	dessine_case(contexte, plateau, colone_case, ligne_case);
}

function mettreOpaciteBoutonTrainA100(){
	let id_buton_clicked = getIdOfCase(dernier_train_clique);
	let buton_clicked = document.getElementById(id_buton_clicked);
	buton_clicked.style.opacity = "100%";
	dernier_train_clique = null;
}

function mettreOpaciteBoutonCaseA100(){
	let id_buton_clicked = getIdOfCase(dernier_case_clique);
	let buton_clicked = document.getElementById(id_buton_clicked);
	buton_clicked.style.opacity = "100%";
	dernier_case_clique = null;
}

function demarrerLeTrain(le_train, plateau, contexte){
	
	
	if(en_marche === false){
		return;
	}	
	if((le_train === null) || (le_train === undefined)){
		return;
	}
	if(le_train.bloque = false){
		return;
	}
	
	
	let peut_bouger_vers = leTrainPeutIlBouger(le_train, plateau);
	
	if (peut_bouger_vers.peut_bouger === false || le_train.a_eliminer === true){
		
		if(le_train.a_eliminer){
			console.log("\nsalut")
		}
		eliminerTrain(le_train, plateau, contexte);
		return;
	}
	else{
		if(peut_bouger_vers.direction === Direction.Droite){
			avancerTrainVersLadroite(le_train, plateau, contexte);
			//setTimeout(demarrerLeTrain, 500, le_train, plateau, contexte);
			//setTimeout(mettreEnMarche, 500, plateau, contexte);
			
		}
		else if(peut_bouger_vers.direction === Direction.Haut){
			avancerTrainVersLeHaut(le_train, plateau, contexte);
			//setTimeout(demarrerLeTrain, 500, le_train, plateau, contexte);
			//setTimeout(mettreEnMarche, 500, plateau, contexte);
		}
		else if(peut_bouger_vers.direction === Direction.Gauche){
			avancerTrainVersLaGauche(le_train, plateau, contexte);
			//setTimeout(demarrerLeTrain, 500, le_train, plateau, contexte);
			//setTimeout(mettreEnMarche, 500, plateau, contexte);
		}
		else{
			avancerTrainVersLeBas(le_train, plateau, contexte);
			//setTimeout(demarrerLeTrain, 500, le_train, plateau, contexte);
			//setTimeout(mettreEnMarche, 500, plateau, contexte);
		}

	}
	

	
	
	
	
}

function avancerTrainVersLadroite(le_train, plateau, contexte){
	
	
	let taille = le_train.tableau.length;

	let tete_du_train = {
		x: le_train.tableau[0].x,
		y: le_train.tableau[0].y,
		type_: le_train.tableau[0].type_
	};

	let queue_du_train = {
		x: le_train.tableau[taille - 1].x,
		y: le_train.tableau[taille - 1].y,
		type_: le_train.tableau[taille - 1].type_
	};
	

	let i;
	let case_de_droite;
	

	if(tete_du_train.x < LARGEUR_PLATEAU - 1){
		case_de_droite = plateau.cases[tete_du_train.x+1][tete_du_train.y];
		
	}
	if(tete_du_train.x === LARGEUR_PLATEAU - 1){
		case_de_droite = plateau.cases[0][tete_du_train.y];
	}

	let case_a_placer_apres_avancement = le_train.modifierTableauRails(case_de_droite, taille);

	for(i = taille - 1; i >=1; i--){
		le_train.tableau[i].x = le_train.tableau[i-1].x;
		le_train.tableau[i].y = le_train.tableau[i-1].y;
		le_train.tableau[i].type_ = Type_de_train.Wagon;
	}

	if(tete_du_train.x < LARGEUR_PLATEAU - 1){
		le_train.tableau[0].x++;
	}
	if(tete_du_train.x === LARGEUR_PLATEAU - 1){
		le_train.tableau[0].x = 0;
	}


	le_train.direction = Direction.Droite;
	
	dessinerTrain(le_train, plateau, contexte);
	
	if(le_train.presence_de_train_derriere === false){
		placerCasePlateau(plateau, queue_du_train.y, queue_du_train.x, contexte, case_a_placer_apres_avancement);
	}
	else{
		le_train.presence_de_train_derriere = false;
	}
	
	
}

function avancerTrainVersLeHaut(le_train, plateau, contexte){
	
	let taille = le_train.tableau.length;

	let tete_du_train = {
		x: le_train.tableau[0].x,
		y: le_train.tableau[0].y,
		type_: le_train.tableau[0].type_
	};

	let queue_du_train = {
		x: le_train.tableau[taille - 1].x,
		y: le_train.tableau[taille - 1].y,
		type_: le_train.tableau[taille - 1].type_
	};

	let i;
	
	let case_de_haut;

	if(tete_du_train.y > 0){
		case_de_haut = plateau.cases[tete_du_train.x][tete_du_train.y-1];
	}
	if(tete_du_train.y === 0){
		case_de_haut = plateau.cases[tete_du_train.x][HAUTEUR_PLATEAU - 1];
	}
	let case_a_placer_apres_avancement = le_train.modifierTableauRails(case_de_haut, taille);
	
	for(i = taille - 1; i >=1; i--){
		le_train.tableau[i].x = le_train.tableau[i-1].x;
		le_train.tableau[i].y = le_train.tableau[i-1].y;
		le_train.tableau[i].type_ = Type_de_train.Wagon;
	}

	if(tete_du_train.y > 0){
		le_train.tableau[0].y--;
	}
	if(tete_du_train.y === 0){
		le_train.tableau[0].y = HAUTEUR_PLATEAU - 1;
	}
	

	le_train.direction = Direction.Haut;
	dessinerTrain(le_train, plateau, contexte);
	if(le_train.presence_de_train_derriere === false){
		placerCasePlateau(plateau, queue_du_train.y, queue_du_train.x, contexte, case_a_placer_apres_avancement);
	}
	else{
		le_train.presence_de_train_derriere = false;
	}
}

function avancerTrainVersLaGauche(le_train, plateau, contexte){
	let taille = le_train.tableau.length;

	let tete_du_train = {
		x: le_train.tableau[0].x,
		y: le_train.tableau[0].y,
		type_: le_train.tableau[0].type_
	};

	let queue_du_train = {
		x: le_train.tableau[taille - 1].x,
		y: le_train.tableau[taille - 1].y,
		type_: le_train.tableau[taille - 1].type_
	};
	

	let i;
	let case_de_gauche;

	if(tete_du_train.x > 0){
		case_de_gauche = plateau.cases[tete_du_train.x-1][tete_du_train.y];
	}
	if(tete_du_train.x === 0){
		case_de_gauche = plateau.cases[LARGEUR_PLATEAU - 1][tete_du_train.y];
	}

	let case_a_placer_apres_avancement = le_train.modifierTableauRails(case_de_gauche, taille);

	for(i = taille - 1; i >=1; i--){
		le_train.tableau[i].x = le_train.tableau[i-1].x;
		le_train.tableau[i].y = le_train.tableau[i-1].y;
		le_train.tableau[i].type_ = Type_de_train.Wagon;
	}

	if(tete_du_train.x > 0){
		le_train.tableau[0].x--;
	}
	if(tete_du_train.x === 0){
		le_train.tableau[0].x = LARGEUR_PLATEAU - 1;
		
	}
	

	le_train.direction = Direction.Gauche;
	
	dessinerTrain(le_train, plateau, contexte);
	
	if(le_train.presence_de_train_derriere === false){
		placerCasePlateau(plateau, queue_du_train.y, queue_du_train.x, contexte, case_a_placer_apres_avancement);
	}
	else{
		le_train.presence_de_train_derriere = false;
	}
}

function avancerTrainVersLeBas(le_train, plateau, contexte){
	
	let taille = le_train.tableau.length;

	let tete_du_train = {
		x: le_train.tableau[0].x,
		y: le_train.tableau[0].y,
		type_: le_train.tableau[0].type_
	};

	let queue_du_train = {
		x: le_train.tableau[taille - 1].x,
		y: le_train.tableau[taille - 1].y,
		type_: le_train.tableau[taille - 1].type_
	};

	let i;
	
	let case_de_bas;

	if(tete_du_train.y < HAUTEUR_PLATEAU - 1){
		case_de_bas = plateau.cases[tete_du_train.x][tete_du_train.y+1];
	}
	if(tete_du_train.y === HAUTEUR_PLATEAU - 1){
		case_de_bas = plateau.cases[tete_du_train.x][0];
	}

	let case_a_placer_apres_avancement = le_train.modifierTableauRails(case_de_bas, taille);
	
	for(i = taille - 1; i >=1; i--){
		le_train.tableau[i].x = le_train.tableau[i-1].x;
		le_train.tableau[i].y = le_train.tableau[i-1].y;
		le_train.tableau[i].type_ = Type_de_train.Wagon;
	}

	if(tete_du_train.y < HAUTEUR_PLATEAU - 1){
		le_train.tableau[0].y++;
	}
	if(tete_du_train.y === HAUTEUR_PLATEAU - 1){
		le_train.tableau[0].y = 0;
	}


	

	le_train.direction = Direction.Bas;
	dessinerTrain(le_train, plateau, contexte);
	if(le_train.presence_de_train_derriere === false){
		placerCasePlateau(plateau, queue_du_train.y, queue_du_train.x, contexte, case_a_placer_apres_avancement);
	}
	else{
		le_train.presence_de_train_derriere = false;
	}
}

function dessinerTrain(le_train, plateau, contexte){
	let i;

	
	for(i = 0; i < le_train.tableau.length; i++){
		if(0 === i){
			switch (le_train.direction){
				case Direction.Bas :
					placerVoitureSurPlateau(plateau, le_train.tableau[i].y, le_train.tableau[i].x, contexte, Type_de_train.Locomotive_bas);
					break;
				case Direction.Gauche :
					placerVoitureSurPlateau(plateau, le_train.tableau[i].y, le_train.tableau[i].x, contexte, Type_de_train.Locomotive_gauche);
					break;
				case Direction.Haut :
					placerVoitureSurPlateau(plateau, le_train.tableau[i].y, le_train.tableau[i].x, contexte, Type_de_train.Locomotive_haut);
					break;
				case Direction.Droite :
					placerVoitureSurPlateau(plateau, le_train.tableau[i].y, le_train.tableau[i].x, contexte, Type_de_train.Locomotive_droite);
					break;
				default :
					break;
			}
		}
		else{
			placerVoitureSurPlateau(plateau, le_train.tableau[i].y, le_train.tableau[i].x, contexte, Type_de_train.Wagon);
		}
		
	}
}

function eliminerTrain(le_train, plateau, contexte){
	if(le_train){
		
		let taille=le_train.tableau.length;
		let i;
		for(i = 0; i < taille; i++){
			placerCasePlateau(plateau, le_train.tableau[i].y, le_train.tableau[i].x, contexte, le_train.tableau_type_de_rails_sous_les_roues[i]);
		}

		let index = mes_trains.indexOf(le_train);
		mes_trains.splice(index, 1);
	}
	
}

/**
 * 
 * @param {*} le_train 
 * @param {*} plateau 
 * 
 * Il verifie si le train peut bouger selon la position de la tete (la locomotive)
 * et revoie un objet contenant 2 champs
 * 1 booleen pour dire s'il peut bouger
 * et la direction
 */
function leTrainPeutIlBouger(le_train, plateau, contexte){

	let result = {
		peut_bouger: false,
		direction: null,
		next_case: null
	}

	if((le_train === null) || (le_train === undefined)){
		result.peut_bouger = false;
		return result;
	}
	
	let tete_du_train = {
		x: le_train.tableau[0].x,
		y: le_train.tableau[0].y
	};

	

	if(le_train.tableau.length >= 1){
		//on verifie s'il peut bouger vers la droite
		if(tete_du_train.x < LARGEUR_PLATEAU - 1) {
			if((Type_de_case.Rail_horizontal === plateau.cases[tete_du_train.x+1][tete_du_train.y] || 
				Type_de_case.Rail_droite_vers_haut === plateau.cases[tete_du_train.x+1][tete_du_train.y] ||
		    	Type_de_case.Rail_droite_vers_bas === plateau.cases[tete_du_train.x+1][tete_du_train.y]) &&		    
				(Type_de_case.Rail_horizontal === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_bas_vers_droite === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_haut_vers_droite === le_train.tableau_type_de_rails_sous_les_roues[0])){

				if((le_train.direction === Direction.Droite || le_train.direction === Direction.Haut || 
					le_train.direction === Direction.Bas) || (change_direction_active)){
					
					result.peut_bouger = true;
					result.direction = Direction.Droite;
					result.next_case = plateau.cases[tete_du_train.x+1][tete_du_train.y];
					return result;
				}	
			}		
						
		}
		if(tete_du_train.x === LARGEUR_PLATEAU - 1) {
			if((Type_de_case.Rail_horizontal === plateau.cases[0][tete_du_train.y] || 
				Type_de_case.Rail_droite_vers_haut === plateau.cases[0][tete_du_train.y] ||
		    	Type_de_case.Rail_droite_vers_bas === plateau.cases[0][tete_du_train.y]) &&		    
				(Type_de_case.Rail_horizontal === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_bas_vers_droite === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_haut_vers_droite === le_train.tableau_type_de_rails_sous_les_roues[0])){

				if((le_train.direction === Direction.Droite || le_train.direction === Direction.Haut || 
					le_train.direction === Direction.Bas) || (change_direction_active)){
					
					result.peut_bouger = true;
					result.direction = Direction.Droite;
					result.next_case = plateau.cases[0][tete_du_train.y];
					return result;
				}	
			}		
						
		} 
		if(tete_du_train.x < LARGEUR_PLATEAU - 1) {
			if((Type_de_train.Locomotive_droite === plateau.cases[tete_du_train.x+1][tete_du_train.y] || 
				Type_de_train.Wagon === plateau.cases[tete_du_train.x+1][tete_du_train.y] || 
				Type_de_train.Locomotive_gauche === plateau.cases[tete_du_train.x+1][tete_du_train.y] ||
				Type_de_train.Locomotive_bas === plateau.cases[tete_du_train.x+1][tete_du_train.y] ||
				Type_de_train.Locomotive_haut === plateau.cases[tete_du_train.x+1][tete_du_train.y]) &&		    
				(Type_de_case.Rail_horizontal === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_bas_vers_droite === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_haut_vers_droite === le_train.tableau_type_de_rails_sous_les_roues[0])){
				if((le_train.direction === Direction.Droite || le_train.direction === Direction.Haut || 
					le_train.direction === Direction.Bas) || (change_direction_active)){
						
					let train_en_face = getTrainInCollection(tete_du_train.x+1, tete_du_train.y);
					if(train_en_face != le_train){

						let taille = train_en_face.tableau.length;
						if(((le_train.getDirection().getDirectionOppose() != train_en_face.getDirection()) || (tete_du_train.y != train_en_face.tableau[0].y)) ){
							
							plateau.cases[tete_du_train.x+1][tete_du_train.y] = train_en_face.tableau_type_de_rails_sous_les_roues[taille-1];
							result.peut_bouger = true;
							result.direction = Direction.Droite;
							result.next_case = plateau.cases[tete_du_train.x+1][tete_du_train.y];
							train_en_face.presence_de_train_derriere = true;
							return result;
						}
						if(le_train.getDirection().getDirectionOppose() === train_en_face.getDirection()){
							if(train_en_face.vient_de_changer_sens === true){
								plateau.cases[tete_du_train.x+1][tete_du_train.y] = train_en_face.tableau_type_de_rails_sous_les_roues[taille-1];
								result.peut_bouger = true;
								result.direction = Direction.Droite;
								result.next_case = plateau.cases[tete_du_train.x+1][tete_du_train.y];
								train_en_face.presence_de_train_derriere = true;
								train_en_face.vient_de_changer_sens = false;
								return result;
								
								
							}else{
								train_en_face.a_eliminer = true;
								result.peut_bouger = false;
								return result;
							}
							
						}
					}
					
					
				}	
			}		
						
		}
		if(tete_du_train.x === LARGEUR_PLATEAU - 1) {
			if((Type_de_train.Locomotive_droite === plateau.cases[0][tete_du_train.y] || 
				Type_de_train.Wagon === plateau.cases[0][tete_du_train.y] || 
				Type_de_train.Locomotive_gauche === plateau.cases[0][tete_du_train.y] ||
				Type_de_train.Locomotive_bas === plateau.cases[0][tete_du_train.y] ||
				Type_de_train.Locomotive_haut === plateau.cases[0][tete_du_train.y]) &&		    
				(Type_de_case.Rail_horizontal === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_bas_vers_droite === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_haut_vers_droite === le_train.tableau_type_de_rails_sous_les_roues[0])){

				if((le_train.direction === Direction.Droite || le_train.direction === Direction.Haut || 
					le_train.direction === Direction.Bas) || (change_direction_active)){
					

					let train_en_face = getTrainInCollection(0, tete_du_train.y);

					if(train_en_face != le_train){
						let taille = train_en_face.tableau.length;
						if(((le_train.getDirection().getDirectionOppose() != train_en_face.getDirection()) || (tete_du_train.y != train_en_face.tableau[0].y))){
							
							plateau.cases[0][tete_du_train.y] = train_en_face.tableau_type_de_rails_sous_les_roues[taille-1];
							result.peut_bouger = true;
							result.direction = Direction.Droite;
							result.next_case = plateau.cases[0][tete_du_train.y];
							train_en_face.presence_de_train_derriere = true;
							return result;
						}
						if(le_train.getDirection().getDirectionOppose() === train_en_face.getDirection()){
							if(train_en_face.vient_de_changer_sens === true){
								plateau.cases[0][tete_du_train.y] = train_en_face.tableau_type_de_rails_sous_les_roues[taille-1];
								result.peut_bouger = true;
								result.direction = Direction.Droite;
								result.next_case = plateau.cases[0][tete_du_train.y];
								train_en_face.presence_de_train_derriere = true;
								train_en_face.vient_de_changer_sens = false;
								return result;
								
								
							}else{
								train_en_face.a_eliminer = true;
								result.peut_bouger = false;
								return result;
							}
							
						}
					}
					
				}	
			}		
						
		}//on va verifier s'il peut bouger vers la gauche
		if(tete_du_train.x > 0 ){
			if((Type_de_case.Rail_horizontal === plateau.cases[tete_du_train.x-1][tete_du_train.y] || 
				Type_de_case.Rail_bas_vers_droite === plateau.cases[tete_du_train.x-1][tete_du_train.y] ||
		    	Type_de_case.Rail_haut_vers_droite === plateau.cases[tete_du_train.x-1][tete_du_train.y]) &&		    
		    	(Type_de_case.Rail_horizontal === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_droite_vers_bas === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_droite_vers_haut === le_train.tableau_type_de_rails_sous_les_roues[0])){

					if((le_train.direction === Direction.Gauche || le_train.direction === Direction.Haut || 
						le_train.direction === Direction.Bas) || (change_direction_active)){
						
						result.peut_bouger = true;
						result.direction = Direction.Gauche;
						result.next_case = plateau.cases[tete_du_train.x-1][tete_du_train.y];
						return result;
					}
					
				
			}
						
		}
		if(tete_du_train.x === 0 ){
			if((Type_de_case.Rail_horizontal === plateau.cases[LARGEUR_PLATEAU - 1][tete_du_train.y] || 
				Type_de_case.Rail_bas_vers_droite === plateau.cases[LARGEUR_PLATEAU - 1][tete_du_train.y] ||
		    	Type_de_case.Rail_haut_vers_droite === plateau.cases[LARGEUR_PLATEAU - 1][tete_du_train.y]) &&		    
		    	(Type_de_case.Rail_horizontal === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_droite_vers_bas === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_droite_vers_haut === le_train.tableau_type_de_rails_sous_les_roues[0])){
			
				if((le_train.direction === Direction.Gauche || le_train.direction === Direction.Haut || 
					le_train.direction === Direction.Bas) || (change_direction_active)){
					result.peut_bouger = true;
					result.direction = Direction.Gauche;
					result.next_case = plateau.cases[LARGEUR_PLATEAU - 1][tete_du_train.y];
					return result;
				}
			}
						
		}
		if(tete_du_train.x > 0 ){
			if( (Type_de_train.Locomotive_droite === plateau.cases[tete_du_train.x-1][tete_du_train.y] || 
				Type_de_train.Wagon === plateau.cases[tete_du_train.x-1][tete_du_train.y] || 
				Type_de_train.Locomotive_gauche === plateau.cases[tete_du_train.x-1][tete_du_train.y] ||
				Type_de_train.Locomotive_bas === plateau.cases[tete_du_train.x-1][tete_du_train.y] ||
				Type_de_train.Locomotive_haut === plateau.cases[tete_du_train.x-1][tete_du_train.y])  &&		    
		    	(Type_de_case.Rail_horizontal === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_droite_vers_bas === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_droite_vers_haut === le_train.tableau_type_de_rails_sous_les_roues[0])){
			
					if((le_train.direction === Direction.Gauche || le_train.direction === Direction.Haut || 
						le_train.direction === Direction.Bas) || (change_direction_active)){
						
	
						let train_en_face = getTrainInCollection(tete_du_train.x-1, tete_du_train.y);

						if((train_en_face != le_train) && (le_train) && (train_en_face)){

							let taille = train_en_face.tableau.length;
							if(((le_train.getDirection().getDirectionOppose() != train_en_face.getDirection()) || (tete_du_train.y != train_en_face.tableau[0].y)) &&
								(train_en_face != le_train)){
								
								plateau.cases[tete_du_train.x-1][tete_du_train.y] = train_en_face.tableau_type_de_rails_sous_les_roues[taille-1];
								result.peut_bouger = true;
								result.direction = Direction.Gauche;
								result.next_case = plateau.cases[tete_du_train.x-1][tete_du_train.y];
								train_en_face.presence_de_train_derriere = true;
								return result;
							}
							if(le_train.getDirection().getDirectionOppose() === train_en_face.getDirection()){
								if(train_en_face.vient_de_changer_sens === true){
									plateau.cases[tete_du_train.x-1][tete_du_train.y] = train_en_face.tableau_type_de_rails_sous_les_roues[taille-1];
									result.peut_bouger = true;
									result.direction = Direction.Gauche;
									result.next_case = plateau.cases[tete_du_train.x-1][tete_du_train.y];
									train_en_face.presence_de_train_derriere = true;
									train_en_face.vient_de_changer_sens = false;
									return result;
									
									
								}else{
									train_en_face.a_eliminer = true;
									result.peut_bouger = false;
									return result;
								}
								
							}
						}
						
					}
			}
						
		}
		if(tete_du_train.x === 0 ){
			if((Type_de_train.Locomotive_droite === plateau.cases[LARGEUR_PLATEAU - 1][tete_du_train.y] || 
				Type_de_train.Wagon === plateau.cases[LARGEUR_PLATEAU - 1][tete_du_train.y] || 
				Type_de_train.Locomotive_gauche === plateau.cases[LARGEUR_PLATEAU - 1][tete_du_train.y] ||
				Type_de_train.Locomotive_bas === plateau.cases[LARGEUR_PLATEAU - 1][tete_du_train.y] ||
				Type_de_train.Locomotive_haut === plateau.cases[LARGEUR_PLATEAU - 1][tete_du_train.y])  &&		    
		    	(Type_de_case.Rail_horizontal === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_droite_vers_bas === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_droite_vers_haut === le_train.tableau_type_de_rails_sous_les_roues[0])){
			
					if((le_train.direction === Direction.Gauche || le_train.direction === Direction.Haut || 
						le_train.direction === Direction.Bas) || (change_direction_active)){
						
	
						let train_en_face = getTrainInCollection(LARGEUR_PLATEAU - 1, tete_du_train.y);

						if(train_en_face != le_train){
							
							let taille = train_en_face.tableau.length;
							if(((le_train.getDirection().getDirectionOppose() != train_en_face.getDirection()) || (tete_du_train.y != train_en_face.tableau[0].y))){
								
								plateau.cases[LARGEUR_PLATEAU - 1][tete_du_train.y] = train_en_face.tableau_type_de_rails_sous_les_roues[taille-1];
								result.peut_bouger = true;
								result.direction = Direction.Gauche;
								result.next_case = plateau.cases[LARGEUR_PLATEAU - 1][tete_du_train.y];
								train_en_face.presence_de_train_derriere = true;
								return result;
							}
							if(le_train.getDirection().getDirectionOppose() === train_en_face.getDirection()){
								if(train_en_face.vient_de_changer_sens === true){
									plateau.cases[LARGEUR_PLATEAU - 1][tete_du_train.y] = train_en_face.tableau_type_de_rails_sous_les_roues[taille-1];
									result.peut_bouger = true;
									result.direction = Direction.Gauche;
									result.next_case = plateau.cases[LARGEUR_PLATEAU - 1][tete_du_train.y];
									train_en_face.presence_de_train_derriere = true;
									train_en_face.vient_de_changer_sens = false;
									return result;
									
									
								}else{
									train_en_face.a_eliminer = true;
									result.peut_bouger = false;
									return result;
								}
								
							}
						}
						
					}
			}
						
		}
		//on va verifier s'il peut bouger vers le haut
		if(tete_du_train.y > 0){
			if((Type_de_case.Rail_vertical === plateau.cases[tete_du_train.x][tete_du_train.y-1] || 
				Type_de_case.Rail_droite_vers_bas === plateau.cases[tete_du_train.x][tete_du_train.y-1] ||
		    	Type_de_case.Rail_haut_vers_droite === plateau.cases[tete_du_train.x][tete_du_train.y-1]) &&		     
		    	(Type_de_case.Rail_vertical === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_bas_vers_droite === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_droite_vers_haut === le_train.tableau_type_de_rails_sous_les_roues[0])){
				
				if((le_train.direction === Direction.Haut || le_train.direction === Direction.Droite || 
					le_train.direction === Direction.Gauche) || (change_direction_active)){

					result.peut_bouger = true;
					result.direction = Direction.Haut;
					result.next_case = plateau.cases[tete_du_train.x][tete_du_train.y-1];
					return result;
				}
			}
						
		}
		if(tete_du_train.y > 0){
			if((Type_de_train.Locomotive_droite === plateau.cases[tete_du_train.x][tete_du_train.y-1] || 
				Type_de_train.Wagon === plateau.cases[tete_du_train.x][tete_du_train.y-1] || 
				Type_de_train.Locomotive_gauche === plateau.cases[tete_du_train.x][tete_du_train.y-1] ||
				Type_de_train.Locomotive_bas ===plateau.cases[tete_du_train.x][tete_du_train.y-1] ||
				Type_de_train.Locomotive_haut === plateau.cases[tete_du_train.x][tete_du_train.y-1])  &&		     
		    	(Type_de_case.Rail_vertical === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_bas_vers_droite === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_droite_vers_haut === le_train.tableau_type_de_rails_sous_les_roues[0])){
				
				if((le_train.direction === Direction.Haut || le_train.direction === Direction.Droite || 
					le_train.direction === Direction.Gauche) || (change_direction_active)){
				
						let train_en_face = getTrainInCollection(tete_du_train.x, tete_du_train.y-1);

						if(train_en_face != le_train){
							let taille = train_en_face.tableau.length;
							if(((le_train.getDirection().getDirectionOppose() != train_en_face.getDirection()) || (tete_du_train.x != train_en_face.tableau[0].x))){
								if(train_en_face.getDirection() === Direction.Bas){
									train_en_face.a_eliminer = true;
									result.peut_bouger = false;
									return result;
								}
								plateau.cases[tete_du_train.x][tete_du_train.y-1] = train_en_face.tableau_type_de_rails_sous_les_roues[taille-1];
								result.peut_bouger = true;
								
								result.direction = Direction.Haut;
								result.next_case = plateau.cases[tete_du_train.x][tete_du_train.y-1];
								train_en_face.presence_de_train_derriere = true;
								return result;
							}
							if(le_train.getDirection().getDirectionOppose() === train_en_face.getDirection()){
								if(train_en_face.vient_de_changer_sens === true){
									
									plateau.cases[tete_du_train.x][tete_du_train.y-1] = train_en_face.tableau_type_de_rails_sous_les_roues[taille-1];
									result.peut_bouger = true;
									result.direction = Direction.Haut;
									result.next_case = plateau.cases[tete_du_train.x][tete_du_train.y-1];
									train_en_face.presence_de_train_derriere = true;
									train_en_face.vient_de_changer_sens = false;
									return result;
									
									
								}else{
									train_en_face.a_eliminer = true;
									result.peut_bouger = false;
									return result;
								}
								
							}
						}
						
				}
			}
						
		}
		if(tete_du_train.y === 0){
			if((Type_de_case.Rail_vertical === plateau.cases[tete_du_train.x][HAUTEUR_PLATEAU - 1] || 
				Type_de_case.Rail_droite_vers_bas === plateau.cases[tete_du_train.x][HAUTEUR_PLATEAU - 1] ||
		    	Type_de_case.Rail_haut_vers_droite === plateau.cases[tete_du_train.x][HAUTEUR_PLATEAU - 1]) &&		     
		    	(Type_de_case.Rail_vertical === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_bas_vers_droite === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_droite_vers_haut === le_train.tableau_type_de_rails_sous_les_roues[0])){
				
				if((le_train.direction === Direction.Haut || le_train.direction === Direction.Droite || 
					le_train.direction === Direction.Gauche) || (change_direction_active)){

					result.peut_bouger = true;
					result.direction = Direction.Haut;
					result.next_case = plateau.cases[tete_du_train.x][HAUTEUR_PLATEAU - 1];
					return result;
				}
			}
						
		}
		if(tete_du_train.y === 0){
			if((Type_de_train.Locomotive_droite ===plateau.cases[tete_du_train.x][HAUTEUR_PLATEAU - 1] || 
				Type_de_train.Wagon === plateau.cases[tete_du_train.x][HAUTEUR_PLATEAU - 1] || 
				Type_de_train.Locomotive_gauche === plateau.cases[tete_du_train.x][HAUTEUR_PLATEAU - 1] ||
				Type_de_train.Locomotive_bas === plateau.cases[tete_du_train.x][HAUTEUR_PLATEAU - 1] ||
				Type_de_train.Locomotive_haut === plateau.cases[tete_du_train.x][HAUTEUR_PLATEAU - 1])  &&		     
		    	(Type_de_case.Rail_vertical === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_bas_vers_droite === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_droite_vers_haut === le_train.tableau_type_de_rails_sous_les_roues[0])){
				
				if((le_train.direction === Direction.Haut || le_train.direction === Direction.Droite || 
					le_train.direction === Direction.Gauche) || (change_direction_active)){
				

						let train_en_face = getTrainInCollection(tete_du_train.x, HAUTEUR_PLATEAU - 1);

						if(train_en_face != le_train){
							let taille = train_en_face.tableau.length;
							if(((le_train.getDirection().getDirectionOppose() != train_en_face.getDirection()) || (tete_du_train.x != train_en_face.tableau[0].x))){
								if(train_en_face.getDirection() === Direction.Bas){
									train_en_face.a_eliminer = true;
									result.peut_bouger = false;
									return result;
								}
								plateau.cases[tete_du_train.x][HAUTEUR_PLATEAU - 1] = train_en_face.tableau_type_de_rails_sous_les_roues[taille-1];
								result.peut_bouger = true;
								result.direction = Direction.Haut;
								result.next_case = plateau.cases[tete_du_train.x][HAUTEUR_PLATEAU - 1];
								train_en_face.presence_de_train_derriere = true;
								return result;
							}
							if(le_train.getDirection().getDirectionOppose() === train_en_face.getDirection()){
								if(train_en_face.vient_de_changer_sens === true){
									plateau.cases[tete_du_train.x][HAUTEUR_PLATEAU - 1] = train_en_face.tableau_type_de_rails_sous_les_roues[taille-1];
									result.peut_bouger = true;
									result.direction = Direction.Haut;
									result.next_case = plateau.cases[tete_du_train.x][HAUTEUR_PLATEAU - 1];
									train_en_face.presence_de_train_derriere = true;
									train_en_face.vient_de_changer_sens = false;
									return result;
								}else{
									train_en_face.a_eliminer = true;
									result.peut_bouger = false;
									return result;
								}
								
							}
						}
						
				}
			}
						
		}		//on va verifier s'il peut bouger vers le bas
		if(tete_du_train.y < HAUTEUR_PLATEAU - 1){
			
			if((Type_de_case.Rail_vertical === plateau.cases[tete_du_train.x][tete_du_train.y+1] || 
				Type_de_case.Rail_droite_vers_haut === plateau.cases[tete_du_train.x][tete_du_train.y+1] ||
		    	Type_de_case.Rail_bas_vers_droite === plateau.cases[tete_du_train.x][tete_du_train.y+1]) &&		    
		    	(Type_de_case.Rail_vertical === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_droite_vers_bas === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_haut_vers_droite === le_train.tableau_type_de_rails_sous_les_roues[0])){
			
				if((le_train.direction === Direction.Bas || le_train.direction === Direction.Droite || 
					le_train.direction === Direction.Gauche) || (change_direction_active)){

					result.peut_bouger = true;
					result.direction = Direction.Bas;
					result.next_case = plateau.cases[tete_du_train.x][tete_du_train.y+1];
					return result;
				}	
			}				
		}
		if(tete_du_train.y < HAUTEUR_PLATEAU - 1){
			if((Type_de_train.Locomotive_droite === plateau.cases[tete_du_train.x][tete_du_train.y+1] || 
				Type_de_train.Wagon === plateau.cases[tete_du_train.x][tete_du_train.y+1] || 
				Type_de_train.Locomotive_gauche === plateau.cases[tete_du_train.x][tete_du_train.y+1] ||
				Type_de_train.Locomotive_bas ===plateau.cases[tete_du_train.x][tete_du_train.y+1]||
				Type_de_train.Locomotive_haut === plateau.cases[tete_du_train.x][tete_du_train.y+1])  &&		     
		    	(Type_de_case.Rail_vertical === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_droite_vers_bas === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_haut_vers_droite === le_train.tableau_type_de_rails_sous_les_roues[0])){
				
				if((le_train.direction === Direction.Bas || le_train.direction === Direction.Droite || 
					le_train.direction === Direction.Gauche) || (change_direction_active)){
						

						let train_en_face = getTrainInCollection(tete_du_train.x, tete_du_train.y+1);

						if(train_en_face != le_train){
							let taille = train_en_face.tableau.length;
							if(((le_train.getDirection().getDirectionOppose() != train_en_face.getDirection()) || (tete_du_train.x != train_en_face.tableau[0].x))){
								if(train_en_face.getDirection() === Direction.Haut){
									train_en_face.a_eliminer = true;
									result.peut_bouger = false;
									return result;
								}
								plateau.cases[tete_du_train.x][tete_du_train.y+1] = train_en_face.tableau_type_de_rails_sous_les_roues[taille-1];
								result.peut_bouger = true;
								result.direction = Direction.Bas;
								result.next_case = plateau.cases[tete_du_train.x][tete_du_train.y+1];
								train_en_face.presence_de_train_derriere = true;
								return result;
							}
							if(le_train.getDirection().getDirectionOppose() === train_en_face.getDirection()){
								if(train_en_face.vient_de_changer_sens === true){
									plateau.cases[tete_du_train.x][tete_du_train.y+1] = train_en_face.tableau_type_de_rails_sous_les_roues[taille-1];
									result.peut_bouger = true;
									result.direction = Direction.Bas;
									result.next_case = plateau.cases[tete_du_train.x][tete_du_train.y+1];
									train_en_face.presence_de_train_derriere = true;
									train_en_face.vient_de_changer_sens = false;
									return result;
									
									
								}else{
									train_en_face.a_eliminer = true;
									result.peut_bouger = false;
									return result;
								}
								
							}
						}
						
				}
			}
						
		}
		if(tete_du_train.y === HAUTEUR_PLATEAU - 1){
			
			if((Type_de_case.Rail_vertical === plateau.cases[tete_du_train.x][0] || 
				Type_de_case.Rail_droite_vers_haut === plateau.cases[tete_du_train.x][0] ||
		    	Type_de_case.Rail_bas_vers_droite === plateau.cases[tete_du_train.x][0]) &&		    
		    	(Type_de_case.Rail_vertical === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_droite_vers_bas === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_haut_vers_droite === le_train.tableau_type_de_rails_sous_les_roues[0])){
			
				if((le_train.direction === Direction.Bas || le_train.direction === Direction.Droite || 
					le_train.direction === Direction.Gauche) || (change_direction_active)){
					
					result.peut_bouger = true;
					result.direction = Direction.Bas;
					result.next_case = plateau.cases[tete_du_train.x][0];
					return result;
				}	
			}				
		}
		if(tete_du_train.y === HAUTEUR_PLATEAU - 1){
			if((Type_de_train.Locomotive_droite === plateau.cases[tete_du_train.x][0] || 
				Type_de_train.Wagon === plateau.cases[tete_du_train.x][0] || 
				Type_de_train.Locomotive_gauche === plateau.cases[tete_du_train.x][0]||
				Type_de_train.Locomotive_bas === plateau.cases[tete_du_train.x][0]||
				Type_de_train.Locomotive_haut === plateau.cases[tete_du_train.x][0])  &&		     
		    	(Type_de_case.Rail_vertical === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_droite_vers_bas === le_train.tableau_type_de_rails_sous_les_roues[0] ||
				Type_de_case.Rail_haut_vers_droite === le_train.tableau_type_de_rails_sous_les_roues[0])){
				
				if((le_train.direction === Direction.Bas || le_train.direction === Direction.Droite || 
					le_train.direction === Direction.Gauche) || (change_direction_active)){
				

						let train_en_face = getTrainInCollection(tete_du_train.x, 0);

						if(train_en_face != le_train){
							let taille = train_en_face.tableau.length;
							if(((le_train.getDirection().getDirectionOppose() != train_en_face.getDirection()) || (tete_du_train.x != train_en_face.tableau[0].x) )){
								if(train_en_face.getDirection() === Direction.Haut){
									train_en_face.a_eliminer = true;
									result.peut_bouger = false;
									return result;
								}
								plateau.cases[tete_du_train.x][0] = train_en_face.tableau_type_de_rails_sous_les_roues[taille-1];
								result.peut_bouger = true;
								result.direction = Direction.Bas;
								result.next_case = plateau.cases[tete_du_train.x][0];
								train_en_face.presence_de_train_derriere = true;
								return result;
							}
							if(le_train.getDirection().getDirectionOppose() === train_en_face.getDirection()){
								if(train_en_face.vient_de_changer_sens === true){
									plateau.cases[tete_du_train.x][0] = train_en_face.tableau_type_de_rails_sous_les_roues[taille-1];
									result.peut_bouger = true;
									result.direction = Direction.Bas;
									result.next_case = plateau.cases[tete_du_train.x][0];
									train_en_face.presence_de_train_derriere = true;
									train_en_face.vient_de_changer_sens = false;
									return result;
									
									
								}else{
									train_en_face.a_eliminer = true;
									result.peut_bouger = false;
									return result;
								}
								
							}
						}
						
				}
			}
						
		}
		
		result.peut_bouger = false;
		return result;
		
		
	}
	
	
}



							
							



/************************************************************/
// Auditeurs
/************************************************************/

// TODO

function ajouterTrainSurLePlateau(e, plateau, contexte){
	let dim_canvas = e.target.getBoundingClientRect();
	let x = e.clientX - dim_canvas.left;
	let y = e.clientY - dim_canvas.top;
	let ligne_case = Math.floor(y/HAUTEUR_CASE);
	let colone_case = Math.floor(x/LARGEUR_CASE);

	//si aucun bouton n'a ete clique
	if(dernier_case_clique === null && dernier_train_clique === null){
		let la_case = plateau.cases[colone_case][ligne_case];
		if(Type_de_train.Locomotive_haut === la_case ||
			Type_de_train.Locomotive_bas === la_case ||
			Type_de_train.Locomotive_gauche === la_case ||
			Type_de_train.Locomotive_droite === la_case || 
			Type_de_train.Wagon === la_case){
			let t = getTrainInCollection(colone_case, ligne_case);
			if(t != null){
				change_direction_active = true;
				changerLeSensDuTrain(t, plateau, contexte);
				change_direction_active = false;
			}
		}
	}

	//si le dernier bouton clique est une case eau, foret, rail horizontal, rail vertical, virage
	else if(dernier_case_clique !== null && dernier_train_clique === null){				
		placerCasePlateau(plateau, ligne_case, colone_case, contexte, dernier_case_clique)
		//mettreOpaciteBoutonCaseA100();		
	}

	//Si le dernier boutton clique est le boutton d'ajout de train
	else if(dernier_case_clique === null && dernier_train_clique !== null){

		if(plateau.cases[colone_case][ligne_case] === Type_de_case.Rail_horizontal){
			let case_gauche_1;
			let case_gauche_2;
			let case_gauche_3;
			let case_gauche_4;
			let case_gauche_5;

			switch (dernier_train_clique) {

				case Type_de_train.Train1 : // Si on avait clique sur le boutton ajour locomotive seule L
					placerVoitureSurPlateau(plateau, ligne_case, colone_case, contexte, Type_de_train.Locomotive_droite);
					ajouterTrainDansCollection(ligne_case, colone_case, Type_de_train.Train1);
					//mettreOpaciteBoutonTrainA100();	
					break;					
				case Type_de_train.Train2 : // Si on a clique sur le boutton WL
					case_gauche_1 = placementVersLaGauchePossible(plateau, ligne_case, colone_case);
					if(case_gauche_1.est_possible){
						placerVoitureSurPlateau(plateau, ligne_case, colone_case, contexte, Type_de_train.Locomotive_droite);
						placerVoitureSurPlateau(plateau, case_gauche_1.x, case_gauche_1.y, contexte, Type_de_train.Wagon);
						ajouterTrainDansCollection(ligne_case, colone_case, Type_de_train.Train2);
						//mettreOpaciteBoutonTrainA100();				
					}
					else{
						//mettreOpaciteBoutonTrainA100();
					}
					break;
				case Type_de_train.Train4 : //Si on clique sur le boutton WWWL						
					case_gauche_1 = placementVersLaGauchePossible(plateau, ligne_case, colone_case);
					if(case_gauche_1.est_possible){
						case_gauche_2 = placementVersLaGauchePossible(plateau, case_gauche_1.x, case_gauche_1.y);
						if(case_gauche_2.est_possible){
							case_gauche_3 = placementVersLaGauchePossible(plateau, case_gauche_2.x, case_gauche_2.y);
							if(case_gauche_3.est_possible){
								placerVoitureSurPlateau(plateau, ligne_case, colone_case, contexte, Type_de_train.Locomotive_droite);
								placerVoitureSurPlateau(plateau, case_gauche_1.x, case_gauche_1.y, contexte, Type_de_train.Wagon);
								placerVoitureSurPlateau(plateau, case_gauche_2.x, case_gauche_2.y, contexte, Type_de_train.Wagon);
								placerVoitureSurPlateau(plateau, case_gauche_3.x, case_gauche_3.y, contexte, Type_de_train.Wagon);
								ajouterTrainDansCollection(ligne_case, colone_case, Type_de_train.Train4);
							}
						}
						
					}						
					//mettreOpaciteBoutonTrainA100();
					break;
				case Type_de_train.Train6 : //Si on clique sur le boutton WWWWWWL
					case_gauche_1 = placementVersLaGauchePossible(plateau, ligne_case, colone_case);
					if(case_gauche_1.est_possible){
						case_gauche_2 = placementVersLaGauchePossible(plateau, case_gauche_1.x, case_gauche_1.y);
						if(case_gauche_2.est_possible){
							case_gauche_3 = placementVersLaGauchePossible(plateau, case_gauche_2.x, case_gauche_2.y);
							if(case_gauche_3.est_possible){
								case_gauche_4 = placementVersLaGauchePossible(plateau, case_gauche_3.x, case_gauche_3.y);
								if(case_gauche_4.est_possible){
									case_gauche_5 = placementVersLaGauchePossible(plateau, case_gauche_4.x, case_gauche_4.y);
									if(case_gauche_5.est_possible){
										placerVoitureSurPlateau(plateau, ligne_case, colone_case, contexte, Type_de_train.Locomotive_droite);
										placerVoitureSurPlateau(plateau, case_gauche_1.x, case_gauche_1.y, contexte, Type_de_train.Wagon);
										placerVoitureSurPlateau(plateau, case_gauche_2.x, case_gauche_2.y, contexte, Type_de_train.Wagon);
										placerVoitureSurPlateau(plateau, case_gauche_3.x, case_gauche_3.y, contexte, Type_de_train.Wagon);
										placerVoitureSurPlateau(plateau, case_gauche_4.x, case_gauche_4.y, contexte, Type_de_train.Wagon);
										placerVoitureSurPlateau(plateau, case_gauche_5.x, case_gauche_5.y, contexte, Type_de_train.Wagon);
										ajouterTrainDansCollection(ligne_case, colone_case, Type_de_train.Train6);
									}
								}
							}
						}
						//mettreOpaciteBoutonTrainA100();
						break;
					}

			}
		}else{
			//mettreOpaciteBoutonTrainA100();
		}
	
	}
	else{
		
	}

	
	
}

function mettreEnMarche(plateau, contexte){
	if(mes_trains.length > 0 && en_marche){

		mes_trains.forEach((arg) => {
			if((arg != null) && (arg != undefined) && (arg.bloque === false) && (mes_trains.bloque === false)){
				demarrerLeTrain(arg, plateau, contexte);
			}
			
			//setTimeout(demarrerLeTrain, 500, arg, plateau, contexte); //first version			
		});
		if(en_marche){
			setTimeout(mettreEnMarche, 500, plateau, contexte);
		}
		
		return;
	}
	return;
}

function changerLeSensDuTrain(le_train, plateau, contexte){
	let taille = le_train.tableau.length;
	let i;
	let temp;
	for(i = 0; i < parseInt(taille/2); i++){
		temp = le_train.tableau[i];
		le_train.tableau[i] = le_train.tableau[taille - 1 - i];
		le_train.tableau[taille - 1 - i] = temp;
		

		temp =le_train.tableau_type_de_rails_sous_les_roues[i];
		le_train.tableau_type_de_rails_sous_les_roues[i] = le_train.tableau_type_de_rails_sous_les_roues[taille - 1 - i];
		le_train.tableau_type_de_rails_sous_les_roues[taille - 1 - i] = temp;

	}

	if(taille === 1){
		le_train.setDirection(le_train.getDirection().getDirectionOppose());
	}
	else{
		let peut_bouger_vers = leTrainPeutIlBouger(le_train, plateau);
		if(peut_bouger_vers.peut_bouger){
			le_train.setDirection(peut_bouger_vers.direction);
			le_train.vient_de_changer_sens = true;
		}
	}
	
	dessinerTrain(le_train, plateau, contexte);
	

	
}

/**
 * Retourne un train du tableau de train
 * prend en parametre les corrdonnees x, y d'une case du plateau
 * et verifie si dans cette case du plateau il y a une voiture d'un train
 * si oui, renvoie le train en question
 * sinon null
 */
function getTrainInCollection(posX, posY){
	let taille1 = mes_trains.length;
	let taille2;
	let i;
	let j;
	let temp;
	for(i = 0 ; i < taille1; i++){
		temp = mes_trains[i];
		taille2 = temp.tableau.length;
		for(j=0; j <taille2; j++){
			if(posX === temp.tableau[j].x && posY === temp.tableau[j].y){
				return temp;
			}
		}
	}
	return null;
}
/*
function mettreEnPause(){
	en_marche = false;
}*/




/************************************************************/
// Plateau de jeu initial
/************************************************************/


function cree_plateau_initial(plateau){
	// Circuit
	plateau.cases[12][7] = Type_de_case.Rail_horizontal;
	plateau.cases[13][7] = Type_de_case.Rail_horizontal;
	plateau.cases[14][7] = Type_de_case.Rail_horizontal;
	plateau.cases[15][7] = Type_de_case.Rail_horizontal;
	plateau.cases[16][7] = Type_de_case.Rail_horizontal;
	plateau.cases[17][7] = Type_de_case.Rail_horizontal;
	plateau.cases[18][7] = Type_de_case.Rail_horizontal;
	plateau.cases[19][7] = Type_de_case.Rail_droite_vers_haut;
	plateau.cases[19][6] = Type_de_case.Rail_vertical;
	plateau.cases[19][5] = Type_de_case.Rail_droite_vers_bas;
	plateau.cases[12][5] = Type_de_case.Rail_horizontal;
	plateau.cases[13][5] = Type_de_case.Rail_horizontal;
	plateau.cases[14][5] = Type_de_case.Rail_horizontal;
	plateau.cases[15][5] = Type_de_case.Rail_horizontal;
	plateau.cases[16][5] = Type_de_case.Rail_horizontal;
	plateau.cases[17][5] = Type_de_case.Rail_horizontal;
	plateau.cases[18][5] = Type_de_case.Rail_horizontal;
	plateau.cases[11][5] = Type_de_case.Rail_haut_vers_droite;
	plateau.cases[11][6] = Type_de_case.Rail_vertical;
	plateau.cases[11][7] = Type_de_case.Rail_bas_vers_droite;

	// Segment isolé à gauche
	plateau.cases[0][7] = Type_de_case.Rail_horizontal;
	plateau.cases[1][7] = Type_de_case.Rail_horizontal;
	plateau.cases[2][7] = Type_de_case.Rail_horizontal;
	plateau.cases[3][7] = Type_de_case.Rail_horizontal;
	plateau.cases[4][7] = Type_de_case.Rail_horizontal;
	plateau.cases[5][7] = Type_de_case.Eau;
	plateau.cases[6][7] = Type_de_case.Rail_horizontal;
	plateau.cases[7][7] = Type_de_case.Rail_horizontal;

	// Plan d'eau
	for(let x = 22; x <= 27; x++){
		for(let y = 2; y <= 5; y++){
			plateau.cases[x][y] = Type_de_case.Eau;
		}
	}

	// Segment isolé à droite
	plateau.cases[22][8] = Type_de_case.Rail_horizontal;
	plateau.cases[23][8] = Type_de_case.Rail_horizontal;
	plateau.cases[24][8] = Type_de_case.Rail_horizontal;
	plateau.cases[25][8] = Type_de_case.Rail_horizontal;
	plateau.cases[26][8] = Type_de_case.Rail_bas_vers_droite;
	plateau.cases[27][8] = Type_de_case.Rail_horizontal;
	plateau.cases[28][8] = Type_de_case.Rail_horizontal;
	plateau.cases[29][8] = Type_de_case.Rail_horizontal;

	// TCHOU
	plateau.cases[3][10] = Type_de_case.Eau;
	plateau.cases[4][10] = Type_de_case.Eau;
	plateau.cases[4][11] = Type_de_case.Eau;
	plateau.cases[4][12] = Type_de_case.Eau;
	plateau.cases[4][13] = Type_de_case.Eau;
	plateau.cases[4][13] = Type_de_case.Eau;
	plateau.cases[5][10] = Type_de_case.Eau;

	plateau.cases[7][10] = Type_de_case.Eau;
	plateau.cases[7][11] = Type_de_case.Eau;
	plateau.cases[7][12] = Type_de_case.Eau;
	plateau.cases[7][13] = Type_de_case.Eau;
	plateau.cases[8][10] = Type_de_case.Eau;
	plateau.cases[9][10] = Type_de_case.Eau;
	plateau.cases[8][13] = Type_de_case.Eau;
	plateau.cases[9][13] = Type_de_case.Eau;

	plateau.cases[11][10] = Type_de_case.Eau;
	plateau.cases[11][11] = Type_de_case.Eau;
	plateau.cases[11][12] = Type_de_case.Eau;
	plateau.cases[11][13] = Type_de_case.Eau;
	plateau.cases[12][11] = Type_de_case.Eau;
	plateau.cases[13][10] = Type_de_case.Eau;
	plateau.cases[13][11] = Type_de_case.Eau;
	plateau.cases[13][12] = Type_de_case.Eau;
	plateau.cases[13][13] = Type_de_case.Eau;

	plateau.cases[15][10] = Type_de_case.Eau;
	plateau.cases[15][11] = Type_de_case.Eau;
	plateau.cases[15][12] = Type_de_case.Eau;
	plateau.cases[15][13] = Type_de_case.Eau;
	plateau.cases[16][10] = Type_de_case.Eau;
	plateau.cases[16][13] = Type_de_case.Eau;
	plateau.cases[17][10] = Type_de_case.Eau;
	plateau.cases[17][11] = Type_de_case.Eau;
	plateau.cases[17][12] = Type_de_case.Eau;
	plateau.cases[17][13] = Type_de_case.Eau;

	plateau.cases[19][10] = Type_de_case.Eau;
	plateau.cases[19][11] = Type_de_case.Eau;
	plateau.cases[19][12] = Type_de_case.Eau;
	plateau.cases[19][13] = Type_de_case.Eau;
	plateau.cases[20][13] = Type_de_case.Eau;
	plateau.cases[21][10] = Type_de_case.Eau;
	plateau.cases[21][11] = Type_de_case.Eau;
	plateau.cases[21][12] = Type_de_case.Eau;
	plateau.cases[21][13] = Type_de_case.Eau;
}

function loadDesertMap(plateau){
	cree_plateau_initial(plateau);
	for(let x = 3; x <= 22; x++){
		for(let y = 10; y <= 13; y++){
			plateau.cases[x][y] = Type_de_case.Sable;
		}
	}
	plateau.cases[22][2] = Type_de_case.Cactus;
	plateau.cases[22][3] = Type_de_case.Chameau;
	plateau.cases[22][4] = Type_de_case.Palmier;
	plateau.cases[22][5] = Type_de_case.Palmier;
	plateau.cases[23][6] = Type_de_case.Chameau;
	plateau.cases[5][7] = Type_de_case.Rail_horizontal;
	plateau.cases[3][5] = Type_de_case.Cactus;
	plateau.cases[6][8] = Type_de_case.Cactus;
	plateau.cases[10][20] = Type_de_case.Cactus;
	plateau.cases[15][10] = Type_de_case.Cactus;
	plateau.cases[1][3] = Type_de_case.Cactus;
	plateau.cases[21][13] = Type_de_case.Cactus;
	plateau.cases[10][14] = Type_de_case.Chameau;
}

function loadIslandMap(plateau){
	cree_plateau_initial(plateau);
	plateau.cases[5][7] = Type_de_case.Rail_horizontal;
	plateau.cases[11][4] = Type_de_case.Sable;
	plateau.cases[12][4] = Type_de_case.Sable;
	plateau.cases[13][4] = Type_de_case.Sable;
	plateau.cases[14][4] = Type_de_case.Sable;
	plateau.cases[15][4] = Type_de_case.Sable;
	plateau.cases[16][4] = Type_de_case.Sable;
	plateau.cases[17][4] = Type_de_case.Sable;
	plateau.cases[18][4] = Type_de_case.Sable;
	plateau.cases[19][4] = Type_de_case.Sable;
	plateau.cases[10][5] = Type_de_case.Sable;
	plateau.cases[20][5] = Type_de_case.Sable;
	plateau.cases[10][6] = Type_de_case.Sable;
	plateau.cases[12][6] = Type_de_case.Sable;
	plateau.cases[10][7] = Type_de_case.Sable;
	plateau.cases[20][7] = Type_de_case.Sable;
	plateau.cases[11][8] = Type_de_case.Sable;
	plateau.cases[12][8] = Type_de_case.Sable;
	plateau.cases[13][8] = Type_de_case.Sable;
	plateau.cases[14][8] = Type_de_case.Sable;
	plateau.cases[15][8] = Type_de_case.Sable;
	plateau.cases[16][8] = Type_de_case.Sable;
	plateau.cases[17][8] = Type_de_case.Sable;
	plateau.cases[18][8] = Type_de_case.Sable;
	plateau.cases[19][8] = Type_de_case.Sable;
	plateau.cases[13][6] = Type_de_case.Palmier;
	plateau.cases[14][6] = Type_de_case.Maison;
	plateau.cases[15][6] = Type_de_case.Palmier;
	plateau.cases[16][6] = Type_de_case.Sable;
	plateau.cases[17][6] = Type_de_case.Sable;
	plateau.cases[18][6] = Type_de_case.Sable;
	plateau.cases[20][6] = Type_de_case.Sable;
	plateau.cases[10][8] = Type_de_case.Bateau;
	plateau.cases[8][12] = Type_de_case.Bateau;

}

/************************************************************/
// Fonction principale
/************************************************************/

function tchou(){
	console.log("Tchou, attention au départ !");
	/*------------------------------------------------------------*/
	// Variables DOM
	/*------------------------------------------------------------*/
	const contexte = document.getElementById('simulateur').getContext("2d");
	
	// NOTE: ce qui suit est sûrement à réécrire intégralement

	// Création du plateau
	let plateau = new Plateau(Type_de_case.Foret);
	cree_plateau_initial(plateau);

	// Dessine le plateau
	dessine_plateau(contexte, plateau);

	//Quns on clique sur un boutton en bas du plateau
	document.querySelectorAll("button").forEach((arg) => {
		arg.addEventListener("click", () => {
			switch (arg.id) {
				case "bouton_foret" :	
					updateDernierBoutonClique(Type_de_case.Foret);
					break;
				case  "bouton_eau":
					updateDernierBoutonClique(Type_de_case.Eau);
					break;
				case  "bouton_rail_horizontal":
					updateDernierBoutonClique(Type_de_case.Rail_horizontal);
					break;
				case  "bouton_rail_vertical":
					updateDernierBoutonClique(Type_de_case.Rail_vertical);
					break;
				case  "bouton_rail_droite_vers_haut":
					updateDernierBoutonClique(Type_de_case.Rail_droite_vers_haut);
					break;
				case  "bouton_rail_haut_vers_droite":
					updateDernierBoutonClique(Type_de_case.Rail_haut_vers_droite);
					break;
				case  "bouton_rail_droite_vers_bas":
					updateDernierBoutonClique(Type_de_case.Rail_droite_vers_bas);
					break;
			 	case  "bouton_rail_bas_vers_droite":
					updateDernierBoutonClique(Type_de_case.Rail_bas_vers_droite);
					break;
				case "bouton_train_1" :
					updateDernierTrainClique(Type_de_train.Train1);
					break;
				case "bouton_train_2" :
					updateDernierTrainClique(Type_de_train.Train2);
					break;
				case "bouton_train_4" :
					updateDernierTrainClique(Type_de_train.Train4);
					break;
				case "bouton_train_6" :
					updateDernierTrainClique(Type_de_train.Train6);
					break;
				case "bouton_pause" :
					updateBoutonPause();
					if(en_marche){
						en_marche = false;
						
					}
					else{
						en_marche = true;
						
						mettreEnMarche(plateau, contexte);
						
					}
					break;
				case "change_direction" :
					if(1){
						change_direction_active = true;
						mes_trains.bloque = true
						mes_trains.forEach((arg) => {
							arg.bloque = true;							
						});

						mes_trains.forEach((arg) => {
							changerLeSensDuTrain(arg, plateau, contexte);
							
						});

						mes_trains.forEach((arg) => {
							arg.bloque = false;
							
						});
						change_direction_active = false;
						mes_trains.bloque = false;
					}
					
					break;	
				case "desert" :
					plateau = new Plateau(Type_de_case.Sable);
					loadDesertMap(plateau);
					dessine_plateau(contexte, plateau);
					break;
				case "île" :
					plateau = new Plateau(Type_de_case.Eau);
					loadIslandMap(plateau);
					dessine_plateau(contexte, plateau);
					break;
				case "retour" :
					tchou();
					break;			
			}
		});
		
	});


	/**
	 * ajout d'un auditeur pour traiter les clics sur l'ecran
	 * il gere les cas ou il y a deja un boutton enfoce
	 */
	document.getElementById("simulateur").addEventListener("click", (e) => {
		ajouterTrainSurLePlateau(e, plateau, contexte);
	});


}

/************************************************************/
// Programme principal
/************************************************************/
// NOTE: rien à modifier ici !
window.addEventListener("load", () => {
	// Appel à la fonction principale
	tchou();
});
