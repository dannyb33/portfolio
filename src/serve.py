from livereload import Server
from generator import build_site

server = Server()

server.watch("content/", build_site)
server.watch("templates/", build_site)
server.watch("static/", build_site)

server.serve(root="dist/")