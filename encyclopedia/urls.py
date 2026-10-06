from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("search/", views.search, name="search"),
    path("random/", views.random_entry, name="random_entry"),
    path("wiki/add/", views.add_entry, name="add_entry"),
    path("wiki/<str:title>", views.entry, name="entry"),
    path("wiki/edit/<str:title>", views.edit_entry, name="edit_entry")
]
