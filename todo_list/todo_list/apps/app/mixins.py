# -*- coding: utf-8 -*-

from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator


class LoginRequiredMixin(object):
    """docstring for LoginRequiredMixin"""

    @method_decorator(login_required(login_url="/login/"))
    def dispatch(self, request, *args, **kwargs):
        print "LoginRequierdMixin"
        return super(LoginRequiredMixin, self).dispatch(request, *args, **kwargs)
