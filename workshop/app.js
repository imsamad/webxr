(async function () {
  const isArSessionSupported =
    navigator.xr &&
    navigator.xr.isSessionSupported &&
    (await navigator.xr.isSessionSupported("immersive-ar"));
  console.log(`navigator.xr `, navigator.xr);
  const infoBox = document.querySelector("#info");
  alert(JSON.stringify(navigator.xr, null, 4));
  alert("isArSessionSupported ", isArSessionSupported);
  infoBox.innerText = JSON.stringify(navigator.xr, null, 4);
  if (isArSessionSupported) {
    document
      .getElementById("enter-ar")
      .addEventListener("click", window.app.activateXR);
  } else {
    onNoXRDevice();
  }
})();

class App {
  activateXR = async () => {
    try {
      this.createXRCanvas();

      await this.onSessionStarted();
    } catch (e) {
      console.log(e);
      onNoXRDevice();
    }
  };

  createXRCanvas() {
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    this.gl = this.canvas.getContext("webgl", { xrCompatible: true });

    this.xrSession.updateRenderState({
      baseLayer: new XRWebGLLayer(this.xrSession, this.gl),
    });
  }

  onSessionStarted = async () => {
    document.body.classList.add("ar");

    this.setupThreeJs();

    this.xrSession.requestAnimationFrame(this.onXRFrame);
  };

  onXRFrame = (time, frame) => {};

  setupThreeJs() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      preserveDrawingBuffer: true,
      canvas: this.canvas,
      context: this.gl,
    });
    this.renderer.autoClear = false;
    this.scene = DemoUtils.createCubeScene();
    this.camera = new THREE.PerspectiveCamera();
    this.camera.matrixAutoUpdate = false;
  }
}

window.app = new App();
