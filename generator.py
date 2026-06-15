from datetime import datetime
import os
from pathlib import Path
from jinja2 import Environment, FileSystemLoader
import markdown


def build_site():
    cwd = Path(os.getcwd()).resolve()
    content_directory = Path(cwd / "content")
    template_directory = Path(cwd / "templates")
    output_directory = Path(cwd / "dist")

    output_directory.mkdir(parents=True, exist_ok=True)

    jinja_env = Environment(
        loader=FileSystemLoader(template_directory),
        autoescape=True
    )

    jinja_env.globals["today"] = datetime.now

    for file in content_directory.rglob("*.md"):
        relative_path = file.relative_to(content_directory)
        dest_file = output_directory / relative_path.with_suffix("") / "index.html"
        dest_file.parent.mkdir(parents=True, exist_ok=True)

        md = file.read_text()
        html_body = markdown.markdown(md)

        final_html = jinja_env.get_template("layout.html").render(content=html_body)

        dest_file.write_text(final_html, encoding="utf_8")
    
if __name__ == "__main__":
    build_site()