# Real Time Web

> ## [Heroku spaceCoders](https://r2d2-team.herokuapp.com/)
><img src="https://user-images.githubusercontent.com/13199349/113708240-46871d00-96e1-11eb-8bf9-a5589536d812.png"></img>


## Problem

Our current team website shows us but it doesn't allow us to chat while we are on this webpage, thus we decided add a real-time chat functionality.

## Solution

To implement this we will consider using socket.io for a real-time connection and have a discussion platform on our website.
For this we need the following **dependencies**:

- [Express](https://www.npmjs.com/package/express) Unopinionated web framework for node.
- [Socket.io](https://www.npmjs.com/package/socket.io) Real-time bi-directional event-based communication.

To create a basic 'chatbox' the easiest way would be to create a form with an unordered list. The list will get children whenever a user sends a message.

### Socket.io

Our implementation of socket.io is relatively simple, it follows the example on [socket.io](https://socket.io/get-started/private-messaging-part-1/) and the [example Justus showed us](https://github.com/ju5tu5/barebonechat).

The clients navigate to our website and are greeted with our faces and a chatbox on the rightside <sub>(desktop format)</sub>. This established a socket connection that persists with each connected user. Everytime someone sends a message socket.io relays this event to the other clients.

![Socket.io communication](https://user-images.githubusercontent.com/13199349/113706950-851bd800-96df-11eb-86b0-82f44f54190a.jpg)


### Coding Style

To have a basic styleguide in our code we will make use of linters.
See [standardjs](https://standardjs.com/rules.html) for a more in-depth guideline of the linter.

### Static files

To have the application as simple as possible we will be serving the golden trio, HTML, CSS and JS.
The express server sends the HTML to the client's browser which in turn interprets it and shows our wonderful faces.

### Heroku
We have been using the automatic deployment feature of heroku.
The one thing we had to take care of is using a process environment variable for the port. This way Heroku decides which port it can use.
```JS
  const port = process.env.PORT || 3000
```
## Insights
The following insights have been generated while discussing and developing this project:

- Socket.io is a bi-directional event based communication method.
- We going to write a lot of markdown.
- Real-Time-Web is the most technological project of this minor.
- We will work in a Readme-Driven Development (RDD).

## Sources
The following sources have been used to develop this project:

https://socket.io/get-started/chat/  
https://github.com/ju5tu5/barebonechat  
https://devcenter.heroku.com/articles/github-integration  
https://standardjs.com/rules.html  

## Authors

[Stan Bankras](https://github.com/StanBankras)  
[Oussama Fahchouch](https://github.com/ofahchouch-gh)  
[Rowin Ruizendaal](https://github.com/RowinRuizendaal)  
[Johan van Beusekom](https://github.com/johancvb)  
[Nathan Bommezijn](https://github.com/dewarian)  
[Sergio Eijben](https://github.com/HappyPantss)  
[Sam Slotenmaker](https://github.com/SamSlotemaker)  

## License

Copyright 2021 spaceCoders

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
