To-do list
===================

This django application requires:

 - Python 2.6+.
 - Git client
 - pip (for the packages installation).
 - virtualenv and/or virtualenvwrapper (optional).
 - Django 1.9+.
 - django-bootstrap (a plug-in for django that integrates bootstrap at template level).
 - A MySQL server and it´s connection data.


## Installation ##


Having Python and pip installed, you need to run pip with the *requirements.txt* as follows:

> pip install -r requirements.txt

This will install the python driver for MySQL, Django in the latest version, and the django-bootstrap plugin.

Then, you must create the database *todo_list* in the MySQL server:

> CREATE DATABASE todo_list;

After that, you can pull the repository:

>