from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    url(r'^', include('todo_list.apps.app.urls')),
]
