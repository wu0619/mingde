window.onload = () => {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var video = document.getElementById("video");
  var img = document.getElementById("client");

  const url = window.location.href;
  const parsedUrl = new URL(url);
  const pathSegments = parsedUrl.pathname.split('/');
  const filteredSegments = pathSegments.filter(segment => segment !== "");
  const pose_id = filteredSegments[filteredSegments.length - 1];

  var pose_title = document.getElementById("pose-name")
  if (pose_id === "pose_00") {
    pose_title.textContent = "四足式"
    pose_title.classList.add("pose_00")
  } else if (pose_id === "pose_01") {
    pose_title.textContent = "平板式"
    pose_title.classList.add("pose_01")
  } else if (pose_id === "pose_02") {
    pose_title.textContent = "下犬式"
    pose_title.classList.add("pose_02")
  } else if (pose_id === "pose_03") {
    pose_title.textContent = "半魚式"
    pose_title.classList.add("pose_03")
  } else if (pose_id === "pose_04") {
    pose_title.textContent = "金字塔式"
    pose_title.classList.add("pose_04")
  } else if (pose_id === "pose_05") {
    pose_title.textContent = "眼鏡蛇式"
    pose_title.classList.add("pose_05")
  } else if (pose_id === "pose_06") {
    pose_title.textContent = "船式"
    pose_title.classList.add("pose_06")
  }

  var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";

  video.width = 640;
  video.height = 480;

  var ws = new WebSocket(ws_scheme + "://" + window.location.host + "/?pose_id=" + pose_id);
  ws.onopen = (event) => {
    console.log("websocket connected!!!");
  };
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.image) {
        img.src = "data:image/jpeg;base64," + data.image;
    }
    if (data.probability !== undefined) {
        var probabilityDisplay = document.querySelector('.percent');
        probabilityDisplay.textContent = `${data.probability.toFixed(2)} %`
        if (data.probability.toFixed(2) > 70) {
          probabilityDisplay.classList.remove("percent-red", "percent-orange")
          probabilityDisplay.classList.add("percent-green")
        } else if (data.probability.toFixed(2) <= 70 && data.probability.toFixed(2) > 30) {
          probabilityDisplay.classList.remove("percent-green", "percent-red")
          probabilityDisplay.classList.add("percent-orange")
        } else if (data.probability.toFixed(2) <= 30) {
          probabilityDisplay.classList.remove("percent-green", "percent-orange")
          probabilityDisplay.classList.add("percent-red")
        }
    }
  };
  ws.onclose = (event) => {
    console.log("Close");
  };
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
      video.srcObject = stream;
      video.play();
      var width = video.width;
      var height = video.height;
      var delay = 200; // adjust the delay to fit your needs (ms)
      var jpegQuality = 0.7; // adjust the quality to fit your needs (0.0 -> 1.0)

      setInterval(function () {
        context.drawImage(video, 0, 0, width, height);
        canvas.toBlob(
          function (blob) {
            if (ws.readyState == WebSocket.OPEN) {
              ws.send(blob);
            }
          },
          "image/jpeg",
          jpegQuality
        );
      }, delay);
    });
  }
};

// --unsafely-treat-insecure-origin-as-secure="http://192.168.0.55:8000/home"