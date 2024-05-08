from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import json


# Create your views here.
@csrf_exempt
def home(request):
    if request.method == "POST":
        pass
    return render(request=request, template_name='home.html')
