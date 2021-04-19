### Multiplayer snake game

> [Made for Real-Time Web](https://github.com/cmda-minor-web/real-time-web-2021)


**Important note: You might have to lower your sound before playing a game :)**

### App description

Snake is the common name for a video game concept where the player maneuvers a line which grows in length, with the line itself being a primary obstacle. The concept originated in the 1976 arcade game Blockade, and the ease of implementing Snake has led to hundreds of versions (some of which have the word snake or worm in the title) for many platforms.

The player who goes out of the grid loses, also if there a collision between the two players, the player who caused the collision loses the match


### Live demo:

[Multiplayer snake](https://realtime-web.herokuapp.com/)



### :pushpin: Table of contents

- [Concepts](#Concept-&-sketches)
- [Chosen concept](#Chosen-concept)
- [What does this app do?](#What-does-this-app-do)
- [Wishlist](#Wishlist)
- [Used packages](#Used-packages)
- [Install the app](#Install-the-application)
- [Sources](#Sources)


#### Realtime twitter tweets


#### Multiplayer snake game

2 players will battle each other in a snake battle, This game allows multiple users to control their own snake, the best snake that survives the longest, wins the game. The player can choose to make a new room or invite friends into their room.

![Homepage](https://raw.githubusercontent.com/RowinRuizendaal/real-time-web-2021/feature/individual-project/img/snake.png)


### Chosen concept


The concept that I've chosen is: Multiplayer snake game


### What does this app do

- Create room
- Join room (with gamecode)
- Detects how many players are in the room
- Copy gamecode
- Play a harder version of snake
- Plays music during the match (Doom :fire:)
- Detects if player goes out of grid
- Detects if there is any collision between the players
- Supports 2 players at a time
- Supports seperate rooms


### Wishlist

#### Must haves
- [x] Create room for players to join the game
- [x] Other player is able to join the room
- [x] Player is able to see their gamecode and send invite link
- [x] In each game there is a winner
- [x] Snake food is begin generated in the grid



#### Should haves

- [x] Match has a countdown before the game begins
- [ ] Choose snake color
- [ ] Choose game theme
- [ ] Change models
- [ ] setup database for scores/time





### Used packages

[dotenv](https://www.npmjs.com/package/dotenv) : 

Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.

[ejs](https://www.npmjs.com/package/ejs) : 

Embedded JavaScript templates

[express](https://www.npmjs.com/package/express) :

Fast, unopinionated, minimalist web framework for node.

[express-router](https://www.npmjs.com/package/express-router) : 

express-router lets you write your express routes in a simpler way. You just have to create a 'routes' folder inside your project and place your routes in an index.txt file.

[nodemon](https://www.npmjs.com/package/nodemon)

nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.

[socket.io](https://www.npmjs.com/package/socket.io)

Socket io enables real-time bidirectional event-based communication


### Install the application

#### Clone the repository

> git clone https://github.com/RowinRuizendaal/Multiplayer-Snake.git

#### install the application

Cd to the multiplayer snake game directory and:

> NPM install

or install it with yarn:

> Yarn install

Once you have installed the project, execute the following command within your code editor:

> npm run dev






### Sources


### Dataflow

![Homepage](https://raw.githubusercontent.com/RowinRuizendaal/real-time-web-2021/feature/individual-project/img/flow.png)





### Shoutout

[vuurvos1](https://github.com/vuurvos1) :

> Helping me with Math logic

