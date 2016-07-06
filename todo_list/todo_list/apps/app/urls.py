from django.conf.urls import url
from views import *

urlpatterns = [
    url(r'^$', LoginView.as_view()),
    url(r'^/', LoginView.as_view()),
    url(r'^login/', LoginView.as_view(), name="login"),
    url(r'^home/', HomeView.as_view(), name="home"),
    # url(r'^logout/$', 'django.contrib.auth.views.logout', {'next_page': '/login'}, name="logout"),
    url(r'^logout/$', LogoutView.as_view(), name="logout"),
    url(r'^register/$', RegisterView.as_view(), name="register"),
    url(r'^new_list/$', CreateListView.as_view(), name="new_list"),
    url(r'^update_list/$', UpdateListView.as_view(), name="update_list"),
    url(r'^status_change/$', StatusChangeView.as_view(), name="mark_finished")
]
