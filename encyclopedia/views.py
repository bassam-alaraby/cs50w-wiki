from django.shortcuts import render
from markdown2 import Markdown

from . import util


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })


def entry(request, title):
    entries = util.list_entries()
    
    if title in entries:
        markdowner = Markdown()
        content = markdowner.convert(util.get_entry(title))
        
        return render(request, "encyclopedia/entry.html", {
            "entry": content,
            "title": title
        })
    else:
        return render(request, "encyclopedia/error.html", {
            "error_message": "The page you looking for isn't available "
        })
