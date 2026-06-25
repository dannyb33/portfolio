from datetime import datetime
import os
from pathlib import Path
from jinja2 import Environment, FileSystemLoader
import markdown
import shutil

cwd = Path(os.getcwd()).resolve()
content_directory = Path(cwd / "site/content")
template_directory = Path(cwd / "templates")
static_directory = Path(cwd / "site/static")
output_directory = Path(cwd.parent / "dist")

class Page:
    def __init__(self, content, path, title="Untitled"):
        self.title = title
        self.content = content
        self.path = path


def build_site():
    copy_static()

    output_directory.mkdir(parents=True, exist_ok=True)

    jinja_env = Environment(
        loader=FileSystemLoader(template_directory),
        autoescape=True
    )

    posts = []

    for file in content_directory.rglob("*.md"):
        md = file.read_text()

        html = page_to_html(md)

        relative_path = file.relative_to(content_directory)
        print(relative_path)
        
        page = Page(html["content"], "/" + str(relative_path.with_suffix("")), html["page_title"])

        if file.name == "home.md":
            dest_file = output_directory / "index.html"
        elif file.name == "projects.md":
            dest_file = output_directory / "projects" / "index.html"
            dest_file.parent.mkdir(parents=True, exist_ok=True)
        else:
            dest_file = output_directory / relative_path.with_suffix("") / "index.html"
            dest_file.parent.mkdir(parents=True, exist_ok=True)
            posts.append(page)
        
        final_html = jinja_env.get_template("content_display.html").render(page=page)

        dest_file.write_text(final_html, encoding="utf_8")


    list_html = jinja_env.get_template("list_display.html").render(pages=posts)

    blog_index = output_directory / "blog" / "index.html"

    blog_index.write_text(list_html, encoding="utf-8")

def page_to_html(md_text):
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