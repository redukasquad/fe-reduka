import { ref } from 'vue'
import * as THREE from 'three'

export function useThreeScene() {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
  const renderer = ref<THREE.WebGLRenderer | null>(null)
  
  const initScene = (container: HTMLElement) => {
    renderer.value = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.value.setSize(container.clientWidth, container.clientHeight)
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.value.domElement)

    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    camera.position.z = 5

    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.value?.setSize(container.clientWidth, container.clientHeight)
    }

    window.addEventListener('resize', handleResize)
    
    const cleanup = () => {
      window.removeEventListener('resize', handleResize)
      renderer.value?.dispose()
      if (renderer.value?.domElement && container.contains(renderer.value.domElement)) {
        container.removeChild(renderer.value.domElement)
      }
    }

    return { cleanup, renderer: renderer.value, scene, camera }
  }

  return { scene, camera, renderer, initScene }
}
