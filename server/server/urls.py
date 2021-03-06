"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    path("api/", include('game.urls')),
    path("register", TemplateView.as_view(template_name="register.html")),
    path("login", TemplateView.as_view(template_name="login.html")),
    path("logout", views.logout_view),
    path("play", TemplateView.as_view(template_name="game.html")),
    path("shop", views.shop),
    path('pay/mobile/<slug:skin>', views.pay_mobile),
    path('pay/qrcode/<slug:skin>', views.pay_qrcode),
    path('select/<slug:skin>', views.select_skin),
    url(r'^', views.homepage),
    #url(r'^', ensure_csrf_cookie(TemplateView.as_view(template_name="index.html"))),
]
