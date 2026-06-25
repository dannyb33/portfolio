.PHONY: clean build serve

clean:
	rm -rf dist

build: clean
	cd src && uv run python generator.py

prod-build: clean
	cd src && python3 generator.py
	
serve: build
	cd src && uv run python serve.py