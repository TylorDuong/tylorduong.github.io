# tylorduong.github.io

Simple portfolio powered by GitHub Pages (Jekyll). It shows projects with images/videos.

How to update:
- Add images to `assets/images/` and videos to `assets/videos/`.
- Put your resume at `assets/resume/resume.pdf` and the Home page will link to it.
- Edit `_data/projects.yml` to add or modify projects:

	- `title`: Project name
	- `description`: Short description
	- `cover`: Image path used for the card thumbnail
	- `media`: Array of items with `type: image|video` and `src: /path`
	- `tags`: Array of labels

Pages:
- `/` Home
- `/portfolio/` Portfolio gallery
- `/home` About (edit `home.md`)