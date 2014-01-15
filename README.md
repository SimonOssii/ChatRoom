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

Start
---------

    sudo node app.js 

And then?
------------

Open your browser, and type ``http://localhost:3000`` , LET'S CHAT ONLINE

Config server
----------------

You should change ``io.connect()`` in ``public/js/index.js``.

Change your server ip like this ``var socket = io.connect("http://server_ip")``.
