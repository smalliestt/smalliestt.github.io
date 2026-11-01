(() => {
  const scenes = document.querySelectorAll('[data-scene-width]');
  function fit(scene) {
    const canvas = scene.querySelector('.vh-scene__canvas');
    if (scene.clientWidth) canvas.style.transform = `scale(${scene.clientWidth / Number(scene.dataset.sceneWidth)})`;
  }
  const observer = new ResizeObserver(entries => entries.forEach(entry => fit(entry.target)));
  scenes.forEach(scene => {fit(scene);observer.observe(scene);});
})();
