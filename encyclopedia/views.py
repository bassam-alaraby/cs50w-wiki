from django.http import HttpResponseRedirect
from django.shortcuts import render
from markdown2 import Markdown

from . import util


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })


def search(request):
    entries = util.list_entries()
    query = request.GET.get("q")

    for entry in entries:
        if query == entry:
            return HttpResponseRedirect(f"/wiki/{entry}")

    matching_entries = []   
    for entry in entries:
        if query in entry:
            matching_entries.append(entry)

    if matching_entries:
        return render(request, "encyclopedia/search.html", {
            "matching_entries": matching_entries
        })

    return render(request, "encyclopedia/search.html", {
        "error_message": f'No results found for "{query}"',
        "entries": entries
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


def add_entry(request):
    if request.method == "GET":
        return render(request, "encyclopedia/add_entry.html")

    if request.method == "POST":
        title = request.POST.get("title")
        content = request.POST.get("content")

        if title not in util.list_entries():
            util.save_entry(title, content)
            return HttpResponseRedirect(f"/wiki/{title}")
        else:
            return render(request, "encyclopedia/add_entry.html", {
                "title": title,
                "content": content,
                "error_message": "This title already exist"
            })
