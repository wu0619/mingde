from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from channels.sessions import CookieMiddleware, SessionMiddleware



# Create your views here.


@csrf_exempt
def pose(request, poseId):
    request.session['poseId'] = poseId

    if request.method == "POST":
        pass
    return render(request=request, template_name='pose.html')


