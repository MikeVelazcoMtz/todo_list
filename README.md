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

> git clone https://github.com/MikeVelazcoMtz/todo_list.git

At this moment you should have all the requirements for the application. Then you have to access to the application folder in order to add the MySQL connection data to the application.

```
cd todo_list/todo_list/
vim settings.py
```
And then, change the `DATABASES` variable adding the necesary information:

```
 DATABASES = {
     'default': {
         'ENGINE': 'django.db.backends.mysql',
         'NAME': "<your_database_name>",
         'USER': "<your_user>",
         'PASSWORD': '<your_password>'
     }
 }
```
Now you can try (if you have the MySQL CLI client) the connection with the `manage.py` file:

```
 cd ..
 python manage.py dbshell
```

If you could access to the database, your connection settings are OK. Then we should create the application tables:

```
 python manage.py makemigrations
 python manage.py migrate
```

Now we have to create a superuser (may be useful):

```
python manage.py createsuperuser --username=root --email=root@example.com
Password: <type_your_password>
Password (again): <type_your_password_again> 
Superuser created successfully.
```

Now the application is ready for testing, so you can start the development server:

```
python manage.py runserver
Performing system checks...

System check identified no issues (0 silenced).
July 06, 2016 - 13:26:29
Django version 1.7.1, using settings 'todo_list.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

# About the famous people reference

Please, do NOT try the [Konami Code](https://en.wikipedia.org/wiki/Konami_Code).

