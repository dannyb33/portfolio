from livereload import Server
from generator import build_site

server = Server()

server.watch("site/", build_site)
server.watch("templates/", build_site)

server.serve(root="../dist/")