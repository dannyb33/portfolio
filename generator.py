from datetime import datetime
import os
from pathlib import Path
from jinja2 import Environment, FileSystemLoader
import markdown
import shutil

cwd = Path(os.getcwd()).resolve()
content_directory = Path(cwd / "content")
template_directory = Path(cwd / "templates")
static_directory = Path(cwd / "static")
output_directory = Path(cwd / "dist")

def build_site():
    copy_static()

    output_directory.mkdir(parents=True, exist_ok=True)

    jinja_env = Environment(
        loader=FileSystemLoader(template_directory),
        autoescape=True
    )

    jinja_env.globals["today"] = datetime.now

    for file in content_directory.rglob("*.md"):
        if file.name == "home.md":
            dest_file = output_directory / "index.html"
        elif file.name == "projects.md":
            dest_file = output_directory / "projects" / "index.html"
            dest_file.parent.mkdir(parents=True, exist_ok=True)
        else:
            relative_path = file.relative_to(content_directory)
            dest_file = output_directory / relative_path.with_suffix("") / "index.html"
            dest_file.parent.mkdir(parents=True, exist_ok=True)

        md = file.read_text()

        page = build_page(md)
        
        final_html = jinja_env.get_template("content_display.html").render(page)

        dest_file.write_text(final_html, encoding="utf_8")

def build_page(md_text):
    content_lines = md_text.split("\n")
    filtered_lines = []
    found_first_heading = False
    title = None

    for line in content_lines:
        if line.strip().startswith("# ") and not found_first_heading:
            title = line.strip()
            found_first_heading = True
            continue
        filtered_lines.append(line)

    filtered_content = "\n".join(filtered_lines)
    html_content = markdown.markdown(filtered_content)
    html_title = markdown.markdown(title) if title else None

    return {
        "page_title": title.lstrip("# ").strip() if html_title else None,
        "content": html_content,
    }

def copy_static():
    static_dest_path = Path(output_directory / "static")
    static_dest_path.mkdir(parents=True, exist_ok=True)

    for file in static_directory.rglob("*"):
        relative_path = file.relative_to(static_directory)
        dest_file = output_directory / static_dest_path / relative_path
        dest_file.parent.mkdir(parents=True, exist_ok=True)

        shutil.copy2(file, dest_file)

    
if __name__ == "__main__":
    build_site()