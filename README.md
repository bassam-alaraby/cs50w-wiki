# Wiki

A Wikipedia-like online encyclopedia built with Django as part of Harvard's CS50 Web Programming with Python and JavaScript.

## Features

- Encyclopedia of entries written in Markdown
- View individual encyclopedia entries
- Create new encyclopedia entries
- Edit existing entries
- Search entries by title
- Display matching entries when a search query partially matches existing titles
- Navigate to a random encyclopedia entry
- Custom 404 error page for unavailable entries

## Structure

```bash
project1-wiki
├── wiki
│   ├── __init__.py
│   ├── asgi.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── encyclopedia
│   ├── migrations/
│   ├── static/
│   ├── templates/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   ├── urls.py
│   ├── util.py
│   └── views.py
│
├── entries
│   ├── CSS.md
│   ├── Django.md
│   ├── Flask.md
│   ├── Git.md
│   ├── HTML.md
│   └── Python.md
│
├── manage.py
└── README.md
```

## Pages

### All Pages

Displays a list of all available encyclopedia entries. Each entry links to its corresponding page.

### Entry Page

Displays the content of an encyclopedia entry, converting its Markdown source into HTML.

### Create New Page

Allows users to create new encyclopedia entries by providing a title and Markdown content.

Entry titles must be unique to prevent duplicate pages.

### Edit Page

Allows users to modify the Markdown content of an existing encyclopedia entry.

The entry title is preserved while its content can be updated.

### Search

Allows users to search for encyclopedia entries by title.

- Exact matches redirect directly to the corresponding entry.
- Partial matches display a list of entries whose titles contain the search query.

### Random Page

Redirects users to a randomly selected encyclopedia entry.

### Error Page

Displays a custom error message when a requested encyclopedia entry does not exist.

## Technical Notes

This project uses Django to handle URL routing, request processing, templates, and server-side logic.

Encyclopedia entries are stored as Markdown files, which are converted into HTML when displayed.

The application uses Django's template system to render pages and generate internal links.

Bootstrap 5 is used for responsive layout and UI components, with additional CSS for custom styling.

## Running Locally

Clone the repository:

```bash
git clone https://github.com/bassam-alaraby/cs50w-wiki.git
cd s50w-wiki
```

Install Django:

```bash
pip install django
```

Install Markdown to HTML:

```bash
pip install markdown2
```

Run the development server:

```bash
python manage.py runserver
```

Then visit:

```text
http://127.0.0.1:8000
```

## Technologies

- Python
- Django
- HTML5
- CSS3
- Bootstrap 5
- Markdown
