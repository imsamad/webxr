(async function () {
  const isArSessionSupported =
    navigator.xr &&
    navigator.xr.isSessionSupported &&
    (await navigator.xr.isSessionSupported("immersive-ar"));
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
      this.xrSession = await navigator.xr.requestSession("immersive-ar");

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

  async onSessionStarted() {
    document.body.classList.add("ar");

    this.setupThreeJs();

    this.localReferenceSpace = await this.xrSession.requestReferenceSpace(
      "local"
    );

    this.xrSession.requestAnimationFrame(this.onXRFrame);
  }

  onXRFrame = (time, frame) => {
    this.xrSession.requestAnimationFrame(this.onXRFrame);

    const framebuffer = this.xrSession.renderState.baseLayer.framebuffer;
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
    this.renderer.setFramebuffer(framebuffer);

    const pose = frame.getViewerPose(this.localReferenceSpace);
    if (pose) {
      const view = pose.views[0];

      const viewport = this.xrSession.renderState.baseLayer.getViewport(view);
      this.renderer.setSize(viewport.width, viewport.height);

      this.camera.matrix.fromArray(view.transform.matrix);
      this.camera.projectionMatrix.fromArray(view.projectionMatrix);
      this.camera.updateMatrixWorld(true);

      this.renderer.render(this.scene, this.camera);
    }
  };

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
