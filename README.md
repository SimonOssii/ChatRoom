Description
========================

Backend
------------

nodejs + express + socket.io

Frontend
--------------

jQuery + swig + bootstrap 

How to use
=========================

First:
-------------

    git clone https://github.com/SimonOssii/ChatRoom.git

Install
-----------

    npm install
    
Config server
----------------

You should change ``io.connect()`` in ``public/js/index.js``.

Change your server ip like this ``var socket = io.connect("http://server_ip")``.

Start
---------

    sudo node app.js 
    
Add your own mood images
------------------------------

You can add your own mood images in ``public/imgs/``


And then?
------------

Open your browser, and type ``http://localhost:3000`` , LET'S CHAT ONLINE

Login
--------------

![](https://raw2.github.com/SimonSun1988/ChatRoom/master/demo_image/login.png)

ChatRoom
------------------
![](https://raw2.github.com/SimonSun1988/ChatRoom/master/demo_image/index.png)

Chat!!!!
-------------

![](https://raw2.github.com/SimonSun1988/ChatRoom/master/demo_image/sendImage.png)
