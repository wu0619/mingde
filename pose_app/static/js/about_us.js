window.onload = () => {
  var granimInstance = new Granim({
    element: "#canvas-basic",
    direction: "diagonal",
    isPausedWhenNotInView: true,
    states: {
      "default-state": {
        gradients: [
          ["#00b4d8", "#90e0ef"],
          ["#fbfff1", "#090c9b"],
        ],
      },
    },
  });
};
