
# Simulateur de trains

Ce document a pour but d'expliquer les fonctionnalités que nous avons implémenté lors de la seconde partie.


## Auteurs
- Amazigh ALLOUN n°étu : 12007813
- Dieunel MARCELIN n°étu : 12207041

## Gestion des collisions 
***version 1***
Toutes les collisions ont été traitées comme demandé dans l'énoncé.

***Version 2***
Tout ce qui se trouve dans la version 1. 2 trains qui se trouvent collés l'un derrière l'autre peuvent changer de direction sans problème s'ils se trouvent en ligne droite. Par contre, si l'un d'entre eux se trouvent sur un virage, il y a 1 chance sur 2 que tout se passe correctement.

## Ajout de fonctionnalités
Dans la version 2 
- Les trains peuvent sortir du plateau et réapparaitre à l'autre bout (quand un train arrive au bout de son chemin à droite, sa tête ressort du coté gauche dans la 1ere colonne, et ainsi de suite)

- On peut changer la direction d'un train en cliquant sur ce train sur le plateau, qu'il soit en marche ou pas. La direction de marche train est inversée ainsi que sa position (la tête de vient la queue et la queue devient la tête)

- L'utilisateur peut changer la direction de tous les trains présents sur le plateau en cliquant sur un bouton du plateau (bouton : C-S).

## Layout

nous avons apporté quelques modifications à l'aspect général de la page, notamment en:
- Affichant à la place des boutons textuels, des images représenant le type de case de chacun de ces derniers.
- Ajoutant de nouvelles images pour améliorer les visuels, grâce à un pack de texture minecraft et plusieurs sprites en 2D trouvés sur différents sites internet.
- Fixant les boutons sur la partie gauche de la page, jusque là inutilisée pour optimiser l'espace donné.

## Nouvelles maps
Nous avons ajouté, en plus de la configuration intiale, deux nouvelles maps que l'on peut charger en cliquant sur les boutons :
- Desert : celui-ci charge une map desertique où les trains circulent entre oasis, chameaux et cactus.
- Île : cette map insulaire reprend le ciruit et le place sur une petite île, avec quelques palmiers et maisons.
Nous avons également mis à disposition un bouton permettant de retrouver la configuration initiale.

## Release Date
May 12, 2024