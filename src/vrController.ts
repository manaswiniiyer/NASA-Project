/**
 * VR Controller System
 * Handles VR controller input, hand tracking, teleportation, and interactions
 */

import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { XRHandModelFactory } from 'three/addons/webxr/XRHandModelFactory.js';

export interface VRInteractionEvent {
  type: 'select' | 'squeeze' | 'hover' | 'teleport';
  controller: THREE.XRTargetRaySpace;
  position?: THREE.Vector3;
  object?: THREE.Object3D;
}

export class VRController {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  
  // Controllers
  private controller1: THREE.XRTargetRaySpace | null = null;
  private controller2: THREE.XRTargetRaySpace | null = null;
  private controllerGrip1: THREE.XRGripSpace | null = null;
  private controllerGrip2: THREE.XRGripSpace | null = null;
  
  // Hand tracking
  private hand1: THREE.XRHandSpace | null = null;
  private hand2: THREE.XRHandSpace | null = null;
  
  // Interaction
  private raycaster: THREE.Raycaster;
  private tempMatrix: THREE.Matrix4;
  private interactiveObjects: THREE.Object3D[] = [];
  private hoveredObject: THREE.Object3D | null = null;
  
  // Laser pointers
  private line1: THREE.Line | null = null;
  private line2: THREE.Line | null = null;
  
  // Teleportation
  private teleportMarker: THREE.Mesh | null = null;
  private teleportEnabled: boolean = true;
  
  // Callbacks
  private onSelect?: (event: VRInteractionEvent) => void;
  private onSqueeze?: (event: VRInteractionEvent) => void;
  private onHover?: (event: VRInteractionEvent) => void;
  private onTeleport?: (position: THREE.Vector3) => void;

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();
    this.tempMatrix = new THREE.Matrix4();
    
