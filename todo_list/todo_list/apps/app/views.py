from django.views.generic.edit import FormView
from django.views.generic import View, TemplateView, CreateView, UpdateView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect, HttpResponseNotFound, JsonResponse
from .mixins import LoginRequiredMixin
from django.contrib.auth.forms import UserCreationForm
from todo_list.apps.app.models import List

# from django import forms

from forms import *


class LoginView(FormView):
    template_name = "login.html"
    form_class = LoginForm

    def form_valid(self, form, *args, **kwargs):
        user_field = form.cleaned_data['user']
        password_field = form.cleaned_data['password']

        user = authenticate(username=user_field, password=password_field)

        if user is not None:
            # the password verified for the user
            if user.is_active:
                login(self.request, user)
                return HttpResponseRedirect(reverse('home'))
            else:
                form.add_error("user", "The account as been disabled.")
                form.add_error(None, "The password is valid, but the account has been disabled!")
                # self.form_invalid(form, **kwargs)
                return self.render_to_response({'form': form})
        else:
            try:
                User.objects.get(username=user_field)
            except User.DoesNotExist:
                form.add_error("user", "User doesn't exist.")

            form.add_error("password", "The given password is incorrect.")

            return self.render_to_response({'form': form})


class LogoutView(View):
    def get(self, request):
        logout(request)
        return HttpResponseRedirect(reverse('login'))


class HomeView(LoginRequiredMixin, TemplateView):
    template_name = "home.html"

    def get_context_data(self, **kwargs):
        context = super(HomeView, self).get_context_data(**kwargs)
        context['list_form'] = ListForm
        context['list_items'] = List.objects.filter(status=1)
        context['finished_items'] = List.objects.filter(status=2)
        return context


class CreateListView(CreateView):

    def post(self, request, *args, **kwargs):
        new_list = List.objects.create(description=request.POST['description'],
                                       list_name=request.POST['list_name'])
        returnData = {
            'pk': new_list.id,
            'description': new_list.description,
            'name': new_list.list_name,
            'status': "Success",
        }
        return JsonResponse(returnData)

    def form_invalid(self, form, *args, **kwargs):
        return HttpResponseNotFound('{error: "Page Not Found"}')


class UpdateListView(UpdateView):
    def post(self, request, *args, **kwargs):
        print request.POST
        list_item = List.objects.get(id=request.POST['id'])
        list_item.list_name = request.POST['name']
        list_item.description = request.POST['description']
        list_item.save()
        return JsonResponse({'status': "Success"})


class StatusChangeView(UpdateView):
    def post(self, request, *args, **kwargs):
        list_item = List.objects.get(id=request.POST['id'])
        if 'active' in request.POST and request.POST['active'] == 0:
            list_item.status = 2
        else:
            list_item.status = 1
        list_item.save()
        return JsonResponse({'status': "Success"})


class RegisterView(CreateView):
    model = User
    form_class = UserCreationForm
    template_name = "register.html"

    def get_success_url(self, **kwargs):
        return reverse('home')

    def form_valid(self, form, *args, **kwargs):
        super(RegisterView, self).form_valid(form)

        username = self.request.POST['username']
        password = self.request.POST['password1']

        user = authenticate(username=username, password=password)
        login(self.request, user)
        return HttpResponseRedirect(self.get_success_url())
