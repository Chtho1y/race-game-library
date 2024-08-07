// game.js
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { Car } from './car.js';
import { Track } from './track.js';

class Game {
    constructor(container, config = {}) {
        this.container = container;
        this.keys = {};
        this.car = null;
        this.track = null;
        this.enemies = [];
        this.score = 0;
        this.crashes = 0;
        this.gameOver = false;
        this.maxCrashes = config.maxCrashes || 5;
        this.playerSpeed = config.playerSpeed || 0.3;
        this.enemySpeed = config.enemySpeed || 0.15;
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();

        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // 添加点光源
        const pointLight = new THREE.PointLight(0xffffff, 0.3);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);

        // 创建摄像机
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.container.appendChild(this.renderer.domElement);

        // 创建后处理效果
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        const fxaaPass = new ShaderPass(FXAAShader);
        fxaaPass.material.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
        this.composer.addPass(fxaaPass);

        // Bloom效果
        // const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.5, 0.2, 0.2);
        // bloomPass.threshold = 0.8;
        // bloomPass.strength = 0.4;
        // bloomPass.radius = 0.2;
        // this.composer.addPass(bloomPass);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.composer.setSize(window.innerWidth, window.innerHeight);
            fxaaPass.material.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
        });

        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });

        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });

        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (!this.gameOver) {
            if (this.car) {
                if (this.keys['ArrowUp']) {
                    this.car.moveForward(this.playerSpeed);
                    if (this.track) this.track.moveBackward(this.playerSpeed);
                }
                if (this.keys['ArrowDown']) {
                    this.car.moveForward(-this.playerSpeed);
                    if (this.track) this.track.moveBackward(-this.playerSpeed);
                }
                if (this.keys['ArrowLeft']) {
                    this.car.turn(0.05);
                }
                if (this.keys['ArrowRight']) {
                    this.car.turn(-0.05);
                }

                this.updateEnemies();
                this.checkCollisions();
                this.checkBounds();

                // 更新摄像机位置以跟随赛车
                const relativeCameraOffset = new THREE.Vector3(0, 5, 10);
                const cameraOffset = relativeCameraOffset.applyMatrix4(this.car.mesh.matrixWorld);
                this.camera.position.lerp(cameraOffset, 0.1);
                this.camera.lookAt(this.car.mesh.position);
            }

            // 使用composer进行渲染
            this.composer.render();
        }
    }

    updateEnemies() {
        // 移动敌人并检测碰撞
        this.enemies.forEach((enemy, index) => {
            enemy.mesh.position.z += this.enemySpeed;
            if (enemy.mesh.position.z > 5) {
                this.scene.remove(enemy.mesh);
                this.enemies.splice(index, 1);
            }
        });

        if (Math.random() < 0.01) {
            const newEnemyPosition = this.generateNonOverlappingPosition();
            const enemyCar = new Car(0x00ff00);
            enemyCar.mesh.position.set(newEnemyPosition.x, 0.5, newEnemyPosition.z);
            this.enemies.push(enemyCar);
            this.scene.add(enemyCar.mesh);
        }
    }

    generateNonOverlappingPosition() {
        let position;
        let overlapping;
        const maxAttempts = 10;
        let attempts = 0;

        do {
            position = {
                x: (Math.random() - 0.5) * 8,
                z: this.car.mesh.position.z - (Math.random() * 50 + 50)
            };
            overlapping = this.enemies.some(enemy => {
                return Math.abs(enemy.mesh.position.x - position.x) < 1 && Math.abs(enemy.mesh.position.z - position.z) < 2;
            });
            attempts++;
        } while (overlapping && attempts < maxAttempts);

        return position;
    }

    checkCollisions() {
        this.enemies.forEach((enemy, index) => {
            if (Math.abs(this.car.mesh.position.x - enemy.mesh.position.x) < 1 && Math.abs(this.car.mesh.position.z - enemy.mesh.position.z) < 1) {
                this.crashes++;
                document.getElementById("ui").textContent = `Score: ${this.score}, Crashes: ${this.crashes}`;
                this.createExplosion(this.car.mesh.position);
                this.scene.remove(enemy.mesh);
                this.enemies.splice(index, 1);
                if (this.crashes >= this.maxCrashes) {
                    this.gameOver = true;
                    document.getElementById("game-over").style.display = "block";
                    document.getElementById("final-score").textContent = this.score;
                }
            }
        });

        this.score++;
        document.getElementById("ui").textContent = `Score: ${this.score}, Crashes: ${this.crashes}`;
    }

    checkBounds() {
        if (this.car.mesh.position.x < -5 || this.car.mesh.position.x > 5) {
            this.car.mesh.position.x = Math.max(Math.min(this.car.mesh.position.x, 5), -5);
            this.crashes++;
            document.getElementById("ui").textContent = `Score: ${this.score}, Crashes: ${this.crashes}`;
            if (this.crashes >= this.maxCrashes) {
                this.gameOver = true;
                document.getElementById("game-over").style.display = "block";
                document.getElementById("final-score").textContent = this.score;
            }
        }
    }

    createExplosion(position) {
        const explosion = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshStandardMaterial({ color: 0xff5500, transparent: true, opacity: 1 }));
        explosion.position.copy(position);
        this.scene.add(explosion);

        let explosionScale = 1;
        const explosionAnimation = setInterval(() => {
            explosionScale += 0.2;
            explosion.scale.set(explosionScale, explosionScale, explosionScale);
            explosion.material.opacity -= 0.08;
            if (explosion.material.opacity <= 0) {
                clearInterval(explosionAnimation);
                this.scene.remove(explosion);
            }
        }, 16);
    }

    addCar(car) {
        this.car = car;
        this.scene.add(car.mesh);
    }

    addTrack(track) {
        this.track = track;
        this.scene.add(track.mesh);
    }

    loadSkybox(hdrPath) {
        new RGBELoader().load(hdrPath, (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.background = texture;
            this.scene.environment = texture;
        });
    }
}

export { Game };