    this.setupControllers();
    this.setupHandTracking();
    this.setupLaserPointers();
    this.setupTeleportation();
  }

  /**
   * Setup VR controllers
   */
  private setupControllers(): void {
    const controllerModelFactory = new XRControllerModelFactory();

    // Controller 1 (right hand)
    this.controller1 = this.renderer.xr.getController(0);
    this.controller1.addEventListener('selectstart', this.onSelectStart.bind(this, 0));
    this.controller1.addEventListener('selectend', this.onSelectEnd.bind(this, 0));
    this.controller1.addEventListener('squeezestart', this.onSqueezeStart.bind(this, 0));
    this.controller1.addEventListener('squeezeend', this.onSqueezeEnd.bind(this, 0));
    this.scene.add(this.controller1);

    this.controllerGrip1 = this.renderer.xr.getControllerGrip(0);
    this.controllerGrip1.add(controllerModelFactory.createControllerModel(this.controllerGrip1));
    this.scene.add(this.controllerGrip1);

    // Controller 2 (left hand)
    this.controller2 = this.renderer.xr.getController(1);
    this.controller2.addEventListener('selectstart', this.onSelectStart.bind(this, 1));
    this.controller2.addEventListener('selectend', this.onSelectEnd.bind(this, 1));
    this.controller2.addEventListener('squeezestart', this.onSqueezeStart.bind(this, 1));
    this.controller2.addEventListener('squeezeend', this.onSqueezeEnd.bind(this, 1));
    this.scene.add(this.controller2);

    this.controllerGrip2 = this.renderer.xr.getControllerGrip(1);
    this.controllerGrip2.add(controllerModelFactory.createControllerModel(this.controllerGrip2));
    this.scene.add(this.controllerGrip2);

    console.log('🎮 VR controllers initialized');
  }

  /**
   * Setup hand tracking (Quest 2/3, etc.)
   */
  private setupHandTracking(): void {
    const handModelFactory = new XRHandModelFactory();

    // Hand 1 (right)
    this.hand1 = this.renderer.xr.getHand(0);
    this.hand1.add(handModelFactory.createHandModel(this.hand1, 'mesh'));
    this.scene.add(this.hand1);

    // Hand 2 (left)
    this.hand2 = this.renderer.xr.getHand(1);
    this.hand2.add(handModelFactory.createHandModel(this.hand2, 'mesh'));
    this.scene.add(this.hand2);

    console.log('👋 Hand tracking initialized');
  }

  /**
   * Setup laser pointers for controllers
   */
  private setupLaserPointers(): void {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -5)
    ]);

    const material = new THREE.LineBasicMaterial({
      color: 0x60a5fa,
      linewidth: 2,
      transparent: true,
      opacity: 0.8
    });

    this.line1 = new THREE.Line(geometry, material);
    this.line1.name = 'line1';
    this.line1.scale.z = 1;
    if (this.controller1) this.controller1.add(this.line1);

    this.line2 = new THREE.Line(geometry.clone(), material.clone());
    this.line2.name = 'line2';
    this.line2.scale.z = 1;
    if (this.controller2) this.controller2.add(this.line2);
  }

  /**
   * Setup teleportation system
   */
  private setupTeleportation(): void {
    // Teleport marker (circle on ground)
    const geometry = new THREE.RingGeometry(0.2, 0.3, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });

    this.teleportMarker = new THREE.Mesh(geometry, material);
    this.teleportMarker.rotation.x = -Math.PI / 2;
    this.teleportMarker.visible = false;
    this.scene.add(this.teleportMarker);
  }

  /**
   * Register interactive objects for raycasting
   */
  public addInteractiveObject(object: THREE.Object3D): void {
    if (!this.interactiveObjects.includes(object)) {
      this.interactiveObjects.push(object);
    }
  }

  /**
   * Remove interactive object
   */
  public removeInteractiveObject(object: THREE.Object3D): void {
    const index = this.interactiveObjects.indexOf(object);
    if (index > -1) {
      this.interactiveObjects.splice(index, 1);
    }
  }

  /**
   * Set callback for select events (trigger button)
   */
  public setOnSelect(callback: (event: VRInteractionEvent) => void): void {
    this.onSelect = callback;
  }

  /**
   * Set callback for squeeze events (grip button)
   */
  public setOnSqueeze(callback: (event: VRInteractionEvent) => void): void {
    this.onSqueeze = callback;
  }

  /**
   * Set callback for hover events
   */
  public setOnHover(callback: (event: VRInteractionEvent) => void): void {
    this.onHover = callback;
  }

  /**
   * Set callback for teleportation
   */
  public setOnTeleport(callback: (position: THREE.Vector3) => void): void {
    this.onTeleport = callback;
  }

  /**
   * Enable/disable teleportation
   */
  public setTeleportEnabled(enabled: boolean): void {
    this.teleportEnabled = enabled;
  }

  /**
   * Update VR controllers (call in animation loop)
   */
  public update(): void {
    if (!this.renderer.xr.isPresenting) return;

    // Update controller 1 raycasting
    if (this.controller1) {
      this.updateControllerRaycast(this.controller1, this.line1);
    }

    // Update controller 2 raycasting
    if (this.controller2) {
      this.updateControllerRaycast(this.controller2, this.line2);
    }

    // Update teleport marker
    this.updateTeleportMarker();
  }

  /**
   * Update raycasting for a controller
   */
  private updateControllerRaycast(controller: THREE.XRTargetRaySpace, line: THREE.Line | null): void {
    this.tempMatrix.identity().extractRotation(controller.matrixWorld);
    this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);

    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      
      // Update laser pointer length
      if (line) {
        line.scale.z = intersect.distance;
      }

      // Hover event
      if (this.hoveredObject !== intersect.object) {
        this.hoveredObject = intersect.object;
        
        if (this.onHover) {
          this.onHover({
            type: 'hover',
            controller,
            object: intersect.object,
            position: intersect.point
          });
        }
      }
    } else {
      // Reset laser pointer
      if (line) {
        line.scale.z = 1;
      }
      this.hoveredObject = null;
    }
  }

  /**
   * Update teleport marker position
   */
  private updateTeleportMarker(): void {
    if (!this.teleportEnabled || !this.teleportMarker) return;

    // Use controller 2 (left hand) for teleportation
    if (this.controller2) {
      this.tempMatrix.identity().extractRotation(this.controller2.matrixWorld);
      this.raycaster.ray.origin.setFromMatrixPosition(this.controller2.matrixWorld);
      this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);

      // Raycast to ground plane (y = 0)
      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const target = new THREE.Vector3();
      this.raycaster.ray.intersectPlane(groundPlane, target);

      if (target) {
        this.teleportMarker.position.copy(target);
        this.teleportMarker.visible = true;
      } else {
        this.teleportMarker.visible = false;
      }
    }
  }

  /**
   * Handle select start (trigger pressed)
   */
  private onSelectStart(controllerIndex: number): void {
    const controller = controllerIndex === 0 ? this.controller1 : this.controller2;
    if (!controller) return;

    this.tempMatrix.identity().extractRotation(controller.matrixWorld);
    this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);

    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    if (intersects.length > 0 && this.onSelect) {
      this.onSelect({
        type: 'select',
        controller,
        object: intersects[0].object,
        position: intersects[0].point
      });
    }
  }

  /**
   * Handle select end (trigger released)
   */
  private onSelectEnd(controllerIndex: number): void {
    const controller = controllerIndex === 0 ? this.controller1 : this.controller2;
    
    // Teleport on left controller release
    if (controllerIndex === 1 && this.teleportEnabled && this.teleportMarker?.visible) {
      if (this.onTeleport) {
        this.onTeleport(this.teleportMarker.position.clone());
      }
      this.teleportMarker.visible = false;
    }
  }

  /**
   * Handle squeeze start (grip pressed)
   */
  private onSqueezeStart(controllerIndex: number): void {
    const controller = controllerIndex === 0 ? this.controller1 : this.controller2;
    if (!controller) return;

    if (this.onSqueeze) {
      this.onSqueeze({
        type: 'squeeze',
        controller
      });
    }
  }

  /**
   * Handle squeeze end (grip released)
   */
  private onSqueezeEnd(controllerIndex: number): void {
    // Handle grip release if needed
  }

  /**
   * Get controller position
   */
  public getControllerPosition(index: 0 | 1): THREE.Vector3 | null {
    const controller = index === 0 ? this.controller1 : this.controller2;
    if (!controller) return null;
    
    const position = new THREE.Vector3();
    position.setFromMatrixPosition(controller.matrixWorld);
    return position;
  }

  /**
   * Vibrate controller (haptic feedback)
   */
  public vibrate(controllerIndex: 0 | 1, intensity: number = 0.5, duration: number = 100): void {
    const controller = controllerIndex === 0 ? this.controller1 : this.controller2;
    if (!controller) return;

    const gamepad = controller.userData.gamepad;
    if (gamepad && gamepad.hapticActuators && gamepad.hapticActuators.length > 0) {
      gamepad.hapticActuators[0].pulse(intensity, duration);
    }
  }

  /**
   * Cleanup
   */
  public dispose(): void {
    if (this.controller1) this.scene.remove(this.controller1);
    if (this.controller2) this.scene.remove(this.controller2);
    if (this.controllerGrip1) this.scene.remove(this.controllerGrip1);
    if (this.controllerGrip2) this.scene.remove(this.controllerGrip2);
    if (this.hand1) this.scene.remove(this.hand1);
    if (this.hand2) this.scene.remove(this.hand2);
    if (this.teleportMarker) this.scene.remove(this.teleportMarker);
  }
}
