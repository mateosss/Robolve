# Robolve
**A tower deffense game with robots, that evolve.**

Robolve is not finished yet, it's a prototype for a personal project, so be
aware of crazy robots walking away to who-knows-where, and other strange things.

## What is?

Robolve is a tower deffense game, in which the robot waves are generated through
a [*"Genetic Algorithm"*](http://www.ai-junkie.com/ga/intro/gat1.html), so the
waves adapt to your deffenses, and you can adapt to the waves customizing your
deffenses. (e.g. if you have many fire deffenses, the waves will start to turn
to the water element, because water > fire)

## What is a genetic algorithm?

A genetic algorithm, to make it short, is a specific kind of algorithm that
shines in finding solutions to dynamic problems, where the problem is always
changing (In this case the problem is the player), it is not used to get
deterministics results (like solving a lineal ecuation), but to obtain a good
enough aproximation to the solution.

There are called Genetic because they try to imitate the behaviour of evolution
having individuals (possible solutions), that have a certain level of adaptation
(how good they are), and this individuals are combined between them following
the survival of the fittest approach (better solutions pass down their genes
to the next generation).

In robolve, the robots are the individuals, the waves are the generations, and
how good the robots perform is the level of fitness. The genes in the robots are
their parts, their elements, their attack speeds, their damage, all their stats.

To know more about genetic algorithms read this three page article:
[http://www.ai-junkie.com/ga/intro/gat1.html](http://www.ai-junkie.com/ga/intro/gat1.html)

## How to play / Downloads

For now you can play Robolve in this ways:
  - **Android:** greater than 4.4, download and install the .apk:
  [https://mega.nz/#!x1sCWTqa!8gTskCOKfjAIRRLTMiWEkXDdbpI4PScUJJTgnQY2l2A](https://mega.nz/#!x1sCWTqa!8gTskCOKfjAIRRLTMiWEkXDdbpI4PScUJJTgnQY2l2A)
  - **Linux:** 64 bits, download the zip, extract and run the "MyGame" executable: [https://mega.nz/#!BxtCnDCI!PJtK1mmMecXWf2RSVjhHrYcearF9X6uGJ_BvAPURjJc](https://mega.nz/#!BxtCnDCI!PJtK1mmMecXWf2RSVjhHrYcearF9X6uGJ_BvAPURjJc)
  - **Browser:** firefox/chrome, you can play robolve directly from this link: [robolve.tk](http://robolve.tk)  

    Note: robolve.tk refers to a Public dropbox folder, Public dropbox folders
    will be removed on October 3th this year (2016), so if I haven't update this
    readme by that time, let me know opening an issue.

There are currently 3 levels select one and play.
- Placing a deffense costs $300
- Modifying a deffense attribute costs $100
- Destroying a turret gives you $50
- Killing a robot gives you $30

There are 3 elements that act like rock, paper and scissors

*electric > water > fire > electric > water ...*

- A deffense with an advantaged element compared to the target robot, hits double damage
- A deffense with a disadvantaged element compared to the target robot, hits half damage
- A deffense with the same element as the target robot hits normally

The robots that have wheels are flying robots (Yup, thats right)
The robot with normal legs are walking robots
A turret can only hit one type of robot (flying or walkin), choose wisely

A final recomendation, after winning/loosing a level, it is better if you restart
Robolve (close and open / reload the page) because there are still many bugs in the game

I hope you enjoy Robolve!
