import json
import numpy as np
import cv2
import mediapipe as mp
import joblib
import base64
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.exceptions import StopConsumer
from urllib.parse import parse_qs

class VideoStreamConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query_string = self.scope['query_string'].decode()
        params = parse_qs(query_string)
        self.pose_id = params.get('pose_id', [None])[0]
        self.pose_id = int(self.pose_id[-1])
        print("pose_id:", self.pose_id)
        self.loop = asyncio.get_running_loop()
        await self.accept()

    async def disconnect(self, close_code):
        self.stop = True
        raise StopConsumer()
    
    async def receive(self, bytes_data):
        model = joblib.load("./pose/model.joblib")
        mp_drawing = mp.solutions.drawing_utils
        mp_drawing_styles = mp.solutions.drawing_styles
        mp_pose = mp.solutions.pose
        if not (bytes_data):
            print('Closed connection')
            await self.close()
        else:
            with mp_pose.Pose(
                    min_detection_confidence=0.5,
                    min_tracking_confidence=0.5) as pose:
                frame = await self.loop.run_in_executor(None, cv2.imdecode, np.frombuffer(bytes_data, dtype=np.uint8), cv2.IMREAD_COLOR)

                img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = pose.process(img)
                proba = 0
                if results.pose_landmarks:
                    landmarks = np.array([[lm.x, lm.y, lm.z] for lm in results.pose_landmarks.landmark]).flatten()
                    pred_proba_sets = model.predict_proba(landmarks.reshape(1, -1))
                    proba = pred_proba_sets[0][self.pose_id] * 100
                    print(pred_proba_sets)

                mp_drawing.draw_landmarks(
                    img,
                    results.pose_landmarks,
                    mp_pose.POSE_CONNECTIONS,
                    landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style()
                )

                # Encoding and sending the image
                buffer_img = await self.loop.run_in_executor(None, cv2.imencode, '.jpeg', img)
                b64_img = base64.b64encode(buffer_img[1]).decode('utf-8')

                # Send the base64 encoded image and the probability back to the client
                await self.send(json.dumps({"image": b64_img, "probability": proba}))
                asyncio.sleep(0.001)


# command: daphne -e ssl:8000:privateKey=server.key:certKey=server.crt:interface=172.20.10.2 pose_app.asgi:application