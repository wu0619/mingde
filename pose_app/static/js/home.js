var onclickPoseId = null;
window.onload = () => {
  var buttonContainer = document.querySelector(".button-container");
  var buttons = buttonContainer.querySelectorAll("a");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.id != "about_us") {
        onclickPoseId = button.id;
        let path = `/static/pic/${button.id}.JPG`;
        let imageContainer = document.getElementById("example");
        imageContainer.src = path;
        let pose_name = button.textContent
        let name_feild = document.querySelector(".start-button").querySelector("span")
        name_feild.textContent = pose_name
      }
    });
  });
  var start = document.querySelector(".start-button");
  start.addEventListener("click", () => {
    if (onclickPoseId != null) {
      start.href = `/pose/${onclickPoseId}`;
    }
  });
};
