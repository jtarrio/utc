# UTC time display

A webpage that shows the current UTC time.

See it in action at https://ea1iti.es/utc/

This webpage synchronizes with the server hosting it to show the correct time even if the computer's clock is imprecise.

# Requirements

A web server running NTP or other precise time source, running the Apache web server with the Alias and Header modules installed. No CGI, Perl, PHP, or other modules are required.

# Building

## Setup

Install node.js and execute the following command to install the dependencies:

```shell
$ npm install
```

## During development

For a development build served from your computer with live reload:

```shell
$ npm run watch
```

This script should open the webpage on your browser automatically. Whenever you make changes, they will be compiled and the page will be reloaded automatically.

If you want to build the webpage manually for development, use this command:

```shell
$ npm run build
```

The compiled webpage is available in the `dist/utc` directory.

## For release

For a release build:

```shell
$ npm run dist
```

The compiled webpage is available in the `dist/utc` directory.

# Deploying

Make sure your Apache web server has the Alias and Header modules installed.

Do a release build and copy the content of the `dist/utc` directory to your website.