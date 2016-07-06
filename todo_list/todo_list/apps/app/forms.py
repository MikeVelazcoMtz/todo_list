# -*- coding: utf-8 -*-

from django import forms
from models import List


class LoginForm(forms.Form):
    user = forms.CharField(label='User', max_length=100, required=True)
    password = forms.CharField(widget=forms.PasswordInput, required=True)


class ListForm(forms.ModelForm):
    class Meta:
        model = List
        fields = ('list_name', 'description')
