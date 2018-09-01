SentiFine Web Application
=============

This repository was offline forked from an example of [the demo of Keystone](http://keystonejs.com) application. You can experience the original one at http://demo.keystonejs.com. For this git, you can visit at http://sentifine.me.

Briefly about my modification. I have already removed some basic functions of keystonejs such as blog, gallery, daily script for demo site. I also fixed the theme of this site with theme Paper by Bootswatch, and created my own model for my own purpose. Below instruction was originally written by keystonejs and I adjusted some parts for the real use of my current code.


# Install & Set up the environment

Starting by below command:

    git clone https://github.com/ammiiamm/sentifine-v6.git
    cd sentifine-v6
    npm install

Then, create a `.env` file in the project folder (the one with this readme) and fill in the following values:

    CLOUDINARY_URL={your cloudinary url}
    MANDRILL_APIKEY={your mandrill api key}
    MANDRILL_USERNAME={your mandrill username}
    EMBEDLY_APIKEY={your embedly key}

**This file is ignored by the default .gitignore settings. When you put your project into production, replicate the env variables above, and add settings for the following:**

    NODE_ENV=production
    COOKIE_SECRET={a random string to encrypt cookies}
    MONGO_URI={your mongo connection uri} // can also be MONGOLAB_URI
    GA_DOMAIN={your google analytics domain} // optional
    GA_PROPERTY={your google analytics property} // optional
    PORT={the port to listen on} // defaults to 3000 but I used 3001 for my own server


### Installing MongoDB

By default, KeystoneJS will look for a MongoDB server running on localhost on the default port, and connect to it. If you're getting errors related to the MongoDB connection, make sure your MongoDB server is running.

You can find more information on how to install MongoDB and other dependencies on our [generator-keystone](https://github.com/keystonejs/generator-keystone) README.

### Configuring the project defaults

Open **keystone.js** and update the name and brand to your own project.

You can also change the other settings in this file (locals, nav, etc.) as you develop your project.


### Replacing the demo account

Open **./updates/0.0.1-admins.js** and update the array of initial admin users to your own.

Also remove the line that says `newAdmin.isProtected = true;` so you can change your password.

When you run your app in production, it is strongly recommended you change your password immediately from the default in this file.

### Run it!

`node keystone`

You should see in your console:

`{your app name} is ready on port 3001`

### Make it your own

Now you can start modifying the demo site and customising it as your own.

Some places to start:

*   `routes/index.js` - this is the file that binds urls to specific view controllers. Files in `./routes/views/*.js` are automatically imported as `routes.views.{script}` ready to be bound.
*   `./templates` - this is the folder that holds the templates for your views. It would typically match the structure of your `./routes` folder fairly closely.
*   `./public` - all the files in this folder are served as static assets for your site. Customise and add your own css, client-side javascript, images, etc. here. Any `.less` files will be automatically compiled into `.css` files.
*   `./models` - these files are included by `./models/index.js` and each one sets up a different database model in your application. If you add more, be sure to add them to the index file!

Check out the [Keystone Guide](http://keystonejs.com/guide) for documentation.

## License

(The MIT License)

Copyright (c) 2014 Jed Watson

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# geekathon
