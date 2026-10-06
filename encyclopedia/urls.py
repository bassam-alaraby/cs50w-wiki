from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("search/", views.search, name="search"),
    path("wiki/add/", views.add_entry, name="add_entry"),
    path("wiki/<str:title>", views.entry, name="entry")
]
