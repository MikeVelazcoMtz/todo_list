# -*- coding: utf-8 -*-

from django.db import models


class List(models.Model):

    class Meta:
        verbose_name = "List"
        verbose_name_plural = "Lists"

    STATUS_CHOICES = (
        (1, "Active"),
        (2, "Finished"),
        (3, "Removed"),
    )
    list_name = models.CharField("List Name", max_length=150, blank=False)
    description = models.TextField("Description", max_length=300, blank=False)
    status = models.IntegerField("Status", choices=STATUS_CHOICES, default=1)
