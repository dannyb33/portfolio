.PHONY: clean build serve

clean:
	rm -rf dist

build: clean
	uv run python generator.py

serve: build
	uv run python serve.py