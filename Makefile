.PHONY: clean build serve

clean:
	rm -rf dist

build: clean
	uv run python generator.py

serve:
	echo "Serving at http://localhost:8000"
	uv run python -m http.server 8000