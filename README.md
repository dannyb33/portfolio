# Personal Website

This repository contains the content of my website, including my bio, projects, and blog hosted at *https://benish.dev/*.

In [src/generator.py](src/generator.py) there is also a custom static site generator to build html pages from the markdown in [src/site/content](src/site/content).

The background of the site is written with ground-up WebGL2, found in [src/site/static/graphic.js](src/site/static/graphic.js).

------

To build, run
`
make build
`

To host a live local server, run
`
make serve
`
